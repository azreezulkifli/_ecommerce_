export const SHIPPING_RATES = [
  { method: "Paket Selamat (Semantan)", price: 8.5, eta: "2-4 hari bekerja" },
  { method: "Poslaju Ekspres", price: 12.0, eta: "1-3 hari bekerja" },
  { method: "Self Pickup (Hubungi Kami)", price: 0, eta: "Sebut masa pengambilan" },
];

export const FREE_SHIPPING_THRESHOLD = 150;

export function calculateShipping(subtotal: number, method: string) {
  const rate = SHIPPING_RATES.find((r) => r.method === method) ?? SHIPPING_RATES[0];
  const price = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : rate.price;
  return { ...rate, price };
}

export const ORDER_STATUSES = [
  "Menunggu Pembayaran",
  "Pembayaran Disahkan",
  "Sedang Diproses",
  "Dihantar",
  "Selesai",
  "Dibatalkan",
] as const;
