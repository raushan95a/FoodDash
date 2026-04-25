const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/environment');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const isLocalViteOrigin = env.nodeEnv !== 'production'
      && /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin || '');

    if (!origin || env.corsOrigins.includes(origin) || isLocalViteOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'FoodDash API is running'
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
