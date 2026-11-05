import Link from "next/link";
import { formatRM } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  isNew: boolean;
  isPopular: boolean;
  onSale: boolean;
  rating: number;
  sold: number;
  category?: { name: string; slug: string } | null;
};

function firstImage(images: string) {
  try {
    const arr = JSON.parse(images);
    return arr[0] ?? "";
  } catch {
    return images;
  }
}

export function ProductCard({ product }: { product: Product }) {
  const image = firstImage(product.images);
  const labels: { text: string; cls: string }[] = [];
  if (product.isNew) labels.push({ text: "Baharu", cls: "bg-mint text-ink" });
  if (product.isPopular) labels.push({ text: "Popular", cls: "bg-sage/40 text-ink" });
  if (product.onSale && product.compareAtPrice) labels.push({ text: "Promosi", cls: "bg-primary-soft text-white" });

  return (
    <div className="group bg-white rounded-2xl border border-taupe/50 overflow-hidden hover:shadow-lg transition flex flex-col">
      <Link href={`/produk/${product.slug}`} className="relative block aspect-square bg-mist/20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
        {labels.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {labels.map((l) => (
              <span key={l.text} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${l.cls}`}>{l.text}</span>
            ))}
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <Link href={`/kategori/${product.category.slug}`} className="text-[11px] uppercase tracking-wide text-sage font-semibold">
            {product.category.name}
          </Link>
        )}
        <Link href={`/produk/${product.slug}`} className="mt-1 text-sm font-medium leading-snug line-clamp-2 hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
          <span className="text-amber-500">★</span> {product.rating.toFixed(1)}
          <span className="text-taupe">•</span> {product.sold} terjual
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-primary">{formatRM(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-ink-soft line-through">{formatRM(product.compareAtPrice)}</span>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <AddToCartButton
            product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, images: product.images }}
            className="flex-1"
          />
          <Link
            href={`/produk/${product.slug}`}
            className="rounded-full border border-taupe px-3 py-2 text-sm hover:border-primary hover:text-primary transition"
            aria-label="Lihat butiran"
          >
            👁
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-center text-ink-soft py-12">Tiada produk dijumpai.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
