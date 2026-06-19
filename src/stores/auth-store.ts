"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { SessionUser } from "@/lib/session";

export function useAuth() {
  const { data: session, status } = useSession();
  const user: SessionUser | null = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        email: session.user.email ?? "",
        name: session.user.name,
        role: (session.user as { role?: string }).role ?? "USER",
      }
    : null;
  return { user, status, signOut };
}

// Sync wishlist from server when user logs in
export function useWishlistSync() {
  const { user } = useAuth();
  const setItems = useWishlistStore((s) => s.setItems);

  useEffect(() => {
    if (!user) return;
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, [user, setItems]);
}
