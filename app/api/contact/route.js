import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Câmpuri lipsă" },
        { status: 400 }
      );
    }

    // Save to database if connected
    try {
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.message.create({
        data: { name, phone, message },
      });
    } catch (dbError) {
      // Database not connected — log and continue so the user sees success
      console.warn("DB not connected, message not persisted:", dbError.message);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
