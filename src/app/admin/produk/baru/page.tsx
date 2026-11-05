import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export default async function BaruProdukPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <Link href="/admin/produk" className="text-sm text-primary hover:underline">← Kembali ke Senarai Produk</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Tambah Produk Baru</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
