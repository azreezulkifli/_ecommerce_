import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "Polisi Pemulangan & Pertukaran" };

export default function PolisiPemulanganPage() {
  return (
    <StaticPage title="Polisi Pemulangan & Pertukaran">
      <p>Kami mahu anda berpuas hati dengan pembelian anda. Jika ada masalah, kami sedia membantu!</p>
      <h2 className="text-lg font-bold text-ink">Tempoh Pemulangan</h2>
      <p>Anda boleh memohon pemulangan dalam tempoh <strong>7 hari</strong> selepas menerima produk, dengan syarat:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Produk belum dibuka/digunakan dan dalam keadaan asal.</li>
        <li>Teg, label dan pembungkusan masih lengkap.</li>
        <li>Terdapat resit atau nombor pesanan sebagai bukti pembelian.</li>
      </ul>
      <h2 className="text-lg font-bold text-ink">Produk Tidak Layak Dipulangkan</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Produk yang telah dibuka atau digunakan.</li>
        <li>Produk yang rosak akibat salah guna oleh pelanggan.</li>
        <li>Produk peribadi atau diubah suai mengikut permintaan.</li>
      </ul>
      <h2 className="text-lg font-bold text-ink">Proses Pemulangan</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Hubungi kami di hello@DisneyKids.com.my dengan nombor pesanan anda.</li>
        <li>Tunggu pengesahan daripada pasukan kami.</li>
        <li>Hantar balik produk ke alamat yang diberikan.</li>
        <li>Bayaran balik akan diproses dalam 5-10 hari bekerja selepas produk diterima.</li>
      </ol>
    </StaticPage>
  );
}
