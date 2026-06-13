import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const QUESTIONS = [
  {
    question: 'Bạn cảm thấy thế nào khi nghĩ về các khoản nợ?',
    options: [
      'Tôi rất lo lắng',
      'Tôi thường tránh nghĩ đến',
      'Tôi không quan tâm lắm',
      'Tôi thấy bình thường',
    ],
  },
  {
    question: 'Bạn kiểm tra tài chính cá nhân bao lâu một lần?',
    options: [
      'Mỗi ngày',
      'Mỗi tuần',
      'Thỉnh thoảng',
      'Gần như không bao giờ',
    ],
  },
  {
    question: 'Khi có hóa đơn mới bạn thường?',
    options: [
      'Kiểm tra ngay',
      'Lo lắng nhiều',
      'Để sau',
      'Quên luôn',
    ],
  },
  {
    question: 'Bạn có kế hoạch trả nợ rõ ràng không?',
    options: [
      'Rất rõ ràng',
      'Có nhưng chưa đều',
      'Mơ hồ',
      'Chưa có',
    ],
  },
  {
    question: 'Điều gì mô tả bạn đúng nhất?',
    options: [
      'Tôi lo lắng quá mức',
      'Tôi thường né tránh',
      'Tôi thiếu động lực',
      'Tôi khá ổn',
    ],
  },
];

function ProgressBar({ current, total }) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressItem,
            index < current && styles.progressActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function AnxietyScanScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));

  const currentQuestion = QUESTIONS[currentIndex];
  const selected = answers[currentIndex];

  const selectAnswer = (option) => {
    const updated = [...answers];
    updated[currentIndex] = option;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex === QUESTIONS.length - 1) {
      navigation.navigate('ScanResult', {
        answers,
      });
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigation.goBack();
      return;
    }

    setCurrentIndex(currentIndex - 1);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Đánh Giá Tâm Lý Tài Chính
          </Text>

          <ProgressBar
            current={currentIndex + 1}
            total={QUESTIONS.length}
          />
        </View>

        <Text style={styles.counter}>
          {currentIndex + 1}/{QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.content}>

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💜 Không có câu trả lời đúng hay sai
          </Text>
        </View>

        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.options.map((option) => {
          const active = selected === option;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                active && styles.optionActive,
              ]}
              onPress={() => selectAnswer(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  active && styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.button,
            !selected && styles.buttonDisabled,
          ]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === QUESTIONS.length - 1
              ? 'Xem Kết Quả'
              : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 20,
    paddingBottom: 20,
  },

  back: {
    fontSize: 24,
    color: Colors.ink,
  },

  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },

  headerTitle: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: Colors.inkMid,
    marginBottom: 10,
  },

  counter: {
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal700,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 6,
  },

  progressItem: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },

  progressActive: {
    backgroundColor: Colors.teal700,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
  },

  tipCard: {
    backgroundColor: Colors.teal50,
    padding: 16,
    borderRadius: Radius.md,
    marginBottom: 24,
  },

  tipText: {
    fontFamily: 'BeVietnamPro-Regular',
    color: Colors.inkMid,
  },

  question: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 22,
    lineHeight: 32,
    color: Colors.ink,
    marginBottom: 24,
  },

  option: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 18,
    marginBottom: 14,
  },

  optionActive: {
    borderColor: Colors.teal700,
    backgroundColor: Colors.teal50,
  },

  optionText: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 15,
    color: Colors.ink,
  },

  optionTextActive: {
    color: Colors.teal700,
  },

  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  button: {
    backgroundColor: Colors.teal700,
    paddingVertical: 16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    ...Shadow.float,
  },

  buttonDisabled: {
    backgroundColor: Colors.border,
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
  },
});