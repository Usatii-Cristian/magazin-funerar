import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const validId = msgId && msgId !== "x" && /^[a-f0-9]{24}$/.test(msgId);

    if (!validId) {
      // No DB row to look up — derive new state purely from action, preserving
      // the unrelated axis as "—" since we have no record of it.
      const newRead = action === "contactat" ? true : action === "necontactat" ? false : undefined;
      const newDelivered = action === "livrat" ? true : action === "nelivrat" ? false : undefined;
      const isFinal = newDelivered === true;
      const oldText = message.text ?? "";
      const headerEnd = oldText.indexOf("\n\n");
      const body = headerEnd >= 0 ? oldText.slice(headerEnd) : `\n\n${oldText}`;
      const header =
        `📬 Mesaj nou de contact!\n` +
        `📌 Status: ${
          newRead === true ? "✅ Contactat" : newRead === false ? "❌ Necontactat" : "—"
        } • ${
          newDelivered === true ? "📦 Livrat" : newDelivered === false ? "⏳ Nelivrat" : "—"
        }${isFinal ? " (finalizat)" : ""}`;
      const newText = header + body;

      await Promise.all([
        answerCallback(callbackId, `Marcat: ${LABELS[action]}`),
        editMessage(
          chat.id,
          message_id,
          newText,
          buildKeyboard(msgId, { read: newRead, delivered: newDelivered })
        ),
      ]);
      return NextResponse.json({ ok: true });
    }

    // Run callback ack and DB update in parallel — saves a round-trip
    const [, updated] = await Promise.all([
      answerCallback(callbackId, `Marcat: ${LABELS[action]}`),
      prisma.message.update({
        where: { id: msgId },
        data: DB_UPDATE[action],
      }),
    ]);

    const isFinal = updated.delivered === true;

    const text = buildMessageText({
      name: updated.name,
      phone: updated.phone,
      message: updated.message,
      createdAt: updated.createdAt,
      read: updated.read,
      delivered: updated.delivered,
      isFinal,
    });

    const keyboard = buildKeyboard(msgId, {
      read: updated.read,
      delivered: updated.delivered,
    });

    const stored = updated.telegramMessages ?? [];

    // Prioritize the user's current message; sync other chats in parallel
    const userKey = `${chat.id}:${message_id}`;
    const seen = new Set();
    const targets = [
      { chatId: chat.id, msgId: message_id },
      ...stored.filter((t) => {
        const k = `${t.chatId}:${t.msgId}`;
        if (k === userKey || seen.has(k)) return false;
        seen.add(k);
        return true;
      }),
    ];

    await Promise.all(
      targets.map(({ chatId, msgId: tgMsgId }) =>
        editMessage(chatId, tgMsgId, text, keyboard)
      )
    );
  } catch {}

  return NextResponse.json({ ok: true });
}
