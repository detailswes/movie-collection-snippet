import dbMiddleware from '../utils/middleware/dbMiddleware';
import { sendSuccess, sendError } from '../lib/response';
import { registerValidationSchema } from '../validation/registerValidation';
import { registerUser } from '../services/authService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed');
  }

  await dbMiddleware(req, res, async () => {
    try {
      const { error, value } = registerValidationSchema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      await registerUser(value.email, value.password);
      return sendSuccess(res, 201, 'Account created successfully');
    } catch (err) {
      if (err.statusCode) {
        return sendError(res, err.statusCode, err.message);
      }
      console.error('Registration error:', err);
      return sendError(res, 500, 'Internal Server Error');
    }
  });
}
