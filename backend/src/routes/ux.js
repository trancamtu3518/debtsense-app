const express = require('express');
const router = express.Router();

router.post('/event', (req, res) => {
  res.json({ message: 'Behavioral event logged' });
});

router.get('/avoidance-report', (req, res) => {
  res.json({
    detected: false,
    severity: 'low',
    recommended_action: 'Continue with current approach'
  });
});

module.exports = router;
