import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
  });

  return NextResponse.json({ product, related });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/session");
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { slug } = await params;
  const body = await req.json();
  const product = await db.product.update({
    where: { slug },
    data: {
      ...body,
      discountPrice: body.discountPrice || null,
      roastLevel: body.roastLevel || null,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { requireAdmin } = await import("@/lib/session");
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { slug } = await params;
  await db.product.update({ where: { slug }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
