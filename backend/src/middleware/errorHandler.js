const env = require('../config/environment');

function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message
  };

  if (error.details) {
    response.details = error.details;
  }

  if (env.nodeEnv !== 'production') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFound,
  errorHandler
};
