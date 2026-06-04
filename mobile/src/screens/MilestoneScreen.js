import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { Card } from '../components';

const MILESTONES = [
  { id: 1, title: 'Thanh toán đầu tiên', date: '01/05/2024', achieved: true },
  { id: 2, title: 'Streak 4 tuần', date: '15/05/2024', achieved: true },
  { id: 3, title: 'Đã trả 10% khoản nợ', date: 'Sắp tới', achieved: false },
  { id: 4, title: 'Streak 8 tuần', date: 'Sắp tới', achieved: false }
];

export default function MilestoneScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mốc Điểm Quan Trọng 🎉</Text>
      
      {MILESTONES.map(milestone => (
        <Card 
          key={milestone.id} 
          style={[styles.milestoneCard, milestone.achieved && styles.achieved]}
        >
          <Text style={[styles.milestoneTitle, milestone.achieved && styles.achievedText]}>
            {milestone.achieved ? '✓ ' : '○ '}{milestone.title}
          </Text>
          <Text style={[styles.milestoneDate, milestone.achieved && styles.achievedText]}>
            {milestone.date}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.bg
  },
  title: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 28,
    color: Colors.teal900,
    marginBottom: Spacing.xl,
    textAlign: 'center'
  },
  milestoneCard: {
    marginBottom: Spacing.md
  },
  achieved: {
    backgroundColor: Colors.teal50,
    borderColor: Colors.teal100
  },
  milestoneTitle: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro-SemiBold',
    color: Colors.ink,
    marginBottom: Spacing.sm
  },
  achievedText: {
    color: Colors.teal700
  },
  milestoneDate: {
    fontSize: 14,
    color: Colors.inkMid,
    fontFamily: 'BeVietnamPro-Regular'
  }
});
