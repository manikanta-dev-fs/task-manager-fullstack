const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const { isProd, corsOptions } = require('./src/config/appConfig');
const requestIdMiddleware = require('./src/middleware/requestIdMiddleware');
const requestLoggerMiddleware = require('./src/middleware/requestLoggerMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

if (!process.env.ENCRYPTION_KEY || Buffer.byteLength(process.env.ENCRYPTION_KEY, 'utf8') !== 32) {
  logger.error('ENCRYPTION_KEY must be defined as a 32-byte string');
  process.exit(1);
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: isProd,
  })
);

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(globalLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'task-manager-api',
    requestId: req.id,
  });
});

app.use('/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info({ port: PORT }, 'server started');
    });
  } catch (error) {
    logger.error({ err: error }, 'startup failed');
    process.exit(1);
  }
};

startServer();
