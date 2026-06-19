import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }

  const [products, orders, users, categories] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count(),
    db.category.count(),
  ]);

  const revenue = await db.order.aggregate({
    where: { status: { not: "CANCELLED" } },
    _sum: { total: true },
  });

  const recentOrders = await db.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const topProducts = await db.product.findMany({
    take: 5,
    where: { isActive: true },
    orderBy: { reviewCount: "desc" },
    select: { id: true, name: true, price: true, rating: true, reviewCount: true, image: true },
  });

  const categoryStats = await db.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRevenue = await db.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo }, status: { not: "CANCELLED" } },
    select: { total: true, createdAt: true },
  });

  return NextResponse.json({
    stats: { products, orders, users, categories, revenue: revenue._sum.total ?? 0 },
    recentOrders,
    topProducts,
    categoryStats,
    recentRevenue,
  });
}
