const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.get('/debt', (req, res) => {
  try {
    const reframe = mockData.getDebtReframe(mockData.financialProfile.profile);
    res.json(reframe);
  } catch (error) {
    console.error('Debt reframe error:', error);
    res.json({
      reframed_text: '600.000đ/tháng = 4 ly cà phê/tuần → thoát nợ 50 tháng',
      metaphor: 'Chặng đường marathon: bạn đang ở km số 5',
      progress_context: 'Đã đi được 18% chặng đường',
      weekly_equivalent: 'Mỗi tuần chỉ cần để dành bằng 1 buổi ăn ngoài'
    });
  }
});

router.get('/savings', (req, res) => {
  res.json({
    reframed_text: 'Bạn đã tiết kiệm được 2 triệu đồng!',
    metaphor: 'Bạn đã xây dựng được một bức tường nhỏ bảo vệ tài chính',
    progress_context: 'Bạn đã đi được 18% đến mục tiêu 11 triệu'
  });
});

router.get('/spending/:category', (req, res) => {
  res.json({
    category: req.params.category,
    reframed_text: 'Nếu giảm 500.000đ/tháng, bạn tiết kiệm được 1 tháng học phí mỗi năm'
  });
});

module.exports = router;
