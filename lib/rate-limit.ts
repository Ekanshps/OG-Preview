import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Keep the production and local-development limits aligned.
const REQUEST_LIMIT = 20;
const WINDOW = "10 m";
const WINDOW_MS = 10 * 60 * 1000;

const memory = new Map<string, { count: number; resetAt: number }>();
let upstashLimiter: Ratelimit | null = null;

export function getClientKey(headers: Headers) {
  return headers.get("cf-connecting-ip")?.trim()
    || headers.get("x-real-ip")?.trim()
    || headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
    || "unknown-client";
}

function getUpstashLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      // TTL is managed by @upstash/ratelimit. The sliding-window algorithm
      // writes its Redis counter keys with an expiry (PEXPIRE) based on WINDOW;
      // no separate Redis EXPIRE command or dashboard setting is required.
      limiter: Ratelimit.slidingWindow(REQUEST_LIMIT, WINDOW),
      analytics: false,
      prefix: "ogpreview:inspect",
    });
  }
  return upstashLimiter;
}

export async function checkRateLimit(key: string) {
  const limiter = getUpstashLimiter();
  if (limiter) {
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining, reset: result.reset };
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Configure Upstash Redis before enabling public URL inspection in production.");
  }
  const now = Date.now();
  if (memory.size > 5000) { for (const [entry, value] of memory) if (value.resetAt <= now) memory.delete(entry); }
  const current = memory.get(key);
  if (!current || current.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: REQUEST_LIMIT - 1, reset: now + WINDOW_MS };
  }
  current.count += 1;
  return {
    success: current.count <= REQUEST_LIMIT,
    remaining: Math.max(0, REQUEST_LIMIT - current.count),
    reset: current.resetAt,
  };
}
