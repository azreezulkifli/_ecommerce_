import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { formatRM, formatDateTime } from "@/lib/format";
import { PaymentActions } from "./PaymentActions";

export default async function PembayaranPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const user = await getSessionUser();
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order || (order.userId && order.userId !== user?.id && user?.role !== "ADMIN")) notFound();

  const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE === "mock" ? "mock" : "gateway";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-3xl">📦</div>
        <h1 className="text-2xl font-bold">Terima Kasih! Pesanan Diterima</h1>
        <p className="text-ink-soft mt-1">Nombor pesanan: <span className="font-bold text-primary">{order.orderNumber}</span></p>
        <p className="text-sm text-ink-soft">{formatDateTime(order.createdAt)}</p>
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 p-6 mb-6">
        <h2 className="font-bold mb-4">Status Pesanan</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-ink-soft">Status:</span> <span className="font-semibold">{order.status}</span></div>
          <div><span className="text-ink-soft">Pembayaran:</span> <span className="font-semibold">{order.paymentStatus}</span></div>
          <div><span className="text-ink-soft">Kaedah:</span> {order.paymentMethod}</div>
          <div><span className="text-ink-soft">Penghantaran:</span> {order.shippingMethod}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 p-6 mb-6">
        <h2 className="font-bold mb-4">Item Pesanan</h2>
        <div className="space-y-3">
          {order.items.map((i) => (
            <div key={i.id} className="flex gap-3 items-center text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image ?? ""} alt={i.name} className="h-12 w-12 rounded-lg object-cover bg-mist/30" />
              <div className="flex-1">
                <p>{i.name} × {i.qty}</p>
                <p className="text-xs text-ink-soft">{i.size} {i.color}</p>
              </div>
              <span className="font-medium">{formatRM(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-taupe/50 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subjumlah</span><span>{formatRM(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-primary"><span>Diskaun{order.promoCode ? ` (${order.promoCode})` : ""}</span><span>-{formatRM(order.discount)}</span></div>}
          <div className="flex justify-between"><span>Penghantaran</span><span>{order.shipping === 0 ? "Percuma" : formatRM(order.shipping)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2"><span>Jumlah</span><span className="text-primary">{formatRM(order.total)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-taupe/50 p-6 mb-6">
        <h2 className="font-bold mb-3">📮 Maklumat Penghantaran</h2>
        <p className="text-sm">{order.shippingName} • {order.shippingPhone}</p>
        <p className="text-sm text-ink-soft">{order.shippingAddress}, {order.shippingCity} {order.shippingPostcode}</p>
      </div>

      <PaymentActions orderId={order.id} orderNumber={order.orderNumber} paymentStatus={order.paymentStatus} paymentMode={paymentMode} />

      <div className="mt-6 text-center space-x-4">
        <Link href="/pesanan-saya" className="text-primary font-semibold hover:underline">Lihat Semua Pesanan</Link>
        <Link href="/" className="text-ink-soft hover:text-primary">← Kembali ke Laman Utama</Link>
      </div>
    </div>
  );
}
