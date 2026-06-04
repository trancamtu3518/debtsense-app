const axios = require('axios');

const VNPT_ENDPOINTS = {
  SMARTBOT:    process.env.VNPT_SMARTBOT_URL,
  SMARTVOICE:  process.env.VNPT_SMARTVOICE_URL,
  EKYC:        process.env.VNPT_EKYC_URL,
  SMARTUX:     process.env.VNPT_SMARTUX_URL,
  SMARTREADER: process.env.VNPT_SMARTREADER_URL
};

const axiosConfig = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
};

async function analyzeAnxietySentiment(userResponse) {
  try {
    const response = await axios.post(VNPT_ENDPOINTS.SMARTBOT, {
      message: userResponse,
      system_prompt: `Bạn là chuyên gia tâm lý tài chính. Phân tích câu trả lời này và trả về JSON:
      {
          "primary_emotion": "fear|anxiety|avoidance|overwhelm|denial|motivation",
          "avoidance_score": 0-10,
          "anxiety_level": "low|medium|high",
          "key_phrases": ["..."]
      }
      Chỉ trả về JSON, không có text khác.`
    }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('VNPT SmartBot API error:', error.message);
    return {
      primary_emotion: 'neutral',
      avoidance_score: 5,
      anxiety_level: 'medium',
      key_phrases: []
    };
  }
}

async function vnptSmartVoiceTTS({ text, voice, speed, language }) {
  try {
    const response = await axios.post(`${VNPT_ENDPOINTS.SMARTVOICE}/tts`, {
      text,
      voice: voice || 'female_warm',
      speed: speed || 0.9,
      language: language || 'vi-VN'
    }, axiosConfig);
    return response.data.audioBase64;
  } catch (error) {
    console.error('VNPT SmartVoice TTS error:', error.message);
    return null;
  }
}

async function vnptSmartVoiceSTT(audioBase64) {
  try {
    const response = await axios.post(`${VNPT_ENDPOINTS.SMARTVOICE}/stt`, {
      audio: audioBase64,
      language: 'vi-VN'
    }, axiosConfig);
    return response.data.text;
  } catch (error) {
    console.error('VNPT SmartVoice STT error:', error.message);
    return null;
  }
}

module.exports = {
  analyzeAnxietySentiment,
  vnptSmartVoiceTTS,
  vnptSmartVoiceSTT
};
