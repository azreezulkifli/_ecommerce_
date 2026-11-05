import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/ProductCard";
import Link from "next/link";

export default async function PromosiPage() {
  const [products, promos] = await Promise.all([
    prisma.product.findMany({ where: { onSale: true }, include: { category: true }, orderBy: { sold: "desc" } }),
    prisma.promoCode.findMany({ where: { active: true } }),
  ]);
  const maxDiscount = Math.max(...promos.map((p) => p.value), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-r from-primary-soft/40 to-leaf p-8 mb-10 text-center">
        <h1 className="text-3xl font-extrabold">🎉 Promosi & Tawaran Istimewa</h1>
        <p className="mt-2 text-ink-soft">Diskaun sehingga {maxDiscount}% untuk produk terpilih!</p>
        {promos.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {promos.map((p) => (
              <span key={p.id} className="rounded-full bg-white border border-primary/30 px-4 py-1.5 text-sm font-semibold text-primary">
                {p.code} — {p.type === "PERCENT" ? `-${p.value}%` : `-RM${p.value.toFixed(2)}`}
                {p.minOrder > 0 && <span className="text-ink-soft font-normal"> (min RM{p.minOrder.toFixed(2)})</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      <ProductGrid products={products} />
      {products.length === 0 && <p className="text-center text-ink-soft py-8">Tiada promosi buat masa ini. Sila semak semula nanti!</p>}
      <p className="text-center text-sm text-ink-soft mt-8">
        <Link href="/" className="text-primary hover:underline">← Kembali ke Laman Utama</Link>
      </p>
    </div>
  );
}
