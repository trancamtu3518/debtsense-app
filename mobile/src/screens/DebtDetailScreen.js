import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { AnimatedProgressBar } from '../components';

function formatVND(amount) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function calcMonthsRemaining(total, paid, monthly) {
  if (monthly <= 0) return 0;
  return Math.ceil((total - paid) / monthly);
}

function calcPercentPaid(total, paid) {
  if (total <= 0) return 0;
  return Math.round((paid / total) * 100);
}

function getCoffeeEquivalent(monthly) {
  const coffeePrice = 45000;
  const cups = Math.round(monthly / coffeePrice / 4.3);
  if (cups <= 0) return '1 ly cà phê/tuần';
  return cups + ' ly cà phê/tuần';
}

function getMarathonKm(percentPaid) {
  return Math.round(percentPaid * 0.42);
}

export default function DebtDetailScreen({ navigation }) {
  const [debtData, setDebtData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem('debtData');
      if (raw) {
        setDebtData(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load debt data', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.teal700} size="large" />
      </View>
    );
  }

  if (!debtData || !debtData.debts || debtData.debts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>Chưa có dữ liệu nợ</Text>
        <Text style={styles.emptySubtext}>Hãy nhập thông tin khoản nợ trước nhé</Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => navigation.navigate('DebtInput')}
        >
          <Text style={styles.emptyBtnText}>Nhập Thông Tin Nợ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const debts = debtData.debts;
  const totalDebt = debts.reduce((sum, d) => sum + (d.total || 0), 0);
  const totalMonthly = debts.reduce((sum, d) => sum + (d.monthly || 0), 0);

  const totalPaid = totalDebt * 0.35;

  const percentPaid = calcPercentPaid(totalDebt, totalPaid);
  const monthsRemaining = calcMonthsRemaining(totalDebt, totalPaid, totalMonthly);
  const marathonKm = getMarathonKm(percentPaid);
  const coffeeEquiv = getCoffeeEquivalent(totalMonthly);
  const progressWidth = Math.max(percentPaid, 3) + '%';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22, color: Colors.ink }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Góc nhìn tài chính 💜</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.heroCard, { backgroundColor: Colors.teal50, borderColor: Colors.teal100 }]}>
          <Text style={styles.heroLabel}>Hành trình của bạn</Text>
          <Text style={styles.heroPercent}>{percentPaid}%</Text>
          <AnimatedProgressBar progress={percentPaid} style={styles.progressBar} />
          <Text style={styles.heroSubtext}>
            {percentPaid === 0
              ? 'Bắt đầu hành trình từ hôm nay 🌱'
              : 'Đã đi được ' + percentPaid + '% chặng đường'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            💡 Debt Reframe
          </Text>

          <Text style={styles.cardMain}>
            Bạn không cần giải quyết
            {'\n'}
            {formatVND(totalDebt)}
            {'\n'}
            hôm nay.
          </Text>

          <Text
            style={{
              fontFamily: 'BeVietnamPro-Regular',
              fontSize: 14,
              color: Colors.inkMid,
              marginTop: 10,
              lineHeight: 22,
            }}
          >
            Chỉ cần tập trung khoảng{' '}
            {formatVND(totalMonthly)}
            /tháng.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: Colors.teal50,
              borderColor: Colors.teal100,
            },
          ]}
        >
          <Text style={styles.cardTip}>
            🌱 Khoản nợ là một hành trình,
            không phải một cuộc khủng hoảng.

            {'\n\n'}

            Mỗi tháng bạn trả đúng hạn là một bước tiến.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: Colors.surface }]}>
          <Text style={styles.metaphorText}>
            🌿 Hành trình của bạn:
            bạn đã hoàn thành khoảng {percentPaid}% mục tiêu tài chính hiện tại.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTip}>
            💡 Mỗi tuần chỉ cần để dành bằng {coffeeEquiv.replace('/tuần', '')} là bạn đang đi đúng hướng
          </Text>
        </View>

        {debts.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết từng khoản</Text>
            {debts.map((debt, index) => (
              <View key={debt.id || index} style={styles.debtRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.debtName}>{debt.name || 'Khoản nợ ' + (index + 1)}</Text>
                  {debt.type ? (
                    <Text style={styles.debtType}>{debt.type}</Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.debtMonthly}>{formatVND(debt.monthly || 0)}/tháng</Text>
                  <Text style={styles.debtMonths}>
                    ~{calcMonthsRemaining(debt.total || 0, 0, debt.monthly || 1)} tháng
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, padding: Spacing.xl, gap: Spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontFamily: 'BeVietnamPro-Bold', fontSize: 20, color: Colors.ink },
  emptySubtext: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, textAlign: 'center' },
  emptyBtn: { backgroundColor: Colors.teal700, borderRadius: Radius.pill, paddingHorizontal: 28, paddingVertical: 14, marginTop: Spacing.sm },
  emptyBtnText: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md,
    backgroundColor: Colors.bg,
  },
  headerTitle: { fontFamily: 'BeVietnamPro-Bold', fontSize: 18, color: Colors.ink },

  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 40, gap: Spacing.md },

  heroCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadow.card,
  },
  heroLabel: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkLight, marginBottom: 4 },
  heroPercent: { fontFamily: 'BeVietnamPro-Bold', fontSize: 56, color: Colors.teal700, lineHeight: 64 },
  progressBar: {
    marginVertical: Spacing.sm,
  },
  heroSubtext: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.teal700, textAlign: 'center' },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  cardLabel: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 12, color: Colors.teal700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  cardMain: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 16, color: Colors.ink, lineHeight: 24 },
  metaphorText: { fontFamily: 'BeVietnamPro-Regular', fontSize: 15, color: Colors.inkMid, fontStyle: 'italic', lineHeight: 22 },
  cardTip: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, lineHeight: 20 },

  section: { marginTop: Spacing.sm },
  sectionTitle: { fontFamily: 'BeVietnamPro-Bold', fontSize: 15, color: Colors.ink, marginBottom: Spacing.md },
  debtRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  debtName: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.ink },
  debtType: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: 2 },
  debtMonthly: { fontFamily: 'BeVietnamPro-Bold', fontSize: 14, color: Colors.teal700 },
  debtMonths: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: 2 },
});
