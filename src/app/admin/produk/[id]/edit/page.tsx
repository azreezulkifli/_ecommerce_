import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "../../ProductForm";

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/produk" className="text-sm text-primary hover:underline">← Kembali ke Senarai Produk</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Edit Produk</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
