// Lightweight error reporting: console + optional Telegram alert.
// Set TELEGRAM_ERROR_CHAT_ID to receive critical errors in a Telegram chat.

import { sendMessage } from "./telegram";

export async function reportError(scope, error, context = {}) {
  const payload = {
    scope,
    message: error?.message ?? String(error),
    stack: error?.stack,
    context,
    at: new Date().toISOString(),
  };
  console.error(`[${scope}]`, payload);

  const chatId = process.env.TELEGRAM_ERROR_CHAT_ID;
  if (!chatId) return;
  try {
    const stack = (payload.stack || "").split("\n").slice(0, 5).join("\n");
    const ctx = Object.keys(context).length
      ? `\n<b>Context:</b>\n<pre>${escapeHtml(JSON.stringify(context, null, 2)).slice(0, 800)}</pre>`
      : "";
    const text =
      `🚨 <b>Eroare ${escapeHtml(scope)}</b>\n` +
      `<b>Mesaj:</b> ${escapeHtml(payload.message)}\n` +
      `<b>Când:</b> ${payload.at}` +
      ctx +
      (stack ? `\n<b>Stack:</b>\n<pre>${escapeHtml(stack).slice(0, 800)}</pre>` : "");
    await sendMessage(chatId, text);
  } catch {}
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
