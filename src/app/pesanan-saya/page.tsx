import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { formatRM, formatDateTime } from "@/lib/format";

const statusColor: Record<string, string> = {
  "Menunggu Pembayaran": "bg-amber-100 text-amber-700",
  "Pembayaran Disahkan": "bg-mist/50 text-ink",
  "Sedang Diproses": "bg-leaf/60 text-ink",
  "Dihantar": "bg-sage/40 text-ink",
  "Selesai": "bg-mint/60 text-ink",
  "Dibatalkan": "bg-red-100 text-red-600",
};

export default async function PesananSayaPage() {
  const user = await getSessionUser();
  if (!user) redirect("/log-masuk?next=/pesanan-saya");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">📦 Pesanan Saya</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-taupe/50">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-ink-soft">Anda belum mempunyai sebarang pesanan.</p>
          <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">Mula membeli-belah →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/pembayaran/${o.orderNumber}`} className="block bg-white rounded-2xl border border-taupe/50 p-5 hover:shadow-md transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold">{o.orderNumber}</p>
                  <p className="text-xs text-ink-soft">{formatDateTime(o.createdAt)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status] ?? "bg-taupe/50"}`}>{o.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-ink-soft">{o.items.length} jenis item • {o.items.reduce((s, i) => s + i.qty, 0)} unit</p>
                <p className="font-bold text-primary">{formatRM(o.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
