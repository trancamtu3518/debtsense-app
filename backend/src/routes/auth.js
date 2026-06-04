const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register-ekyc', async (req, res) => {
  try {
    const { phone, ekycToken, displayName } = req.body;
    const userId = 'mock-user-id-' + Date.now();
    
    const token = jwt.sign({ userId, phone }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, userId, displayName });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userId = 'mock-user-id-' + phone;
    
    const token = jwt.sign({ userId, phone }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, userId });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh-token', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId, phone: decoded.phone }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
