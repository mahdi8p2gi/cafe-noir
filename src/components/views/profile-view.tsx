"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, ShoppingBag } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavStore } from "@/stores/nav-store";
import { useAuth } from "@/stores/auth-store";
import { EmptyState } from "@/components/shared/common";
import { ORDER_STATUS, formatPrice, type Order } from "@/types";

export function ProfileView() {
  const { data: session } = useSession();
  const navigate = useNavStore((s) => s.navigate);
  const params = useNavStore((s) => s.params);
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const initialTab = params.tab === "orders" ? "orders" : "profile";

  useEffect(() => {
    if (!user) {
      navigate("auth");
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={User}
          title="وارد شوید"
          description="برای مشاهده پروفایل وارد حساب خود شوید"
          action={<Button onClick={() => navigate("auth")} className="rounded-full">ورود</Button>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-card to-secondary/30 p-8 text-center sm:flex-row sm:text-right"
      >
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] text-2xl font-bold text-[var(--coffee-gold)] shadow-glow">
          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-bold">{user.name || "کاربر"}</h1>
            {user.role === "ADMIN" && (
              <Badge className="bg-[var(--coffee-gold)] text-black">مدیر</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="ml-2 h-4 w-4" />
          خروج
        </Button>
      </motion.div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 rounded-full">
          <TabsTrigger value="profile" className="rounded-full gap-1.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">پروفایل</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-full gap-1.5">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">سفارش‌ها</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="rounded-full gap-1.5">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">علاقه‌مندی</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-semibold">اطلاعات کاربری</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">نام</p>
                <p className="font-medium">{user.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ایمیل</p>
                <p className="font-medium" dir="ltr">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نقش</p>
                <p className="font-medium">{user.role === "ADMIN" ? "مدیر" : "کاربر"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تعداد سفارش‌ها</p>
                <p className="font-medium">{orders.length.toLocaleString("fa-IR")}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Orders tab */}
        <TabsContent value="orders">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted/40" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="هنوز سفارشی ثبت نکرده‌اید"
              description="سفارش‌های شما در اینجا نمایش داده می‌شوند"
              action={<Button onClick={() => navigate("shop")} className="rounded-full">شروع خرید</Button>}
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">شماره سفارش</p>
                        <p className="font-bold tracking-wider" dir="ltr">{order.orderNumber}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        order.status === "DELIVERED"
                          ? "bg-green-500 text-white"
                          : order.status === "CANCELLED"
                          ? "bg-red-500 text-white"
                          : "bg-[var(--coffee-gold)] text-black"
                      }
                    >
                      {ORDER_STATUS[order.status] || order.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg bg-secondary/30 p-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                          {item.product?.image && (
                            <Image src={item.product.image} alt={item.name} fill sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.quantity} عدد</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                    <span className="font-bold">{formatPrice(order.total)} تومان</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist tab */}
        <TabsContent value="wishlist">
          <WishlistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WishlistTab() {
  const navigate = useNavStore((s) => s.navigate);
  const { user } = useAuth();
  const [items, setItems] = useState<{ id: string; name: string; price: number; discountPrice: number | null; image: string; slug: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.items?.length) return;
        const res = await fetch(`/api/products?limit=100`);
        const products = await res.json();
        const wishProducts = (products.products || []).filter((p: { id: string }) =>
          data.items.includes(p.id)
        );
        setItems(wishProducts);
      });
  }, [user]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="علاقه‌مندی خالی است"
        description="محصولات مورد علاقه خود را اینجا ذخیره کنید"
        action={<Button onClick={() => navigate("shop")} className="rounded-full">کشف محصولات</Button>}
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate("product", { slug: item.slug })}
          className="flex gap-3 rounded-2xl border border-border/60 bg-card/40 p-3 text-right transition-colors hover:bg-card/60"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-sm font-bold text-[var(--coffee-caramel)]">
              {formatPrice(item.discountPrice ?? item.price)} ت
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
