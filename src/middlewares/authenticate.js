import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) throw createError(401, 'No token provided');

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid token');
    }

    const user = await User.findById(payload.id);
    if (!user) throw createError(401, 'User not found');

    const session = await Session.findOne({ userId: user._id, accessToken: token });
    if (!session) throw createError(401, 'Invalid or expired token');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
