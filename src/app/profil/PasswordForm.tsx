"use client";

import { useActionState } from "react";
import { changePasswordAction, type ActionResult } from "@/app/actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(changePasswordAction, null);
  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-taupe/50 p-6 space-y-4">
      <h2 className="font-bold text-lg">Tukar Kata Laluan</h2>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-primary font-medium">{state.message}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Kata Laluan Semasa</label>
        <input name="current" type="password" required className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Kata Laluan Baru</label>
        <input name="next" type="password" required minLength={6} className={inputCls} />
      </div>
      <button disabled={pending} className="w-full rounded-full bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
        {pending ? "Menyimpan..." : "Tukar Kata Laluan"}
      </button>
    </form>
  );
}
