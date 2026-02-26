const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

if (!process.env.ENCRYPTION_KEY || Buffer.byteLength(process.env.ENCRYPTION_KEY, 'utf8') !== 32) {
  console.error('ENCRYPTION_KEY must be defined as a 32-byte string');
  process.exit(1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'task-manager-api',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
