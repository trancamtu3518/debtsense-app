import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

// Format số tiền: 30000000 → "30.000.000"
function formatCurrency(value) {
  const num = value.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseCurrency(formatted) {
  return parseInt(formatted.replace(/\./g, '') || '0', 10);
}

const DEBT_TYPES = ['Vay học phí', 'Thẻ tín dụng', 'Trả góp', 'Vay tiêu dùng', 'Khác'];

function DebtForm({ debt, onChange }) {
  return (
    <View style={formStyles.container}>
      {/* Tên nợ */}
      <View style={formStyles.fieldWrapper}>
        <Text style={formStyles.label}>Tên khoản nợ</Text>
        <TextInput
          style={formStyles.input}
          value={debt.name}
          onChangeText={(v) => onChange({ ...debt, name: v })}
          placeholder="VD: Vay học phí đại học"
          placeholderTextColor={Colors.inkLight}
        />
      </View>

      {/* Tổng nợ */}
      <View style={formStyles.fieldWrapper}>
        <Text style={formStyles.label}>Tổng số tiền nợ (đồng)</Text>
        <View style={formStyles.currencyRow}>
          <TextInput
            style={[formStyles.input, { flex: 1 }]}
            value={debt.totalFormatted}
            onChangeText={(v) => onChange({
              ...debt,
              totalFormatted: formatCurrency(v),
              total: parseCurrency(v),
            })}
            placeholder="0"
            placeholderTextColor={Colors.inkLight}
            keyboardType="numeric"
          />
          <Text style={formStyles.unit}>đ</Text>
        </View>
      </View>

      {/* Trả mỗi tháng */}
      <View style={formStyles.fieldWrapper}>
        <Text style={formStyles.label}>Trả mỗi tháng (đồng)</Text>
        <View style={formStyles.currencyRow}>
          <TextInput
            style={[formStyles.input, { flex: 1 }]}
            value={debt.monthlyFormatted}
            onChangeText={(v) => onChange({
              ...debt,
              monthlyFormatted: formatCurrency(v),
              monthly: parseCurrency(v),
            })}
            placeholder="0"
            placeholderTextColor={Colors.inkLight}
            keyboardType="numeric"
          />
          <Text style={formStyles.unit}>đ/tháng</Text>
        </View>
      </View>

      {/* Loại nợ (optional) */}
      <View style={formStyles.fieldWrapper}>
        <Text style={formStyles.label}>Loại nợ (tùy chọn)</Text>
        <View style={formStyles.typeRow}>
          {DEBT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[formStyles.typeChip, debt.type === type && formStyles.typeChipActive]}
              onPress={() => onChange({ ...debt, type: debt.type === type ? '' : type })}
            >
              <Text style={[formStyles.typeText, debt.type === type && formStyles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  fieldWrapper: { marginBottom: Spacing.lg },
  label: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 13,
    color: Colors.inkLight,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: Colors.ink,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  currencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unit: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkLight,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.teal100,
    borderColor: Colors.teal700,
  },
  typeText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkMid,
  },
  typeTextActive: {
    fontFamily: 'BeVietnamPro-SemiBold',
    color: Colors.teal700,
  },
});

// Empty debt template
const emptyDebt = () => ({
  id: Date.now().toString(),
  name: '', total: 0, totalFormatted: '',
  monthly: 0, monthlyFormatted: '', type: '',
});

export default function DebtInputScreen({ navigation }) {
  const [debts, setDebts] = useState([emptyDebt()]);

  const updateDebt = (index, updated) => {
    const newDebts = [...debts];
    newDebts[index] = updated;
    setDebts(newDebts);
  };

  const addDebt = () => setDebts([...debts, emptyDebt()]);

  const removeDebt = (index) => {
    if (debts.length === 1) return;
    setDebts(debts.filter((_, i) => i !== index));
  };

  const canSubmit = debts.every(d => d.name.trim() && d.total > 0 && d.monthly > 0);

  const handleSubmit = async () => {
    await AsyncStorage.setItem('debtData', JSON.stringify({ debts, savedAt: new Date().toISOString() }));
    navigation.replace('MainTabs');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 22, color: Colors.ink }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Thông Tin Khoản Nợ</Text>
        </View>

        <Text style={styles.intro}>
          Nhập thông tin để DebtSense tính toán lộ trình thoát nợ cá nhân cho bạn.
        </Text>

        {/* Debt forms */}
        {debts.map((debt, index) => (
          <View key={debt.id}>
            {debts.length > 1 && (
              <View style={styles.debtHeader}>
                <Text style={styles.debtLabel}>Khoản nợ {index + 1}</Text>
                <TouchableOpacity onPress={() => removeDebt(index)}>
                  <Text style={styles.removeText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
            <DebtForm debt={debt} onChange={(updated) => updateDebt(index, updated)} />
          </View>
        ))}

        {/* Add more */}
        <TouchableOpacity style={styles.addBtn} onPress={addDebt}>
          <Text style={styles.addBtnText}>+ Thêm khoản nợ khác</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Submit */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, !canSubmit && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Xem Dashboard →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 120, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  title: { fontFamily: 'BeVietnamPro-Bold', fontSize: 20, color: Colors.ink },
  intro: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkMid,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  debtLabel: { fontFamily: 'BeVietnamPro-Bold', fontSize: 14, color: Colors.teal700 },
  removeText: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkLight },
  addBtn: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.teal700,
    borderStyle: 'dashed',
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  addBtnText: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.teal700 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  btn: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.float,
  },
  btnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
