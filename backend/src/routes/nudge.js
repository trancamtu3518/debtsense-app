const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.get('/current', (req, res) => {
  res.json(mockData.currentNudge);
});

router.post('/checkin', (req, res) => {
  res.json({ message: 'Check-in recorded successfully! ✅' });
});

module.exports = router;
