import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";

const NAV = [
  { href: "/admin", label: "📊 Dashboard", exact: true },
  { href: "/admin/produk", label: "📦 Produk" },
  { href: "/admin/kategori", label: "🗂️ Kategori" },
  { href: "/admin/pesanan", label: "🧾 Pesanan" },
  { href: "/admin/pelanggan", label: "👥 Pelanggan" },
  { href: "/admin/promosi", label: "🏷️ Promosi" },
  { href: "/admin/laporan", label: "📈 Laporan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/log-masuk?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-taupe/50 p-4 lg:sticky lg:top-24">
            <p className="font-bold text-primary mb-1">Admin Panel</p>
            <p className="text-xs text-ink-soft mb-4">{user.name}</p>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-mist/50 hover:text-primary transition">
                  {n.label}
                </Link>
              ))}
              <Link href="/" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-mist/50 hover:text-primary transition">
                ← Laman Utama
              </Link>
              <form action={logoutAction}>
                <button className="w-full text-left whitespace-nowrap rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition">
                  🚪 Log Keluar
                </button>
              </form>
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
