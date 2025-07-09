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

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie('sessionId', session._id.toString(), {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
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
    const { accessToken, refreshToken, session } = await refreshService(
      req.cookies.refreshToken
    );

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .cookie('sessionId', session._id.toString(), {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
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
    const { refreshToken, sessionId } = req.cookies;
    await logoutService(refreshToken, sessionId);
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
