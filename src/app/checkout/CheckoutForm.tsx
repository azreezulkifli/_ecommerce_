"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatRM } from "@/lib/format";
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { createOrderAction, validatePromoAction } from "@/app/actions";

type User = { name: string; email: string; phone: string | null; address: string | null; city: string | null; postcode: string | null };

export function CheckoutForm({ user }: { user: User }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState(SHIPPING_RATES[0].method);
  const [payment, setPayment] = useState("FPX");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = (() => {
    const r = SHIPPING_RATES.find((s) => s.method === method) ?? SHIPPING_RATES[0];
    const afterDiscount = subtotal - discount;
    return { ...r, price: afterDiscount >= FREE_SHIPPING_THRESHOLD || r.price === 0 ? 0 : r.price };
  })();
  const total = subtotal - discount + shipping.price;

  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const whatsappUrl = (() => {
    if (!waNumber || items.length === 0) return null;
    const lines = [
      "Assalamualaikum! Saya ingin membuat pesanan:",
      "",
      ...items.map((i) => `• ${i.name} (${i.size ?? "-"}, ${i.color ?? "-"}) x${i.qty} — ${formatRM(i.price * i.qty)}`),
      "",
      `Subjumlah: ${formatRM(subtotal)}`,
      `Penghantaran (${method}): ${shipping.price === 0 ? "Percuma" : formatRM(shipping.price)}`,
      `Jumlah: ${formatRM(total)}`,
      "",
      `Nama: ${user.name}`,
      `Telefon: ${user.phone ?? "-"}`,
    ];
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  })();

  const applyPromo = async () => {
    if (!promo.trim()) return;
    const res = await validatePromoAction(promo, subtotal);
    if (res.ok && res.data) {
      const d = res.data as { code: string; discount: number };
      setDiscount(d.discount);
      setPromoMsg(`Kod ${d.code} digunakan: -${formatRM(d.discount)}`);
    } else {
      setDiscount(0);
      setPromoMsg(res.error ?? "Kod tidak sah");
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const result = await createOrderAction({
      items: items.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size, color: i.color })),
      shippingName: String(fd.get("shippingName")),
      shippingPhone: String(fd.get("shippingPhone")),
      shippingAddress: String(fd.get("shippingAddress")),
      shippingCity: String(fd.get("shippingCity")),
      shippingPostcode: String(fd.get("shippingPostcode")),
      shippingMethod: method,
      paymentMethod: payment,
      notes: String(fd.get("notes") ?? ""),
      promoCode: discount > 0 ? promo : undefined,
    });
    setSubmitting(false);
    if (result.ok && result.data) {
      const d = result.data as { orderNumber: string };
      clear();
      router.push(`/pembayaran/${d.orderNumber}`);
    } else {
      setError(result.error ?? "Ralat tidak diketahui. Sila cuba lagi.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Troli Anda Kosong</h1>
        <p className="text-ink-soft mt-2">Tambah produk ke troli sebelum checkout.</p>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Maklumat Penghantaran */}
          <section className="bg-white rounded-2xl border border-taupe/50 p-6">
            <h2 className="font-bold text-lg mb-4">📍 Maklumat Penghantaran</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Penerima *</label>
                <input name="shippingName" required defaultValue={user.name} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombor Telefon *</label>
                <input name="shippingPhone" required defaultValue={user.phone ?? ""} className={inputCls} placeholder="012-3456789" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Alamat *</label>
                <textarea name="shippingAddress" required rows={2} defaultValue={user.address ?? ""} className={inputCls} placeholder="No. rumah, jalan, bandar" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bandar *</label>
                <input name="shippingCity" required defaultValue={user.city ?? ""} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poskod *</label>
                <input name="shippingPostcode" required defaultValue={user.postcode ?? ""} className={inputCls} />
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-3">Kaedah Penghantaran</h3>
            <div className="space-y-2">
              {SHIPPING_RATES.map((r) => (
                <label key={r.method} className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${method === r.method ? "border-primary bg-primary/5" : "border-taupe hover:border-primary/50"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="ship" checked={method === r.method} onChange={() => setMethod(r.method)} className="accent-primary" />
                    <span>
                      <span className="block text-sm font-medium">{r.method}</span>
                      <span className="block text-xs text-ink-soft">{r.eta}</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{r.price === 0 ? "RM0.00" : formatRM(r.price)}</span>
                </label>
              ))}
            </div>
            {subtotal - discount >= FREE_SHIPPING_THRESHOLD && method !== "Self Pickup (Hubungi Kami)" && (
              <p className="mt-2 text-xs text-primary font-medium">🚚 Anda layak penghantaran percuma!</p>
            )}
          </section>

          {/* Pembayaran */}
          <section className="bg-white rounded-2xl border border-taupe/50 p-6">
            <h2 className="font-bold text-lg mb-4">💳 Kaedah Pembayaran</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                ["FPX", "FPX (Bank Online)"],
                ["KAD", "Kad Debit/Kredit"],
                ["EWALLET", "e-Dompet (Touch 'n Go, GrabPay)"],
              ].map(([val, label]) => (
                <label key={val} className={`rounded-xl border p-3 cursor-pointer text-center text-sm font-medium transition ${payment === val ? "border-primary bg-primary/5 text-primary" : "border-taupe hover:border-primary/50"}`}>
                  <input type="radio" name="pay" className="sr-only" checked={payment === val} onChange={() => setPayment(val)} />
                  {label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-soft">Pembayaran diproses melalui payment gateway Malaysia yang selamat (FPX, kad & e-dompet).</p>
          </section>

          {/* Nota */}
          <section className="bg-white rounded-2xl border border-taupe/50 p-6">
            <label className="block font-semibold mb-2">Nota Pesanan (pilihan)</label>
            <textarea name="notes" rows={2} className={inputCls} placeholder="Arahan khas untuk penjual..." />
          </section>
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-2xl border border-taupe/50 p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-mist/30" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{i.name} × {i.qty}</p>
                  <p className="text-xs text-ink-soft">{i.size} {i.color}</p>
                </div>
                <span className="font-medium">{formatRM(i.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm border-t border-taupe/50 pt-4">
            <div className="flex justify-between"><span>Subjumlah</span><span>{formatRM(subtotal)}</span></div>
            <div className="flex justify-between">
              <span>Diskaun</span>
              <span className="text-primary">-{formatRM(discount)}</span>
            </div>
            <div className="flex justify-between"><span>Penghantaran ({method})</span><span>{shipping.price === 0 ? "Percuma" : formatRM(shipping.price)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-taupe/50">
              <span>Jumlah</span><span className="text-primary">{formatRM(total)}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="Kod promosi" className="flex-1 rounded-lg border border-taupe px-3 py-2 text-sm uppercase" />
            <button type="button" onClick={applyPromo} className="rounded-full border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/10">Guna</button>
          </div>
          {promoMsg && <p className="mt-2 text-xs text-ink-soft">{promoMsg}</p>}

          <button type="submit" disabled={submitting} className="mt-5 w-full rounded-full bg-primary py-3.5 font-bold text-white hover:bg-primary-dark transition disabled:opacity-60">
            {submitting ? "Memproses..." : `Buat Pesanan • ${formatRM(total)}`}
          </button>

          {whatsappUrl && (
            <>
              <div className="my-4 flex items-center gap-3 text-xs text-ink-soft">
                <span className="h-px flex-1 bg-taupe/60" /> atau <span className="h-px flex-1 bg-taupe/60" />
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] py-3 font-bold text-[#128C4B] hover:bg-[#25D366]/10 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z"/>
                </svg>
                Tempah Terus melalui WhatsApp
              </a>
              <p className="mt-2 text-center text-[11px] text-ink-soft">Pesanan anda akan dihantar terus ke WhatsApp kami.</p>
            </>
          )}
          <p className="mt-3 text-center text-xs text-ink-soft">🔒 Pembayaran anda dilindungi. Data peribadi anda selamat.</p>
        </div>
      </div>
    </form>
  );
}
