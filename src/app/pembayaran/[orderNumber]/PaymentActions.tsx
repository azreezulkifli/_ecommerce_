"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { payOrderAction } from "@/app/actions";

export function PaymentActions({ orderId, orderNumber, paymentStatus, paymentMode }: {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  paymentMode: string;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const pay = async () => {
    setLoading(true);
    const res = await payOrderAction(orderId);
    setLoading(false);
    if (res.ok) {
      setMsg(res.message ?? "Pembayaran berjaya.");
      router.refresh();
    } else {
      setMsg(res.error ?? "Ralat pembayaran.");
    }
  };

  if (paymentStatus === "Dibayar") {
    return (
      <div className="rounded-2xl bg-mint/50 border border-sage p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-ink">Pembayaran telah disahkan!</p>
        <p className="text-sm text-ink-soft mt-1">Pesanan anda sedang diproses dan akan dihantar tidak lama lagi.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-taupe/50 p-6">
      <h2 className="font-bold mb-3">💰 Pembayaran</h2>
      {paymentMode === "mock" ? (
        <div className="rounded-xl bg-leaf/50 border border-sage p-4 text-sm mb-4">
          <p className="font-semibold mb-1">Mod Sandbox (Pembangunan)</p>
          <p className="text-ink-soft">Ini adalah mod simulasi untuk ujian. Klik butang di bawah untuk mensimulasikan pembayaran berjaya. Untuk production, tetapkan <code>NEXT_PUBLIC_PAYMENT_MODE=gateway</code> dan konfigurasikan payment gateway sebenar (lihat env.example).</p>
        </div>
      ) : (
        <div className="rounded-xl bg-mist/40 border border-mist p-4 text-sm mb-4">
          <p className="font-semibold mb-1">Payment Gateway</p>
          <p className="text-ink-soft">Sila lengkapkan pembayaran melalui FPX / kad / e-dompet menggunakan butang pembayaran yang disediakan oleh payment gateway anda.</p>
        </div>
      )}
      {msg && <p className="mb-3 text-sm text-ink-soft">{msg}</p>}
      <button onClick={pay} disabled={loading || paymentMode !== "mock"} className="w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-dark transition disabled:opacity-50">
        {loading ? "Memproses..." : paymentMode === "mock" ? "Simulasikan Pembayaran (Sandbox)" : "Bayar Sekarang"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        <Link href={`/pesanan-saya`} className="hover:underline">Nombor rujukan: {orderNumber}</Link>
      </p>
    </div>
  );
}
