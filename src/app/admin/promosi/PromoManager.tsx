"use client";

import { useActionState, useState, useTransition } from "react";
import { savePromoAction, deletePromoAction, type ActionResult } from "@/app/actions";
import { formatRM } from "@/lib/format";
import { formatDate } from "@/lib/format";

type Promo = { id: string; code: string; type: string; value: number; minOrder: number; active: boolean; expiresAt: string | null };

export function PromoManager({ promos }: { promos: Promo[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(savePromoAction, null);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [, startTransition] = useTransition();

  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form action={formAction} className="bg-white rounded-2xl border border-taupe/50 p-5 space-y-3 h-fit">
        <h2 className="font-bold">{editing ? "Edit Kod" : "Tambah Kod Promosi"}</h2>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm text-primary font-medium">{state.message}</p>}
        <input name="code" required placeholder="Contoh: KANAK10" defaultValue={editing?.code} className={`${inputCls} uppercase`} />
        <div className="grid grid-cols-2 gap-3">
          <select name="type" defaultValue={editing?.type ?? "PERCENT"} className={inputCls}>
            <option value="PERCENT">Peratus (%)</option>
            <option value="FIXED">Jumlah Tetap (RM)</option>
          </select>
          <input name="value" type="number" step="0.01" required placeholder="Nilai" defaultValue={editing?.value} className={inputCls} />
        </div>
        <input name="minOrder" type="number" step="0.01" placeholder="Pesanan minimum (RM)" defaultValue={editing?.minOrder ?? 0} className={inputCls} />
        <input name="expiresAt" type="date" defaultValue={editing?.expiresAt?.slice(0, 10) ?? ""} className={inputCls} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} className="accent-primary" /> Aktif
        </label>
        <div className="flex gap-2">
          <button disabled={pending} className="flex-1 rounded-full bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
            {pending ? "..." : editing ? "Kemas Kini" : "Tambah"}
          </button>
          {editing && <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-taupe px-4 py-2 text-sm">Batal</button>}
        </div>
      </form>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-taupe/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-taupe/50 text-ink-soft bg-cream/50">
              <th className="py-3 px-4">Kod</th>
              <th className="py-3 px-4">Diskaun</th>
              <th className="py-3 px-4">Min. Pesanan</th>
              <th className="py-3 px-4">Tamat</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-b border-taupe/30">
                <td className="py-3 px-4 font-bold text-primary">{p.code}</td>
                <td className="py-3 px-4 font-semibold">{p.type === "PERCENT" ? `-${p.value}%` : `-${formatRM(p.value)}`}</td>
                <td className="py-3 px-4">{p.minOrder > 0 ? formatRM(p.minOrder) : "-"}</td>
                <td className="py-3 px-4 text-ink-soft">{p.expiresAt ? formatDate(p.expiresAt) : "Tiada had"}</td>
                <td className="py-3 px-4"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.active ? "bg-mint text-ink" : "bg-taupe/50 text-ink-soft"}`}>{p.active ? "Aktif" : "Tidak Aktif"}</span></td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => setEditing(p)} className="text-primary hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => { if (confirm("Padam kod ini?")) startTransition(async () => { await deletePromoAction(p.id); }); }} className="text-red-500 hover:underline text-xs font-medium">Padam</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
