import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useStore from '../store/useStore';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { Card } from '../components';

export default function DebtReframeScreen() {
  const [reframeData, setReframeData] = useState(null);
  const profile = useStore(state => state.profile);

  useEffect(() => {
    setReframeData({
      reframedText: '600.000đ/tháng = 4 ly cà phê/tuần → thoát nợ 50 tháng',
      metaphor: 'Chặng đường marathon: bạn đang ở km số 5',
      progressContext: 'Đã đi được 18% chặng đường',
      weeklyEquivalent: 'Mỗi tuần chỉ cần để dành bằng 1 buổi ăn ngoài'
    });
  }, []);

  if (!reframeData) return null;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Thông tin của bạn</Text>
        <Text style={styles.reframedText}>{reframeData.reframedText}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.metaphor}>{reframeData.metaphor}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.progress}>{reframeData.progressContext}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.weekly}>{reframeData.weeklyEquivalent}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.bg
  },
  card: {
    marginBottom: Spacing.lg
  },
  title: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro-SemiBold',
    color: Colors.teal700,
    marginBottom: Spacing.md
  },
  reframedText: {
    fontSize: 20,
    color: Colors.ink,
    fontFamily: 'BeVietnamPro-SemiBold'
  },
  metaphor: {
    fontSize: 18,
    color: Colors.ink,
    fontStyle: 'italic',
    fontFamily: 'BeVietnamPro-Regular'
  },
  progress: {
    fontSize: 22,
    color: Colors.teal700,
    fontFamily: 'BeVietnamPro-Bold',
    textAlign: 'center'
  },
  weekly: {
    fontSize: 18,
    color: Colors.inkMid,
    textAlign: 'center',
    fontFamily: 'BeVietnamPro-Regular'
  }
});
