import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: store in DB or send email. Here we just log.
    console.log("Contact form submission:", body);
    return NextResponse.json({
      ok: true,
      message: "پیام شما با موفقیت ارسال شد. به زودی پاسخ می‌دهیم.",
    });
  } catch {
    return NextResponse.json({ error: "خطا در ارسال" }, { status: 500 });
  }
}
