import { NextResponse } from "next/server";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID || "-5141877015",
  process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);

export function buildKeyboard(msgId, isRead) {
  const id = msgId ?? "x";
  return {
    inline_keyboard: [
      [
        {
          text: isRead === true ? "✅ Contactat ✓" : "✅ Contactat",
          callback_data: `contactat:${id}`,
        },
        {
          text: isRead === false ? "❌ Necontactat ✓" : "❌ Necontactat",
          callback_data: `necontactat:${id}`,
        },
      ],
      [
        { text: "📦 Livrat", callback_data: `livrat:${id}` },
        { text: "⏳ Nelivrat", callback_data: `nelivrat:${id}` },
      ],
    ],
  };
}

async function sendToOne(chatId, text, keyboard) {
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
          reply_markup: keyboard,
        }),
      }
    );
    if (!res.ok) return null;
    const { result } = await res.json();
    return { chatId: String(chatId), msgId: result?.message_id };
  } catch {
    return null;
  }
}

async function sendTelegram(name, phone, message, date, dbMsgId) {
  const text =
    `📬 <b>Mesaj nou de contact!</b>\n\n` +
    `👤 <b>Nume:</b> ${name}\n` +
    `📞 <b>Telefon:</b> ${phone}\n` +
    `💬 <b>Mesaj:</b> ${message}\n` +
    `🕐 <b>Data:</b> ${date}`;
  const keyboard = buildKeyboard(dbMsgId, undefined);
  const results = await Promise.all(
    TELEGRAM_CHAT_IDS.map((id) => sendToOne(id, text, keyboard))
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

    const date = new Date().toLocaleString("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Bucharest",
    });

    // Save to DB first to get the ID for Telegram buttons
    let dbMsgId = null;
    try {
      const { default: prisma } = await import("@/lib/prisma");
      const saved = await prisma.message.create({
        data: { name, phone, message, telegramSent: false },
      });
      dbMsgId = saved.id;
    } catch {}

    const sent = await sendTelegram(name, phone, message, date, dbMsgId);
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
