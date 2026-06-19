"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useNavStore } from "@/stores/nav-store";
import { formatPrice } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, totalPrice } = useCartStore();
  const navigate = useNavStore((s) => s.navigate);

  const subtotal = totalPrice();
  const shipping = subtotal > 500000 ? 0 : subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setOpen(false);
    navigate("checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[var(--coffee-caramel)]" />
              سبد خرید
              {items.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({items.length} مورد)
                </span>
              )}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">سبد خرید شما خالی است</p>
              <p className="text-sm text-muted-foreground">
                محصولات مورد علاقه خود را به سبد اضافه کنید
              </p>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("shop");
              }}
              className="rounded-full"
            >
              رفتن به فروشگاه
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5">
              <div className="space-y-4 py-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => {
                              setOpen(false);
                              navigate("product", { slug: item.slug });
                            }}
                            className="line-clamp-1 text-sm font-medium hover:text-[var(--coffee-caramel)]"
                          >
                            {item.name}
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-muted-foreground transition-colors hover:text-red-500"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-border/60">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-secondary"
                              aria-label="کاهش"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40"
                              aria-label="افزایش"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-bold">
                            {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                            <span className="mr-1 text-[10px] font-normal text-muted-foreground">
                              تومان
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="border-t border-border/60 px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">جمع کل</span>
                  <span className="font-medium">{formatPrice(subtotal)} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="font-medium">
                    {shipping === 0 ? "رایگان" : `${formatPrice(shipping)} تومان`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 500000 && (
                  <p className="rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    {formatPrice(500000 - subtotal)} تومان تا ارسال رایگان
                  </p>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(total)} تومان</span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="mt-4 w-full rounded-full" size="lg">
                ادامه و پرداخت
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
