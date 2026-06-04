const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

const ANXIETY_SCAN_QUESTIONS = [
  "Khi bạn nghĩ đến các khoản nợ hoặc chi phí sắp tới, cảm giác đầu tiên xuất hiện trong đầu bạn là gì?",
  "Lần cuối cùng bạn chủ động kiểm tra số dư tài khoản là khi nào, và bạn cảm thấy thế nào sau đó?",
  "Khi nhận được thông báo từ ngân hàng, phản ứng đầu tiên của bạn thường là gì?",
  "Bạn thường làm gì khi cảm thấy lo lắng về tiền bạc — đối mặt ngay hay để qua hôm sau?",
  "Nếu được thay đổi một điều về cách bạn quản lý tài chính ngay bây giờ, bạn muốn thay đổi điều gì?"
];

router.get('/questions', (req, res) => {
  res.json({ questions: ANXIETY_SCAN_QUESTIONS });
});

router.post('/submit', (req, res) => {
  try {
    const { responses } = req.body;
    
    // Simple rule-based classification for demo
    let profile = 'avoider';
    let confidence = 0.85;
    const text = responses.map(r => r.text).join(' ').toLowerCase();
    
    if (text.includes('lo') || text.includes('sợ') || text.includes('áp lực')) {
      profile = 'worrier';
    } else if (text.includes('thôi') || text.includes('không quan tâm') || text.includes('để sau')) {
      profile = 'ostrich';
    }
    
    const recommendations = {
      avoider: ['Bắt đầu với các bước cực nhỏ', 'Không cần xem số tiền tuyệt đối', 'Chỉ tập trung vào cảm xúc của bạn'],
      worrier: ['Tập trung vào tiến độ thay vì số tiền', 'Thử bài tập thở khi lo lắng', 'Đặt mục tiêu nhỏ mỗi tuần'],
      ostrich: ['Thử thách streak hàng tuần với phần thưởng', 'Tham gia bảng xếp hạng', 'Thu thập huy hiệu'],
    };
    
    mockData.financialProfile.profile = profile;
    
    res.json({
      profile,
      confidence,
      recommendations: recommendations[profile],
    });
  } catch (error) {
    console.error('Scan submit error:', error);
    res.status(500).json({ 
      profile: 'avoider', 
      confidence: 0.85, 
      recommendations: ['Bắt đầu với các bước nhỏ'] 
    });
  }
});

router.get('/profile', (req, res) => {
  res.json(mockData.financialProfile);
});

module.exports = router;
