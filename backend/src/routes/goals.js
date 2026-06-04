const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.get('/current', (req, res) => {
  res.json(mockData.currentGoal);
});

router.post('/complete', (req, res) => {
  mockData.currentGoal.completed = true;
  res.json({ message: 'Goal completed! Great job! 🎉' });
});

module.exports = router;
