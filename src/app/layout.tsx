import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { getSessionUser } from "@/lib/auth";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  title: {
    default: "DisneyKids Store | Pakaian & Mainan Kanak-Kanak",
    template: "%s | DisneyKids Store",
  },
  description:
    "Kedai dalam talian pakaian dan mainan kanak-kanak yang selamat, berkualiti dan mesra keluarga. Penghantaran ke seluruh Malaysia.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <html lang="ms" className={baloo.variable}>
      <body className="min-h-screen flex flex-col bg-cream text-ink antialiased">
        <CartProvider>
          <Header user={user ? { name: user.name, role: user.role } : null} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
