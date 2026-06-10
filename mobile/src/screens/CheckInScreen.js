import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { Button } from '../components';

const { width } = Dimensions.get('window');

const QUIZ_STEPS = [
  {
    id: 1,
    question: "Hôm nay bạn có mua món đồ nào nằm ngoài kế hoạch không?",
    options: [
      { id: 'a', text: "Có, mình đã không kìm được 😰", score: 'worried', feedback: "Hoàn toàn bình thường! Khi căng thẳng, việc mua sắm giúp tạo dopamine (hormone hạnh phúc) ngắn hạn. Quan trọng là bạn đã nhận thức được nó. Đừng tự trách mình nhé!" },
      { id: 'b', text: "Một chút xíu, không đáng kể ☕", score: 'okay', feedback: "Những niềm vui nhỏ đôi khi là cần thiết để giữ tinh thần thoải mái. Lần tới, hãy thử ghi khoản này vào 'quỹ linh tinh' nhé." },
      { id: 'c', text: "Không hề, mình tuân thủ 100% 🛡️", score: 'calm', feedback: "Tuyệt vời! Việc nói 'Không' với cám dỗ cần rất nhiều sức mạnh ý chí. Bạn đang kiểm soát bản thân rất tốt." }
    ]
  },
  {
    id: 2,
    question: "Cảm giác của bạn lúc này khi nghĩ về tình hình tài chính?",
    options: [
      { id: 'a', text: "Hơi ngộp thở, thấy áp lực 💭", score: 'worried', feedback: "Cảm giác áp lực chứng tỏ bạn đang rất quan tâm đến tương lai của mình. Hãy nhớ rằng, bạn không cần trả hết nợ trong 1 ngày." },
      { id: 'b', text: "Bình thường, mình đang làm quen 🚶‍♂️", score: 'okay', feedback: "Chấp nhận thực tại là bước khó nhất, và bạn đã vượt qua được nó. Cứ từ từ từng bước một nhé." },
      { id: 'c', text: "Khá ổn, mình có động lực 💪", score: 'calm', feedback: "Năng lượng của bạn đang rất tuyệt. Hãy tận dụng đà này để xem lại chi tiết lộ trình nhé!" }
    ]
  }
];

export default function CheckInScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]); 

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowFeedback(true);
    setAnswers([...answers, option.score]);
  };

  const handleNext = async () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Calculate final mood based on answers
      const worriedCount = answers.filter(a => a === 'worried').length;
      const finalMood = worriedCount > 0 ? 'worried' : (answers.includes('calm') ? 'calm' : 'okay');
      
      const todayStr = new Date().toISOString().split('T')[0];
      
      try {
        const checkInsRaw = await AsyncStorage.getItem('checkIns') || '[]';
        let checkIns = JSON.parse(checkInsRaw);

        let todayIndex = checkIns.findIndex(c => c.date === todayStr);
        let isNewCheckIn = false;
        
        const transcript = "Hoàn thành bài trắc nghiệm hành vi (Noom style).";

        if (todayIndex >= 0) {
          checkIns[todayIndex] = { date: todayStr, mood: finalMood, transcript };
        } else {
          checkIns.push({ date: todayStr, mood: finalMood, transcript });
          isNewCheckIn = true;
        }
        await AsyncStorage.setItem('checkIns', JSON.stringify(checkIns));

        if (isNewCheckIn) {
          const currentRaw = await AsyncStorage.getItem('streak');
          const currentStreak = currentRaw ? parseInt(currentRaw) : 0;
          await AsyncStorage.setItem('streak', (currentStreak + 1).toString());
        }

        const completedTasksRaw = await AsyncStorage.getItem('completedTasks_' + todayStr);
        let completed = completedTasksRaw ? JSON.parse(completedTasksRaw) : { lesson: false, checkin: false, review: false, payment: false };
        completed.checkin = true;
        await AsyncStorage.setItem('completedTasks_' + todayStr, JSON.stringify(completed));

        navigation.goBack();
      } catch(e) {
        console.error(e);
        navigation.goBack();
      }
    }
  };

  const stepData = QUIZ_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${((currentStep + 1) / QUIZ_STEPS.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.questionText}>{stepData.question}</Text>

        {!showFeedback ? (
          <View style={styles.optionsContainer}>
            {stepData.options.map((opt) => (
              <TouchableOpacity 
                key={opt.id} 
                style={styles.optionCard}
                onPress={() => handleSelect(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.feedbackContainer}>
            <View style={styles.selectedOptionCard}>
              <Text style={styles.optionText}>{selectedOption.text}</Text>
            </View>
            <View style={styles.coachBubble}>
              <Text style={styles.coachEmoji}>🧠</Text>
              <Text style={styles.coachText}>{selectedOption.feedback}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {showFeedback && (
        <View style={styles.footer}>
          <Button 
            title={currentStep === QUIZ_STEPS.length - 1 ? "Hoàn tất Check-in" : "Tiếp tục"}
            onPress={handleNext}
            variant="primary"
          />
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  closeBtn: {
    padding: 10,
    marginRight: 10,
  },
  closeBtnText: {
    fontSize: 20,
    color: Colors.inkLight,
    fontFamily: 'BeVietnamPro-Bold',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.teal700,
  },
  scroll: {
    padding: 24,
    paddingTop: 40,
  },
  questionText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 40,
    lineHeight: 34,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  optionText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: Colors.ink,
  },
  feedbackContainer: {
    gap: 20,
  },
  selectedOptionCard: {
    backgroundColor: Colors.teal50,
    padding: 20,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.teal700,
  },
  coachBubble: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    ...Shadow.float,
  },
  coachEmoji: {
    fontSize: 30,
  },
  coachText: {
    flex: 1,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderColor: Colors.border,
  }
});
