import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (productId) {
    const reviews = await db.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  }
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "برای ثبت نظر وارد شوید" }, { status: 401 });
  }
  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "امتیاز نامعتبر" }, { status: 400 });
  }

  // Check existing
  const existing = await db.review.findFirst({
    where: { productId, userId: user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "شما قبلاً نظر ثبت کرده‌اید" },
      { status: 400 }
    );
  }

  const review = await db.review.create({
    data: { productId, userId: user.id, rating: parseInt(rating), comment },
    include: { user: { select: { name: true } } },
  });

  // update product rating
  const stats = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  await db.product.update({
    where: { id: productId },
    data: {
      rating: stats._avg.rating ?? 0,
      reviewCount: stats._count,
    },
  });

  return NextResponse.json(review);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await params;
  const review = await db.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  if (review.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
  }
  await db.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
