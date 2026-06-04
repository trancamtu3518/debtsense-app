const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.get('/all', (req, res) => {
  res.json({ milestones: mockData.milestones });
});

router.get('/next', (req, res) => {
  const nextMilestone = mockData.milestones.find(m => !m.achievedAt);
  res.json({
    milestone: {
      ...nextMilestone,
      description: 'Đã trả 10% khoản nợ',
      progress: 85
    }
  });
});

module.exports = router;
