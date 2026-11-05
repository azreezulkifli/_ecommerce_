"use client";

import { useActionState } from "react";
import { contactAction, type ActionResult } from "@/app/actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(contactAction, null);
  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (state?.ok) {
    return (
      <div className="rounded-xl bg-mint/50 border border-sage p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">{state.error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama *</label>
          <input name="name" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Emel *</label>
          <input name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input name="phone" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subjek</label>
          <input name="subject" className={inputCls} placeholder="Pertanyaan anda" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mesej *</label>
        <textarea name="message" required rows={5} className={inputCls} placeholder="Tulis mesej anda di sini..." />
      </div>
      <button disabled={pending} className="rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
        {pending ? "Menghantar..." : "Hantar Mesej"}
      </button>
    </form>
  );
}
