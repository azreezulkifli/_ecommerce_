import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log Masuk" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-3xl border border-taupe/50 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Log Masuk</h1>
        <p className="text-sm text-ink-soft text-center mb-6">Selamat kembali ke KidSmart Store</p>
        <LoginForm />
      </div>
    </div>
  );
}
