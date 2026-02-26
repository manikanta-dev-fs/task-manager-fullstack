const { randomUUID } = require('crypto');

const requestIdMiddleware = (req, res, next) => {
  const incomingRequestId = req.get('x-request-id');
  const requestId = incomingRequestId && incomingRequestId.trim() ? incomingRequestId : randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

module.exports = requestIdMiddleware;
