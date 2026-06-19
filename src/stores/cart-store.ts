"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.image,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
            isOpen: true,
          });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
            ),
        }),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (s, i) => s + (i.discountPrice ?? i.price) * i.quantity,
          0
        ),
    }),
    { name: "cafenoir-cart" }
  )
);
