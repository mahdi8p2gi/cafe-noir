import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toLowerCase();
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: name || null,
        role: "USER",
      },
    });
    return NextResponse.json({
      ok: true,
      userId: user.id,
      message: "ثبت‌نام موفقیت‌آمیز بود. اکنون وارد شوید.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "خطا در ثبت‌نام: " + (e as Error).message },
      { status: 500 }
    );
  }
}
