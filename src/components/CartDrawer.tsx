"use client";

import Link from "next/link";
import { useCart, itemKey } from "./CartProvider";
import { formatRM } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal, count } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40" onClick={() => setIsOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-taupe/60">
          <h2 className="font-bold text-lg">Troli Anda ({count})</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-mist/50" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <p className="text-4xl mb-3">🧸</p>
              <p>Troli anda masih kosong.</p>
              <Link href="/" onClick={() => setIsOpen(false)} className="inline-block mt-4 text-primary font-medium hover:underline">Mula membeli-belah</Link>
            </div>
          ) : (
            items.map((i) => (
              <div key={itemKey(i)} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover bg-mist/30" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{i.name}</p>
                  <p className="text-xs text-ink-soft">
                    {i.size && `Saiz: ${i.size} `}{i.color && `• Warna: ${i.color}`}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">{formatRM(i.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(itemKey(i), i.qty - 1)} className="h-7 w-7 rounded-full border border-taupe text-sm">−</button>
                    <span className="text-sm w-6 text-center">{i.qty}</span>
                    <button onClick={() => updateQty(itemKey(i), i.qty + 1)} className="h-7 w-7 rounded-full border border-taupe text-sm">+</button>
                    <button onClick={() => removeItem(itemKey(i))} className="ml-auto text-xs text-primary hover:underline">Buang</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-taupe/60 px-5 py-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Subjumlah</span>
              <span>{formatRM(subtotal)}</span>
            </div>
            <p className="text-xs text-ink-soft">Penghantaran dikira semasa checkout.</p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-full bg-primary py-3 text-center font-semibold text-white hover:bg-primary-dark transition"
            >
              Bayar Sekarang
            </Link>
            <Link href="/troli" onClick={() => setIsOpen(false)} className="block text-center text-sm text-primary hover:underline">
              Lihat Troli Penuh
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
