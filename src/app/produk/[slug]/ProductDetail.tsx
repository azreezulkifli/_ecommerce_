"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { ProductGrid } from "@/components/ProductCard";
import { formatRM } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string;
  sizes: string;
  colors: string;
  rating: number;
  sold: number;
  description: string;
};

type RelatedProduct = Parameters<typeof ProductGrid>[0]["products"][number];

export function ProductDetail({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const images = JSON.parse(product.images || "[]") as string[];
  const sizes = JSON.parse(product.sizes || "[]") as string[];
  const colors = JSON.parse(product.colors || "[]") as string[];

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const addToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[0] ?? "",
      size,
      color,
      qty,
    });
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Galeri */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-taupe/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[imgIdx] ?? images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`h-16 w-16 rounded-xl overflow-hidden border-2 ${i === imgIdx ? "border-primary" : "border-transparent"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Maklumat */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
            <span className="text-amber-500">★</span> {product.rating.toFixed(1)} • {product.sold} terjual
            {product.stock > 0 ? (
              <span className="text-mint font-medium">• Stok ada ({product.stock})</span>
            ) : (
              <span className="text-primary font-medium">• Habis stok</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatRM(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-ink-soft line-through">{formatRM(product.compareAtPrice)}</span>
                <span className="rounded-full bg-primary-soft text-white text-xs font-bold px-2 py-1">-{discount}%</span>
              </>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">Warna: <span className="text-ink-soft font-normal">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-1.5 text-sm transition ${color === c ? "border-primary bg-primary/10 text-primary font-semibold" : "border-taupe hover:border-primary"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Saiz: <span className="text-ink-soft font-normal">{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`rounded-full border px-4 py-1.5 text-sm transition ${size === s ? "border-primary bg-primary/10 text-primary font-semibold" : "border-taupe hover:border-primary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-taupe rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg">−</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="px-4 py-2 text-lg">+</button>
            </div>
            <button onClick={addToCart} disabled={product.stock <= 0} className="flex-1 rounded-full bg-leaf border border-sage px-6 py-3 font-semibold hover:bg-mint transition disabled:opacity-50 disabled:cursor-not-allowed">
              🛒 Tambah ke Troli
            </button>
            <button onClick={buyNow} disabled={product.stock <= 0} className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed">
              Beli Sekarang
            </button>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-taupe/50 p-5">
            <h3 className="font-semibold mb-2">📦 Penghantaran</h3>
            <p className="text-sm text-ink-soft">Pilih masa penghantaran di checkout. Penghantaran percuma untuk pesanan ≥ RM150. Hantar ke seluruh Malaysia dalam 1-4 hari bekerja.</p>
          </div>
        </div>
      </div>

      {/* Penerangan */}
      <div className="mt-12 bg-white rounded-2xl border border-taupe/50 p-6">
        <h2 className="text-xl font-bold mb-3">Penerangan Produk</h2>
        <p className="text-ink-soft leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      {/* Berkaitan */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Produk Berkaitan</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
