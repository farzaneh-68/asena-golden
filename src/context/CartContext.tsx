"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: number) => void;
  update: (id: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("asena_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // save to localStorage on change
  useEffect(() => {
    localStorage.setItem("asena_cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product) =>
    setItems(prev => {
      const exists = prev.find(i => i.product.id === p.id);
      if (exists) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1 }];
    });

  const remove = (id: number) => setItems(prev => prev.filter(i => i.product.id !== id));

  const update = (id: number, qty: number) =>
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.product.id !== id)
        : prev.map(i => i.product.id === id ? { ...i, qty } : i)
    );

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
