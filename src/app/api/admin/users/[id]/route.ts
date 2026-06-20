import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await params;
  const body = await _req.json();
  const { db } = await import("@/lib/db");
  const user = await db.user.update({ where: { id }, data: { role: body.role } });
  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await params;
  const { db } = await import("@/lib/db");
  await db.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
