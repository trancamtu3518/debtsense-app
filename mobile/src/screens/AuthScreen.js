import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, Easing, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

// Floating Label Input Component
function FloatingInput({ label, value, onChangeText, keyboardType = 'default', maxLength }) {
  const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isFocused = useRef(false);

  const handleFocus = () => {
    isFocused.current = true;
    Animated.timing(floatAnim, { toValue: 1, duration: 200, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }).start();
  };

  const handleBlur = () => {
    isFocused.current = false;
    if (!value) {
      Animated.timing(floatAnim, { toValue: 0, duration: 200, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }).start();
    }
  };

  const labelTop = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const labelSize = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] });
  const labelColor = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inkLight, Colors.teal700],
  });

  return (
    <View style={floatStyles.wrapper}>
      <Animated.Text style={[floatStyles.label, {
        top: labelTop, fontSize: labelSize, color: labelColor,
      }]}>
        {label}
      </Animated.Text>
      <TextInput
        style={floatStyles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      <View style={floatStyles.underline} />
    </View>
  );
}

const floatStyles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.xl, position: 'relative', paddingTop: 16 },
  label: { position: 'absolute', left: 0, fontFamily: 'BeVietnamPro-Regular' },
  input: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 18,
    color: Colors.ink,
    paddingBottom: 8,
    paddingTop: 4,
  },
  underline: { height: 1.5, backgroundColor: Colors.border },
});

export default function AuthScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const isValid = name.trim().length >= 2 && phone.trim().length >= 9;

  const handleContinue = async () => {
    await AsyncStorage.setItem('userProfile', JSON.stringify({
      name: name.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    }));
    navigation.navigate('AnxietyScan');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>
            💜
          </Text>

          <Text style={styles.greeting}>
            Chào mừng đến với DebtSense
          </Text>

          <Text style={styles.subheading}>
            Chúng tôi muốn hiểu bạn hơn để cá nhân hóa hành trình tài chính và giúp bạn giảm áp lực từng bước.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FloatingInput
            label="Tên của bạn"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <FloatingInput
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
          />

          {/* Privacy note */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyText}>
              Thông tin của bạn được mã hóa và không chia sẻ với bên thứ ba
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.btn, !isValid && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Tiếp Tục</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 120,
  },
  header: { marginBottom: Spacing.xxl },
  greeting: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 28,
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.inkMid,
    lineHeight: 22,
  },
  form: { flex: 1 },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Spacing.lg,
    backgroundColor: Colors.teal50,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  privacyIcon: { fontSize: 14, marginTop: 1 },
  privacyText: {
    flex: 1,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkMid,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
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
  emoji: {
  fontSize: 42,
  marginBottom: 16,
  },
});
