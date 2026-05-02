const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

const TG_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export function formatDate(d) {
  return new Date(d).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  });
}

function statusLine(read, delivered, isFinal) {
  const contact = read ? "✅ Contactat" : "❌ Necontactat";
  const delivery = delivered ? "📦 Livrat" : "⏳ Nelivrat";
  const suffix = isFinal ? " <i>(finalizat)</i>" : "";
  return `${contact} • ${delivery}${suffix}`;
}

export function buildMessageText({
  name,
  phone,
  message,
  createdAt,
  read = false,
  delivered = false,
  isFinal = false,
}) {
  return (
    `📬 <b>Mesaj nou de contact!</b>\n` +
    `📌 <b>Status:</b> ${statusLine(read, delivered, isFinal)}\n\n` +
    `👤 <b>Nume:</b> ${name}\n` +
    `📞 <b>Telefon:</b> ${phone}\n` +
    `💬 <b>Mesaj:</b> ${message}\n` +
    `🕐 <b>Data:</b> ${formatDate(createdAt)}`
  );
}

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

export async function sendMessage(chatId, text, keyboard) {
  try {
    const res = await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: keyboard,
      }),
    });
    if (!res.ok) return null;
    const { result } = await res.json();
    return { chatId: String(chatId), msgId: result?.message_id };
  } catch {
    return null;
  }
}

export async function editMessage(chatId, msgId, text, keyboard) {
  try {
    const res = await fetch(`${TG_API}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: msgId,
        text,
        parse_mode: "HTML",
        reply_markup: keyboard,
      }),
    });
    if (res.ok) return true;
    const data = await res.json().catch(() => null);
    // "message is not modified" — Telegram refuses no-op edits. Fall back to
    // updating just the keyboard so the visual checkmark still moves.
    if (data && /not modified/i.test(data.description ?? "")) {
      await fetch(`${TG_API}/editMessageReplyMarkup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: msgId,
          reply_markup: keyboard,
        }),
      });
    }
  } catch {}
  return false;
}

export async function answerCallback(callbackId, text) {
  try {
    await fetch(`${TG_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackId, text }),
    });
  } catch {}
}
