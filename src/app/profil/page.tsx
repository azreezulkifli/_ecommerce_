import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export default async function ProfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/log-masuk?next=/profil");

  const orderCount = await prisma.order.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">👤 Profil Saya</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link href="/pesanan-saya" className="bg-white rounded-2xl border border-taupe/50 p-5 text-center hover:shadow-md transition">
          <p className="text-3xl font-bold text-primary">{orderCount}</p>
          <p className="text-sm text-ink-soft mt-1">Pesanan</p>
        </Link>
        <Link href="/troli" className="bg-white rounded-2xl border border-taupe/50 p-5 text-center hover:shadow-md transition">
          <p className="text-3xl font-bold text-primary">🛒</p>
          <p className="text-sm text-ink-soft mt-1">Troli</p>
        </Link>
        {user.role === "ADMIN" && (
          <Link href="/admin" className="bg-white rounded-2xl border border-primary/30 p-5 text-center hover:shadow-md transition">
            <p className="text-3xl font-bold text-primary">⚙️</p>
            <p className="text-sm text-ink-soft mt-1">Dashboard Admin</p>
          </Link>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <ProfileForm user={user} />
        <PasswordForm />
      </div>
    </div>
  );
}
