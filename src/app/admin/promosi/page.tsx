import { prisma } from "@/lib/db";
import { PromoManager } from "./PromoManager";

export default async function AdminPromosiPage() {
  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kod Promosi ({promos.length})</h1>
      <PromoManager promos={promos.map((p) => ({
        id: p.id, code: p.code, type: p.type, value: p.value, minOrder: p.minOrder,
        active: p.active, expiresAt: p.expiresAt?.toISOString() ?? null,
      }))} />
    </div>
  );
}
