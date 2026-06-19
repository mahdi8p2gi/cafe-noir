"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/stores/nav-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/shared/common";
import type { Product } from "@/types";

export function WishlistView() {
  const navigate = useNavStore((s) => s.navigate);
  const wishlistIds = useWishlistStore((s) => s.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      setLoading(false);
      return;
    }
    fetch(`/api/products?limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setProducts((data.products || []).filter((p: Product) => wishlistIds.includes(p.id)));
        setLoading(false);
      });
  }, [wishlistIds]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12">در حال بارگذاری...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <EmptyState
          icon={Heart}
          title="علاقه‌مندی شما خالی است"
          description="محصولاتی که دوست دارید را برای بعد ذخیره کنید"
          action={
            <Button onClick={() => navigate("shop")} className="rounded-full">
              رفتن به فروشگاه
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">علاقه‌مندی‌ها</h1>
        <p className="mt-2 text-muted-foreground">{products.length.toLocaleString("fa-IR")} محصول ذخیره شده</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
