import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { RoleSelect } from "./RoleSelect";

export default async function AdminPelangganPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pelanggan ({users.length})</h1>
      <div className="bg-white rounded-2xl border border-taupe/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-taupe/50 text-ink-soft bg-cream/50">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Emel</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Bandar</th>
                <th className="py-3 px-4">Pesanan</th>
                <th className="py-3 px-4">Sertai</th>
                <th className="py-3 px-4">Peranan</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-taupe/30">
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 text-ink-soft">{u.phone ?? "-"}</td>
                  <td className="py-3 px-4 text-ink-soft">{u.city ?? "-"}</td>
                  <td className="py-3 px-4">{u._count.orders}</td>
                  <td className="py-3 px-4 text-ink-soft">{formatDateTime(u.createdAt)}</td>
                  <td className="py-3 px-4">
                    <RoleSelect userId={u.id} currentRole={u.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
