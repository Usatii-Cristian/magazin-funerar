import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildKeyboard } from "@/app/api/contact/route";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

async function syncTelegram(telegramMessages, dbMsgId, isRead, isDelivered) {
  if (!Array.isArray(telegramMessages) || !telegramMessages.length) return;

  const keyboard = isDelivered
    ? { inline_keyboard: [] }
    : buildKeyboard(dbMsgId, isRead);

  await Promise.all(
    telegramMessages.map(({ chatId, msgId }) =>
      fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: msgId,
            reply_markup: keyboard,
          }),
        }
      ).catch(() => {})
    )
  );
}

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

    const updated = await prisma.message.update({ where: { id }, data });

    // Sync Telegram keyboards without blocking the response
    syncTelegram(
      updated.telegramMessages,
      id,
      updated.read,
      updated.delivered
    ).catch(() => {});

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
