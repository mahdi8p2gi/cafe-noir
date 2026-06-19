"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useNavStore } from "@/stores/nav-store";
import { EmptyState } from "@/components/shared/common";
import { formatPrice } from "@/types";

export function CartView() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const navigate = useNavStore((s) => s.navigate);

  const subtotal = totalPrice();
  const shipping = subtotal > 500000 ? 0 : subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید شما خالی است"
          description="محصولات مورد علاقه خود را به سبد اضافه کنید"
          action={
            <Button onClick={() => navigate("shop")} className="rounded-full">
              رفتن به فروشگاه
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">سبد خرید</h1>
        <p className="mt-2 text-muted-foreground">{items.length} محصول در سبد شما</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0 }}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => navigate("product", { slug: item.slug })}
                        className="font-medium hover:text-[var(--coffee-caramel)]"
                      >
                        {item.name}
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-red-500"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border/60">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground line-through" dir="ltr">
                          {(item.discountPrice ?? item.price).toLocaleString("fa-IR")} × {item.quantity}
                        </p>
                        <p className="font-bold">
                          {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                          <span className="mr-1 text-xs font-normal text-muted-foreground">تومان</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("shop")}
            className="mt-4 gap-1 rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
            ادامه خرید
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-semibold">خلاصه سفارش</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">جمع کل</span>
                <span>{formatPrice(subtotal)} تومان</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">هزینه ارسال</span>
                <span>{shipping === 0 ? "رایگان" : `${formatPrice(shipping)} تومان`}</span>
              </div>
              {subtotal > 0 && subtotal < 500000 && (
                <p className="rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                  {formatPrice(500000 - subtotal)} تومان تا ارسال رایگان
                </p>
              )}
              <Separator className="my-3" />
              <div className="flex justify-between text-base font-bold">
                <span>مبلغ نهایی</span>
                <span>{formatPrice(total)} ت</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("checkout")}
              className="mt-5 w-full rounded-full"
              size="lg"
            >
              ادامه به پرداخت
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
