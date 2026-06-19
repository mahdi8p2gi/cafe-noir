import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Demo: just records the request. In production send email with reset link.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
    }
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    // Always return success to prevent email enumeration
    return NextResponse.json({
      ok: true,
      message: user
        ? "ایمیل بازنشانی رمز عبور ارسال شد"
        : "اگر ایمیل ثبت شده باشد، پیام ارسال می‌شود",
    });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
