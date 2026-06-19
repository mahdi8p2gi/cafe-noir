import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const roast = searchParams.get("roast");
  const limit = searchParams.get("limit");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(limit || "12");

  const where: {
    isActive?: boolean;
    featured?: boolean;
    categoryId?: string;
    OR?: { name?: { contains: string }; description?: { contains: string } }[];
    price?: { gte?: number; lte?: number };
    roastLevel?: string;
  } = { isActive: true };

  if (featured === "true") where.featured = true;
  if (roast) where.roastLevel = roast;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }

  if (category && category !== "all") {
    const cat = await db.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };

  const [total, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  // Admin: create product
  try {
    const { requireAdmin } = await import("@/lib/session");
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const body = await req.json();
  const product = await db.product.create({
    data: {
      ...body,
      discountPrice: body.discountPrice || null,
      roastLevel: body.roastLevel || null,
      origin: body.origin || null,
      weight: body.weight || null,
      sku: body.sku || null,
    },
  });
  return NextResponse.json(product);
}
