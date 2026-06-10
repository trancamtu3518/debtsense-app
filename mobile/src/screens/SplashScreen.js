import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative circle — góc trên phải */}
      <View style={styles.decorCircle} />

      {/* Top — logo nhỏ */}
      <View style={styles.topSection}>
        <View style={styles.logoChip}>
          <Text style={styles.logoChipText}>DS</Text>
        </View>
      </View>

      {/* Center — main content */}
      <Animated.View style={[styles.centerSection, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }]}>
        {/* Icon minh họa */}
        <View style={styles.iconWrapper}>
          <Text style={{ fontSize: 56 }}>🌱</Text>
        </View>

        <Text style={styles.title}>DebtSense</Text>
        <Text style={styles.subtitle}>
          Người bạn tài chính hiểu cảm xúc của bạn — không chỉ con số
        </Text>

        {/* 3 feature pills */}
        <View style={styles.pillRow}>
          {['Không phán xét', 'Đồng hành', 'Cá nhân hóa'].map((text) => (
            <View key={text} style={styles.pill}>
              <Text style={styles.pillText}>{text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Bottom — CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Welcome')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Bắt Đầu Hành Trình</Text>
        </TouchableOpacity>
        <Text style={styles.bottomNote}>Chỉ mất 3 phút để thiết lập</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  decorCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.teal100,
    top: -80,
    right: -80,
    opacity: 0.5,
  },
  topSection: {
    alignItems: 'flex-start',
  },
  logoChip: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoChipText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 14,
    color: '#fff',
    letterSpacing: 1,
  },
  centerSection: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.teal50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.teal100,
  },
  title: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 40,
    color: Colors.teal900,
    letterSpacing: -1,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: Colors.inkMid,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: Colors.teal100,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 13,
    color: Colors.teal700,
  },
  bottomSection: {
    gap: 12,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    ...Shadow.float,
  },
  btnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  bottomNote: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkLight,
  },
});
