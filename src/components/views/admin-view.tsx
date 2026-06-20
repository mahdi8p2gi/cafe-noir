"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/stores/auth-store";
import { useNavStore } from "@/stores/nav-store";
import { ORDER_STATUS, formatPrice, type Category } from "@/types";
import { toast } from "sonner";

type Tab = "dashboard" | "products" | "orders" | "users";

export function AdminView() {
  const { user } = useAuth();
  const navigate = useNavStore((s) => s.navigate);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      toast.error("دسترسی غیرمجاز");
      navigate("home");
    }
    if (!user) {
      navigate("auth");
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <p className="mt-4 text-muted-foreground">در حال بررسی دسترسی...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
    { id: "products", label: "محصولات", icon: Package },
    { id: "orders", label: "سفارش‌ها", icon: ShoppingBag },
    { id: "users", label: "کاربران", icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">پنل مدیریت</h1>
        <p className="mt-2 text-muted-foreground">مدیریت کامل فروشگاه کافه‌نویر</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "users" && <UsersTab />}
    </div>
  );
}

function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = [
    { icon: DollarSign, label: "درآمد کل", value: `${formatPrice(data?.stats?.revenue || 0)} ت`, color: "from-green-500 to-emerald-600" },
    { icon: ShoppingBag, label: "سفارش‌ها", value: (data?.stats?.orders || 0).toLocaleString("fa-IR"), color: "from-[var(--coffee-mocha)] to-[var(--coffee-espresso)]" },
    { icon: Package, label: "محصولات", value: (data?.stats?.products || 0).toLocaleString("fa-IR"), color: "from-amber-500 to-orange-600" },
    { icon: Users, label: "کاربران", value: (data?.stats?.users || 0).toLocaleString("fa-IR"), color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
          >
            <div className={`mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-[var(--coffee-caramel)]" />
            سفارش‌های اخیر
          </h3>
          <div className="space-y-2">
            {(data?.recentOrders || []).slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium" dir="ltr">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.user?.name || order.user?.email}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{formatPrice(order.total)} ت</p>
                  <Badge className="text-[10px]">{ORDER_STATUS[order.status]}</Badge>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <p className="py-6 text-center text-sm text-muted-foreground">سفارشی ثبت نشده</p>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4 text-[var(--coffee-caramel)]" />
            محصولات پرفروش
          </h3>
          <div className="space-y-2">
            {(data?.topProducts || []).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
                <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{p.reviewCount.toLocaleString("fa-IR")} فروش</span>
                  <span className="font-bold text-foreground">{formatPrice(p.price)} ت</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((p) => {
        setProducts(Array.isArray(p) ? p : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    fetch("/api/categories").then((r) => r.json()).then((c) => setCategories(Array.isArray(c) ? c : []));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("محصول حذف شد");
      load();
    }
  };

  const filtered = products.filter((p) => p.name.includes(search));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول..."
            className="h-10 rounded-full pr-10"
          />
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="ml-2 h-4 w-4" />
              محصول جدید
            </Button>
          </DialogTrigger>
          <ProductForm
            product={editing}
            categories={categories}
            onClose={() => { setOpen(false); setEditing(null); }}
            onSaved={() => { load(); setOpen(false); setEditing(null); }}
          />
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>محصول</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category?.name || "—"}</TableCell>
                  <TableCell>{formatPrice(p.discountPrice ?? p.price)} ت</TableCell>
                  <TableCell>{p.stock.toLocaleString("fa-IR")}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "default" : "secondary"}>
                      {p.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditing(p); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSaved }: {
  product: any;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    longDescription: product?.longDescription || "",
    price: product?.price || 0,
    discountPrice: product?.discountPrice || 0,
    image: product?.image || "/images/products/espresso-blend.png",
    roastLevel: product?.roastLevel || "",
    origin: product?.origin || "",
    weight: product?.weight || "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || null,
        stock: Number(form.stock),
        roastLevel: form.roastLevel || null,
      };
      const url = product ? `/api/admin/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("خطا در ذخیره");
      toast.success(product ? "محصول به‌روزرسانی شد" : "محصول ایجاد شد");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{product ? "ویرایش محصول" : "محصول جدید"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>نام محصول</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>توضیح کوتاه</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>توضیح کامل</Label>
          <Textarea value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label>قیمت (تومان)</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>قیمت تخفیف (اختیاری)</Label>
          <Input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>موجودی</Label>
          <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>دسته‌بندی</Label>
          <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
            <SelectTrigger><SelectValue placeholder="انتخاب دسته" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>درجه رست</Label>
          <Select value={form.roastLevel} onValueChange={(v) => setForm({ ...form, roastLevel: v })}>
            <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LIGHT">روشن</SelectItem>
              <SelectItem value="MEDIUM">متوسط</SelectItem>
              <SelectItem value="DARK">تیره</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>خاستگاه</Label>
          <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>وزن</Label>
          <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>آدرس تصویر</Label>
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} dir="ltr" />
        </div>
        <div className="flex items-center gap-4 md:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            محصول ویژه
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            فعال
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>انصراف</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>
    </DialogContent>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((o) => {
        setOrders(Array.isArray(o) ? o : []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success("وضعیت به‌روزرسانی شد");
      load();
    }
  };

  if (loading) {
    return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شماره</TableHead>
            <TableHead>مشتری</TableHead>
            <TableHead>مبلغ</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium" dir="ltr">{o.orderNumber}</TableCell>
              <TableCell>{o.user?.name || o.user?.email}</TableCell>
              <TableCell>{formatPrice(o.total)} ت</TableCell>
              <TableCell className="text-xs">{new Date(o.createdAt).toLocaleDateString("fa-IR")}</TableCell>
              <TableCell>
                <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                  <SelectTrigger className="h-8 w-32 rounded-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">سفارشی ثبت نشده</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((u) => {
        setUsers(Array.isArray(u) ? u : []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (id: string, role: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      toast.success("نقش به‌روزرسانی شد");
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف این کاربر؟")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("کاربر حذف شد");
      load();
    }
  };

  if (loading) {
    return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>ایمیل</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>سفارش‌ها</TableHead>
            <TableHead>تاریخ عضویت</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name || "—"}</TableCell>
              <TableCell dir="ltr" className="text-xs">{u.email}</TableCell>
              <TableCell>
                <Select value={u.role} onValueChange={(v) => updateRole(u.id, v)}>
                  <SelectTrigger className="h-8 w-24 rounded-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">کاربر</SelectItem>
                    <SelectItem value="ADMIN">مدیر</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{u._count?.orders?.toLocaleString("fa-IR") || "۰"}</TableCell>
              <TableCell className="text-xs">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(u.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
