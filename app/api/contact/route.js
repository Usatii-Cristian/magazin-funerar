import { NextResponse } from "next/server";
import { buildKeyboard, buildMessageText, sendMessage } from "@/lib/telegram";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { reportError } from "@/lib/errorTracking";

const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID || "-5141877015",
  process.env.TELEGRAM_CHAT_ID_2,
].filter(Boolean);

export { buildKeyboard };

async function sendTelegram({ name, phone, message, createdAt, dbMsgId }) {
  const text = buildMessageText({ name, phone, message, createdAt });
  const keyboard = buildKeyboard(dbMsgId, undefined);
  const results = await Promise.all(
    TELEGRAM_CHAT_IDS.map((id) => sendMessage(id, text, keyboard))
  );
  return results.filter(Boolean);
}

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit: 5 mesaje per minut per IP
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Prea multe încercări. Reveniți peste un minut." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const { name, phone, message, hp, recaptchaToken } = body || {};

  // Honeypot — dacă e completat, e bot
  if (typeof hp === "string" && hp.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Câmpuri lipsă" }, { status: 400 });
  }

  // Limite rezonabile de mărime
  if (name.length > 100 || phone.length > 30 || message.length > 2000) {
    return NextResponse.json({ error: "Câmp prea lung" }, { status: 400 });
  }

  // reCAPTCHA — sărit dacă RECAPTCHA_SECRET_KEY nu e setat
  const captcha = await verifyRecaptcha(recaptchaToken, "contact");
  if (!captcha.ok) {
    return NextResponse.json(
      { error: "Verificare antispam eșuată" },
      { status: 400 }
    );
  }

  let dbMsgId = null;
  let createdAt = new Date();
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const saved = await prisma.message.create({
      data: { name, phone, message, telegramSent: false },
    });
    dbMsgId = saved.id;
    createdAt = saved.createdAt;
  } catch (err) {
    await reportError("contact:db-create", err, { ip });
  }

  let sent = [];
  try {
    sent = await sendTelegram({ name, phone, message, createdAt, dbMsgId });
  } catch (err) {
    await reportError("contact:telegram-send", err, { ip, dbMsgId });
  }
  const telegramSent = sent.length > 0;

  if (dbMsgId) {
    try {
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.message.update({
        where: { id: dbMsgId },
        data: { telegramSent, telegramMessages: sent },
      });
    } catch (err) {
      await reportError("contact:db-update", err, { ip, dbMsgId });
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
