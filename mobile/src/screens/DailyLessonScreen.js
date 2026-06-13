import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';
import { Button } from '../components';

const { width } = Dimensions.get('window');

const LESSON_DATA = [
  {
    id: 1,
    content: "Chào bạn! Hôm nay chúng ta sẽ nói về một tâm lý rất phổ biến: \n\nSự né tránh những con số. 🫣",
    emoji: "🫣",
    type: "intro"
  },
  {
    id: 2,
    content: "Bạn có bao giờ cảm thấy tim đập nhanh khi nhận được tin nhắn từ ngân hàng, và chọn cách... lờ nó đi không?",
    emoji: "🏦",
    type: "insight"
  },
  {
    id: 3,
    content: "Đó là phản ứng 'Fight or Flight' của não bộ. Việc lờ đi giúp bạn giảm lo âu tức thời, nhưng lại tạo ra 'Lãi kép của sự lo lắng' trong dài hạn.",
    emoji: "🧠",
    type: "insight"
  },
  {
    id: 4,
    content: "Thử thách nhỏ hôm nay:\n\nHãy dành đúng 30 giây để nhìn vào con số tổng nợ của bạn. Chỉ nhìn thôi, không đánh giá, không phán xét bản thân.",
    emoji: "🌱",
    type: "action"
  }
];

export default function DailyLessonScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleComplete = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completedTasksRaw = await AsyncStorage.getItem('completedTasks_' + todayStr);
    let completed = completedTasksRaw ? JSON.parse(completedTasksRaw) : { checkin: false, review: false, payment: false, lesson: false };
    completed.lesson = true;
    await AsyncStorage.setItem('completedTasks_' + todayStr, JSON.stringify(completed));
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const nextSlide = () => {
    if (currentIndex < LESSON_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePress = (e) => {
    const x = e.nativeEvent.locationX;
    if (x < width * 0.3) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.touchArea} onPress={handlePress}>
        
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {LESSON_DATA.map((_, index) => (
            <View key={index} style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: index <= currentIndex ? '100%' : '0%' }
                ]} 
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.emoji}>{LESSON_DATA[currentIndex].emoji}</Text>
          <Text style={styles.content}>{LESSON_DATA[currentIndex].content}</Text>
          
          {LESSON_DATA[currentIndex].type === 'action' && (
            <View style={{ marginTop: 40, width: '100%' }}>
              <Button 
                title="Mình sẽ làm thử ngay" 
                onPress={handleComplete} 
                variant="primary" 
              />
            </View>
          )}
        </View>

        </TouchableOpacity>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  touchArea: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 50,
    gap: 6,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'BeVietnamPro-Bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  content: {
    fontSize: 22,
    fontFamily: 'BeVietnamPro-SemiBold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
  },
  hints: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
  }
});
