import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Daftar Akaun" };

export default function DaftarPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-3xl border border-taupe/50 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Daftar Akaun</h1>
        <p className="text-sm text-ink-soft text-center mb-6">Sertai KidSmart Store untuk pengalaman membeli-belah yang lebih mudah</p>
        <RegisterForm />
      </div>
    </div>
  );
}
