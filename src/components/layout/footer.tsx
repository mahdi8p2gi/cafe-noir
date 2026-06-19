"use client";

import { Coffee, Instagram, Twitter, Send, Phone, MapPin, Mail } from "lucide-react";
import { useNavStore } from "@/stores/nav-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const navigate = useNavStore((s) => s.navigate);

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)]">
                <Coffee className="h-5 w-5 text-[var(--coffee-gold)]" />
              </div>
              <span className="text-lg font-bold">
                کافه<span className="text-gradient">نویر</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              کافه‌نویر، تخصصی‌ترین فروشگاه آنلاین قهوه در ایران. ما با بیش از یک دهه
              تجربه، تازه‌ترین دانه‌های قهوه را از بهترین مزارع جهان برای شما فراهم
              کرده‌ایم.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="اینستاگرام"
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 transition-colors hover:bg-secondary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="توییتر"
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 transition-colors hover:bg-secondary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="تلگرام"
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 transition-colors hover:bg-secondary"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button onClick={() => navigate("home")} className="transition-colors hover:text-foreground">
                  خانه
                </button>
              </li>
              <li>
                <button onClick={() => navigate("shop")} className="transition-colors hover:text-foreground">
                  فروشگاه
                </button>
              </li>
              <li>
                <button onClick={() => navigate("about")} className="transition-colors hover:text-foreground">
                  درباره ما
                </button>
              </li>
              <li>
                <button onClick={() => navigate("contact")} className="transition-colors hover:text-foreground">
                  تماس با ما
                </button>
              </li>
              <li>
                <button onClick={() => navigate("wishlist")} className="transition-colors hover:text-foreground">
                  علاقه‌مندی‌ها
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">اطلاعات تماس</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--coffee-caramel)]" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[var(--coffee-caramel)]" />
                <span dir="ltr">۰۲۱-۸۸۸۸۸۸۸۸</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[var(--coffee-caramel)]" />
                <span>info@cafenoir.ir</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">خبرنامه</h4>
            <p className="text-sm text-muted-foreground">
              برای دریافت آخرین تخفیف‌ها و محصولات جدید عضو شوید.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                (e.target as HTMLFormElement).reset();
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="ایمیل شما"
                className="h-10 rounded-full"
                required
              />
              <Button type="submit" className="h-10 rounded-full px-4">
                عضویت
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© ۱۴۰۴ کافه‌نویر. تمام حقوق محفوظ است.</p>
          <div className="flex gap-4">
            <button className="transition-colors hover:text-foreground">قوانین و مقررات</button>
            <button className="transition-colors hover:text-foreground">حریم خصوصی</button>
            <button className="transition-colors hover:text-foreground">پشتیبانی</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
