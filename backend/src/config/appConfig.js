const isProd = process.env.NODE_ENV === 'production';

const defaultAllowedOrigins = [
  'https://task-manager-fullstack-git-main-manikanta-dev-fs-projects.vercel.app',
  'https://task-manager-fullstack-frl1vb0wv-manikanta-dev-fs-projects.vercel.app',
];

const allowedOrigins = (process.env.CLIENT_URL || defaultAllowedOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  optionsSuccessStatus: 204,
};

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
};

module.exports = {
  isProd,
  allowedOrigins,
  corsOptions,
  cookieOptions,
  clearCookieOptions,
};
