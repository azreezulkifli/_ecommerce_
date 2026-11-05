import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/log-masuk?next=/checkout");
  return <CheckoutForm user={user} />;
}
