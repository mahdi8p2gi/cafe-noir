import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { getCurrentUser } = await import("@/lib/session");
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  const { id } = await params;
  const review = await db.review.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  if (review.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
  }
  await db.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
