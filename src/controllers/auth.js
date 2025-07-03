import {
  registerService,
  loginService,
  refreshService,
  logoutService,
} from '../services/auth.js';

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

    // Записуємо refreshToken в cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
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