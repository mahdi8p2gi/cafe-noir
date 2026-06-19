"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactView() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message || "پیام ارسال شد");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: "آدرس", value: "تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه دوم" },
    { icon: Phone, title: "تلفن", value: "۰۲۱-۸۸۸۸۸۸۸۸", ltr: true },
    { icon: Mail, title: "ایمیل", value: "info@cafenoir.ir", ltr: true },
    { icon: Clock, title: "ساعات کاری", value: "شنبه تا پنجشنبه، ۹ تا ۲۱" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">تماس با ما</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          هر سوال، پیشنهاد یا انتقادی دارید، خوشحال می‌شویم بشنویم
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {contactInfo.map(({ icon: Icon, title, value, ltr }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/60 bg-card/40 p-5"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)]">
                  <Icon className="h-5 w-5 text-[var(--coffee-gold)]" />
                </div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground" dir={ltr ? "ltr" : "rtl"}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="relative h-64 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[var(--coffee-espresso)] to-[var(--coffee-mocha)]">
            <div className="absolute inset-0 noise-overlay opacity-30" />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center text-white">
              <MapPin className="h-10 w-10 text-[var(--coffee-gold)]" />
              <p className="font-medium">ما را روی نقشه پیدا کنید</p>
              <p className="text-sm text-white/70">تهران، خیابان ولیعصر</p>
              <Button variant="outline" className="mt-2 rounded-full bg-white/10 text-white border-white/20">
                مشاهده روی نقشه
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-border/60 bg-card/40 p-6 md:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <MessageCircle className="h-5 w-5 text-[var(--coffee-caramel)]" />
            </div>
            <h2 className="text-xl font-bold">ارسال پیام</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="rounded-xl"
                  placeholder="نام شما"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="rounded-xl text-right"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">موضوع</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="rounded-xl"
                placeholder="موضوع پیام"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">پیام</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="min-h-[150px] rounded-xl"
                placeholder="پیام خود را بنویسید..."
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full" size="lg">
              {loading ? "در حال ارسال..." : (
                <>
                  ارسال پیام
                  <Send className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
