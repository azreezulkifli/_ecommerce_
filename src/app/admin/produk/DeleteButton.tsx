"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Padam produk ini? Tindakan ini tidak boleh dibatalkan.")) {
          startTransition(async () => {
            const res = await deleteProductAction(id);
            if (!res.ok) alert(res.error ?? "Ralat");
          });
        }
      }}
      className="text-red-500 hover:underline text-xs font-medium disabled:opacity-50"
    >
      {pending ? "..." : "Padam"}
    </button>
  );
}
