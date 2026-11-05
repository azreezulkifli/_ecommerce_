"use client";

import { useTransition } from "react";
import { updateUserRoleAction } from "@/app/actions";

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      value={currentRole}
      disabled={pending}
      onChange={(e) => startTransition(async () => {
        const res = await updateUserRoleAction(userId, e.target.value);
        if (!res.ok) alert(res.error);
      })}
      className="rounded-lg border border-taupe px-2 py-1 text-xs bg-cream"
    >
      <option value="USER">Pelanggan</option>
      <option value="ADMIN">Admin</option>
    </select>
  );
}
