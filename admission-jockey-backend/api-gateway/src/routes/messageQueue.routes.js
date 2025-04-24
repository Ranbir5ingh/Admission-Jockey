const express = require('express');
const router = express.Router();
const messageQueueService = require('../services/messageQueue.service');

// Endpoint to publish event to message queue
router.post('/publish', async (req, res) => {
  const { queue, message } = req.body;
  if (!queue || !message) {
    return res.status(400).json({ error: 'queue and message are required' });
  }
  try {
    await messageQueueService.publishEvent(queue, message);
    res.status(200).json({ message: 'Event published successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish event' });
  }
});

module.exports = router;
