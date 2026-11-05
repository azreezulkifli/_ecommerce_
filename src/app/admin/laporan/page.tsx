import { prisma } from "@/lib/db";
import { formatRM } from "@/lib/format";
import Link from "next/link";

export default async function AdminLaporanPage({ searchParams }: { searchParams: Promise<{ tempoh?: string }> }) {
  const { tempoh = "semua" } = await searchParams;

  const now = new Date();
  let since: Date | null = null;
  if (tempoh === "harian") since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (tempoh === "mingguan") since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (tempoh === "bulanan") since = new Date(now.getFullYear(), now.getMonth(), 1);

  const orderWhere = { paymentStatus: "Dibayar", ...(since ? { createdAt: { gte: since } } : {}) };
  const [agg, count, items] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true, discount: true, shipping: true }, where: orderWhere }),
    prisma.order.count({ where: orderWhere }),
    prisma.orderItem.findMany({
      where: { order: orderWhere },
      select: { name: true, price: true, qty: true },
    }),
  ]);

  const productMap = new Map<string, { qty: number; revenue: number }>();
  for (const i of items) {
    const cur = productMap.get(i.name) ?? { qty: 0, revenue: 0 };
    cur.qty += i.qty;
    cur.revenue += i.price * i.qty;
    productMap.set(i.name, cur);
  }
  const topProducts = [...productMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  const tabs = [["harian", "Harian"], ["mingguan", "Mingguan"], ["bulanan", "Bulanan"], ["semua", "Semua"]] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Laporan Jualan</h1>
        <div className="flex gap-2">
          {tabs.map(([key, label]) => (
            <Link key={key} href={`/admin/laporan?tempoh=${key}`} className={`rounded-full px-4 py-1.5 text-sm font-medium ${tempoh === key ? "bg-primary text-white" : "bg-white border border-taupe"}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          ["Jumlah Jualan", formatRM(agg._sum.total ?? 0)],
          ["Jumlah Pesanan", count],
          ["Jumlah Diskaun", formatRM(agg._sum.discount ?? 0)],
          ["Hasil Penghantaran", formatRM(agg._sum.shipping ?? 0)],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-white rounded-2xl border border-taupe/50 p-5">
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-ink-soft mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 p-5">
        <h2 className="font-bold mb-4">Produk Terlaris</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-taupe/50 text-ink-soft">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Produk</th>
              <th className="py-2 pr-4">Jumlah Terjual</th>
              <th className="py-2">Jualan</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, i) => (
              <tr key={p.name} className="border-b border-taupe/30">
                <td className="py-2 pr-4 text-ink-soft">{i + 1}</td>
                <td className="py-2 pr-4 font-medium">{p.name}</td>
                <td className="py-2 pr-4">{p.qty}</td>
                <td className="py-2 font-semibold">{formatRM(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topProducts.length === 0 && <p className="text-ink-soft text-sm py-4">Tiada data jualan lagi.</p>}
      </div>
    </div>
  );
}
