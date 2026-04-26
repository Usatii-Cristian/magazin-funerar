import { NextResponse } from "next/server";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID || "-5141877015",
  process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);

const STATUS_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "✅ Contactat", callback_data: "contactat" },
      { text: "❌ Necontactat", callback_data: "necontactat" },
    ],
    [
      { text: "📦 Livrat", callback_data: "livrat" },
      { text: "⏳ Nelivrat", callback_data: "nelivrat" },
    ],
  ],
};

async function sendToOne(chatId, text) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: STATUS_KEYBOARD,
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function sendTelegram(name, phone, message, date) {
  const text =
    `📬 <b>Mesaj nou de contact!</b>\n\n` +
    `👤 <b>Nume:</b> ${name}\n` +
    `📞 <b>Telefon:</b> ${phone}\n` +
    `💬 <b>Mesaj:</b> ${message}\n` +
    `🕐 <b>Data:</b> ${date}`;
  const results = await Promise.all(TELEGRAM_CHAT_IDS.map((id) => sendToOne(id, text)));
  return results.some(Boolean);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Câmpuri lipsă" }, { status: 400 });
    }

    const date = new Date().toLocaleString("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const telegramSent = await sendTelegram(name, phone, message, date);

    try {
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.message.create({
        data: { name, phone, message, telegramSent },
      });
    } catch (dbError) {
      console.warn("DB not connected, message not persisted:", dbError.message);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
