import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "Soalan Lazim" };

const faqs = [
  ["Bagaimana cara membuat pesanan?", "Pilih produk kegemaran anda, tambah ke troli, kemudian klik 'Checkout'. Isi maklumat penghantaran dan pilih kaedah pembayaran. Pesanan anda akan diproses serta-merta!"],
  ["Apakah kaedah pembayaran yang diterima?", "Kami menerima FPX (perbankan dalam talian), kad debit/kredit (Visa & Mastercard) dan e-dompet seperti Touch 'n Go eWallet dan GrabPay."],
  ["Berapa lama masa penghantaran?", "Penghantaran mengambil masa 1-4 hari bekerja bergantung pada kaedah penghantaran yang dipilih. Penghantaran percuma untuk pesanan ≥ RM150!"],
  ["Adakah produk selamat untuk kanak-kanak?", "Ya, semua produk kami dipilih dengan teliti untuk keselamatan kanak-kanak. Mainan kami mematuhi standard keselamatan antarabangsa dan bebas daripada bahan berbahaya."],
  ["Bolehkah saya memulangkan atau menukar produk?", "Ya, kami menerima pemulangan dalam tempoh 7 hari untuk produk yang belum dibuka dan dalam keadaan asal. Sila rujuk Polisi Pemulangan untuk butiran lanjut."],
  ["Bagaimana jika produk sampai rosak?", "Sila hubungi kami dalam tempoh 48 jam dengan gambar produk rosak. Kami akan menghantar produk gantian atau memulangkan wang anda sepenuhnya."],
  ["Adakah saya perlu akaun untuk membeli?", "Tidak wajib, tetapi mempunyai akaun membolehkan anda menjejak pesanan dan menguruskan profil dengan lebih mudah."],
  ["Bagaimana menggunakan kod promosi?", "Masukkan kod promosi di ruangan 'Kod Promosi' semasa checkout. Kod promosi aktif akan dipaparkan di halaman Promosi."],
];

export default function FaqPage() {
  return (
    <StaticPage title="Soalan Lazim (FAQ)">
      <div className="space-y-4">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-xl border border-taupe/50 bg-cream/50 px-5 py-4">
            <summary className="cursor-pointer font-semibold text-ink list-none flex justify-between items-center">
              {q}
              <span className="text-primary group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="mt-3 text-sm">{a}</p>
          </details>
        ))}
      </div>
      <p className="text-sm pt-2">Masih ada soalan? <a href="/hubungi-kami" className="text-primary font-semibold hover:underline">Hubungi kami</a> — kami sedia membantu!</p>
    </StaticPage>
  );
}
