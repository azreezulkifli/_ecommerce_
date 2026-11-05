import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/ProductCard";
import Link from "next/link";

export default async function MainanPage() {
  const categories = await prisma.category.findMany({
    where: { slug: { startsWith: "mainan" } },
    include: { products: { include: { category: true } } },
  });
  const products = categories.flatMap((c) => c.products);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-ink-soft mb-4">
        <Link href="/" className="hover:text-primary">Utama</Link> / <span className="text-ink">Mainan</span>
      </nav>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🧸 Mainan Kanak-Kanak</h1>
        <p className="text-ink-soft mt-2 max-w-2xl">Mainan pendidikan, mainan bayi dan mainan kreatif yang merangsang perkembangan si kecil.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/kategori/${c.slug}`} className="rounded-full border border-taupe px-4 py-1.5 text-sm hover:border-primary hover:text-primary transition">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
