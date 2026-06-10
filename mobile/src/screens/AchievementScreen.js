import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

export default function AchievementScreen({ navigation }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const value = await AsyncStorage.getItem('streak');

    if (value) {
      setStreak(parseInt(value));
    }
  };

  const achievements = [
    {
      emoji: '🥉',
      title: 'Khoản nợ đầu tiên',
      unlocked: true,
    },
    {
      emoji: '🥈',
      title: 'Check-in đầu tiên',
      unlocked: streak >= 1,
    },
    {
      emoji: '🥇',
      title: '7 ngày liên tiếp',
      unlocked: streak >= 7,
    },
    {
      emoji: '🏆',
      title: '30 ngày liên tiếp',
      unlocked: streak >= 30,
    },
  ];

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
        <Text style={styles.heroEmoji}>
          🔥
        </Text>

        <Text style={styles.heroNumber}>
          {streak}
        </Text>

        <Text style={styles.heroLabel}>
          ngày liên tiếp
        </Text>
      </View>

      {achievements.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            !item.unlocked && styles.locked,
          ]}
        >
          <Text style={styles.emoji}>
            {item.emoji}
          </Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.status}>
              {item.unlocked
                ? 'Đã mở khóa'
                : 'Chưa mở khóa'}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: 40,
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
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 12,
    ...Shadow.card,
  },

  locked: {
    opacity: 0.4,
  },

  emoji: {
    fontSize: 28,
    marginRight: 16,
  },

  title: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: Colors.ink,
  },

  status: {
    marginTop: 4,
    color: Colors.inkLight,
  },
});