import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-taupe/60">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary-dark font-extrabold text-sm">D</span>
            <span className="text-lg font-extrabold text-primary">Disney<span className="text-gold">Kids</span></span>
          </div>
          <p className="text-sm text-ink-soft">
            Kedai dalam talian pakaian dan mainan kanak-kanak yang selamat, berkualiti dan mesra keluarga.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Kategori</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link className="hover:text-primary" href="/kategori/pakaian-bayi">Pakaian Bayi</Link></li>
            <li><Link className="hover:text-primary" href="/kategori/mainan-pendidikan">Mainan Pendidikan</Link></li>
            <li><Link className="hover:text-primary" href="/kategori/mainan-bayi">Mainan Bayi</Link></li>
            <li><Link className="hover:text-primary" href="/kategori/aksesori-kanak-kanak">Aksesori</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Bantuan</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link className="hover:text-primary" href="/faq">Soalan Lazim</Link></li>
            <li><Link className="hover:text-primary" href="/polisi-penghantaran">Polisi Penghantaran</Link></li>
            <li><Link className="hover:text-primary" href="/polisi-pemulangan">Pemulangan & Pertukaran</Link></li>
            <li><Link className="hover:text-primary" href="/hubungi-kami">Hubungi Kami</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Perundangan</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link className="hover:text-primary" href="/polisi-privasi">Polisi Privasi</Link></li>
            <li><Link className="hover:text-primary" href="/terma-syarat">Terma & Syarat</Link></li>
            <li><Link className="hover:text-primary" href="/tentang-kami">Tentang Kami</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-taupe/60 py-4 text-center text-xs text-ink-soft">
        © 2026 DisneyKids Store. Hak cipta terpelihara. Dibuat dengan ❤️ di Malaysia.
      </div>
    </footer>
  );
}
