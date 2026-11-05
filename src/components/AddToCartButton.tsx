"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  product,
  size,
  color,
  qty = 1,
  label = "Tambah ke Troli",
  className = "",
}: {
  product: { id: string; slug: string; name: string; price: number; images: string };
  size?: string;
  color?: string;
  qty?: number;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const image = (() => {
    try {
      const arr = JSON.parse(product.images);
      return arr[0] ?? "";
    } catch {
      return product.images;
    }
  })();

  const handle = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image,
      size,
      color,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handle}
      className={`rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition ${className}`}
    >
      {added ? "✓ Ditambah!" : label}
    </button>
  );
}
