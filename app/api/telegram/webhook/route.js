import { NextResponse } from "next/server";
import {
  buildKeyboard,
  buildMessageText,
  editMessage,
  answerCallback,
} from "@/lib/telegram";

const LABELS = {
  contactat: "✅ Contactat",
  necontactat: "❌ Necontactat",
  livrat: "📦 Livrat",
  nelivrat: "⏳ Nelivrat",
};

const DB_UPDATE = {
  contactat: { read: true },
  necontactat: { read: false },
  livrat: { delivered: true },
  nelivrat: { delivered: false },
};

export async function POST(request) {
  try {
    const update = await request.json();
    if (!update.callback_query) return NextResponse.json({ ok: true });

    const { id: callbackId, data, message } = update.callback_query;
    const { chat, message_id } = message;
    const [action, msgId] = (data ?? "").split(":");

    if (!LABELS[action]) return NextResponse.json({ ok: true });

    await answerCallback(callbackId, `Marcat: ${LABELS[action]}`);

    const isFinal = action === "livrat" || action === "nelivrat";
    const validId = msgId && msgId !== "x" && /^[a-f0-9]{24}$/.test(msgId);

    if (!validId) {
      // No DB record — fallback: just clear or update keyboard on this message
      const kb = isFinal
        ? { inline_keyboard: [] }
        : buildKeyboard(msgId, action === "contactat");
      await editMessage(
        chat.id,
        message_id,
        message.text ?? "",
        kb
      );
      return NextResponse.json({ ok: true });
    }

    // Update DB and propagate to all Telegram chats
    try {
      const { default: prisma } = await import("@/lib/prisma");

      const updated = await prisma.message.update({
        where: { id: msgId },
        data: DB_UPDATE[action],
      });

      const text = buildMessageText({
        name: updated.name,
        phone: updated.phone,
        message: updated.message,
        createdAt: updated.createdAt,
        read: updated.read,
        delivered: updated.delivered,
        isFinal,
      });

      const keyboard = isFinal
        ? { inline_keyboard: [] }
        : buildKeyboard(msgId, updated.read);

      const stored = updated.telegramMessages ?? [];

      // Update the message that was clicked, plus all synced copies
      const targets = stored.length
        ? stored
        : [{ chatId: chat.id, msgId: message_id }];

      await Promise.all(
        targets.map(({ chatId, msgId: tgMsgId }) =>
          editMessage(chatId, tgMsgId, text, keyboard)
        )
      );
    } catch {}
  } catch {}

  return NextResponse.json({ ok: true });
}
