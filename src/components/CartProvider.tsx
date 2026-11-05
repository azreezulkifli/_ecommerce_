"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function itemKey(item: { productId: string; size?: string; color?: string }) {
  return `${item.productId}|${item.size ?? ""}|${item.color ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem("kidsmart_cart");
        if (saved) setItems(JSON.parse(saved));
      } catch {}
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("kidsmart_cart", JSON.stringify(items));
  }, [items, loaded]);

  const addItem: CartContextType["addItem"] = (item) => {
    setItems((prev) => {
      const key = itemKey(item);
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) => (itemKey(i) === key ? { ...i, qty: i.qty + (item.qty ?? 1) } : i));
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (key: string) => setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  const updateQty = (key: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => itemKey(i) !== key) : prev.map((i) => (itemKey(i) === key ? { ...i, qty } : i))
    );
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, removeItem, updateQty, clear, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart mesti digunakan dalam CartProvider");
  return ctx;
}
