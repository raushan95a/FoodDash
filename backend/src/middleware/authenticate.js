const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/token');

function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AppError('Authentication token is required', 401));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (_error) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

module.exports = authenticate;
