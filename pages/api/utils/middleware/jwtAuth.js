import jwt from 'jsonwebtoken';

export default function authMiddleware(handler) {
  return async (req, res) => {
    // Read token from the httpOnly cookie set on login
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      return await handler(req, res);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
  };
}
