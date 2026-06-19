"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[]; // product ids
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
  setItems: (ids: string[]) => void;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      has: (productId) => get().items.includes(productId),
      remove: (productId) =>
        set({ items: get().items.filter((id) => id !== productId) }),
      setItems: (ids) => set({ items: ids }),
      count: () => get().items.length,
    }),
    { name: "cafenoir-wishlist" }
  )
);
