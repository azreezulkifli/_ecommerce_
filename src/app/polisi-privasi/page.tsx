import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "Polisi Privasi" };

export default function PolisiPrivasiPage() {
  return (
    <StaticPage title="Polisi Privasi">
      <p>DisneyKids Store komited untuk melindungi privasi pelanggan kami. Polisi ini menerangkan cara kami mengumpul, menggunakan dan melindungi maklumat peribadi anda.</p>
      <h2 className="text-lg font-bold text-ink">1. Maklumat yang Kami Kumpul</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Maklumat akaun: nama, emel, nombor telefon.</li>
        <li>Maklumat penghantaran: alamat, bandar, poskod.</li>
        <li>Maklumat pesanan dan sejarah pembelian.</li>
      </ul>
      <h2 className="text-lg font-bold text-ink">2. Penggunaan Maklumat</h2>
      <p>Kami menggunakan maklumat anda untuk memproses pesanan, menghantar produk, memberikan khidmat pelanggan dan (dengan kebenaran anda) menghantar promosi.</p>
      <h2 className="text-lg font-bold text-ink">3. Perlindungan Data</h2>
      <p>Kami menggunakan langkah keselamatan teknikal dan organisasi yang munasabah untuk melindungi data anda. Kata laluan disimpan dalam bentuk hashed dan tidak dapat dibaca oleh sesiapa.</p>
      <h2 className="text-lg font-bold text-ink">4. Perkongsian Data</h2>
      <p>Kami tidak menjual maklumat peribadi anda kepada pihak ketiga. Data mungkin dikongsi dengan penyedia penghantaran dan payment gateway semata-mata untuk tujuan pemprosesan pesanan anda.</p>
      <h2 className="text-lg font-bold text-ink">5. Hak Anda</h2>
      <p>Anda boleh meminta akses, pembetulan atau pemadaman maklumat peribadi anda pada bila-bila masa dengan menghubungi kami.</p>
    </StaticPage>
  );
}
