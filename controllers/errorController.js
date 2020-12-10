const AppError = require('../utils/appError');

const handleJWTError = () =>
  new AppError('Invalid token , Please Log In Again', 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const handleJWTexpired = () => new AppError('Your Token has Expired', 401);
const sendErrorProduct = (err, req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTexpired();
    }
    sendErrorProduct(error, req, res);
  }
};
