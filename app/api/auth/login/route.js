import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { reportError } from "@/lib/errorTracking";

export async function POST(request) {
  const ip = getClientIp(request);

  // Brute-force guard: 8 login attempts per 5 min per IP.
  const rl = rateLimit(`login:${ip}`, { limit: 8, windowMs: 5 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Prea multe încercări. Reveniți peste câteva minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password || email.length > 254 || password.length > 200) {
      return NextResponse.json({ error: "Câmpuri lipsă" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Credențiale invalide" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credențiale invalide" }, { status: 401 });
    }

    const token = await signToken({ adminId: admin.id, email: admin.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    await reportError("auth:login", err, { ip });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
