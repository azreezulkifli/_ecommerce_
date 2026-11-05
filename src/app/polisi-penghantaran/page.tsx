import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export const metadata: Metadata = { title: "Polisi Penghantaran" };

export default function PolisiPenghantaranPage() {
  return (
    <StaticPage title="Polisi Penghantaran">
      <p>Kami menghantar ke seluruh Malaysia melalui penyedia logistik yang dipercayai.</p>
      <h2 className="text-lg font-bold text-ink">Kaedah & Kos Penghantaran</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-taupe">
              <th className="text-left py-2 pr-4">Kaedah</th>
              <th className="text-left py-2 pr-4">Kos</th>
              <th className="text-left py-2">Anggaran Masa</th>
            </tr>
          </thead>
          <tbody>
            {SHIPPING_RATES.map((r) => (
              <tr key={r.method} className="border-b border-taupe/50">
                <td className="py-2 pr-4">{r.method}</td>
                <td className="py-2 pr-4">{r.price === 0 ? "RM0.00" : `RM${r.price.toFixed(2)}`}</td>
                <td className="py-2">{r.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p><strong>Penghantaran Percuma:</strong> Untuk semua pesanan bernilai ≥ RM{FREE_SHIPPING_THRESHOLD.toFixed(2)} (tidak termasuk self pickup).</p>
      <h2 className="text-lg font-bold text-ink">Masa Proses</h2>
      <p>Pesanan diproses dalam 1-2 hari bekerja selepas pembayaran disahkan. Anda akan menerima notifikasi e-mel apabila pesanan dihantar.</p>
      <h2 className="text-lg font-bold text-ink">Kawasan Penghantaran</h2>
      <p>Kami menghantar ke seluruh 13 negeri dan 3 wilayah persekutuan Malaysia. Untuk Sabah & Sarawak, masa penghantaran mungkin lebih lama (5-7 hari bekerja).</p>
    </StaticPage>
  );
}
