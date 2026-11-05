import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";

export default async function HomePage() {
  const [categories, featured, popular, newProducts, promos, bestSellers] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { onSale: true }, take: 8, include: { category: true }, orderBy: { sold: "desc" } }),
    prisma.product.findMany({ where: { isPopular: true }, take: 8, include: { category: true } }),
    prisma.product.findMany({ where: { isNew: true }, take: 8, include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { onSale: true }, take: 4, include: { category: true }, orderBy: { sold: "desc" } }),
    prisma.product.findMany({ orderBy: { sold: "desc" }, take: 8, include: { category: true } }),
  ]);

  const promoCode = await prisma.promoCode.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      {/* Banner Utama */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#b0565f] to-primary-soft text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #fff 0%, transparent 40%), radial-gradient(circle at 80% 70%, #D2EAB8 0%, transparent 40%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium mb-4">🎉 Jualan Mega Kanak-Kanak</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Dunia Ceria Si Kecil Bermula Di Sini!</h1>
            <p className="mt-4 text-lg text-white/85 max-w-md">
              Pilihan pakaian comel dan mainan menarik untuk anak tersayang. Kualiti terjamin, harga mesra ibu bapa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/promosi" className="rounded-full bg-white px-7 py-3 font-bold text-primary hover:bg-mist transition">
                Beli Sekarang
              </Link>
              <Link href="/kategori/pakaian-bayi" className="rounded-full border-2 border-white/70 px-7 py-3 font-semibold hover:bg-white/10 transition">
                Lihat Kategori
              </Link>
            </div>
            {promoCode && (
              <p className="mt-6 text-sm bg-white/15 rounded-full inline-block px-4 py-2">
                Gunakan kod <span className="font-bold">{promoCode.code}</span> untuk diskaun istimewa!
              </p>
            )}
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {["produk-2", "produk-5", "produk-11", "produk-12"].map((p) => (
              <div key={p} className="rounded-2xl overflow-hidden bg-white/15 backdrop-blur border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/products/${p}.svg`} alt="" className="w-full h-44 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Kategori Popular</h2>
            <p className="text-ink-soft mt-1">Terokai pilihan mengikut kategori kegemaran anda</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} name={c.name} slug={c.slug} image={c.image} />
          ))}
        </div>
      </section>

      {/* Produk Promosi */}
      <section className="bg-mist/30 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">🔥 Produk Promosi</h2>
              <p className="text-ink-soft mt-1">Diskaun sehingga 40% — tawaran terhad!</p>
            </div>
            <Link href="/promosi" className="text-sm font-semibold text-primary hover:underline shrink-0">Lihat Semua →</Link>
          </div>
          <ProductGrid products={promos.length ? promos : featured} />
        </div>
      </section>

      {/* Kelebihan */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["✓", "Produk Berkualiti", "Semua produk dipilih dengan teliti untuk keselamatan kanak-kanak."],
            ["RM", "Harga Berpatutan", "Harga mesra keluarga tanpa kompromi kualiti."],
            ["🔒", "Pembelian Selamat", "Proses checkout yang mudah dan selamat."],
            ["🚚", "Hantar Seluruh Malaysia", "Penghantaran pantas ke seluruh negara."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-2xl border border-taupe/50 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-xl">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-ink-soft mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produk Popular */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">⭐ Produk Popular</h2>
          <Link href="/cari?popular=1" className="text-sm font-semibold text-primary hover:underline">Lihat Semua →</Link>
        </div>
        <ProductGrid products={popular} />
      </section>

      {/* Banner Promosi */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="rounded-3xl bg-gradient-to-r from-leaf to-mint p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink">Jualan Murah Awal Bulan!</h2>
            <p className="mt-2 text-ink-soft max-w-lg">Diskaun tambahan untuk produk terpilih. Jangan lepaskan peluang ini untuk stok barangan kegemaran si kecil!</p>
          </div>
          <Link href="/promosi" className="shrink-0 rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-primary-dark transition">
            Terus ke Promosi
          </Link>
        </div>
      </section>

      {/* Produk Baharu */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">🆕 Produk Baharu</h2>
          <Link href="/cari?new=1" className="text-sm font-semibold text-primary hover:underline">Lihat Semua →</Link>
        </div>
        <ProductGrid products={newProducts} />
      </section>

      {/* Terlaris */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">🏆 Jualan Terlaris</h2>
        </div>
        <ProductGrid products={bestSellers} />
      </section>
    </div>
  );
}
