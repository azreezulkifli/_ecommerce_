import { prisma } from "@/lib/db";
import { formatRM } from "@/lib/format";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalSales, orderCount, customerCount, productCount, recentOrders, pendingPayment] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "Dibayar" } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.order.count({ where: { paymentStatus: "Belum Dibayar" } }),
  ]);

  const stats = [
    { label: "Jumlah Jualan", value: formatRM(totalSales._sum.total ?? 0), icon: "💰", color: "bg-leaf/60" },
    { label: "Jumlah Pesanan", value: orderCount, icon: "🧾", color: "bg-mist/60" },
    { label: "Jumlah Pelanggan", value: customerCount, icon: "👥", color: "bg-mint/60" },
    { label: "Jumlah Produk", value: productCount, icon: "📦", color: "bg-primary-soft/30" },
    { label: "Menunggu Pembayaran", value: pendingPayment, icon: "⏳", color: "bg-amber-100" },
  ];

  const statusColor: Record<string, string> = {
    "Menunggu Pembayaran": "bg-amber-100 text-amber-700",
    "Pembayaran Disahkan": "bg-mist/50",
    "Sedang Diproses": "bg-leaf/60",
    "Dihantar": "bg-sage/40",
    "Selesai": "bg-mint/60",
    "Dibatalkan": "bg-red-100 text-red-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-ink-soft mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Pesanan Terkini</h2>
          <Link href="/admin/pesanan" className="text-sm text-primary hover:underline">Lihat Semua →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-ink-soft text-sm">Tiada pesanan lagi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-taupe/50 text-ink-soft">
                  <th className="py-2 pr-4">No. Pesanan</th>
                  <th className="py-2 pr-4">Pelanggan</th>
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Jumlah</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-taupe/30">
                    <td className="py-2 pr-4 font-medium">{o.orderNumber}</td>
                    <td className="py-2 pr-4">{o.shippingName}</td>
                    <td className="py-2 pr-4">{o.items.reduce((s, i) => s + i.qty, 0)} item</td>
                    <td className="py-2 pr-4 font-semibold">{formatRM(o.total)}</td>
                    <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[o.status] ?? ""}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
