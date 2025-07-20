const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const statusText = statusCode >= 500 ? 'error' : 'fail';

  res.status(statusCode).json({
    status: statusText,    // рядок "error" або "fail"
    code: statusCode,      // числовий HTTP код
    message: err.message || 'Something went wrong',
    data: {},              // пустий об'єкт у відповіді
  });
};

export default errorHandler;