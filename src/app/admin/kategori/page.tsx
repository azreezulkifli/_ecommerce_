import { prisma } from "@/lib/db";
import { CategoryManager } from "./CategoryManager";

export default async function AdminKategoriPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kategori ({categories.length})</h1>
      <CategoryManager categories={categories.map((c) => ({
        id: c.id, name: c.name, description: c.description ?? "", image: c.image ?? "", productCount: c._count.products,
      }))} />
    </div>
  );
}
