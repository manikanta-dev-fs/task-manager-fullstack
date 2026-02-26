const logger = require('../config/logger');

const requestLoggerMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  req.log = logger.child({
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
  });

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

    req.log.info(
      {
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
      },
      'request completed'
    );
  });

  next();
};

module.exports = requestLoggerMiddleware;
