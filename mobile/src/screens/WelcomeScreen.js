import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.content}>
        
        <Text style={styles.logo}>💜</Text>

        <Text style={styles.title}>
          Chào mừng đến với DebtSense
        </Text>

        <Text style={styles.subtitle}>
          Quản lý nợ không chỉ là những con số.
          {'\n'}
          Đó còn là cảm xúc.
        </Text>

        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🌱</Text>

          <Text style={styles.featureTitle}>
            Không phán xét
          </Text>

          <Text style={styles.featureText}>
            DebtSense giúp bạn nhìn rõ tình hình tài chính
            mà không tạo thêm áp lực.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🎯</Text>

          <Text style={styles.featureTitle}>
            Từng bước nhỏ
          </Text>

          <Text style={styles.featureText}>
            Chúng tôi chia các mục tiêu lớn thành
            những hành động dễ thực hiện mỗi ngày.
          </Text>
        </View>

      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.buttonText}>
            Bắt đầu
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Chỉ mất khoảng 3 phút để thiết lập
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'space-between',
  },

  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
  },

  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },

  title: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 30,
    textAlign: 'center',
    color: Colors.ink,
    marginBottom: 16,
  },

  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.inkMid,
    marginBottom: 32,
  },

  featureCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    ...Shadow.float,
  },

  featureEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },

  featureTitle: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 8,
  },

  featureText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.inkMid,
  },

  bottom: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },

  button: {
    backgroundColor: Colors.teal700,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.float,
  },

  buttonText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },

  note: {
    textAlign: 'center',
    marginTop: 12,
    color: Colors.inkLight,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
  },
});