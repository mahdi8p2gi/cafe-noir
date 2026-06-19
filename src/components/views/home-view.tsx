"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Coffee,
  Truck,
  ShieldCheck,
  Sparkles,
  Leaf,
  Award,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavStore } from "@/stores/nav-store";
import { ProductCard } from "@/components/product-card";
import { SectionHeading, CoffeeBean } from "@/components/shared/common";
import type { Product, Category } from "@/types";

export function HomeView() {
  const navigate = useNavStore((s) => s.navigate);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?featured=true&limit=8").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([p, c]) => {
      setFeatured(p.products || []);
      setCategories(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[88vh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="قهوه تخصصی کافه‌نویر"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--coffee-caramel)]" />
              <span className="text-xs font-medium">تازه‌ترین رست‌های ۱۴۰۴</span>
            </motion.div>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
              هر فنجان،
              <br />
              یک <span className="text-gradient">داستان</span> طعم
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              کافه‌نویر، جایی که هنر قهوه با کیفیت پریمیوم گره می‌خورد. دانه‌های
              منتخب از بهترین مزارع جهان، رست شده با وسواس و تحویل شده تازه به
              دست شما.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("shop")}
                className="rounded-full px-6 shadow-glow"
              >
                خرید قهوه
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("about")}
                className="rounded-full bg-background/40 px-6 backdrop-blur-md"
              >
                داستان ما
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { icon: Leaf, label: "۱۰۰٪ طبیعی" },
                { icon: Award, label: "کیفیت پریمیوم" },
                { icon: Truck, label: "ارسال سریع" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-[var(--coffee-caramel)]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee banner */}
      <section className="border-y border-border/60 bg-secondary/30 py-4">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-12 whitespace-nowrap pl-12 text-sm font-medium text-muted-foreground">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <CoffeeBean className="h-4 w-4 text-[var(--coffee-caramel)]" />
                ارسال رایگان بالای ۵۰۰ هزار تومان
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center gap-12 whitespace-nowrap pl-12 text-sm font-medium text-muted-foreground" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <CoffeeBean className="h-4 w-4 text-[var(--coffee-caramel)]" />
                ارسال رایگان بالای ۵۰۰ هزار تومان
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <SectionHeading
          title="دسته‌بندی محصولات"
          subtitle="هر نیاز قهوه‌ای شما را پوشش می‌دهیم"
          align="center"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate("shop", { category: cat.slug })}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft transition-all hover:shadow-glow"
            >
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] transition-transform group-hover:scale-110">
                <Coffee className="h-7 w-7 text-[var(--coffee-gold)]" />
              </div>
              <p className="font-medium">{cat.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {(cat as { _count?: { products: number } })._count?.products ?? 0} محصول
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <SectionHeading
          title="محصولات ویژه"
          subtitle="منتخب تازه‌ترین و بهترین قهوه‌های ما"
          align="right"
          action={
            <Button
              variant="ghost"
              onClick={() => navigate("shop")}
              className="gap-1 rounded-full"
            >
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Story / About teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/images/about.png"
                alt="کافه‌نویر رستری"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-5 shadow-soft md:block">
              <p className="text-3xl font-bold text-[var(--coffee-caramel)]">+۱۰</p>
              <p className="text-xs text-muted-foreground">سال تجربه</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full">
              <Sparkles className="h-3 w-3 text-[var(--coffee-caramel)]" />
              داستان کافه‌نویر
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              از مزرعه تا فنجان شما،
              <br />
              با <span className="text-gradient">عشق</span> و وسواس
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              ما در کافه‌نویر باور داریم که هر فنجان قهوه، یک تجربه است. از انتخاب
              دستی دانه‌ها در مزارع منتخب، تا رست دقیق و بسته‌بندی تازه، هر مرحله
              با وسواس و عشق انجام می‌شود تا بهترین طعم را به شما هدیه دهیم.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, title: "انتخاب دستی", desc: "دانه‌های باکیفیت" },
                { icon: Award, title: "رست تخصصی", desc: "با دستگاه‌های پیشرفته" },
                { icon: ShieldCheck, title: "کیفیت تضمینی", desc: "بازگشت وجه" },
                { icon: Truck, title: "تحویل تازه", desc: "ارسال در ۲۴ ساعت" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                    <Icon className="h-5 w-5 text-[var(--coffee-caramel)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate("about")} className="mt-6 rounded-full">
              بیشتر بدانید
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            title="نظرات مشتریان"
            subtitle="آنچه مشتریان ما می‌گویند"
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "سارا محمدی",
                role: "باریستا",
                text: "بهترین قهوه‌ای که تا حالا استفاده کردم. طعم و عطر فوق‌العاده‌ای داره و کیفیتش همیشه ثابته.",
              },
              {
                name: "علی رضایی",
                role: "مشتری دائمی",
                text: "ارسال سریع، بسته‌بندی عالی و طعم بی‌نظیر. کافه‌نویر واقعاً پریمیوم هست.",
              },
              {
                name: "مریم احمدی",
                role: "کافه‌دار",
                text: "برای کافه‌ام همیشه از کافه‌نویر خرید می‌کنم. مشتری‌هام همیشه از طعم راضی‌اند.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
              >
                <Quote className="absolute left-4 top-4 h-8 w-8 text-[var(--coffee-caramel)]/20" />
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  «{t.text}»
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] text-sm font-bold text-[var(--coffee-gold)]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--coffee-espresso)] via-[var(--coffee-mocha)] to-[var(--coffee-espresso)] p-10 text-center md:p-16"
        >
          <div className="absolute inset-0 noise-overlay opacity-30" />
          <div className="relative space-y-4">
            <Coffee className="mx-auto h-12 w-12 text-[var(--coffee-gold)]" />
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              آماده‌اید طعم واقعی قهوه را بچشید؟
            </h2>
            <p className="mx-auto max-w-xl text-white/70">
              همین حالا سفارش دهید و در اولین خرید از ۱۵٪ تخفیف بهره‌مند شوید
            </p>
            <Button
              size="lg"
              onClick={() => navigate("shop")}
              className="mt-2 rounded-full bg-[var(--coffee-gold)] px-8 text-black hover:bg-[var(--coffee-caramel)]"
            >
              شروع خرید
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
