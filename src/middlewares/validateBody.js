import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const message = err.errors ? err.errors.join(', ') : 'Invalid request';
    next(createHttpError(400, message));
  }
};
