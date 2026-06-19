"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Award, Heart, Users, Coffee, Sparkles, Globe, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavStore } from "@/stores/nav-store";
import { SectionHeading } from "@/components/shared/common";

export function AboutView() {
  const navigate = useNavStore((s) => s.navigate);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about.png"
            alt="کافه‌نویر"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full">
              <Sparkles className="h-3 w-3 text-[var(--coffee-caramel)]" />
              از سال ۱۳۹۳
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              داستان <span className="text-gradient">کافه‌نویر</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              ما باور داریم قهوه فقط یک نوشیدنی نیست؛ یک تجربه، یک لحظه آرامش و
              یک هنر است. این باور ما را به ساختن برندی رساند که در آن کیفیت،
              اصالت و عشق به قهوه در هر فنجان جریان دارد.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-secondary/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6 lg:px-8">
          {[
            { icon: Coffee, value: "+۱۰۰", label: "نوع قهوه" },
            { icon: Users, value: "+۵۰٬۰۰۰", label: "مشتری راضی" },
            { icon: Globe, value: "+۱۵", label: "کشور خاستگاه" },
            { icon: Award, value: "+۱۰", label: "سال تجربه" },
          ].map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <Icon className="mx-auto mb-2 h-7 w-7 text-[var(--coffee-caramel)]" />
              <p className="text-2xl font-bold md:text-3xl">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden rounded-3xl shadow-soft"
          >
            <Image
              src="/images/hero.png"
              alt="دانه قهوه"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full">
              <Heart className="h-3 w-3 text-[var(--coffee-caramel)]" />
              شروع داستان
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              از یک ایده ساده
              <br />
              به یک برند پریمیوم
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                داستان کافه‌نویر در سال ۱۳۹۳ با عشق یک جوان به قهوه آغاز شد. او که
                سال‌ها به عنوان باریستا کار کرده بود، می‌خواست طعم واقعی قهوه را
                به همه ایرانیان برساند.
              </p>
              <p>
                ما با سفر به مزارع قهوه در اتیوپی، کلمبیا و برزیل، روابط مستقیم با
                کشاورزان برقرار کردیم و تازه‌ترین دانه‌ها را مستقیماً به ایران آوردیم.
              </p>
              <p>
                امروز، با تیمی متخصص و دستگاه‌های رست پیشرفته، هر روز قهوه‌ای تازه
                رست می‌کنیم و با وسواس بسته‌بندی می‌کنیم تا بهترین طعم را به دست
                شما برسانیم.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            title="ارزش‌های ما"
            subtitle="آنچه ما را متمایز می‌کند"
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "اصالت و کیفیت",
                desc: "ما فقط دانه‌های باکیفیت را از مزارع منتخب انتخاب می‌کنیم. کیفیت بر کمیت ارجحیت دارد.",
              },
              {
                icon: Heart,
                title: "عشق به قهوه",
                desc: "هر مرحله از انتخاب تا رست و بسته‌بندی با عشق و وسواس انجام می‌شود.",
              },
              {
                icon: Truck,
                title: "تحویل تازه",
                desc: "قهوه ما به‌صورت هفتگی رست می‌شود تا همیشه تازه‌ترین طعم را دریافت کنید.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-soft"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)]">
                  <Icon className="h-7 w-7 text-[var(--coffee-gold)]" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
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
          className="rounded-3xl border border-border/60 bg-gradient-to-br from-[var(--coffee-espresso)] to-[var(--coffee-mocha)] p-10 text-center md:p-16"
        >
          <Coffee className="mx-auto mb-4 h-12 w-12 text-[var(--coffee-gold)]" />
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            به خانواده کافه‌نویر بپیوندید
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            تجربه طعم واقعی قهوه را با ما کشف کنید
          </p>
          <Button
            size="lg"
            onClick={() => navigate("shop")}
            className="mt-6 rounded-full bg-[var(--coffee-gold)] px-8 text-black hover:bg-[var(--coffee-caramel)]"
          >
            مشاهده محصولات
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
