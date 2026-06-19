"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { initFromHash } from "@/stores/nav-store";
import { useWishlistSync } from "@/stores/auth-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    initFromHash();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <WishlistSyncWrapper>{children}</WishlistSyncWrapper>
      </SessionProvider>
    </QueryClientProvider>
  );
}

function WishlistSyncWrapper({ children }: { children: React.ReactNode }) {
  useWishlistSync();
  return <>{children}</>;
}
