const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const tokenController = require('../controllers/token.controller');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Refresh authentication token
router.post('/refresh-token', tokenController.refreshToken);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;
