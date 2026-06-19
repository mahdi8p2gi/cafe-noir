import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const product = await db.product.update({
    where: { id },
    data: {
      ...body,
      discountPrice: body.discountPrice || null,
      roastLevel: body.roastLevel || null,
      categoryId: body.categoryId || undefined,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
