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

const DEFAULT_KEYBOARD = [
  [
    { text: "✅ Contactat", callback_data: "contactat" },
    { text: "❌ Necontactat", callback_data: "necontactat" },
  ],
  [
    { text: "📦 Livrat", callback_data: "livrat" },
    { text: "⏳ Nelivrat", callback_data: "nelivrat" },
  ],
];

export async function POST(request) {
  try {
    const update = await request.json();

    if (!update.callback_query) return NextResponse.json({ ok: true });

    const { id: callbackId, data, message } = update.callback_query;
    const { chat, message_id, reply_markup } = message;

    if (!LABELS[data]) return NextResponse.json({ ok: true });

    // Answer callback — removes loading spinner on button
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: `Marcat: ${LABELS[data]}`,
        }),
      }
    );

    // Update only the row that was clicked, keep the other row as-is
    const currentRows =
      reply_markup?.inline_keyboard ?? DEFAULT_KEYBOARD;
    const targetRow = ROW_INDEX[data];

    const newKeyboard = currentRows.map((row, ri) => {
      if (ri !== targetRow) return row;
      return row.map((btn) => ({
        ...btn,
        text:
          btn.callback_data === data
            ? `${LABELS[data]} ✓`
            : LABELS[btn.callback_data] ?? btn.text,
      }));
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
  } catch {
    // Silently ignore — Telegram resends if no 200 response
  }

  return NextResponse.json({ ok: true });
}
