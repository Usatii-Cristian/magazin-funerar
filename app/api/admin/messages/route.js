import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, action } = await request.json();
    const dataMap = {
      read: { read: true },
      unread: { read: false },
      deliver: { delivered: true },
      undeliver: { delivered: false },
    };
    const data = dataMap[action];
    if (!data) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    const message = await prisma.message.update({ where: { id }, data });
    return NextResponse.json(message);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
