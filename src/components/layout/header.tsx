"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Coffee,
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Sun,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavStore } from "@/stores/nav-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

const NAV_ITEMS = [
  { label: "خانه", page: "home" as const },
  { label: "فروشگاه", page: "shop" as const },
  { label: "درباره ما", page: "about" as const },
  { label: "تماس با ما", page: "contact" as const },
];

export function Header() {
  const navigate = useNavStore((s) => s.navigate);
  const currentPage = useNavStore((s) => s.page);
  const setSearchQuery = useNavStore((s) => s.setSearchQuery);
  const cartCount = useCartStore((s) => s.totalItems());
  const setOpenCart = useCartStore((s) => s.setOpen);
  const wishlistCount = useWishlistStore((s) => s.count());
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
    navigate("shop", searchValue ? { search: searchValue } : {});
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const isAdmin = session?.user && (session.user as { role?: string }).role === "ADMIN";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-strong shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-18 md:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] shadow-sm">
            <Coffee className="h-5 w-5 text-[var(--coffee-gold)]" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            کافه<span className="text-gradient">نویر</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {currentPage === item.page && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="جستجوی قهوه..."
                className="h-9 w-44 rounded-full border-border/60 bg-background/60 pr-9 text-sm transition-all focus:w-64"
              />
            </div>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-full"
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="جستجو"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
            onClick={() => navigate("wishlist")}
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-4.5 min-w-4.5 rounded-full bg-red-500 px-1 text-[10px] text-white">
                {wishlistCount}
              </Badge>
            )}
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
            onClick={() => setOpenCart(true)}
            aria-label="سبد خرید"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-4.5 min-w-4.5 rounded-full bg-[var(--coffee-caramel)] px-1 text-[10px] text-black">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("profile")} className="cursor-pointer">
                  <User className="ml-2 h-4 w-4" />
                  پروفایل کاربر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("profile", { tab: "orders" })} className="cursor-pointer">
                  <Package className="ml-2 h-4 w-4" />
                  سفارش‌های من
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("admin")} className="cursor-pointer">
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    پنل مدیریت
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("auth")}
              className="hidden h-9 rounded-full px-4 md:inline-flex"
            >
              ورود / ثبت‌نام
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-[var(--coffee-caramel)]" />
                  کافه‌نویر
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      navigate(item.page);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      currentPage === item.page
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {item.label}
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                ))}
                {!session?.user && (
                  <Button
                    onClick={() => {
                      navigate("auth");
                      setMobileOpen(false);
                    }}
                    className="mt-2"
                  >
                    ورود / ثبت‌نام
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background px-4 lg:hidden"
          >
            <div className="relative py-3">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="جستجوی قهوه..."
                className="h-10 rounded-full pr-10"
                autoFocus
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </header>
  );
}
