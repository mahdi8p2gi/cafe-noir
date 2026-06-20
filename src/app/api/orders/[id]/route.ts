import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { image: true } } } } },
  });
  if (!order) return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  if (order.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
  }
  return NextResponse.json(order);
}
