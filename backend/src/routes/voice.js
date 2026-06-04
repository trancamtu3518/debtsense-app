const express = require('express');
const router = express.Router();
const { vnptSmartVoiceSTT, vnptSmartVoiceTTS } = require('../services/vnptApiService');

router.post('/checkin', async (req, res) => {
  try {
    const { audioBase64 } = req.body;
    const text = await vnptSmartVoiceSTT(audioBase64);
    
    const responseText = text ? `Tuyệt vời! Bạn vừa nói: "${text}"` : 'Xin lỗi, tôi không nghe rõ. Bạn có thể nói lại không?';
    const audioResponse = await vnptSmartVoiceTTS({ text: responseText });
    
    res.json({ text, audioResponse });
  } catch (error) {
    res.status(500).json({ error: 'Voice check-in failed' });
  }
});

module.exports = router;
