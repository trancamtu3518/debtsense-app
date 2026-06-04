import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../constants/theme';
import Button from './Button';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>😔</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Button title="Thử lại" onPress={onRetry} style={styles.button} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  message: {
    color: Colors.inkMid,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontFamily: 'BeVietnamPro-Regular',
  },
  button: {
    marginTop: Spacing.md,
  },
});

export default ErrorMessage;
