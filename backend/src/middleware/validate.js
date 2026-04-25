const AppError = require('../utils/AppError');

function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((item) => item.message);
      return next(new AppError('Validation failed', 400, details));
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
