"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Search, Grid3x3, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/shared/common";
import { useNavStore } from "@/stores/nav-store";
import type { Product, Category } from "@/types";

const ROAST_OPTIONS = [
  { value: "LIGHT", label: "روشن" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "DARK", label: "تیره" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "محبوب‌ترین" },
];

export function ShopView() {
  const params = useNavStore((s) => s.params);
  const navigate = useNavStore((s) => s.navigate);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(params.search || "");
  const [category, setCategory] = useState(params.category || "all");
  const [roast, setRoast] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((c) => setCategories(Array.isArray(c) ? c : []));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const q = new URLSearchParams({
      category: category === "all" ? "" : category,
      roast: roast === "all" ? "" : roast,
      search,
      sort,
      page: String(page),
      minPrice: String(priceRange[0]),
      maxPrice: String(priceRange[1]),
    });
    fetch(`/api/products?${q.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, category, roast, priceRange, sort, page]);

  const filters = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">دسته‌بندی</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCategory("all");
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            همه
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.slug);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                category === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Roast */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">درجه رست</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setRoast("all");
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              roast === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            همه
          </button>
          {ROAST_OPTIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setRoast(r.value);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                roast === r.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">محدوده قیمت</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => {
            setPriceRange(v);
            setPage(1);
          }}
          min={0}
          max={500000}
          step={10000}
          className="py-2"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString("fa-IR")} ت</span>
          <span>{priceRange[1].toLocaleString("fa-IR")} ت</span>
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full rounded-full"
        onClick={() => {
          setCategory("all");
          setRoast("all");
          setPriceRange([0, 500000]);
          setSearch("");
          setPage(1);
          navigate("shop");
        }}
      >
        پاک کردن فیلترها
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">فروشگاه</h1>
        <p className="mt-2 text-muted-foreground">
          {loading ? "در حال بارگذاری..." : `${total.toLocaleString("fa-IR")} محصول یافت شد`}
        </p>
      </motion.div>

      {/* Search + Sort bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجوی محصول..."
            className="h-10 rounded-full pr-10"
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-10 w-[140px] rounded-full">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile filter button */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 rounded-full lg:hidden">
              <SlidersHorizontal className="ml-2 h-4 w-4" />
              فیلترها
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>فیلتر محصولات</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filters}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[var(--coffee-caramel)]" />
              <h2 className="font-semibold">فیلترها</h2>
            </div>
            {filters}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="محصولی یافت نشد"
              description="فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full"
              >
                ›
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const p = i + 1;
                return (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="icon"
                    onClick={() => setPage(p)}
                    className="h-10 w-10 rounded-full"
                  >
                    {p.toLocaleString("fa-IR")}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full"
              >
                ‹
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
