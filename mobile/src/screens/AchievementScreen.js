import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

export default function AchievementScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    debtCount: 0,
    checkInCount: 0,
    totalPaidAmount: 0,
    debtsClearedCount: 0
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [streakRaw, checkInsRaw, debtDataRaw] = await Promise.all([
        AsyncStorage.getItem('streak'),
        AsyncStorage.getItem('checkIns'),
        AsyncStorage.getItem('debtData'),
      ]);

      const currentStreak = streakRaw ? parseInt(streakRaw, 10) : 0;
      setStreak(currentStreak);

      const checkIns = checkInsRaw ? JSON.parse(checkInsRaw) : [];
      const checkInCount = checkIns.length;

      const debtData = debtDataRaw ? JSON.parse(debtDataRaw) : null;
      let debtCount = 0;
      let totalPaidAmount = 0;
      let debtsClearedCount = 0;

      if (debtData && debtData.debts) {
        debtCount = debtData.debts.length;
        totalPaidAmount = debtData.debts.reduce((sum, d) => sum + (d.paid || 0), 0);
        debtsClearedCount = debtData.debts.filter(d => (d.paid || 0) >= d.total && d.total > 0).length;
      }

      setStats({
        debtCount,
        checkInCount,
        totalPaidAmount,
        debtsClearedCount
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      emoji: '📋',
      title: 'Chào Sân',
      subtitle: 'Nhập khoản nợ đầu tiên để bắt đầu lộ trình.',
      unlocked: stats.debtCount >= 1,
    },
    {
      emoji: '💜',
      title: 'Dũng Cảm',
      subtitle: 'Thực hiện buổi check-in cảm xúc tài chính đầu tiên.',
      unlocked: stats.checkInCount >= 1,
    },
    {
      emoji: '🔥',
      title: 'Kiên Trì',
      subtitle: 'Đạt streak check-in từ 3 ngày liên tiếp trở lên.',
      unlocked: streak >= 3,
    },
    {
      emoji: '💳',
      title: 'Bắt Đầu Tích Lũy',
      subtitle: 'Thanh toán tích lũy đạt trên 1.000.000đ.',
      unlocked: stats.totalPaidAmount > 1000000,
    },
    {
      emoji: '🏆',
      title: 'Tự Do Tài Chính',
      subtitle: 'Thanh toán sạch sẽ hoàn toàn ít nhất 1 khoản nợ.',
      unlocked: stats.debtsClearedCount >= 1,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal700} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: Spacing.lg,
        paddingBottom: 40,
      }}
    >
      <View style={styles.header}>
        {navigation?.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={styles.headerTitle}>Thành Tích</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔥</Text>
        <Text style={styles.heroNumber}>{streak}</Text>
        <Text style={styles.heroLabel}>ngày check-in liên tiếp</Text>
        
        {/* Simple stats bar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.checkInCount}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{(stats.totalPaidAmount / 1000).toFixed(0)}k</Text>
            <Text style={styles.statLabel}>Đã trả</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.debtsClearedCount}</Text>
            <Text style={styles.statLabel}>Xong nợ</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Huy Hiệu Của Bạn</Text>
      {achievements.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            !item.unlocked && styles.locked,
          ]}
        >
          <View style={[styles.emojiContainer, !item.unlocked && styles.emojiContainerLocked]}>
            <Text style={styles.emoji}>
              {item.unlocked ? item.emoji : '🔒'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.subtitleText}>
              {item.subtitle}
            </Text>
            <Text style={[styles.status, item.unlocked ? styles.statusUnlocked : styles.statusLocked]}>
              {item.unlocked ? '✓ Đã mở khóa' : 'Chưa mở khóa'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: 56,
  },
  back: {
    fontSize: 24,
    color: Colors.ink,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.ink,
    fontFamily: 'BeVietnamPro-Bold',
  },
  hero: {
    backgroundColor: Colors.teal50,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.teal100,
    ...Shadow.card,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroNumber: {
    fontSize: 48,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal700,
  },
  heroLabel: {
    color: Colors.inkMid,
    fontFamily: 'BeVietnamPro-Regular',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: Colors.teal700,
  },
  statLabel: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 11,
    color: Colors.inkLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: Colors.ink,
    marginBottom: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  locked: {
    backgroundColor: '#FAFDFD',
    borderColor: Colors.border,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.teal50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiContainerLocked: {
    backgroundColor: Colors.border,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: Colors.ink,
  },
  subtitleText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkMid,
    marginTop: 2,
    lineHeight: 18,
  },
  status: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'BeVietnamPro-SemiBold',
  },
  statusUnlocked: {
    color: Colors.success,
  },
  statusLocked: {
    color: Colors.inkLight,
  },
});