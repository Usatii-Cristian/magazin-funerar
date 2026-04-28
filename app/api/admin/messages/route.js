import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildKeyboard, buildMessageText, editMessage } from "@/lib/telegram";

async function syncTelegram(updated) {
  const stored = updated.telegramMessages;
  if (!Array.isArray(stored) || !stored.length) return;

  const isFinal = false; // admin panel toggles are reversible — never final
  const text = buildMessageText({
    name: updated.name,
    phone: updated.phone,
    message: updated.message,
    createdAt: updated.createdAt,
    read: updated.read,
    delivered: updated.delivered,
    isFinal,
  });

  // Match webhook behaviour: hide buttons once delivery state is set
  const keyboard = updated.delivered
    ? { inline_keyboard: [] }
    : buildKeyboard(updated.id, updated.read);

  await Promise.all(
    stored.map(({ chatId, msgId }) =>
      editMessage(chatId, msgId, text, keyboard)
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

    syncTelegram(updated).catch(() => {});

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
