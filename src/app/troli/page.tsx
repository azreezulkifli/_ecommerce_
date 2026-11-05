"use client";

import Link from "next/link";
import { useCart, itemKey } from "@/components/CartProvider";
import { formatRM } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export default function TroliPage() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🧸</div>
        <h1 className="text-2xl font-bold">Troli Anda Kosong</h1>
        <p className="text-ink-soft mt-2">Jom cari pakaian dan mainan comel untuk si kecil!</p>
        <Link href="/" className="inline-block mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark transition">
          Mula Membeli-belah
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">🛒 Troli Pembelian</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <div key={itemKey(i)} className="flex gap-4 bg-white rounded-2xl border border-taupe/50 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Link href={`/produk/${i.slug}`}><img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover bg-mist/30" /></Link>
              <div className="flex-1 min-w-0">
                <Link href={`/produk/${i.slug}`} className="font-medium hover:text-primary line-clamp-1">{i.name}</Link>
                <p className="text-xs text-ink-soft mt-1">
                  {i.size && `Saiz: ${i.size} `}{i.color && `• Warna: ${i.color}`}
                </p>
                <p className="font-bold text-primary mt-1">{formatRM(i.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-taupe rounded-full text-sm">
                    <button onClick={() => updateQty(itemKey(i), i.qty - 1)} className="px-3 py-1">−</button>
                    <span className="w-8 text-center">{i.qty}</span>
                    <button onClick={() => updateQty(itemKey(i), i.qty + 1)} className="px-3 py-1">+</button>
                  </div>
                  <button onClick={() => removeItem(itemKey(i))} className="text-sm text-primary hover:underline">Buang</button>
                </div>
              </div>
              <div className="text-right font-semibold">{formatRM(i.price * i.qty)}</div>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-ink-soft hover:text-primary">Kosongkan troli</button>
        </div>

        <div className="bg-white rounded-2xl border border-taupe/50 p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subjumlah ({items.reduce((s, i) => s + i.qty, 0)} item)</span><span>{formatRM(subtotal)}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Penghantaran</span><span>Dikira di checkout</span></div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
                Tambah {formatRM(FREE_SHIPPING_THRESHOLD - subtotal)} lagi untuk penghantaran percuma!
              </p>
            )}
          </div>
          <Link href="/checkout" className="mt-5 block w-full rounded-full bg-primary py-3 text-center font-semibold text-white hover:bg-primary-dark transition">
            Terus ke Checkout
          </Link>
          <Link href="/" className="mt-3 block text-center text-sm text-primary hover:underline">← Terus membeli-belah</Link>
        </div>
      </div>
    </div>
  );
}
