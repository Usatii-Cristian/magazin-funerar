import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const TELEGRAM_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8559936198:AAEA_Y_iBuq1TF4HQHhdi1v9MAmAKr1CjPA";

export async function GET(request) {
  // Endpoint is outside /api/admin/* so the auth middleware doesn't gate it.
  // Verify the admin cookie inline so a stranger can't repoint our webhook.
  const token = request.cookies.get("admin-token")?.value;
  try {
    if (!token) throw new Error("no token");
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = request.headers.get("host");
  const webhookUrl = `https://${host}/api/telegram/webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json({ webhookUrl, telegram: data });
}
