import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { sendEmail } from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET;
const APP_DOMAIN = process.env.APP_DOMAIN;

export const registerUser = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, session } = await loginService(req.body);

   
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await refreshService(req.cookies.refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await logoutService(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};


export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;
    const html = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;

    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html,
    });

    if (!emailSent) {
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, 'User not found!');

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};