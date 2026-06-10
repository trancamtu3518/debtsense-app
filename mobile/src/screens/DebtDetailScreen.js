import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { AnimatedProgressBar } from '../components';

function formatVND(amount) {
  return (amount || 0).toLocaleString('vi-VN') + 'đ';
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
  const [activePaymentDebtId, setActivePaymentDebtId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

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

  const handleRecordPayment = async (debtId) => {
    const rawAmount = paymentAmount.replace(/\D/g, '');
    const amount = parseInt(rawAmount || '0', 10);
    if (amount <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập số tiền thanh toán hợp lệ.');
      return;
    }

    const currentDebt = debtData.debts.find(d => d.id === debtId);
    if (!currentDebt) return;

    const currentPaid = currentDebt.paid || 0;
    const isCleared = currentPaid + amount >= currentDebt.total;

    const updatedDebts = debtData.debts.map(d => {
      if (d.id === debtId) {
        return {
          ...d,
          paid: Math.min(currentPaid + amount, d.total)
        };
      }
      return d;
    });

    const updatedData = {
      ...debtData,
      debts: updatedDebts,
      savedAt: new Date().toISOString()
    };

    try {
      await AsyncStorage.setItem('debtData', JSON.stringify(updatedData));

      // Tick completed task for payment
      const todayStr = new Date().toISOString().split('T')[0];
      const completedTasksRaw = await AsyncStorage.getItem('completedTasks_' + todayStr);
      let completed = completedTasksRaw ? JSON.parse(completedTasksRaw) : { checkin: false, review: false, payment: false };
      completed.payment = true;
      await AsyncStorage.setItem('completedTasks_' + todayStr, JSON.stringify(completed));

      setDebtData(updatedData);
      setActivePaymentDebtId(null);
      setPaymentAmount('');

      if (isCleared) {
        Alert.alert('Chúc mừng! 🏆', `Bạn đã hoàn tất chi trả hoàn toàn khoản nợ "${currentDebt.name}"! Sự kiên trì của bạn thật đáng tự hào.`);
      } else {
        Alert.alert('Thành công! 🎉', `Đã ghi nhận thanh toán ${amount.toLocaleString('vi-VN')}đ cho "${currentDebt.name}".`);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Lỗi', 'Không thể ghi nhận khoản thanh toán.');
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
  const totalPaid = debts.reduce((sum, d) => sum + (d.paid || 0), 0);

  const percentPaid = calcPercentPaid(totalDebt, totalPaid);
  const monthsRemaining = calcMonthsRemaining(totalDebt, totalPaid, totalMonthly);
  const coffeeEquiv = getCoffeeEquivalent(totalMonthly);

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
          <Text style={styles.heroPaidDetail}>
            Đã trả: {formatVND(totalPaid)} / Tổng nợ: {formatVND(totalDebt)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            💡 Debt Reframe
          </Text>

          <Text style={styles.cardMain}>
            Bạn không cần giải quyết
            {'\n'}
            {formatVND(totalDebt - totalPaid)}
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
            🌱 Khoản nợ là một hành trình, không phải một cuộc khủng hoảng.
            {'\n\n'}
            Mỗi tháng bạn trả đúng hạn là một bước tiến mới.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTip}>
            💡 Mỗi tuần chỉ cần để dành khoảng {coffeeEquiv.replace('/tuần', '')} là bạn đang đi đúng hướng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách khoản nợ</Text>
          {debts.map((debt, index) => {
            const isCleared = (debt.paid || 0) >= debt.total;
            const singlePercent = calcPercentPaid(debt.total, debt.paid || 0);

            return (
              <View key={debt.id || index} style={[styles.debtRow, isCleared && styles.debtRowCleared]}>
                <View style={styles.debtMainInfo}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.debtName, isCleared && styles.debtTextStrikethrough]}>
                      {debt.name || 'Khoản nợ ' + (index + 1)}
                    </Text>
                    {debt.type ? (
                      <Text style={styles.debtType}>{debt.type}</Text>
                    ) : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.debtMonthly}>{formatVND(debt.monthly || 0)}/tháng</Text>
                    <Text style={styles.debtMonths}>
                      {isCleared ? 'Đã hoàn thành 🎉' : `Còn ~${calcMonthsRemaining(debt.total || 0, debt.paid || 0, debt.monthly || 1)} tháng`}
                    </Text>
                  </View>
                </View>

                {/* Progress details for each debt */}
                <View style={styles.singleDebtProgressSection}>
                  <View style={styles.singleDebtProgressBarRow}>
                    <AnimatedProgressBar progress={singlePercent} style={styles.singleProgressBar} color={isCleared ? Colors.success : Colors.teal700} />
                    <Text style={styles.singleDebtProgressText}>{singlePercent}%</Text>
                  </View>
                  <Text style={styles.singleDebtProgressDetail}>
                    Đã trả {formatVND(debt.paid || 0)} / {formatVND(debt.total)}
                  </Text>
                </View>

                {/* Inline payment form */}
                {activePaymentDebtId === debt.id ? (
                  <View style={styles.paymentForm}>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="Nhập số tiền trả (đ)"
                      keyboardType="numeric"
                      value={paymentAmount}
                      onChangeText={setPaymentAmount}
                      autoFocus
                    />
                    <View style={styles.paymentBtnRow}>
                      <TouchableOpacity
                        style={[styles.paymentBtn, styles.paymentCancelBtn]}
                        onPress={() => {
                          setActivePaymentDebtId(null);
                          setPaymentAmount('');
                        }}
                      >
                        <Text style={styles.paymentCancelText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.paymentBtn, styles.paymentConfirmBtn]}
                        onPress={() => handleRecordPayment(debt.id)}
                      >
                        <Text style={styles.paymentConfirmText}>Xác nhận</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  !isCleared && (
                    <TouchableOpacity
                      style={styles.recordPaymentBtn}
                      onPress={() => {
                        setActivePaymentDebtId(debt.id);
                        setPaymentAmount('');
                      }}
                    >
                      <Text style={styles.recordPaymentBtnText}>💳 Ghi nhận thanh toán</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            );
          })}
        </View>
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
    paddingHorizontal: Spacing.lg, paddingTop: 72, paddingBottom: Spacing.md,
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
  heroPaidDetail: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkMid, marginTop: 8 },

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
    backgroundColor: Colors.surface,
    borderRadius: Radius.md, 
    padding: Spacing.md,
    borderWidth: 1, 
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  debtRowCleared: {
    borderColor: Colors.teal100,
    backgroundColor: Colors.teal50,
  },
  debtMainInfo: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  debtName: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.ink },
  debtTextStrikethrough: {
    textDecorationLine: 'line-through',
    color: Colors.inkLight,
  },
  debtType: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: 2 },
  debtMonthly: { fontFamily: 'BeVietnamPro-Bold', fontSize: 14, color: Colors.teal700 },
  debtMonths: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: 2 },
  
  singleDebtProgressSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  singleDebtProgressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  singleProgressBar: {
    flex: 1,
  },
  singleDebtProgressText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 12,
    color: Colors.teal700,
  },
  singleDebtProgressDetail: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 11,
    color: Colors.inkLight,
    marginTop: 4,
  },
  recordPaymentBtn: {
    marginTop: 12,
    backgroundColor: Colors.teal50,
    borderColor: Colors.teal100,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  recordPaymentBtnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 12,
    color: Colors.teal700,
  },
  paymentForm: {
    marginTop: 12,
    padding: 8,
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
  },
  paymentInput: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: Colors.ink,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.teal700,
    paddingBottom: 4,
    marginBottom: 8,
  },
  paymentBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  paymentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  paymentCancelBtn: {
    backgroundColor: 'transparent',
  },
  paymentConfirmBtn: {
    backgroundColor: Colors.teal700,
  },
  paymentCancelText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 12,
    color: Colors.inkLight,
  },
  paymentConfirmText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
});
