import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }

  if (productId) {
    const items = await db.wishlistItem.findMany({
      where: { userId: user.id, productId },
    });
    return NextResponse.json({ has: items.length > 0 });
  }

  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  return NextResponse.json({ items: items.map((i) => i.productId) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId الزامی است" }, { status: 400 });
  }
  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed" });
  }
  await db.wishlistItem.create({ data: { userId: user.id, productId } });
  return NextResponse.json({ action: "added" });
}
