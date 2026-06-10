import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

function formatMoney(number) {
  return number.toLocaleString('vi-VN') + 'đ';
}

export default function DebtReframeScreen({ navigation }) {
  const [debt, setDebt] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const raw = await AsyncStorage.getItem('debtData');

    if (!raw) return;

    const data = JSON.parse(raw);

    const total = data.debts.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setDebt(total);
  };

  const monthly = Math.round(debt / 36);
  const daily = Math.round(monthly / 30);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Debt Reframe</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.title}>
        💡 Debt Reframe
      </Text>

      <Text style={styles.subtitle}>
        Hãy nhìn khoản nợ theo một góc nhìn nhẹ nhàng hơn
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Tổng khoản nợ hiện tại
        </Text>

        <Text style={styles.bigNumber}>
          {formatMoney(debt)}
        </Text>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>
          🤖 DebtSense AI
        </Text>

        <Text style={styles.aiText}>
          Khoản nợ này tương đương khoảng:
        </Text>

        <Text style={styles.highlight}>
          {formatMoney(monthly)}/tháng
        </Text>

        <Text style={styles.highlight}>
          {formatMoney(daily)}/ngày
        </Text>

        <Text style={styles.message}>
          Bạn không cần giải quyết toàn bộ khoản nợ hôm nay.
        </Text>

        <Text style={styles.message}>
          Chỉ cần hoàn thành bước tiếp theo.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>
          Tôi đã hiểu 👍
        </Text>
      </TouchableOpacity>
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
    paddingTop: 60,
    marginBottom: Spacing.lg,
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

  title: {
    fontSize: 28,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal900,
  },

  subtitle: {
    marginTop: 8,
    color: Colors.inkMid,
    marginBottom: 24,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },

  label: {
    color: Colors.inkLight,
    marginBottom: 8,
  },

  bigNumber: {
    fontSize: 32,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal700,
  },

  aiCard: {
    backgroundColor: Colors.teal50,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },

  aiTitle: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro-Bold',
    marginBottom: 12,
  },

  aiText: {
    marginBottom: 12,
    color: Colors.ink,
  },

  highlight: {
    fontSize: 24,
    fontFamily: 'BeVietnamPro-Bold',
    color: Colors.teal700,
    marginBottom: 8,
  },

  message: {
    marginTop: 12,
    lineHeight: 22,
    color: Colors.inkMid,
  },

  button: {
    marginTop: 24,
    backgroundColor: Colors.teal700,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-SemiBold',
  },
});
