"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/app/actions";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(registerAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Penuh</label>
        <input name="name" required className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Nama anda" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Emel</label>
        <input name="email" type="email" required className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="anda@contoh.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nombor Telefon</label>
        <input name="phone" className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="012-3456789" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Kata Laluan</label>
        <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Minimum 6 aksara" />
      </div>
      <button disabled={pending} className="w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
        {pending ? "Mendaftar..." : "Daftar Akaun"}
      </button>
      <p className="text-sm text-ink-soft text-center">
        Sudah ada akaun? <Link href="/log-masuk" className="text-primary font-semibold hover:underline">Log Masuk</Link>
      </p>
    </form>
  );
}
