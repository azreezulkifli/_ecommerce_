"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/app/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Emel</label>
        <input name="email" type="email" required className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="anda@contoh.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Kata Laluan</label>
        <input name="password" type="password" required className="w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Kata laluan anda" />
      </div>
      <button disabled={pending} className="w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
        {pending ? "Sedang log masuk..." : "Log Masuk"}
      </button>
      <p className="text-sm text-ink-soft text-center">
        Belum ada akaun? <Link href="/daftar" className="text-primary font-semibold hover:underline">Daftar Sekarang</Link>
      </p>
      <p className="text-xs text-center text-ink-soft bg-mist/30 rounded-lg px-3 py-2">
        Akaun demo: siti@example.com / password123 • Admin: admin@DisneyKids.com.my / admin123
      </p>
    </form>
  );
}
