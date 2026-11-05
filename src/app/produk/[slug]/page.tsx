import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductDetail } from "./ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-ink-soft mb-6">
        <Link href="/" className="hover:text-primary">Utama</Link> /{" "}
        <Link href={`/kategori/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link> /{" "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} related={related} />
    </div>
  );
}
