"use client";

import { useTransition } from "react";
import { updateOrderStatusAction, markOrderPaidAction } from "@/app/actions";
import { formatRM, formatDateTime } from "@/lib/format";

type Order = {
  id: string; orderNumber: string; customer: string; email: string;
  items: number; total: number; status: string; paymentStatus: string;
  paymentMethod: string; createdAt: string;
};

const STATUSES = ["Menunggu Pembayaran", "Pembayaran Disahkan", "Sedang Diproses", "Dihantar", "Selesai", "Dibatalkan"];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [pending, startTransition] = useTransition();

  const setStatus = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(id, status);
      if (!res.ok) alert(res.error);
    });
  };

  const markPaid = (id: string) => {
    startTransition(async () => {
      const res = await markOrderPaidAction(id);
      if (!res.ok) alert(res.error);
    });
  };

  if (orders.length === 0) return <p className="text-ink-soft">Tiada pesanan.</p>;

  return (
    <div className="bg-white rounded-2xl border border-taupe/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-taupe/50 text-ink-soft bg-cream/50">
              <th className="py-3 px-4">Pesanan</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Pembayaran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-taupe/30 align-top">
                <td className="py-3 px-4">
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-ink-soft">{formatDateTime(o.createdAt)}</p>
                </td>
                <td className="py-3 px-4">
                  <p>{o.customer}</p>
                  <p className="text-xs text-ink-soft">{o.email}</p>
                </td>
                <td className="py-3 px-4">{o.items}</td>
                <td className="py-3 px-4 font-semibold">{formatRM(o.total)}</td>
                <td className="py-3 px-4">
                  <p className="text-xs">{o.paymentMethod}</p>
                  <p className={`text-xs font-semibold ${o.paymentStatus === "Dibayar" ? "text-primary" : "text-amber-600"}`}>{o.paymentStatus}</p>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={o.status}
                    disabled={pending}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="rounded-lg border border-taupe px-2 py-1.5 text-xs bg-cream"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4">
                  {o.paymentStatus !== "Dibayar" && (
                    <button onClick={() => markPaid(o.id)} disabled={pending} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                      Tanda Dibayar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
