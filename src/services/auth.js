import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { sendEmail } from '../utils/sendEmail.js';

const ACCESS_EXPIRES = 15 * 60; // 15 хвилин
const REFRESH_EXPIRES = 30 * 24 * 60 * 60; // 30 днів
const RESET_EXPIRES = 5 * 60; // 5 хвилин

const generateToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

export const registerService = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createHttpError(409, 'Email in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  return user;
};

export const loginService = async ({ email, password }) => {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error('JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not defined');
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = generateToken({ id: user._id }, ACCESS_SECRET, ACCESS_EXPIRES);
  const refreshToken = generateToken({ id: user._id }, REFRESH_SECRET, REFRESH_EXPIRES);

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_EXPIRES * 1000),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_EXPIRES * 1000),
  });

  return { accessToken, refreshToken, session };
};

export const refreshService = async (refreshToken) => {
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

  if (!REFRESH_SECRET || !ACCESS_SECRET) {
    throw new Error('JWT_REFRESH_SECRET or JWT_ACCESS_SECRET is not defined');
  }

  if (!refreshToken) throw createHttpError(401, 'No refresh token');

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    throw createHttpError(403, 'Invalid refresh token');
  }

  const oldSession = await Session.findOneAndDelete({ refreshToken });
  if (!oldSession) throw createHttpError(403, 'Session not found');

  const accessToken = generateToken({ id: payload.id }, ACCESS_SECRET, ACCESS_EXPIRES);
  const newRefreshToken = generateToken({ id: payload.id }, REFRESH_SECRET, REFRESH_EXPIRES);

  const session = await Session.create({
    userId: payload.id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_EXPIRES * 1000),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_EXPIRES * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken, session };
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token');
  await Session.findOneAndDelete({ refreshToken });
};

export const sendResetEmailService = async (email) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const APP_DOMAIN = process.env.APP_DOMAIN;

  console.log('sendResetEmailService JWT_SECRET:', JWT_SECRET);
  console.log('sendResetEmailService APP_DOMAIN:', APP_DOMAIN);

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (!APP_DOMAIN) {
    throw new Error('APP_DOMAIN is not defined');
  }

  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const token = generateToken({ email }, JWT_SECRET, RESET_EXPIRES);
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  const html = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;

  const success = await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });

  if (!success) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};