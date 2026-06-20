"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useNavStore } from "@/stores/nav-store";
import { useAuth } from "@/stores/auth-store";
import { EmptyState } from "@/components/shared/common";
import { formatPrice } from "@/types";
import { toast } from "sonner";

export function CheckoutView() {
  const { items, totalPrice, clear } = useCartStore();
  const navigate = useNavStore((s) => s.navigate);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "تهران",
    postalCode: "",
    notes: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal > 500000 ? 0 : 45000;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={User}
          title="برای تکمیل خرید وارد شوید"
          description="برای ثبت سفارش ابتدا باید وارد حساب کاربری خود شوید"
          action={
            <Button onClick={() => navigate("auth")} className="rounded-full">
              ورود / ثبت‌نام
            </Button>
          }
        />
      </div>
    );
  }

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید خالی است"
          description="ابتدا محصولاتی را به سبد اضافه کنید"
          action={
            <Button onClick={() => navigate("shop")} className="rounded-full">
              رفتن به فروشگاه
            </Button>
          }
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          phone: form.phone,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderNumber(data.order.orderNumber);
      clear();
      toast.success("سفارش با موفقیت ثبت شد!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-soft md:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-green-500/10"
          >
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-bold md:text-3xl">سفارش شما ثبت شد!</h1>
          <p className="mt-2 text-muted-foreground">
            از خرید شما متشکریم. به زودی با شما تماس می‌گیریم.
          </p>
          <div className="mt-6 rounded-2xl bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">شماره سفارش</p>
            <p className="mt-1 text-xl font-bold tracking-wider" dir="ltr">{orderNumber}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("profile", { tab: "orders" })} className="rounded-full">
              مشاهده سفارش‌ها
            </Button>
            <Button variant="outline" onClick={() => navigate("home")} className="rounded-full">
              بازگشت به خانه
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">تکمیل خرید</h1>
        <p className="mt-2 text-muted-foreground">اطلاعات ارسال را وارد کنید</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-semibold">اطلاعات تماس و ارسال</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  dir="ltr"
                  placeholder="09xxxxxxxxx"
                  required
                  className="rounded-xl text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">شهر</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  dir="ltr"
                  className="rounded-xl text-right"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">آدرس کامل</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  className="min-h-[80px] rounded-xl"
                  placeholder="خیابان، کوچه، پلاک..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">یادداشت (اختیاری)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="min-h-[60px] rounded-xl"
                  placeholder="توضیحات برای پیک..."
                />
              </div>
            </div>
          </div>

          {/* Payment method (demo) */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-semibold">روش پرداخت</h2>
            <div className="flex items-center gap-3 rounded-xl border-2 border-[var(--coffee-caramel)] bg-secondary/40 p-4">
              <div className="grid h-5 w-5 place-items-center rounded-full bg-[var(--coffee-caramel)]">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-sm font-medium">پرداخت در محل تحویل (نقدی / کارت)</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              پرداخت آنلاین به‌زودی فعال می‌شود. در حال حاضر پرداخت در محل امکان‌پذیر است.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-semibold">سفارش شما</h2>
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} عدد</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">جمع کل</span>
                <span>{formatPrice(subtotal)} ت</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ارسال</span>
                <span>{shipping === 0 ? "رایگان" : `${formatPrice(shipping)} ت`}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-base font-bold">
                <span>مبلغ نهایی</span>
                <span className="text-[var(--coffee-caramel)]">{formatPrice(total)} ت</span>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-5 w-full rounded-full" size="lg">
              {loading ? "در حال ثبت..." : (
                <>
                  ثبت سفارش
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
