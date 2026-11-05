import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/ProductCard";
import Link from "next/link";
import { Prisma } from "@prisma/client";

export default async function CariPage({ searchParams }: { searchParams: Promise<{ q?: string; kategori?: string; min?: string; max?: string; popular?: string; new?: string; sort?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const where: Prisma.ProductWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (sp.kategori) {
    where.category = { slug: sp.kategori };
  }
  if (sp.min || sp.max) {
    where.price = {};
    if (sp.min) where.price.gte = Number(sp.min);
    if (sp.max) where.price.lte = Number(sp.max);
  }
  if (sp.popular === "1") where.isPopular = true;
  if (sp.new === "1") where.isNew = true;

  const sort = sp.sort ?? "terkini";
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "murah" ? { price: "asc" } :
    sort === "mahal" ? { price: "desc" } :
    sort === "popular" ? { sold: "desc" } :
    sort === "rating" ? { rating: "desc" } :
    { createdAt: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {q ? `Hasil carian: "${q}"` : "Semua Produk"}
      </h1>
      <p className="text-ink-soft mb-6">{products.length} produk dijumpai</p>

      {/* Penapis */}
      <form method="GET" className="bg-white rounded-2xl border border-taupe/50 p-4 mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input type="hidden" name="q" value={q} />
        <select name="kategori" defaultValue={sp.kategori ?? ""} className="rounded-lg border border-taupe px-3 py-2 text-sm bg-cream">
          <option value="">Semua Kategori</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <input name="min" type="number" placeholder="Harga min (RM)" defaultValue={sp.min ?? ""} className="rounded-lg border border-taupe px-3 py-2 text-sm bg-cream" />
        <input name="max" type="number" placeholder="Harga maks (RM)" defaultValue={sp.max ?? ""} className="rounded-lg border border-taupe px-3 py-2 text-sm bg-cream" />
        <select name="sort" defaultValue={sort} className="rounded-lg border border-taupe px-3 py-2 text-sm bg-cream">
          <option value="terkini">Terkini</option>
          <option value="popular">Paling Popular</option>
          <option value="rating">Penarafan Tertinggi</option>
          <option value="murah">Harga: Rendah ke Tinggi</option>
          <option value="mahal">Harga: Tinggi ke Rendah</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">Tapis</button>
          <Link href="/cari" className="rounded-full border border-taupe px-4 py-2 text-sm hover:border-primary hover:text-primary">Reset</Link>
        </div>
      </form>

      <ProductGrid products={products} />
    </div>
  );
}
