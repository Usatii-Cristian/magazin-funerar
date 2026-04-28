import { NextResponse } from "next/server";
import { buildKeyboard, buildMessageText, sendMessage } from "@/lib/telegram";

const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID || "-5141877015",
  process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);

// Re-export for backward compatibility (still imported elsewhere)
export { buildKeyboard };

async function sendTelegram({ name, phone, message, createdAt, dbMsgId }) {
  const text = buildMessageText({ name, phone, message, createdAt });
  const keyboard = buildKeyboard(dbMsgId, undefined);
  const results = await Promise.all(
    TELEGRAM_CHAT_IDS.map((id) => sendMessage(id, text, keyboard))
  );
  return results.filter(Boolean);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Câmpuri lipsă" }, { status: 400 });
    }

    let dbMsgId = null;
    let createdAt = new Date();
    try {
      const { default: prisma } = await import("@/lib/prisma");
      const saved = await prisma.message.create({
        data: { name, phone, message, telegramSent: false },
      });
      dbMsgId = saved.id;
      createdAt = saved.createdAt;
    } catch {}

    const sent = await sendTelegram({ name, phone, message, createdAt, dbMsgId });
    const telegramSent = sent.length > 0;

    if (dbMsgId) {
      try {
        const { default: prisma } = await import("@/lib/prisma");
        await prisma.message.update({
          where: { id: dbMsgId },
          data: { telegramSent, telegramMessages: sent },
        });
      } catch {}
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
