import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, include: { products: { include: { category: true } } } });
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-ink-soft mb-4">
        <Link href="/" className="hover:text-primary">Utama</Link> / <span className="text-ink">{category.name}</span>
      </nav>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="text-ink-soft mt-2 max-w-2xl">{category.description}</p>}
        <p className="text-sm text-ink-soft mt-1">{category.products.length} produk</p>
      </div>
      <ProductGrid products={category.products} />
    </div>
  );
}
