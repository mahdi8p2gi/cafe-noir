"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Coffee, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavStore } from "@/stores/nav-store";
import { toast } from "sonner";

type Mode = "login" | "register" | "forgot";

export function AuthView() {
  const navigate = useNavStore((s) => s.navigate);
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("خوش آمدید!");
          navigate("home");
        }
      } else if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success("ثبت‌نام موفقیت‌آمیز بود. اکنون وارد شوید.");
        setMode("login");
      } else if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        setForgotSent(true);
        toast.success("ایمیل بازنشانی ارسال شد");
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--coffee-espresso)] via-background to-[var(--coffee-mocha)]" />
      <div className="absolute inset-0 noise-overlay opacity-30" />
      <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[var(--coffee-caramel)] opacity-10 blur-3xl" />
      <div className="absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-[var(--coffee-gold)] opacity-10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-border/60 glass-strong p-8 shadow-soft"
        >
          {/* Logo */}
          <div className="mb-8 text-center">
            <button
              onClick={() => navigate("home")}
              className="mx-auto mb-4 flex items-center gap-2.5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] shadow-glow">
                <Coffee className="h-6 w-6 text-[var(--coffee-gold)]" />
              </div>
            </button>
            <h1 className="text-2xl font-bold">
              {mode === "login" && "ورود به حساب"}
              {mode === "register" && "ساخت حساب جدید"}
              {mode === "forgot" && "بازیابی رمز عبور"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login" && "به کافه‌نویر خوش آمدید"}
              {mode === "register" && "عضو خانواده کافه‌نویر شوید"}
              {mode === "forgot" && "ایمیل خود را وارد کنید"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {forgotSent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <p className="font-medium">ایمیل ارسال شد</p>
                <p className="text-sm text-muted-foreground">
                  لینک بازنشانی رمز عبور به ایمیل شما ارسال شد
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setMode("login");
                    setForgotSent(false);
                  }}
                >
                  بازگشت به ورود
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === "register" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">نام</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="نام شما"
                        className="rounded-xl pr-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="rounded-xl pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <div className="space-y-2">
                    <Label htmlFor="password">رمز عبور</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        dir="ltr"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="rounded-xl px-10 text-right"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                  {loading ? "لطفاً صبر کنید..." : (
                    <>
                      {mode === "login" && "ورود"}
                      {mode === "register" && "ثبت‌نام"}
                      {mode === "forgot" && "ارسال لینک"}
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Switch modes */}
          {mode !== "forgot" && !forgotSent && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  حساب ندارید؟{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="font-medium text-[var(--coffee-caramel)] hover:underline"
                  >
                    ثبت‌نام کنید
                  </button>
                </>
              ) : (
                <>
                  قبلاً ثبت‌نام کرده‌اید؟{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-medium text-[var(--coffee-caramel)] hover:underline"
                  >
                    وارد شوید
                  </button>
                </>
              )}
            </div>
          )}

          {/* Demo credentials */}
          {mode === "login" && (
            <div className="mt-6 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-medium">حساب‌های دمو:</p>
              <p>مدیر: admin@cafenoir.ir / admin123</p>
              <p>کاربر: user@cafenoir.ir / user123</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
