import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Hubungi Kami" };

export default function HubungiKamiPage() {
  return (
    <StaticPage title="Hubungi Kami">
      <p>Ada pertanyaan atau perlukan bantuan? Kami sedia membantu anda!</p>
      <div className="grid sm:grid-cols-3 gap-4 py-2">
        <div className="rounded-xl bg-cream p-4 text-center">
          <p className="text-2xl mb-1">📧</p>
          <p className="font-semibold text-sm">Emel</p>
          <p className="text-sm">hello@kidsmart.com.my</p>
        </div>
        <div className="rounded-xl bg-cream p-4 text-center">
          <p className="text-2xl mb-1">📞</p>
          <p className="font-semibold text-sm">Telefon</p>
          <p className="text-sm">03-1234 5678</p>
        </div>
        <div className="rounded-xl bg-cream p-4 text-center">
          <p className="text-2xl mb-1">🕐</p>
          <p className="font-semibold text-sm">Waktu Operasi</p>
          <p className="text-sm">Isnin–Sabtu, 9pg–6ptg</p>
        </div>
      </div>
      <h2 className="text-xl font-bold text-ink pt-2">Hantar Mesej</h2>
      <ContactForm />
    </StaticPage>
  );
}
