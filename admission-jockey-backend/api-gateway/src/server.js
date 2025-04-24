require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

 
const app = express();

const authMiddleware = require('./middlewares/auth.middleware');
const corsMiddleware = require('./middlewares/cors.middleware');
const rateLimitMiddleware = require('./middlewares/rateLimit.middleware');
const loggingMiddleware = require('./middlewares/logging.middleware');

// Use middlewares
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(loggingMiddleware);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const collegeRoutes = require('./routes/college.routes');
const chatRoutes = require('./routes/chat.routes');
const applicationRoutes = require('./routes/application.routes');
const alumniRoutes = require('./routes/alumni.routes');
const calendarRoutes = require('./routes/calendar.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const messageQueueRoutes = require('./routes/messageQueue.routes');

const axios = require('axios');
const serviceDiscovery = require('./services/serviceDiscovery');

// Dynamic proxy middleware
async function proxyRequest(req, res, serviceName) {
  try {
    const instances = await serviceDiscovery.getServiceInstances(serviceName);
    if (instances.length === 0) {
      return res.status(503).json({ message: `${serviceName} service unavailable` });
    }
    // Simple round-robin load balancing
    const instance = instances[Math.floor(Math.random() * instances.length)];
    const targetUrl = `http://${instance.address}:${instance.port}${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: undefined },
      data: req.body,
      validateStatus: () => true,
    });

    res.status(response.status).set(response.headers).send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Register routes with proxy
app.use('/auth', (req, res) => proxyRequest(req, res, 'auth-service'));
app.use('/users', authMiddleware, (req, res) => proxyRequest(req, res, 'user-service'));
app.use('/colleges', (req, res) => proxyRequest(req, res, 'college-service'));
app.use('/chat', (req, res) => proxyRequest(req, res, 'chatbot-gateway'));
app.use('/applications', (req, res) => proxyRequest(req, res, 'application-service'));
app.use('/alumni', (req, res) => proxyRequest(req, res, 'alumni-service'));
app.use('/calendar', (req, res) => proxyRequest(req, res, 'calendar-service'));
app.use('/payments', (req, res) => proxyRequest(req, res, 'payment-service'));
app.use('/notifications', (req, res) => proxyRequest(req, res, 'notification-service'));
app.use('/message-queue', (req, res) => proxyRequest(req, res, 'message-queue'));

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`api-gateway running on port ${PORT}`);
});

module.exports = app;
