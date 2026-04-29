// Simple in-memory rate limiter — token bucket per key (IP).
// Note: serverless functions can run in different instances, so this
// is best-effort. For stricter limits use Vercel KV / Upstash Redis.

const buckets = new Map();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (now - b.last > 10 * 60 * 1000) buckets.delete(key);
  }
}

export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  sweep(now);
  let b = buckets.get(key);
  if (!b || now - b.windowStart > windowMs) {
    b = { count: 0, windowStart: now, last: now };
    buckets.set(key, b);
  }
  b.count += 1;
  b.last = now;
  const ok = b.count <= limit;
  const retryAfterSec = ok ? 0 : Math.ceil((b.windowStart + windowMs - now) / 1000);
  return { ok, retryAfterSec, remaining: Math.max(0, limit - b.count) };
}

export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
