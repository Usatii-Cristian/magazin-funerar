import { SignJWT, jwtVerify } from "jose";

const FALLBACK = "primnord-fallback-secret-change-me";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s === FALLBACK) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is not set — refusing to sign/verify in production");
    }
    return new TextEncoder().encode(FALLBACK);
  }
  return new TextEncoder().encode(s);
}

const secret = () => getSecret();

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret());
  return payload;
}
