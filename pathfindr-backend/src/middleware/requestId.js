const crypto = require('crypto');

/**
 * Middleware that attaches a unique request ID to every incoming request.
 * The ID is available as req.requestId and is sent back in the
 * X-Request-ID response header for correlation in logs.
 */
const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};

module.exports = requestId;
