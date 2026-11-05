"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/", label: "Utama" },
  { href: "/pakaian", label: "Pakaian" },
  { href: "/mainan", label: "Mainan" },
  { href: "/promosi", label: "Promosi" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
];

export function Header({ user }: { user: { name: string; role: string } | null }) {
  const { count, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/cari?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-taupe/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold">K</span>
            <span className="text-xl font-bold text-primary tracking-tight">KidSmart</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="px-3 py-2 rounded-full text-sm font-medium text-ink-soft hover:text-primary hover:bg-mist/50 transition">
                {n.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xs ml-auto">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-taupe bg-cream pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft hover:text-primary" aria-label="Cari">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <Link href={user ? "/profil" : "/log-masuk"} className="p-2 rounded-full hover:bg-mist/50 text-ink-soft hover:text-primary" aria-label="Akaun" title={user ? user.name : "Log Masuk"}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-mist/50 text-ink-soft hover:text-primary" aria-label="Troli">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{count}</span>
              )}
            </button>
            <button className="lg:hidden p-2 rounded-full hover:bg-mist/50" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-3 flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-primary hover:bg-mist/50">
                {n.label}
              </Link>
            ))}
            <form onSubmit={submitSearch} className="px-3 pt-2 md:hidden">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-taupe bg-cream px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
