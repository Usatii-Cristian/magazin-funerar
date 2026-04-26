import { NextResponse } from "next/server";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

const LABELS = {
  contactat: "✅ Contactat",
  necontactat: "❌ Necontactat",
  livrat: "📦 Livrat",
  nelivrat: "⏳ Nelivrat",
};

const ROW_INDEX = {
  contactat: 0,
  necontactat: 0,
  livrat: 1,
  nelivrat: 1,
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
    const { chat, message_id, reply_markup } = message;

    const [action, msgId] = data.split(":");
    if (!LABELS[action]) return NextResponse.json({ ok: true });

    // Answer callback — removes loading spinner
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

    // Update DB if we have a valid MongoDB ID
    if (msgId && msgId !== "x" && /^[a-f0-9]{24}$/.test(msgId)) {
      try {
        const { default: prisma } = await import("@/lib/prisma");
        await prisma.message.update({
          where: { id: msgId },
          data: DB_UPDATE[action],
        });
      } catch {}
    }

    // Update keyboard — mark selected button in its row, keep other row as-is
    const currentRows = reply_markup?.inline_keyboard ?? [];
    const targetRow = ROW_INDEX[action];

    const newKeyboard = currentRows.map((row, ri) => {
      if (ri !== targetRow) return row;
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

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat.id,
          message_id,
          reply_markup: { inline_keyboard: newKeyboard },
        }),
      }
    );
  } catch {}

  return NextResponse.json({ ok: true });
}
