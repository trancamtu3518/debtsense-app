import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const QUESTIONS = [
  "Khi bạn nghĩ đến các khoản nợ hoặc chi phí sắp tới, cảm giác đầu tiên xuất hiện trong đầu bạn là gì?",
  "Lần cuối cùng bạn chủ động kiểm tra số dư tài khoản là khi nào, và bạn cảm thấy thế nào sau đó?",
  "Khi nhận được thông báo từ ngân hàng, phản ứng đầu tiên của bạn thường là gì?",
  "Bạn thường làm gì khi cảm thấy lo lắng về tiền bạc — đối mặt ngay hay để qua hôm sau?",
  "Nếu được thay đổi một điều về cách bạn quản lý tài chính ngay bây giờ, bạn muốn thay đổi điều gì?",
];

// Segment progress bar
function ProgressBar({ current, total }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            backgroundColor: i < current ? Colors.teal700 : Colors.border,
          }}
        />
      ))}
    </View>
  );
}

export default function AnxietyScanScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(5).fill(''));
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentAnswer = answers[currentIndex];
  const isAnswered = currentAnswer.trim().length >= 5;
  const isLast = currentIndex === QUESTIONS.length - 1;

  const animateToNext = (callback) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 30, duration: 0, useNativeDriver: true }),
    ]).start(() => {
      callback();
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('ScanResult', { answers });
    } else {
      animateToNext(() => setCurrentIndex(i => i + 1));
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigation.goBack();
    } else {
      animateToNext(() => setCurrentIndex(i => i - 1));
    }
  };

  const updateAnswer = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = text;
    setAnswers(newAnswers);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={styles.stepLabel}>Đánh Giá Cảm Xúc</Text>
          <View style={{ marginTop: 8 }}>
            <ProgressBar current={currentIndex + 1} total={5} />
          </View>
        </View>
        <Text style={styles.stepCount}>{currentIndex + 1}/5</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{
          opacity: slideAnim.interpolate({
            inputRange: [-30, 0, 30],
            outputRange: [0, 1, 0],
          }),
          transform: [{ translateX: slideAnim }]
        }}>

          {/* Emotion hint */}
          <View style={styles.hintRow}>
            <Text style={styles.hintIcon}>💬</Text>
            <Text style={styles.hintText}>Không có câu trả lời đúng hay sai</Text>
          </View>

          {/* Question card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{QUESTIONS[currentIndex]}</Text>
          </View>

          {/* Answer input */}
          <TextInput
            style={styles.input}
            value={currentAnswer}
            onChangeText={updateAnswer}
            placeholder="Viết câu trả lời của bạn ở đây..."
            placeholderTextColor={Colors.inkLight}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Character nudge */}
          {currentAnswer.length > 0 && currentAnswer.length < 5 && (
            <Text style={styles.nudgeText}>Hãy chia sẻ thêm một chút nhé 🙂</Text>
          )}
        </Animated.View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, !isAnswered && styles.btnDisabled]}
          onPress={handleNext}
          disabled={!isAnswered}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {isLast ? 'Xem Kết Quả' : 'Câu Tiếp Theo →'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bg,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: Colors.ink },
  stepLabel: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: Colors.inkMid,
  },
  stepCount: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 13,
    color: Colors.teal700,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  hintIcon: { fontSize: 16 },
  hintText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkLight,
    fontStyle: 'italic',
  },
  questionCard: {
    backgroundColor: Colors.teal50,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal700,
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 17,
    color: Colors.ink,
    lineHeight: 26,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.ink,
    minHeight: 120,
    lineHeight: 22,
  },
  nudgeText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.teal500,
    marginTop: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  btn: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.float,
  },
  btnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
