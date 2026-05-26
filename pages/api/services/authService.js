import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRATION || '7d';

/**
 * Authenticate a user by email and password.
 * @returns {string} A signed JWT on success.
 * @throws  {Error} with a `statusCode` property on failure.
 */
export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  return jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Register a new user account.
 * @throws {Error} with statusCode 409 if the email is already taken.
 */
export async function registerUser(email, password) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  return user;
}
