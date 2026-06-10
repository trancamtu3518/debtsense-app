import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

// HARDCODE cho MVP — sau này thay bằng API call
function mockAnalyzeProfile(answers) {
  const combined = answers.join(' ').toLowerCase();
  if (combined.includes('sợ') || combined.includes('né') || combined.includes('tránh')) return 'avoider';
  if (combined.includes('lo') || combined.includes('liên tục') || combined.includes('kiểm tra')) return 'worrier';
  return 'ostrich';
}

const PROFILE_DATA = {
  avoider: {
    emoji: '🌱',
    title: 'Người Né Tránh',
    subtitle: 'Avoider',
    description: 'Bạn biết mình cần nhìn vào tài chính, nhưng cảm giác overwhelmed khiến bạn trì hoãn. Điều đó hoàn toàn bình thường.',
    approach: 'DebtSense sẽ không ép bạn nhìn số. Mình sẽ hỏi cảm xúc trước, từng bước nhỏ thôi.',
    accentColor: Colors.teal700,
    bgColor: Colors.teal50,
  },
  worrier: {
    emoji: '🌊',
    title: 'Người Lo Lắng',
    subtitle: 'Worrier',
    description: 'Bạn quan tâm đến tài chính — có lẽ hơi quá mức. Kiểm tra số dư nhiều lần nhưng vẫn thấy bất an.',
    approach: 'DebtSense sẽ hiển thị tiến độ bằng % và cột mốc nhỏ — không bao giờ là con số tuyệt đối đáng sợ.',
    accentColor: Colors.gold,
    bgColor: Colors.goldLight,
  },
  ostrich: {
    emoji: '🔥',
    title: 'Người Trì Hoãn',
    subtitle: 'Ostrich',
    description: 'Bạn biết phải làm gì, chỉ là... chưa làm thôi. Thiếu động lực hơn là thiếu kiến thức.',
    approach: 'DebtSense sẽ biến việc quản lý nợ thành game — streak, badge, và cảm giác chiến thắng mỗi tuần.',
    accentColor: Colors.teal900,
    bgColor: Colors.teal100,
  },
};

export default function ScanResultScreen({ route, navigation }) {
  const { answers } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [dotCount, setDotCount] = useState(1);
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount(d => d === 3 ? 1 : d + 1);
    }, 500);

    setTimeout(async () => {
      clearInterval(dotInterval);
      const result = mockAnalyzeProfile(answers);
      setProfile(result);
      await AsyncStorage.setItem('stressProfile', JSON.stringify({
        profileType: result,
        determinedAt: new Date().toISOString(),
      }));
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 3000);

    return () => clearInterval(dotInterval);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🧠</Text>
        <Text style={styles.loadingText}>
          Đang phân tích cảm xúc của bạn{'.'.repeat(dotCount)}
        </Text>
        <Text style={styles.loadingSubtext}>Mình đang lắng nghe từng từ bạn viết</Text>
      </View>
    );
  }

  const data = PROFILE_DATA[profile];

  return (
    <View style={[styles.container, { backgroundColor: data.bgColor }]}>
      <Animated.View style={[styles.card, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }]}>
        <View style={[styles.iconCircle, { backgroundColor: data.accentColor + '20' }]}>
          <Text style={{ fontSize: 52 }}>{data.emoji}</Text>
        </View>

        <View style={[styles.profileBadge, { backgroundColor: data.accentColor }]}>
          <Text style={styles.profileBadgeText}>{data.subtitle}</Text>
        </View>

        <Text style={styles.profileTitle}>{data.title}</Text>
        <Text style={styles.description}>{data.description}</Text>

        <View style={styles.divider} />

        <View style={styles.approachRow}>
          <Text style={styles.approachIcon}>💡</Text>
          <Text style={styles.approachText}>{data.approach}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: data.accentColor }]}
          onPress={() => navigation.navigate('DebtInput')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Nhập Thông Tin Nợ →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.skipText}>Bỏ qua, xem Dashboard trước</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  loadingEmoji: { fontSize: 48 },
  loadingText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 18,
    color: Colors.ink,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkLight,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg + 8,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.float,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  profileBadgeText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 12,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  profileTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 26,
    color: Colors.ink,
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.inkMid,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 48,
    height: 1.5,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  approachRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  approachIcon: { fontSize: 16, marginTop: 1 },
  approachText: {
    flex: 1,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkMid,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  btn: {
    width: '100%',
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  btnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  skipText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkLight,
    textDecorationLine: 'underline',
  },
});
