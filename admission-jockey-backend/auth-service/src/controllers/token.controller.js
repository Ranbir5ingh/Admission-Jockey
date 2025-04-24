const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const tokenDoc = await Token.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    const newToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
