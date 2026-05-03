import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// One-shot bootstrap: creates the first admin on an empty database, then
// permanently refuses (because count > 0). Lives outside /api/admin/* so the
// auth middleware does not gate it — there is no admin to authenticate as
// yet on a fresh DB. Rate-limited to make probing painful.
//
// Usage (after pointing DATABASE_URL at the new MongoDB):
//   curl -X POST https://<host>/api/bootstrap \
//     -H "Content-Type: application/json" \
//     -d '{"email":"you@example.com","password":"strong-password"}'
export async function POST(request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`bootstrap:${ip}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const existingCount = await prisma.admin.count();
  if (existingCount > 0) {
    return NextResponse.json(
      { error: "Bootstrap closed — an admin already exists." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Email invalid" }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json(
      { error: "Parola trebuie să aibă minim 8 caractere" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: { email, passwordHash },
  });

  return NextResponse.json({ success: true, adminId: admin.id, email: admin.email });
}
