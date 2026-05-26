import { loginValidationSchema } from '../validation/loginValidation';
import dbMiddleware from '../utils/middleware/dbMiddleware';
import { sendSuccess, sendError } from '../lib/response';
import { createRateLimiter } from '../lib/rateLimit';
import { loginUser } from '../services/authService';

// Allow 10 login attempts per 15 minutes per IP
const loginRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function buildCookieHeader(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  const limited = loginRateLimiter(req);
  if (limited) {
    res.setHeader('Retry-After', limited.retryAfter);
    return sendError(
      res, 429,
      `Too many login attempts. Please try again in ${limited.retryAfter} seconds.`
    );
  }

  await dbMiddleware(req, res, async () => {
    try {
      const { error, value } = loginValidationSchema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const token = await loginUser(value.email, value.password);

      res.setHeader('Set-Cookie', buildCookieHeader(token));
      return sendSuccess(res, 200, 'Login successful');
    } catch (err) {
      if (err.statusCode) {
        return sendError(res, err.statusCode, err.message);
      }
      console.error('Login error:', err);
      return sendError(res, 500, 'Internal Server Error');
    }
  });
}
