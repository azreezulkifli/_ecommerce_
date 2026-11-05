"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSessionUser, hashPassword, verifyPassword, requireAdmin } from "@/lib/auth";
import { calculateShipping, ORDER_STATUSES } from "@/lib/shipping";
import { slugify } from "@/lib/format";

export type ActionResult = { ok: boolean; error?: string; message?: string; data?: unknown };

const credentialsSchema = z.object({
  name: z.string().min(2, "Nama mestilah sekurang-kurangnya 2 aksara"),
  email: z.string().email("Alamat emel tidak sah"),
  password: z.string().min(6, "Kata laluan mestilah sekurang-kurangnya 6 aksara"),
  phone: z.string().optional(),
});

export async function registerAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = credentialsSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const { name, email, password, phone } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return { ok: false, error: "Emel ini telah didaftarkan. Sila log masuk." };

  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash: hashPassword(password), phone },
  });
  await createSession(user.id);
  redirect("/");
}

export async function loginAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Sila isi emel dan kata laluan." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Emel atau kata laluan tidak sah." };
  }
  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updateProfileAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sila log masuk dahulu." };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postcode = String(formData.get("postcode") ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Nama tidak sah." };

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone, address, city, postcode },
  });
  revalidatePath("/profil");
  return { ok: true, message: "Profil berjaya dikemaskini." };
}

export async function changePasswordAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sila log masuk dahulu." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!verifyPassword(current, user.passwordHash)) return { ok: false, error: "Kata laluan semasa tidak betul." };
  if (next.length < 6) return { ok: false, error: "Kata laluan baru mestilah sekurang-kurangnya 6 aksara." };

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  return { ok: true, message: "Kata laluan berjaya ditukar." };
}

// ---------- Troli / Checkout ----------

const cartItemSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(1).max(99),
  size: z.string().optional(),
  color: z.string().optional(),
});

export type CheckoutPayload = {
  items: { productId: string; qty: number; size?: string; color?: string }[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  promoCode?: string;
};

export async function validatePromoAction(code: string, subtotal: number): Promise<ActionResult> {
  const promo = await prisma.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!promo || !promo.active) return { ok: false, error: "Kod promosi tidak sah." };
  if (promo.expiresAt && promo.expiresAt < new Date()) return { ok: false, error: "Kod promosi telah tamat tempoh." };
  if (subtotal < promo.minOrder) return { ok: false, error: `Jumlah minimum RM${promo.minOrder.toFixed(2)} untuk kod ini.` };

  const discount = promo.type === "PERCENT" ? (subtotal * promo.value) / 100 : promo.value;
  return { ok: true, data: { code: promo.code, discount: Math.min(discount, subtotal) } };
}

export async function createOrderAction(payload: CheckoutPayload): Promise<ActionResult> {
  const user = await getSessionUser();
  const parsed = z.array(cartItemSchema).min(1).safeParse(payload.items);
  if (!parsed.success || !payload.shippingName || !payload.shippingPhone || !payload.shippingAddress || !payload.shippingMethod) {
    return { ok: false, error: "Sila lengkapkan semua maklumat yang diperlukan." };
  }

  // Sahkan produk & kira semula harga di server
  const lines = [];
  let subtotal = 0;
  for (const item of parsed.data) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.qty) {
      return { ok: false, error: `Stok tidak mencukupi untuk ${product?.name ?? "produk"}.` };
    }
    subtotal += product.price * item.qty;
    lines.push({ product, qty: item.qty, size: item.size, color: item.color });
  }

  let discount = 0;
  let promoCode: string | null = null;
  if (payload.promoCode?.trim()) {
    const promo = await prisma.promoCode.findUnique({ where: { code: payload.promoCode.trim().toUpperCase() } });
    if (promo && promo.active && (!promo.expiresAt || promo.expiresAt > new Date()) && subtotal >= promo.minOrder) {
      discount = promo.type === "PERCENT" ? (subtotal * promo.value) / 100 : promo.value;
      discount = Math.min(discount, subtotal);
      promoCode = promo.code;
    }
  }

  const shipping = calculateShipping(subtotal - discount, payload.shippingMethod);
  const total = subtotal - discount + shipping.price;

  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const orderNumber = `KS-${year}-${String(count + 1).padStart(4, "0")}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user?.id ?? null,
      status: "Menunggu Pembayaran",
      paymentStatus: "Belum Dibayar",
      paymentMethod: payload.paymentMethod,
      subtotal,
      discount,
      shipping: shipping.price,
      total,
      promoCode,
      shippingName: payload.shippingName,
      shippingPhone: payload.shippingPhone,
      shippingAddress: payload.shippingAddress,
      shippingCity: payload.shippingCity,
      shippingPostcode: payload.shippingPostcode,
      shippingMethod: payload.shippingMethod,
      notes: payload.notes,
      items: {
        create: lines.map(({ product, qty, size, color }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          size,
          color,
          image: JSON.parse(product.images)[0] ?? "",
        })),
      },
    },
    include: { items: true },
  });

  // Kurangkan stok
  for (const { product, qty } of lines) {
    await prisma.product.update({ where: { id: product.id }, data: { stock: { decrement: qty }, sold: { increment: qty } } });
  }

  revalidatePath("/admin/pesanan");
  return { ok: true, data: { orderNumber: order.orderNumber, orderId: order.id, total } };
}

export async function payOrderAction(orderId: string): Promise<ActionResult> {
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE !== "mock") {
    return { ok: false, error: "Mod pembayaran sandbox dimatikan. Sila gunakan payment gateway sebenar." };
  }
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: "Pesanan tidak dijumpai." };
  if (order.paymentStatus === "Dibayar") return { ok: true, message: "Pesanan sudah dibayar." };

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "Dibayar", status: "Pembayaran Disahkan" },
  });
  revalidatePath(`/pembayaran/${order.orderNumber}`);
  return { ok: true, message: "Pembayaran berjaya disahkan (mod sandbox)." };
}

// ---------- Hubungi Kami ----------

export async function contactAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    return { ok: false, error: "Sila lengkapkan nama, emel dan mesej (minimum 10 aksara)." };
  }

  await prisma.contactMessage.create({ data: { name, email, phone, subject, message } });
  return { ok: true, message: "Mesej anda telah dihantar. Kami akan membalas secepat mungkin!" };
}

// ---------- Admin ----------

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.string().default("[]"),
  sizes: z.string().default("[]"),
  colors: z.string().default("[]"),
  isNew: z.coerce.boolean().optional(),
  isPopular: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
});

export async function saveProductAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || null,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    images: formData.get("images") ?? "[]",
    sizes: formData.get("sizes") ?? "[]",
    colors: formData.get("colors") ?? "[]",
    isNew: formData.get("isNew") === "on",
    isPopular: formData.get("isPopular") === "on",
    onSale: formData.get("onSale") === "on",
  });
  if (!parsed.success) return { ok: false, error: "Data produk tidak sah. Semak semua medan." };

  const csvToJson = (v: string) => {
    const parts = String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    return JSON.stringify(parts);
  };

  const d = parsed.data;
  const data = {
    name: d.name,
    slug: slugify(d.name),
    description: d.description,
    price: d.price,
    compareAtPrice: d.compareAtPrice || null,
    stock: d.stock,
    categoryId: d.categoryId,
    images: csvToJson(d.images),
    sizes: csvToJson(d.sizes),
    colors: csvToJson(d.colors),
    isNew: !!d.isNew,
    isPopular: !!d.isPopular,
    onSale: !!d.onSale,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/produk");
  revalidatePath("/");
  return { ok: true, message: "Produk berjaya disimpan." };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produk");
  return { ok: true };
}

export async function saveCategoryAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  if (name.length < 2) return { ok: false, error: "Nama kategori tidak sah." };

  const data = { name, slug: slugify(name), description, image: image || null };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/kategori");
  return { ok: true, message: "Kategori berjaya disimpan." };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return { ok: false, error: `Tidak boleh padam: ${count} produk dalam kategori ini.` };
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
  return { ok: true };
}

export async function updateOrderStatusAction(orderId: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return { ok: false, error: "Status tidak sah." };
  }
  const data: Record<string, string> = { status };
  if (status === "Dihantar" || status === "Selesai") {
    // tidak ubah paymentStatus
  }
  await prisma.order.update({ where: { id: orderId }, data });
  revalidatePath("/admin/pesanan");
  return { ok: true };
}

export async function markOrderPaidAction(orderId: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "Dibayar", status: "Pembayaran Disahkan" },
  });
  revalidatePath("/admin/pesanan");
  return { ok: true };
}

export async function savePromoAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = formData.get("type") === "FIXED" ? "FIXED" : "PERCENT";
  const value = Number(formData.get("value") ?? 0);
  const minOrder = Number(formData.get("minOrder") ?? 0);
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!code || value <= 0) return { ok: false, error: "Kod dan nilai tidak sah." };
  const data = { code, type, value, minOrder, expiresAt, active: formData.get("active") === "on" };
  try {
    if (id) await prisma.promoCode.update({ where: { id }, data });
    else await prisma.promoCode.create({ data });
  } catch {
    return { ok: false, error: "Kod promosi ini telah wujud." };
  }
  revalidatePath("/admin/promosi");
  return { ok: true, message: "Kod promosi disimpan." };
}

export async function deletePromoAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.promoCode.delete({ where: { id } });
  revalidatePath("/admin/promosi");
  return { ok: true };
}

export async function updateUserRoleAction(userId: string, role: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { ok: false, error: "Tidak boleh mengubah peranan sendiri." };
  if (!["USER", "ADMIN"].includes(role)) return { ok: false, error: "Peranan tidak sah." };
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/pelanggan");
  return { ok: true };
}

