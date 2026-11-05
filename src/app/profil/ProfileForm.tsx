"use client";

import { useActionState } from "react";
import { updateProfileAction, type ActionResult } from "@/app/actions";

type User = { name: string; email: string; phone: string | null; address: string | null; city: string | null; postcode: string | null };

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(updateProfileAction, null);
  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-taupe/50 p-6 space-y-4">
      <h2 className="font-bold text-lg">Maklumat Peribadi</h2>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-primary font-medium">{state.message}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Emel</label>
        <input value={user.email} disabled className={`${inputCls} bg-cream text-ink-soft`} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nama Penuh</label>
        <input name="name" required defaultValue={user.name} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nombor Telefon</label>
        <input name="phone" defaultValue={user.phone ?? ""} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alamat</label>
        <textarea name="address" rows={2} defaultValue={user.address ?? ""} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Bandar</label>
          <input name="city" defaultValue={user.city ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Poskod</label>
          <input name="postcode" defaultValue={user.postcode ?? ""} className={inputCls} />
        </div>
      </div>
      <button disabled={pending} className="w-full rounded-full bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60">
        {pending ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
