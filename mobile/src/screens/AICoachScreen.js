import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { askCoach } from '../services/aiService';
import StreamingText from '../components/StreamingText';

const SUGGESTED_QUESTIONS = {
  avoider: [
    'Làm sao để bớt lo lắng về nợ nần? 😰',
    'Có cách nào trả nợ từng bước nhỏ không? 🌱',
    'Mình sợ mở tin nhắn ngân hàng, phải làm sao? 🏦'
  ],
  worrier: [
    'Nên trả hết nợ hay lập quỹ khẩn cấp trước? 💳',
    'Làm sao để ngừng nghĩ về con số tổng nợ? 📈',
    'Cách kiểm soát việc kiểm tra tài khoản liên tục? 🔍'
  ],
  ostrich: [
    'Thử thách streak tiết kiệm tuần này là gì? 🔥',
    'Làm sao để có thêm động lực trả nợ? ⚡',
    'Gợi ý phần thưởng khi hoàn thành kế hoạch? 🏆'
  ]
};

function getLocalCoachResponse(userMessage, profile = 'avoider', debtSummary = null) {
  const msg = userMessage.toLowerCase();
  
  if (debtSummary && debtSummary.totalDebt > 0 && (msg.includes('nợ') || msg.includes('trả') || msg.includes('lo') || msg.includes('tổng') || msg.includes('áp lực'))) {
    const months = debtSummary.monthsRemaining;
    const monthly = (debtSummary.totalMonthly / 1000000).toFixed(1);
    const total = (debtSummary.totalDebt / 1000000).toFixed(1);
    
    if (profile === 'avoider') {
      return `Mình thấy bạn đang quản lý tổng nợ khoảng ${total} triệu. Đừng quá sợ hãi con số này. Nếu mỗi tháng bạn cố gắng duy trì trả ${monthly} triệu, thì chỉ khoảng ${months} tháng nữa là bạn hoàn toàn tự do tài chính rồi! Hãy hít thở sâu, mọi chuyện đang nằm trong tầm kiểm soát. 🌱`;
    }
    if (profile === 'worrier') {
      return `Bạn đang lo lắng về con số ${total} triệu đúng không? Đừng quên rằng bạn đã lên kế hoạch trả ${monthly} triệu/tháng rất chi tiết. Với tiến độ này, chỉ ${months} tháng nữa bạn sẽ dứt điểm được khoản nợ. Hãy tập trung vào % tiến trình tiến lên mỗi ngày thay vì nhìn vào tổng nợ nhé! 💜`;
    }
    if (profile === 'ostrich') {
      return `Nợ ${total} triệu thì đã sao! Thử thách của bạn là kiên trì trả ${monthly} triệu/tháng. Chỉ cần ${months} tháng nữa là bạn sẽ đánh bại hoàn toàn "quái thú" này và thăng cấp. Bắt tay vào hành động thôi! 🔥`;
    }
  }
  
  if (profile === 'avoider') {
    if (msg.includes('lo') || msg.includes('sợ') || msg.includes('lắng')) {
      return "Mình rất đồng cảm với cảm giác lo lắng của bạn. Khoản nợ lớn có thể gây áp lực cực kỳ ngột ngạt. Hãy nhớ rằng bạn không cần trả hết tất cả hôm nay. Hãy bắt đầu bằng cách uống 1 ly nước ấm, hít thở thật sâu, và hôm nay chỉ cần nhắm mắt lại và chấp nhận cảm xúc này thôi nhé. Từng bước nhỏ thôi 🌱";
    }
    if (msg.includes('bước nhỏ') || msg.includes('bắt đầu') || msg.includes('cách nào')) {
      return "Đúng vậy, bước đi nhỏ nhất là bước đi quan trọng nhất. Hãy chia nhỏ mọi thứ ra. Hôm nay bạn chỉ cần làm đúng một việc: tích checkbox xem nợ trên trang chủ. Chỉ 30 giây thôi. Ngày mai tính tiếp nhé. Bạn làm được mà!";
    }
    if (msg.includes('tin nhắn') || msg.includes('ngân hàng') || msg.includes('tránh')) {
      return "Né tránh tin nhắn ngân hàng là phản ứng bảo vệ tâm lý rất tự nhiên khi bạn quá tải. Đừng ép buộc bản thân. Bạn có thể nhờ một người bạn tin tưởng mở giúp, hoặc chỉ mở nó vào lúc tâm trạng bạn thoải mái nhất trong tuần. DebtSense cũng thiết kế Reframe để bạn thấy số tiền quy đổi dễ chịu hơn đó!";
    }
    return "Mình luôn ở đây lắng nghe bạn. Quản lý tài chính là hành trình dài, hãy đi từng bước cực nhỏ và yêu thương bản thân nhiều hơn nhé. Hôm nay bạn có muốn chia sẻ thêm điều gì làm bạn áp lực không? 💜";
  }
  
  if (profile === 'worrier') {
    if (msg.includes('quỹ khẩn cấp') || msg.includes('trả hết')) {
      return "Đây là câu hỏi rất phổ biến! Cho hồ sơ Worrier, việc giữ một quỹ khẩn cấp nhỏ (khoảng 1-2 triệu đồng) là cực kỳ quan trọng để bạn thấy an tâm tâm lý trước, sau đó mới dồn tiền trả nợ. Hãy chia tỷ lệ: 70% tiền dư để trả nợ và 30% tích vào quỹ an tâm nhé.";
    }
    if (msg.includes('tổng nợ') || msg.includes('con số') || msg.includes('ngừng nghĩ')) {
      return "Con số tổng nợ lớn dễ khiến tâm trí chúng ta bị 'đóng băng'. Lời khuyên cho bạn là hãy tạm ẩn con số tuyệt đối đi. Hãy tập trung nhìn vào thanh tiến trình phần trăm (%) trên Dashboard và ăn mừng từng 1% tăng lên. Bạn đang đi đúng hướng, đừng để con số dọa bạn.";
    }
    if (msg.includes('kiểm tra') || msg.includes('tài khoản')) {
      return "Việc kiểm tra tài khoản liên tục là cách tâm trí bạn tìm kiếm sự kiểm soát khi lo lắng, nhưng nó lại vô tình kích hoạt thêm stress. Hãy thử thách bản thân giới hạn chỉ kiểm tra đúng 1 lần vào mỗi sáng thứ Hai. Những ngày còn lại, hãy để app lo giúp bạn.";
    }
    return "Bạn đang làm rất tốt và cực kỳ trách nhiệm với tài chính của mình. Đừng lo lắng quá mức nhé, mọi thứ đang tiến triển từng chút một. Tuần này bạn muốn tối ưu thêm khoản chi nhỏ nào không? ☕";
  }
  
  if (profile === 'ostrich') {
    if (msg.includes('thử thách') || msg.includes('streak')) {
      return "Thử thách tuần này cho bạn: Giữ streak check-in liên tục 3 ngày để mở khóa huy hiệu 'Kiên trì' và tự thưởng cho mình một cốc trà sữa hoặc món ăn yêu thích dưới 50k. Bạn đã hoàn thành check-in hôm nay chưa? Trận chiến đang chờ bạn đó! 🔥";
    }
    if (msg.includes('động lực') || msg.includes('thiếu')) {
      return "Động lực thường đến sau hành động, chứ không phải trước. Hãy tạo thói quen mở app vào lúc 8h tối mỗi ngày như một trò chơi. Khi tích đủ 5 huy hiệu, bạn sẽ thấy mình giỏi hơn 80% người dùng khác. Bắt đầu ngay bằng một hành động nhỏ nhé!";
    }
    if (msg.includes('phần thưởng') || msg.includes('thưởng')) {
      return "Hệ thống phần thưởng rất quan trọng để kích hoạt dopamine! Khi bạn thanh toán xong 10% nợ hoặc đạt 5 ngày streak, hãy thưởng cho mình những thứ không tốn kém nhưng mang lại niềm vui tinh thần, ví dụ: 1 bộ phim hay, 1 buổi tối đi dạo tự do. Cố lên nhé!";
    }
    return "Chào chiến binh! Đừng trì hoãn nữa, mỗi hành động nhỏ hôm nay là một bước đệm cho tự do tài chính ngày mai. Hãy click ngay vào 'Ghi nhận thanh toán' để tăng tiến độ của bạn nào! 🏆";
  }
  
  return "Chào bạn, mình là DebtSense Coach. Mình sẵn sàng đồng hành cùng bạn để chia sẻ áp lực tài chính và tìm ra giải pháp phù hợp nhất. Bạn cần hỗ trợ gì hôm nay? 🌱";
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.delay(300)
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 150);
    const anim3 = animateDot(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View style={[styles.message, styles.aiMessage, { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60, paddingVertical: 14 }]}>
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
}

export default function AICoachScreen() {
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState('avoider');
  const [debtSummary, setDebtSummary] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingIndex, setStreamingIndex] = useState(-1);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào 👋 Mình là DebtSense Coach. Mình sẽ ở đây lắng nghe và phân tích tình hình tài chính giúp bạn. Bạn đang lo lắng điều gì?',
    },
  ]);

  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('stressProfile');
    if (raw) {
      const data = JSON.parse(raw);
      setProfile(data.profileType || 'avoider');
    }
    const debtRaw = await AsyncStorage.getItem('debtData');
    if (debtRaw) {
      const debtData = JSON.parse(debtRaw);
      const debts = debtData.debts || [];
      const totalDebt = debts.reduce((s, d) => s + (d.total || 0), 0);
      const totalPaid = debts.reduce((s, d) => s + (d.paid || 0), 0);
      const totalMonthly = debts.reduce((s, d) => s + (d.monthly || 0), 0);
      const monthsRemaining = totalMonthly > 0 ? Math.ceil((totalDebt - totalPaid) / totalMonthly) : 0;
      setDebtSummary({ totalDebt, totalPaid, totalMonthly, monthsRemaining });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setMessage('');
    setIsTyping(true);
    scrollToBottom();

    setTimeout(async () => {
      try {
        const result = await askCoach(text, profile);
        setMessages(prev => [...prev, { role: 'assistant', text: result.reply }]);
      } catch (error) {
        console.warn("AI backend connection failed, utilizing smart offline fallback service");
        // Get AI response locally with context
        const aiResponse = getLocalCoachResponse(text, profile, debtSummary);
        setMessages(prev => {
          setStreamingIndex(prev.length);
          return [...prev, { role: 'assistant', text: aiResponse }];
        });
      } finally {
        setIsTyping(false);
        scrollToBottom();
      }
    }, 1200);
  };

  const renderItem = ({ item, index }) => {
    const isLastMessage = index === messages.length - 1;
    const isAssistant = item.role === 'assistant';
    const shouldStream = isAssistant && index === streamingIndex;
    
    return (
      <View style={{ marginBottom: isLastMessage ? 20 : 0 }}>
        <View
          style={[
            styles.message,
            item.role === 'user' ? styles.userMessage : styles.aiMessage,
          ]}
        >
          {shouldStream ? (
            <StreamingText
              text={item.text}
              speed={20}
              style={[
                styles.messageText,
                styles.aiMessageText,
              ]}
              onComplete={() => setStreamingIndex(-1)}
            />
          ) : (
            <Text
              style={[
                styles.messageText,
                item.role === 'user' ? styles.userMessageText : styles.aiMessageText,
              ]}
            >
              {item.text}
            </Text>
          )}
        </View>
        
        {/* Render Quick Replies if it's the last message and from assistant */}
        {isLastMessage && isAssistant && !isTyping && (
          <View style={styles.quickRepliesContainer}>
            {chips.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickReplyBtn}
                onPress={() => handleSendMessage(q)}
              >
                <Text style={styles.quickReplyText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const chips = SUGGESTED_QUESTIONS[profile] || SUGGESTED_QUESTIONS.avoider;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🤖 AI Financial Coach</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>{profile.toUpperCase()}</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Hoặc tự gõ câu hỏi của bạn..."
            style={styles.input}
            placeholderTextColor={Colors.inkLight}
            onSubmitEditing={() => handleSendMessage(message)}
          />

          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage(message)}
            disabled={!message.trim()}
          >
            <Text style={{ color: '#fff', fontFamily: 'BeVietnamPro-SemiBold' }}>
              Gửi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 16,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 99, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'BeVietnamPro-Bold',
    color: '#3730A3',
    letterSpacing: -0.5,
  },
  profileBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  profileBadgeText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 10,
    color: '#6C63FF',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 20,
  },
  message: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    maxWidth: '82%',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: '#6C63FF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
  },
  aiMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.15)',
  },
  messageText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: Colors.ink,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#A78BFA',
  },
  quickRepliesContainer: {
    marginTop: 10,
    gap: 8,
    paddingLeft: 4,
  },
  quickReplyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(108, 99, 255, 0.3)',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickReplyText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: '#6C63FF',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 24 : 100,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(108, 99, 255, 0.1)',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(108, 99, 255, 0.15)',
    borderRadius: 22,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    height: 50,
    color: Colors.ink,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 22,
    justifyContent: 'center',
    borderRadius: 22,
    height: 50,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  sendBtnDisabled: {
    backgroundColor: '#DDD6FE',
    shadowOpacity: 0,
    elevation: 0,
  },
});