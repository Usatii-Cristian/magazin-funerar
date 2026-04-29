// Server-side verification for Google reCAPTCHA v3 (invisible).
// If RECAPTCHA_SECRET_KEY env var is not set, verification is skipped
// (the check returns true), so the site works in dev without setup.

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.4;

export async function verifyRecaptcha(token, expectedAction) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "no-token" };

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    if (!data.success) return { ok: false, reason: "verify-failed", errors: data["error-codes"] };
    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { ok: false, reason: "low-score", score: data.score };
    }
    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, reason: "action-mismatch", action: data.action };
    }
    return { ok: true, score: data.score };
  } catch (err) {
    return { ok: false, reason: "verify-error", error: err.message };
  }
}
