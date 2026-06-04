const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.get('/profile', (req, res) => {
  res.json(mockData.currentUser);
});

module.exports = router;
