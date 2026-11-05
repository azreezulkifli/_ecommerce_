import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "Tentang Kami" };

export default function TentangKamiPage() {
  return (
    <StaticPage title="Tentang DisneyKids Store">
      <p>
        DisneyKids Store ditubuhkan dengan satu misi mudah: menyediakan pakaian dan mainan kanak-kanak yang <strong>selamat, berkualiti dan berpatutan</strong> untuk keluarga Malaysia.
      </p>
      <p>
        Kami percaya bahawa setiap ibu bapa mahukan yang terbaik untuk anak mereka. Itulah sebabnya kami memilih setiap produk dengan teliti — daripada fabrik pakaian yang mesra kulit, hingga mainan yang lulus standard keselamatan kanak-kanak.
      </p>
      <h2 className="text-xl font-bold text-ink pt-2">Nilai Kami</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Kualiti Terjamin</strong> — Setiap produk melalui proses semakan yang ketat.</li>
        <li><strong>Harga Mesra Keluarga</strong> — Kami tawarkan harga terbaik tanpa kompromi kualiti.</li>
        <li><strong>Perkhidmatan Pelanggan</strong> — Pasukan kami sentiasa bersedia membantu anda.</li>
        <li><strong>Kemajuan Sosial</strong> — Sebahagian hasil jualan disalurkan kepada amal kanak-kanak.</li>
      </ul>
      <p>
        Terima kasih kerana mempercayai DisneyKids Store sebagai rakan membeli-belah keluarga anda. 😊
      </p>
    </StaticPage>
  );
}
