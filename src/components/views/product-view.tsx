"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  Package,
  Coffee,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavStore } from "@/stores/nav-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useAuth } from "@/stores/auth-store";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/shared/common";
import { formatPrice, ROAST_LEVELS, type Product, type Review } from "@/types";

export function ProductView() {
  const { slug } = useNavStore((s) => s.params);
  const navigate = useNavStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const setOpenCart = useCartStore((s) => s.setOpen);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => slug ? false : false);
  const { user } = useAuth();

  const [data, setData] = useState<{ product: Product & { reviews?: Review[] }; related: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setReviews(d.product?.reviews || []);
        setLoading(false);
      });
  }, [slug]);

  const product = data?.product;
  const inWishlistNow = product ? useWishlistStore.getState().items.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success("به سبد خرید اضافه شد");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, qty);
    navigate("checkout");
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!user) {
      toast.info("برای افزودن به علاقه‌مندی وارد شوید");
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
      toast.success(inWishlistNow ? "حذف شد" : "افزوده شد");
    } catch {
      toast.error("خطا");
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.info("برای ثبت نظر وارد شوید");
      navigate("auth");
      return;
    }
    if (!newComment.trim()) {
      toast.error("نظر خود را بنویسید");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews([data, ...reviews]);
      setNewComment("");
      setNewRating(5);
      toast.success("نظر شما ثبت شد");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p>محصول یافت نشد</p>
        <Button onClick={() => navigate("shop")} className="mt-4">بازگشت به فروشگاه</Button>
      </div>
    );
  }

  const finalPrice = product.discountPrice ?? product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <button onClick={() => navigate("home")} className="hover:text-foreground">خانه</button>
        <ChevronLeft className="h-4 w-4" />
        <button onClick={() => navigate("shop")} className="hover:text-foreground">فروشگاه</button>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <Badge className="absolute right-4 top-4 bg-red-500 text-white">
              {discount}٪ تخفیف
            </Badge>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {product.featured && (
            <Badge variant="outline" className="gap-1.5 rounded-full">
              <Star className="h-3 w-3 fill-[var(--coffee-gold)] text-[var(--coffee-gold)]" />
              محصول ویژه
            </Badge>
          )}

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

          <div className="flex items-center gap-3">
            <StarRating value={product.rating} readOnly size="sm" />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} نظر)
            </span>
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
            {product.roastLevel && (
              <div className="flex items-center gap-2 text-sm">
                <Coffee className="h-4 w-4 text-[var(--coffee-caramel)]" />
                <span className="text-muted-foreground">رست:</span>
                <span className="font-medium">{ROAST_LEVELS[product.roastLevel]}</span>
              </div>
            )}
            {product.origin && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[var(--coffee-caramel)]" />
                <span className="text-muted-foreground">خاستگاه:</span>
                <span className="font-medium">{product.origin}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-[var(--coffee-caramel)]" />
                <span className="text-muted-foreground">وزن:</span>
                <span className="font-medium">{product.weight}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-[var(--coffee-caramel)]" />
                <span className="text-muted-foreground">کد:</span>
                <span className="font-medium" dir="ltr">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[var(--coffee-caramel)]">
              {formatPrice(finalPrice)}
              <span className="mr-1 text-sm font-normal text-muted-foreground">تومان</span>
            </span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            {product.stock > 0 ? (
              <span className="text-muted-foreground">موجود در انبار ({product.stock} عدد)</span>
            ) : (
              <span className="text-red-500">ناموجود</span>
            )}
          </div>

          {/* Quantity + Actions */}
          {product.stock > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-border/60">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
                  aria-label="کاهش"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
                  aria-label="افزایش"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button onClick={handleAddToCart} size="lg" variant="outline" className="rounded-full">
                <ShoppingCart className="ml-2 h-4 w-4" />
                افزودن به سبد
              </Button>

              <Button onClick={handleBuyNow} size="lg" className="rounded-full">
                خرید سریع
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={handleWishlist}
                className="h-12 w-12 rounded-full"
              >
                <Heart className={`h-5 w-5 ${inWishlistNow ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          )}

          <Separator />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "ارسال سریع", desc: "۲۴-۴۸ ساعت" },
              { icon: ShieldCheck, title: "ضمانت اصالت", desc: "کیفیت تضمینی" },
              { icon: RotateCcw, title: "بازگشت کالا", desc: "۷ روز مهلت" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 p-3 text-center">
                <Icon className="h-5 w-5 text-[var(--coffee-caramel)]" />
                <p className="text-xs font-medium">{title}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Long description */}
      {product.longDescription && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-border/60 bg-card/40 p-6 md:p-10"
        >
          <h2 className="mb-4 text-xl font-bold">معرفی کامل محصول</h2>
          <p className="leading-loose text-muted-foreground">{product.longDescription}</p>
        </motion.section>
      )}

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-bold">نظرات کاربران ({reviews.length})</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add review */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h3 className="mb-3 font-medium">ثبت نظر شما</h3>
            <div className="mb-3">
              <p className="mb-2 text-sm text-muted-foreground">امتیاز شما:</p>
              <StarRating value={newRating} onChange={setNewRating} size="lg" />
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="تجربه خود را بنویسید..."
              className="mb-3 min-h-[100px]"
            />
            <Button onClick={submitReview} disabled={submittingReview} className="w-full rounded-full">
              {submittingReview ? "در حال ارسال..." : "ارسال نظر"}
            </Button>
          </div>

          {/* Reviews list */}
          <div className="space-y-3 lg:col-span-2 max-h-[500px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                هنوز نظری ثبت نشده است. اولین نفر باشید!
              </div>
            ) : (
              reviews.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] text-sm font-bold text-[var(--coffee-gold)]">
                        {(r.user?.name || "ک").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.user?.name || "کاربر"}</p>
                        <StarRating value={r.rating} readOnly size="sm" />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {data?.related && data.related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">محصولات مرتبط</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
