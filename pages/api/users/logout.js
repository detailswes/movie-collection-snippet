import { sendSuccess, sendError } from '../lib/response';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  // Clear the httpOnly auth cookie by setting Max-Age=0
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`
  );

  return sendSuccess(res, 200, 'Logged out successfully');
}
