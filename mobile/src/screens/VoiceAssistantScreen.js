import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { askCoach } from '../services/aiService';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const SUGGESTED_SPEECHES = [
  'Tôi lo lắng về tiền học phí quá 😰',
  'Hôm nay tôi vừa trả được nợ rồi! 😌',
  'Làm sao để tiết kiệm tiền sinh hoạt? ☕',
  'Tôi cảm thấy bế tắc vì nợ nần 🏦'
];

function getLocalCoachResponse(userMessage, profile = 'avoider') {
  const msg = userMessage.toLowerCase();
  
  if (profile === 'avoider') {
    if (msg.includes('lo') || msg.includes('sợ') || msg.includes('lắng') || msg.includes('bế tắc')) {
      return "Mình rất đồng cảm với cảm giác lo lắng của bạn. Khoản nợ lớn có thể gây áp lực cực kỳ ngột ngạt. Hãy nhớ rằng bạn không cần trả hết tất cả hôm nay. Hãy bắt đầu bằng cách uống 1 ly nước ấm, hít thở thật sâu, và hôm nay chỉ cần nhắm mắt lại và chấp nhận cảm xúc này thôi nhé. Từng bước nhỏ thôi 🌱";
    }
    if (msg.includes('bước nhỏ') || msg.includes('tiết kiệm') || msg.includes('sinh hoạt')) {
      return "Đúng vậy, bước đi nhỏ nhất là bước đi quan trọng nhất. Hãy chia nhỏ mọi thứ ra. Hôm nay bạn chỉ cần làm đúng một việc: tích checkbox xem nợ trên trang chủ. Chỉ 30 giây thôi. Ngày mai tính tiếp nhé. Bạn làm được mà!";
    }
    if (msg.includes('trả nợ') || msg.includes('trả được')) {
      return "Chúc mừng bạn nhé! Trả được một ít nợ là một chiến thắng rất lớn rồi. Hãy tự hào về nỗ lực hôm nay của bạn. Tiếp tục duy trì thói quen này nhé!";
    }
    return "Mình luôn ở đây lắng nghe bạn. Quản lý tài chính là hành trình dài, hãy đi từng bước cực nhỏ và yêu thương bản thân nhiều hơn nhé. Hôm nay bạn có muốn chia sẻ thêm điều gì làm bạn áp lực không? 💜";
  }
  
  if (profile === 'worrier') {
    if (msg.includes('quỹ khẩn cấp') || msg.includes('trả hết')) {
      return "Đây là câu hỏi rất phổ biến! Cho hồ sơ Worrier, việc giữ một quỹ khẩn cấp nhỏ (khoảng 1-2 triệu đồng) là cực kỳ quan trọng để bạn thấy an tâm tâm lý trước, sau đó mới dồn tiền trả nợ. Hãy chia tỷ lệ: 70% tiền dư để trả nợ và 30% tích vào quỹ an tâm nhé.";
    }
    if (msg.includes('tổng nợ') || msg.includes('con số') || msg.includes('bế tắc')) {
      return "Con số tổng nợ lớn dễ khiến tâm trí chúng ta bị 'đóng băng'. Lời khuyên cho bạn là hãy tạm ẩn con số tuyệt đối đi. Hãy tập trung nhìn vào thanh tiến trình phần trăm (%) trên Dashboard và ăn mừng từng 1% tăng lên. Bạn đang đi đúng hướng, đừng để con số dọa bạn.";
    }
    if (msg.includes('tiết kiệm') || msg.includes('sinh hoạt')) {
      return "Để tiết kiệm sinh hoạt phí cho Worrier, hãy bắt đầu ghi chép các khoản chi cực nhỏ từ 10k-20k. Khi biết rõ dòng tiền, bạn sẽ cảm thấy an tâm và kiểm soát tốt hơn.";
    }
    return "Bạn đang làm rất tốt và cực kỳ trách nhiệm với tài chính của mình. Đừng lo lắng quá mức nhé, mọi thứ đang tiến triển từng chút một. Tuần này bạn muốn tối ưu thêm khoản chi nhỏ nào không? ☕";
  }
  
  if (profile === 'ostrich') {
    if (msg.includes('tiết kiệm') || msg.includes('sinh hoạt') || msg.includes('nợ')) {
      return "Thử thách tuần này cho bạn: Giữ streak check-in liên tục 3 ngày để mở khóa huy hiệu 'Kiên trì' và tự thưởng cho mình một cốc trà sữa hoặc món ăn yêu thích dưới 50k. Bạn đã hoàn thành check-in hôm nay chưa? Trận chiến đang chờ bạn đó! 🔥";
    }
    return "Chào chiến binh! Đừng trì hoãn nữa, mỗi hành động nhỏ hôm nay là một bước đệm cho tự do tài chính ngày mai. Hãy click ngay vào 'Ghi nhận thanh toán' để tăng tiến độ của bạn nào! 🏆";
  }
  
  return "Chào bạn, mình là DebtSense Coach. Mình sẵn sàng đồng hành cùng bạn để chia sẻ áp lực tài chính và tìm ra giải pháp phù hợp nhất. Bạn cần hỗ trợ gì hôm nay? 🌱";
}

export default function VoiceAssistantScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [profile, setProfile] = useState('avoider');
  const [aiReply, setAiReply] = useState('');
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('stressProfile');
    if (raw) {
      const data = JSON.parse(raw);
      setProfile(data.profileType || 'avoider');
    }
  };

  const handleSpeechInput = async (spokenText) => {
    setLoading(true);
    setAiReply('');
    setTranscript(spokenText);

    setTimeout(async () => {
      try {
        const result = await askCoach(spokenText, profile);
        setAiReply(result.reply);
        setLoading(false);
      } catch (error) {
        console.warn("FastAPI/Gemini connection failed, using offline fallback response:", error);
        const fallbackText = getLocalCoachResponse(spokenText, profile);
        setAiReply(fallbackText);
        setLoading(false);
      }
    }, 1200);
  };

  const fakeListen = async () => {
    setLoading(true);
    setAiReply('');
    setTranscript('');

    setTimeout(async () => {
      const cleanedSpeeches = SUGGESTED_SPEECHES.map(s => s.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim());
      const randomUserText = cleanedSpeeches[Math.floor(Math.random() * cleanedSpeeches.length)];
      setTranscript(randomUserText);
      setLoading(false);

      try {
        setLoading(true);
        const result = await askCoach(randomUserText, profile);
        setAiReply(result.reply);
      } catch (error) {
        console.warn("FastAPI/Gemini connection failed, using offline fallback response:", error);
        const fallbackText = getLocalCoachResponse(randomUserText, profile);
        setAiReply(fallbackText);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const speakResponse = () => {
    const textToSpeak = aiReply || 'Mình hiểu cảm giác đó. Bạn không cần giải quyết toàn bộ khoản nợ hôm nay. Chỉ cần hoàn thành bước tiếp theo.';
    Speech.speak(textToSpeak, { language: 'vi-VN' });
  };

  const handleCustomTextSubmit = () => {
    if (!textInput.trim()) return;
    handleSpeechInput(textInput);
    setTextInput('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {navigation?.canGoBack() && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        🎤 Voice Assistant
      </Text>

      <Text style={styles.subtitle}>
        Nói hoặc gõ về cảm xúc tài chính của bạn
      </Text>

      <TouchableOpacity
        style={[styles.mic, loading && styles.micLoading]}
        onPress={fakeListen}
        disabled={loading}
      >
        <Text style={styles.micIcon}>
          🎙️
        </Text>
      </TouchableOpacity>
      <Text style={styles.micLabel}>{loading ? 'Đang phân tích...' : 'Nhấn mic để giả lập nói'}</Text>

      {/* Suggested Speeches Card */}
      <View style={styles.suggestedSection}>
        <Text style={styles.suggestedTitle}>Chọn câu nói nhanh:</Text>
        <View style={styles.suggestedGrid}>
          {SUGGESTED_SPEECHES.map((speech, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.speechCard}
              onPress={() => {
                const cleaned = speech.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
                handleSpeechInput(cleaned);
              }}
            >
              <Text style={styles.speechText}>{speech}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Text fallback input */}
      <View style={styles.inputSection}>
        <Text style={styles.suggestedTitle}>Hoặc gõ câu hỏi:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Ví dụ: Làm sao giảm lo lắng?"
            placeholderTextColor={Colors.inkLight}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleCustomTextSubmit}>
            <Text style={styles.sendText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.teal700}
          style={{ marginVertical: 16 }}
        />
      )}

      {!!transcript && !loading && (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>
              Bạn vừa nói:
            </Text>

            <Text style={styles.content}>
              "{transcript}"
            </Text>
          </View>

          {!!aiReply && (
            <View style={[styles.card, { backgroundColor: Colors.teal50 }]}>
              <Text style={[styles.label, { color: Colors.teal700 }]}>
                DebtSense AI trả lời:
              </Text>
              <Text style={styles.content}>
                {aiReply}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={speakResponse}
          >
            <Text style={styles.buttonText}>
              Nghe phản hồi AI 🔊
            </Text>
          </TouchableOpacity>
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },

  backText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 15,
    color: Colors.ink,
  },

  title: {
    fontSize: 26,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal900,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: Colors.inkMid,
    fontFamily: 'BeVietnamPro-Regular',
  },

  mic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.teal700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadow.float,
  },
  micLoading: {
    backgroundColor: Colors.teal500,
  },
  micIcon: {
    fontSize: 44,
  },
  micLabel: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 13,
    color: Colors.teal700,
    marginBottom: 24,
  },
  suggestedSection: {
    width: '100%',
    marginBottom: 20,
  },
  suggestedTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  suggestedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speechCard: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  speechText: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 12,
    color: Colors.inkMid,
  },
  inputSection: {
    width: '100%',
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    height: 44,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.sm,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 13,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },

  label: {
    fontFamily: 'BeVietnamPro-Bold',
    marginBottom: 8,
    color: Colors.ink,
  },

  content: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro-Regular',
    color: Colors.inkMid,
    lineHeight: 22,
  },

  button: {
    backgroundColor: Colors.teal700,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    ...Shadow.float,
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Bold',
  }
});