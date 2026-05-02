import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const FALLBACK = "primnord-fallback-secret-change-me";
const JWT_SECRET = process.env.JWT_SECRET || FALLBACK;
const isProd = process.env.NODE_ENV === "production";
const secretBytes = new TextEncoder().encode(JWT_SECRET);

async function isAuthed(request) {
  if (isProd && JWT_SECRET === FALLBACK) return false;
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretBytes);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAuthApi =
    pathname === "/api/auth/login" || pathname === "/api/auth/logout";
  if (isLoginPage || isAuthApi) return NextResponse.next();

  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminUi && !isAdminApi) return NextResponse.next();

  const ok = await isAuthed(request);
  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const original = pathname + (request.nextUrl.search || "");
  const loginUrl = new URL("/admin/login", request.url);
  if (original.startsWith("/admin")) {
    loginUrl.searchParams.set("next", original);
  }
  const res = NextResponse.redirect(loginUrl);
  res.cookies.delete("admin-token");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
