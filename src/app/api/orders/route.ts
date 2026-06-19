import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

function genOrderNumber() {
  const d = new Date();
  const stamp =
    d.getFullYear().toString().slice(-2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CN-${stamp}-${rand}`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { select: { image: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "برای ثبت سفارش وارد شوید" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { items, address, city, postalCode, phone, notes } = body;

    if (!items?.length || !address || !city || !phone) {
      return NextResponse.json(
        { error: "اطلاعات سفارش ناقص است" },
        { status: 400 }
      );
    }

    // Verify products and stock
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `محصول یافت نشد` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `موجودی ${product.name} کافی نیست` },
          { status: 400 }
        );
      }
      const unitPrice = product.discountPrice ?? product.price;
      subtotal += unitPrice * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
      });
    }

    const shipping = subtotal > 500000 ? 0 : 45000;
    const total = subtotal + shipping;

    // create order
    const order = await db.order.create({
      data: {
        orderNumber: genOrderNumber(),
        userId: user.id,
        status: "PENDING",
        subtotal,
        shipping,
        total,
        address,
        city,
        postalCode: postalCode || null,
        phone,
        notes: notes || null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // decrement stock
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json(
      { error: "خطا در ثبت سفارش: " + (e as Error).message },
      { status: 500 }
    );
  }
}
