const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  req.log?.error(
    {
      err,
      statusCode,
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
    },
    'request failed'
  );

  const errorResponse = {
    success: false,
    message: err.message || 'Server Error',
    requestId: req.id,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  notFound,
  errorHandler,
};
