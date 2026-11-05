"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveProductAction, type ActionResult } from "@/app/actions";

type Category = { id: string; name: string };
type Product = {
  id: string; name: string; description: string; price: number; compareAtPrice: number | null;
  stock: number; categoryId: string; images: string; sizes: string; colors: string;
  isNew: boolean; isPopular: boolean; onSale: boolean;
};

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveProductAction, null);
  const router = useRouter();

  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";
  const jsonToCsv = (json: string) => { try { return (JSON.parse(json) as string[]).join(", "); } catch { return ""; } };

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-taupe/50 p-6 space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-mint/50 text-ink text-sm px-4 py-2">{state.message}</p>}
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Nama Produk *</label>
          <input name="name" required defaultValue={product?.name} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Penerangan *</label>
          <textarea name="description" required rows={4} defaultValue={product?.description} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Harga (RM) *</label>
          <input name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Harga Asal (RM) — untuk promosi</label>
          <input name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={product?.compareAtPrice ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stok *</label>
          <input name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori *</label>
          <select name="categoryId" required defaultValue={product?.categoryId ?? ""} className={inputCls}>
            <option value="" disabled>Pilih kategori...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Gambar (path dipisahkan koma)</label>
          <input name="images" defaultValue={product ? jsonToCsv(product.images) : ""} className={inputCls} placeholder="/images/products/produk-1.svg, /images/products/produk-2.svg" />
          <p className="text-xs text-ink-soft mt-1">Contoh: /images/products/produk-1.svg</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Saiz (dipisahkan koma)</label>
          <input name="sizes" defaultValue={product ? jsonToCsv(product.sizes) : ""} className={inputCls} placeholder="2T, 3T, 4T" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warna (dipisahkan koma)</label>
          <input name="colors" defaultValue={product ? jsonToCsv(product.colors) : ""} className={inputCls} placeholder="Merah, Biru, Hijau" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {([["isNew", "Produk Baharu"], ["isPopular", "Produk Popular"], ["onSale", "Promosi"]] as const).map(([name, label]) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name={name} defaultChecked={product ? product[name] : false} className="accent-primary h-4 w-4" />
            {label}
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className="rounded-full bg-primary px-8 py-2.5 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan Produk"}
        </button>
        <button type="button" onClick={() => router.push("/admin/produk")} className="rounded-full border border-taupe px-6 py-2.5 text-sm hover:border-primary">Batal</button>
      </div>
    </form>
  );
}
