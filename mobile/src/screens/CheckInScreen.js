import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { Button } from '../components';

export default function CheckInScreen() {
  const [checked, setChecked] = useState(false);

  const handleCheckIn = async () => {
    const current = await AsyncStorage.getItem('streak');

    const streak = current
      ? parseInt(current)
      : 0;

    const newStreak = streak + 1;

    await AsyncStorage.setItem(
      'streak',
      newStreak.toString()
    );

    setChecked(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In Hàng Tuần</Text>
      <Text style={styles.subtitle}>Hãy nói về cảm xúc tài chính của bạn tuần này</Text>
      
      <View style={styles.micContainer}>
        <TouchableOpacity style={styles.micButton}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
        <Text style={styles.micLabel}>Nhấn để nói</Text>
      </View>

      <Button
        title={checked ? '✓ Đã check-in' : 'Check-in ngay'}
        variant={checked ? 'primary' : 'accent'}
        onPress={handleCheckIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 28,
    color: Colors.teal900,
    marginBottom: Spacing.sm
  },
  subtitle: {
    fontSize: 16,
    color: Colors.inkMid,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    fontFamily: 'BeVietnamPro-Regular'
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.teal700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.float
  },
  micIcon: {
    fontSize: 50
  },
  micLabel: {
    fontSize: 16,
    color: Colors.inkMid,
    fontFamily: 'BeVietnamPro-Regular'
  }
});
