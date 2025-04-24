const logger = require('../logger'); // We will create a logger.js to export the Winston logger

const loggingMiddleware = (req, res, next) => {
  logger.info('Incoming request: ' + req.method + ' ' + req.url);
  next();
};

module.exports = loggingMiddleware;
