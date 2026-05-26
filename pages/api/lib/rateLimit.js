/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * Works per-IP. The store is held in the Node.js process memory which means
 * it resets on cold starts. For multi-instance production use, replace with
 * a Redis-backed store (e.g. rate-limiter-flexible).
 */

const ipStore = new Map();

// Periodically prune expired entries so the map doesn't grow unbounded
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of ipStore) {
      if (now > entry.resetAt) ipStore.delete(key);
    }
  }, 60_000);
}

/**
 * @param {object} options
 * @param {number} options.windowMs   Time window in milliseconds (default: 15 min)
 * @param {number} options.max        Max allowed requests per window (default: 10)
 * @returns A middleware function that returns an error string or null
 */
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  return function checkRateLimit(req) {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const entry = ipStore.get(ip);

    if (!entry || now > entry.resetAt) {
      ipStore.set(ip, { count: 1, resetAt: now + windowMs });
      return null;
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      return { retryAfter: retryAfterSec };
    }

    return null;
  };
}
