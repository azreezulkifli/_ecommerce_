"use client";

import { useActionState, useState, useTransition } from "react";
import { saveCategoryAction, deleteCategoryAction, type ActionResult } from "@/app/actions";

type Category = { id: string; name: string; description: string; image: string; productCount: number };

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveCategoryAction, null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [, startTransition] = useTransition();

  const inputCls = "w-full rounded-lg border border-taupe px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form action={formAction} className="bg-white rounded-2xl border border-taupe/50 p-5 space-y-3 h-fit">
        <h2 className="font-bold">{editing ? "Edit Kategori" : "Tambah Kategori"}</h2>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm text-primary font-medium">{state.message}</p>}
        <input name="name" required placeholder="Nama kategori" defaultValue={editing?.name} className={inputCls} />
        <input name="description" placeholder="Penerangan" defaultValue={editing?.description} className={inputCls} />
        <input name="image" placeholder="Path gambar (cth: /images/categories/x.svg)" defaultValue={editing?.image} className={inputCls} />
        <div className="flex gap-2">
          <button disabled={pending} className="flex-1 rounded-full bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
            {pending ? "..." : editing ? "Kemas Kini" : "Tambah"}
          </button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-taupe px-4 py-2 text-sm">Batal</button>
          )}
        </div>
      </form>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-taupe/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-taupe/50 text-ink-soft bg-cream/50">
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Produk</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-taupe/30">
                <td className="py-3 px-4">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink-soft truncate max-w-[200px]">{c.description}</p>
                </td>
                <td className="py-3 px-4">{c.productCount}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => setEditing(c)} className="text-primary hover:underline text-xs font-medium">Edit</button>
                  <button
                    onClick={() => {
                      if (confirm("Padam kategori ini?")) {
                        startTransition(async () => {
                          const res = await deleteCategoryAction(c.id);
                          if (!res.ok) alert(res.error);
                        });
                      }
                    }}
                    className="text-red-500 hover:underline text-xs font-medium"
                  >
                    Padam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

