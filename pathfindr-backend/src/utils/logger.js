const winston = require('winston');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, requestId, stack, ...meta }) => {
  let log = `${timestamp} [${level}]`;
  if (requestId) log += ` [${requestId}]`;
  log += `: ${stack || message}`;
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }
  return log;
});

// JSON format for production (structured logging for log aggregators)
const jsonFormat = printf(({ level, message, timestamp, requestId, stack, ...meta }) => {
  return JSON.stringify({
    timestamp,
    level,
    requestId: requestId || undefined,
    message: stack || message,
    ...meta,
  });
});

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { service: 'pathfindr-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: isProduction
        ? combine(jsonFormat)
        : combine(colorize(), consoleFormat),
    }),
    // File transport for errors (production)
    ...(isProduction
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: jsonFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            format: jsonFormat,
            maxsize: 5242880,
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

module.exports = logger;
