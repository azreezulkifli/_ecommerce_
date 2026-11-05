import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = { title: "Terma & Syarat" };

export default function TermaSyaratPage() {
  return (
    <StaticPage title="Terma & Syarat">
      <p>Dengan menggunakan laman web DisneyKids Store, anda bersetuju dengan terma dan syarat berikut:</p>
      <h2 className="text-lg font-bold text-ink">1. Penggunaan Laman Web</h2>
      <p>Laman web ini disediakan untuk tujuan membeli-belah dalam talian. Anda bertanggungjawab untuk memastikan maklumat yang diberikan adalah tepat dan terkini.</p>
      <h2 className="text-lg font-bold text-ink">2. Akaun Pengguna</h2>
      <p>Anda bertanggungjawab untuk menjaga kerahsiaan kata laluan akaun anda. Segala aktiviti di bawah akaun anda dianggap dilakukan oleh anda.</p>
      <h2 className="text-lg font-bold text-ink">3. Harga & Produk</h2>
      <p>Kami berhak untuk mengubah harga dan ketersediaan produk pada bila-bila masa. Kami akan memaklumkan sekiranya harga berubah selepas pesanan dibuat.</p>
      <h2 className="text-lg font-bold text-ink">4. Harta Intelek</h2>
      <p>Semua kandungan di laman web ini adalah hak milik DisneyKids Store dan tidak boleh disalin tanpa kebenaran bertulis.</p>
      <h2 className="text-lg font-bold text-ink">5. Had Liabiliti</h2>
      <p>DisneyKids Store tidak bertanggungjawab atas sebarang kerugian tidak langsung yang timbul daripada penggunaan laman web ini.</p>
    </StaticPage>
  );
}
