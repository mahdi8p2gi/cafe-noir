"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import { formatPrice, ROAST_LEVELS } from "@/types";
import { useNavStore } from "@/stores/nav-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const navigate = useNavStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.items.includes(product.id));
  const { user } = useAuth();

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const finalPrice = product.discountPrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info("برای افزودن به علاقه‌مندی‌ها وارد شوید");
      navigate("auth");
      return;
    }
    toggleWishlist(product.id);
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      toast.success(inWishlist ? "از علاقه‌مندی حذف شد" : "به علاقه‌مندی اضافه شد");
    } catch {
      toast.error("خطا در ثبت علاقه‌مندی");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => navigate("product", { slug: product.slug })}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:shadow-glow"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-red-500/90 text-white backdrop-blur-sm hover:bg-red-500">
              {discount}٪ تخفیف
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-[var(--coffee-gold)]/90 text-black backdrop-blur-sm hover:bg-[var(--coffee-gold)]">
              ویژه
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label="افزودن به علاقه‌مندی"
          className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/70 backdrop-blur-md transition-all hover:bg-background"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate("product", { slug: product.slug });
            }}
          >
            <Eye className="h-4 w-4" />
            مشاهده
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          {product.roastLevel && (
            <span className="text-[11px] font-medium text-muted-foreground">
              رست {ROAST_LEVELS[product.roastLevel] ?? product.roastLevel}
            </span>
          )}
          <div className="mr-auto flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)} ({product.reviewCount})
          </div>
        </div>

        <h3 className="line-clamp-1 font-semibold leading-tight">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground min-h-[2rem]">
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {product.discountPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-base font-bold text-foreground">
              {formatPrice(finalPrice)}
              <span className="mr-1 text-[11px] font-normal text-muted-foreground">تومان</span>
            </span>
          </div>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:scale-110 disabled:opacity-40"
            aria-label="افزودن به سبد"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
