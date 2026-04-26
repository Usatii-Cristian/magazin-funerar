import { NextResponse } from "next/server";
import { buildKeyboard } from "@/app/api/contact/route";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

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

async function editKeyboard(chatId, msgId, keyboard) {
  try {
    await fetch(
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
    );
  } catch {}
}

export async function POST(request) {
  try {
    const update = await request.json();
    if (!update.callback_query) return NextResponse.json({ ok: true });

    const { id: callbackId, data, message } = update.callback_query;
    const { chat, message_id, reply_markup } = message;
    const [action, msgId] = (data ?? "").split(":");

    if (!LABELS[action]) return NextResponse.json({ ok: true });

    // Answer callback — clears loading spinner
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: `Marcat: ${LABELS[action]}`,
        }),
      }
    );

    const isFinal = action === "livrat" || action === "nelivrat";

    // Update current message keyboard
    if (isFinal) {
      await editKeyboard(chat.id, message_id, { inline_keyboard: [] });
    } else {
      const currentRows = reply_markup?.inline_keyboard ?? [];
      const newRows = currentRows.map((row, ri) => {
        if (ri !== 0) return row;
        return row.map((btn) => {
          const [btnAction] = btn.callback_data.split(":");
          return {
            ...btn,
            text:
              btnAction === action
                ? `${LABELS[action]} ✓`
                : LABELS[btnAction] ?? btn.text,
          };
        });
      });
      await editKeyboard(chat.id, message_id, { inline_keyboard: newRows });
    }

    // Update DB and sync other Telegram chats
    const validId = msgId && msgId !== "x" && /^[a-f0-9]{24}$/.test(msgId);
    if (validId) {
      try {
        const { default: prisma } = await import("@/lib/prisma");

        const updated = await prisma.message.update({
          where: { id: msgId },
          data: DB_UPDATE[action],
        });

        const stored = updated.telegramMessages ?? [];
        for (const { chatId, msgId: tgMsgId } of stored) {
          if (String(chatId) === String(chat.id) && tgMsgId === message_id) continue;
          if (isFinal) {
            await editKeyboard(chatId, tgMsgId, { inline_keyboard: [] });
          } else {
            const kb = buildKeyboard(msgId, updated.read);
            await editKeyboard(chatId, tgMsgId, kb);
          }
        }
      } catch {}
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
