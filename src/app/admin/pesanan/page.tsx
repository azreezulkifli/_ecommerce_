import { prisma } from "@/lib/db";
import { OrdersTable } from "./OrdersTable";

export default async function AdminPesananPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true, user: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.order.groupBy({ by: ["status"], _count: true });
  const statusCounts = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pesanan Pelanggan ({orders.length})</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/admin/pesanan" className={`rounded-full px-4 py-1.5 text-sm font-medium ${!status ? "bg-primary text-white" : "bg-white border border-taupe"}`}>
          Semua ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})
        </a>
        {["Menunggu Pembayaran", "Pembayaran Disahkan", "Sedang Diproses", "Dihantar", "Selesai", "Dibatalkan"].map((s) => (
          <a key={s} href={`/admin/pesanan?status=${encodeURIComponent(s)}`} className={`rounded-full px-4 py-1.5 text-sm font-medium ${status === s ? "bg-primary text-white" : "bg-white border border-taupe"}`}>
            {s} ({statusCounts[s] ?? 0})
          </a>
        ))}
      </div>
      <OrdersTable orders={orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.user?.name ?? o.shippingName,
        email: o.user?.email ?? "",
        items: o.items.length,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod ?? "",
        createdAt: o.createdAt.toISOString(),
      }))} />
    </div>
  );
}
