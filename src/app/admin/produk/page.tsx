import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRM } from "@/lib/format";
import { DeleteButton } from "./DeleteButton";

export default async function AdminProdukPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Produk ({products.length})</h1>
        <div className="flex gap-2">
          <form>
            <input name="q" defaultValue={q ?? ""} placeholder="Cari produk..." className="rounded-lg border border-taupe px-3 py-2 text-sm bg-white" />
          </form>
          <Link href="/admin/produk/baru" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark">+ Tambah Produk</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-taupe/50 text-ink-soft bg-cream/50">
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = (() => { try { return JSON.parse(p.images)[0] ?? ""; } catch { return ""; } })();
                return (
                  <tr key={p.id} className="border-b border-taupe/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="h-10 w-10 rounded-lg object-cover bg-mist/30" />
                        <span className="font-medium max-w-[200px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ink-soft">{p.category.name}</td>
                    <td className="py-3 px-4 font-semibold">{formatRM(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={p.stock === 0 ? "text-red-500 font-semibold" : p.stock < 10 ? "text-amber-600" : ""}>{p.stock}</span>
                    </td>
                    <td className="py-3 px-4 space-x-1">
                      {p.isNew && <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold">Baharu</span>}
                      {p.isPopular && <span className="rounded-full bg-sage/40 px-2 py-0.5 text-[11px] font-semibold">Popular</span>}
                      {p.onSale && <span className="rounded-full bg-primary-soft text-white px-2 py-0.5 text-[11px] font-semibold">Promo</span>}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/produk/${p.slug}`} target="_blank" className="text-sage hover:text-primary text-xs">Lihat</Link>
                      <Link href={`/admin/produk/${p.id}/edit`} className="text-primary hover:underline text-xs font-medium">Edit</Link>
                      <DeleteButton id={p.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
