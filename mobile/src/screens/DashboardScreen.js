import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { AnimatedProgressBar } from '../components';
import { getZenLevel, getLevelProgress, addZenXP } from '../services/gamificationService';
import ZenTreeVisual from '../components/ZenTreeVisual';
import XPCelebration from '../components/XPCelebration';

async function loadAllData() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [userRaw, profileRaw, debtRaw, streakRaw, completedTasksRaw, checkInsRaw, zenExpRaw] = await Promise.all([
    AsyncStorage.getItem('userProfile'),
    AsyncStorage.getItem('stressProfile'),
    AsyncStorage.getItem('debtData'),
    AsyncStorage.getItem('streak'),
    AsyncStorage.getItem('completedTasks_' + todayStr),
    AsyncStorage.getItem('checkIns'),
    AsyncStorage.getItem('zenExp'),
  ]);

  const checkIns = checkInsRaw ? JSON.parse(checkInsRaw) : [];
  const todayCheckIn = checkIns.find(c => c.date === todayStr);

  let completed = completedTasksRaw ? JSON.parse(completedTasksRaw) : { lesson: false, checkin: false, review: false, payment: false };
  if (todayCheckIn) {
    completed.checkin = true;
  }

  return {
    user: userRaw ? JSON.parse(userRaw) : null,
    profile: profileRaw ? JSON.parse(profileRaw) : null,
    debt: debtRaw ? JSON.parse(debtRaw) : null,
    streak: streakRaw ? parseInt(streakRaw) : 0,
    completedTasks: completed,
    todayMood: todayCheckIn ? todayCheckIn.mood : null,
    zenExp: zenExpRaw ? parseInt(zenExpRaw, 10) : 0,
  };
}

function calcDebtSummary(debt) {
  if (!debt?.debts?.length) return null;

  const debts = debt.debts;

  const totalDebt = debts.reduce((s, d) => s + (d.total || 0), 0);
  const totalPaid = debts.reduce((s, d) => s + (d.paid || 0), 0);
  const totalMonthly = debts.reduce((s, d) => s + (d.monthly || 0), 0);

  const monthsRemaining =
    totalMonthly > 0
      ? Math.ceil((totalDebt - totalPaid) / totalMonthly)
      : 0;

  const percentPaid = totalDebt > 0
    ? Math.min(Math.round((totalPaid / totalDebt) * 100), 100)
    : 0;

  return {
    totalDebt,
    totalPaid,
    totalMonthly,
    monthsRemaining,
    percentPaid,
    count: debts.length,
  };
}

function getTodayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function ZenTreeHeader({ user, zenExp, showCelebration, celebrationXP }) {
  const zenLevelInfo = getZenLevel(zenExp || 0);
  const progressPercent = getLevelProgress(zenExp || 0);

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 28, color: Colors.ink }}>
            👋 Chào {user?.name || 'bạn'}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, marginTop: 2 }}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <View style={styles.profileBtn}>
          <Text style={styles.profileBtnText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
      </View>

      <View style={[styles.card, { alignItems: 'center', paddingVertical: 28, marginTop: Spacing.md, backgroundColor: Colors.teal50, borderColor: Colors.teal100, overflow: 'hidden' }]}>
        <XPCelebration show={showCelebration} xpGained={celebrationXP} />
        <ZenTreeVisual level={zenLevelInfo.level} xp={zenExp} nextAt={zenLevelInfo.nextAt} />
        <Text style={{ fontFamily: 'BeVietnamPro-Bold', color: Colors.ink, fontSize: 20, marginTop: 8 }}>
          {zenLevelInfo.name}
        </Text>
        <Text style={{ fontFamily: 'BeVietnamPro-Regular', color: Colors.inkMid, fontSize: 14, marginTop: 4 }}>
          {zenExp} XP  •  Level {zenLevelInfo.level}
        </Text>
        <View style={{ width: '75%', marginTop: 16 }}>
          <AnimatedProgressBar progress={progressPercent} />
          <Text style={{ fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkMid, textAlign: 'center', marginTop: 6 }}>
            {progressPercent}% đến cấp tiếp theo
          </Text>
        </View>
      </View>
    </View>
  );
}

function AvoiderDashboard({ user, debtSummary, navigation, completedTasks, onToggleTask, streak, mood, onSelectMood, zenExp, showCelebration, celebrationXP }) {
  const moods = [
    { key: 'calm', emoji: '😌', label: 'Bình yên' },
    { key: 'okay', emoji: '😐', label: 'Bình thường' },
    { key: 'worried', emoji: '😰', label: 'Hơi lo' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ZenTreeHeader user={user} zenExp={zenExp} showCelebration={showCelebration} celebrationXP={celebrationXP} />

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            💡 Góc nhìn mới
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {(debtSummary.totalMonthly/1000000).toFixed(1)} triệu/tháng
          </Text>
        </View>
      )}

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            🌱 Tiến độ
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {debtSummary.percentPaid ?? 0}%
          </Text>
          <AnimatedProgressBar progress={debtSummary.percentPaid ?? 0} style={{ marginTop: 12 }} />
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🗺️ Hành trình hôm nay</Text>

        <TouchableOpacity 
          style={[styles.journeyStep, completedTasks.lesson && styles.journeyStepDone]} 
          onPress={() => navigation.navigate('DailyLesson')}
        >
          <View style={styles.journeyIcon}>
            <Text style={{fontSize: 20}}>{completedTasks.lesson ? '✅' : '🧠'}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={completedTasks.lesson ? styles.journeyTitleDone : styles.journeyTitle}>
              1. Bài học tâm lý (2 phút)
            </Text>
            <Text style={styles.journeySub}>Đừng né tránh con số</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.journeyStep, completedTasks.checkin && styles.journeyStepDone]} 
          onPress={() => navigation.navigate('CheckIn')}
        >
          <View style={styles.journeyIcon}>
            <Text style={{fontSize: 20}}>{completedTasks.checkin ? '✅' : '🎤'}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={completedTasks.checkin ? styles.journeyTitleDone : styles.journeyTitle}>
              2. Check-in hành vi
            </Text>
            <Text style={styles.journeySub}>Ghi nhận tâm lý hôm nay</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.journeyStep, completedTasks.review && styles.journeyStepDone]} 
          onPress={() => {
            onToggleTask('review');
            navigation.navigate('DebtDetail');
          }}
        >
          <View style={styles.journeyIcon}>
            <Text style={{fontSize: 20}}>{completedTasks.review ? '✅' : '💳'}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={completedTasks.review ? styles.journeyTitleDone : styles.journeyTitle}>
              3. Đối mặt con số
            </Text>
            <Text style={styles.journeySub}>Xem lại và cập nhật</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>⚡ Hành động nhanh</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('DebtDetail')}
          >
            <Text style={styles.actionBtnText}>💳 Chi tiết nợ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.actionBtnText}>🎤 Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionBtnText}>👤 Hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function WorrierDashboard({ user, debtSummary, navigation, completedTasks, onToggleTask, streak, mood, onSelectMood, zenExp, showCelebration, celebrationXP }) {
  const percent = debtSummary?.percentPaid ?? 0;
  const months = debtSummary?.monthsRemaining ?? 0;
  const moods = [
    { key: 'calm', emoji: '😌', label: 'Bình yên' },
    { key: 'okay', emoji: '😐', label: 'Bình thường' },
    { key: 'worried', emoji: '😰', label: 'Hơi lo' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ZenTreeHeader user={user} zenExp={zenExp} showCelebration={showCelebration} celebrationXP={celebrationXP} />

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            💡 Góc nhìn mới
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {(debtSummary.totalMonthly/1000000).toFixed(1)} triệu/tháng
          </Text>
        </View>
      )}

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            🌱 Tiến độ
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {debtSummary.percentPaid ?? 0}%
          </Text>
          <AnimatedProgressBar progress={debtSummary.percentPaid ?? 0} style={{ marginTop: 12 }} />
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🎯 Hôm nay</Text>
        <TouchableOpacity style={styles.todoRow} onPress={() => navigation.navigate('CheckIn')}>
          <Text style={completedTasks.checkin ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.checkin ? '☑ Check-in cảm xúc' : '☐ Check-in cảm xúc'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todoRow} onPress={() => {
          onToggleTask('review');
          navigation.navigate('DebtDetail');
        }}>
          <Text style={completedTasks.review ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.review ? '☑ Xem lại khoản nợ' : '☐ Xem lại khoản nợ'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todoRow} onPress={() => {
          onToggleTask('payment');
          navigation.navigate('DebtDetail');
        }}>
          <Text style={completedTasks.payment ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.payment ? '☑ Cập nhật thanh toán' : '☐ Cập nhật thanh toán'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>⚡ Hành động nhanh</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('DebtDetail')}
          >
            <Text style={styles.actionBtnText}>💳 Chi tiết nợ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.actionBtnText}>🎤 Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionBtnText}>👤 Hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function OstrichDashboard({ user, debtSummary, navigation, completedTasks, onToggleTask, streak, mood, onSelectMood, zenExp, showCelebration, celebrationXP }) {
  const moods = [
    { key: 'calm', emoji: '😌', label: 'Bình yên' },
    { key: 'okay', emoji: '😐', label: 'Bình thường' },
    { key: 'worried', emoji: '😰', label: 'Hơi lo' },
  ];

  const percent = debtSummary?.percentPaid ?? 0;
  const rank = percent >= 80 ? 8 : percent >= 50 ? 15 : percent >= 30 ? 25 : percent >= 10 ? 38 : 49;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ZenTreeHeader user={user} zenExp={zenExp} showCelebration={showCelebration} celebrationXP={celebrationXP} />

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            💡 Góc nhìn mới
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {(debtSummary.totalMonthly/1000000).toFixed(1)} triệu/tháng
          </Text>
        </View>
      )}

      {debtSummary && (
        <View style={styles.card}>
          <Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.inkMid }}>
            🌱 Tiến độ
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro-Bold', fontSize: 32, color: Colors.teal700, marginTop: 8 }}>
            {debtSummary.percentPaid ?? 0}%
          </Text>
          <AnimatedProgressBar progress={debtSummary.percentPaid ?? 0} style={{ marginTop: 12 }} />
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🎯 Hôm nay</Text>
        <TouchableOpacity style={styles.todoRow} onPress={() => navigation.navigate('CheckIn')}>
          <Text style={completedTasks.checkin ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.checkin ? '☑ Check-in cảm xúc' : '☐ Check-in cảm xúc'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todoRow} onPress={() => {
          onToggleTask('review');
          navigation.navigate('DebtDetail');
        }}>
          <Text style={completedTasks.review ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.review ? '☑ Xem lại khoản nợ' : '☐ Xem lại khoản nợ'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todoRow} onPress={() => {
          onToggleTask('payment');
          navigation.navigate('DebtDetail');
        }}>
          <Text style={completedTasks.payment ? styles.todoItemDone : styles.todoItem}>
            {completedTasks.payment ? '☑ Cập nhật thanh toán' : '☐ Cập nhật thanh toán'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>⚡ Hành động nhanh</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('DebtDetail')}
          >
            <Text style={styles.actionBtnText}>💳 Chi tiết nợ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.actionBtnText}>🎤 Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionBtnText}>👤 Hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadAllData().then(result => {
        setData(result);
        setLoading(false);
      });
    }, [])
  );

  const handleToggleTask = async (taskKey) => {
    if (!data) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const isCompleted = data.completedTasks[taskKey];
    
    let newXP = data.zenExp;
    if (!isCompleted) {
      newXP = await addZenXP(10);
      setCelebrationXP(10);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }

    const updatedTasks = {
      ...data.completedTasks,
      [taskKey]: !isCompleted,
    };
    await AsyncStorage.setItem('completedTasks_' + todayStr, JSON.stringify(updatedTasks));
    setData(prev => ({
      ...prev,
      completedTasks: updatedTasks,
      zenExp: newXP,
    }));
  };

  const handleSelectMood = async (moodKey) => {
    if (!data) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const checkInsRaw = await AsyncStorage.getItem('checkIns') || '[]';
    let checkIns = JSON.parse(checkInsRaw);

    let todayCheckInIndex = checkIns.findIndex(c => c.date === todayStr);
    let isNewCheckIn = false;
    if (todayCheckInIndex >= 0) {
      checkIns[todayCheckInIndex].mood = moodKey;
    } else {
      checkIns.push({
        date: todayStr,
        mood: moodKey,
        transcript: 'Quick mood selection on dashboard',
      });
      isNewCheckIn = true;
    }

    await AsyncStorage.setItem('checkIns', JSON.stringify(checkIns));

    let newStreak = data.streak;
    let newXP = data.zenExp;
    if (isNewCheckIn) {
      const currentStreakRaw = await AsyncStorage.getItem('streak');
      const currentStreak = currentStreakRaw ? parseInt(currentStreakRaw) : 0;
      newStreak = currentStreak + 1;
      await AsyncStorage.setItem('streak', newStreak.toString());
      newXP = await addZenXP(5);
      setCelebrationXP(5);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }

    const updatedTasks = {
      ...data.completedTasks,
      checkin: true,
    };
    await AsyncStorage.setItem('completedTasks_' + todayStr, JSON.stringify(updatedTasks));

    setData(prev => ({
      ...prev,
      streak: newStreak,
      completedTasks: updatedTasks,
      todayMood: moodKey,
      zenExp: newXP,
    }));
  };

  if (loading || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.teal700} size="large" />
      </View>
    );
  }

  const profileType = data?.profile?.profileType ?? 'worrier';
  const debtSummary = calcDebtSummary(data?.debt);
  const user = data?.user;

  const needsDebtInput = !debtSummary;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      {needsDebtInput && (
        <TouchableOpacity
          style={styles.debtBanner}
          onPress={() => navigation.navigate('DebtInput')}
        >
          <Text style={styles.debtBannerText}>
            📝 Nhập thông tin nợ để xem lộ trình thoát nợ của bạn →
          </Text>
        </TouchableOpacity>
      )}

      {profileType === 'avoider' && (
        <AvoiderDashboard
          user={user}
          debtSummary={debtSummary}
          navigation={navigation}
          completedTasks={data.completedTasks}
          onToggleTask={handleToggleTask}
          streak={data.streak}
          mood={data.todayMood}
          onSelectMood={handleSelectMood}
          zenExp={data.zenExp}
          showCelebration={showCelebration}
          celebrationXP={celebrationXP}
        />
      )}
      {profileType === 'worrier' && (
        <WorrierDashboard
          user={user}
          debtSummary={debtSummary}
          navigation={navigation}
          completedTasks={data.completedTasks}
          onToggleTask={handleToggleTask}
          streak={data.streak}
          mood={data.todayMood}
          onSelectMood={handleSelectMood}
          zenExp={data.zenExp}
          showCelebration={showCelebration}
          celebrationXP={celebrationXP}
        />
      )}
      {profileType === 'ostrich' && (
        <OstrichDashboard
          user={user}
          debtSummary={debtSummary}
          navigation={navigation}
          completedTasks={data.completedTasks}
          onToggleTask={handleToggleTask}
          streak={data.streak}
          mood={data.todayMood}
          onSelectMood={handleSelectMood}
          zenExp={data.zenExp}
          showCelebration={showCelebration}
          celebrationXP={celebrationXP}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 80, paddingBottom: 100, gap: Spacing.md },

  greetingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.sm,
  },
  greetingSmall: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkLight },
  greetingName: { fontFamily: 'BeVietnamPro-Bold', fontSize: 24, color: Colors.ink },
  dateBadge: {
    backgroundColor: Colors.teal100, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  dateText: { fontFamily: 'BeVietnamPro-Medium', fontSize: 12, color: Colors.teal700 },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 251, 241, 0.6)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  cardTitle: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 17, color: Colors.ink, marginBottom: Spacing.md, lineHeight: 24 },
  cardSubtitle: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, lineHeight: 20 },
  cardLabel: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 13, color: Colors.teal700, marginBottom: 4 },

  moodRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  moodBtn: {
    flex: 1, alignItems: 'center', padding: Spacing.md,
    borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(204, 251, 241, 0.8)',
    backgroundColor: 'rgba(240, 253, 250, 0.6)',
  },
  moodBtnActive: { borderColor: Colors.teal700, backgroundColor: '#CCFBF1' },
  moodEmoji: { fontSize: 28, marginBottom: 4 },
  moodLabel: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkMid },
  moodLabelActive: { fontFamily: 'BeVietnamPro-SemiBold', color: Colors.teal700 },
  softBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  softBtnText: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.teal700, textDecorationLine: 'underline' },

  goalLabel: { fontFamily: 'BeVietnamPro-Bold', fontSize: 13, color: Colors.teal700, marginBottom: Spacing.sm },
  goalText: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, lineHeight: 20 },

  bigPercent: { fontFamily: 'BeVietnamPro-Bold', fontSize: 52, color: Colors.teal700, lineHeight: 60 },
  progressBar: { marginVertical: Spacing.sm },
  progressSub: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkLight },
  progressMonths: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 13, color: Colors.teal700, marginTop: 4 },
  tapHint: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: Spacing.md, textAlign: 'right' },
  quoteEmoji: { fontSize: 20, marginBottom: 6 },
  quoteText: { fontFamily: 'BeVietnamPro-Regular', fontSize: 14, color: Colors.inkMid, fontStyle: 'italic', lineHeight: 22 },

  streakNumber: { fontFamily: 'BeVietnamPro-Bold', fontSize: 40, color: Colors.gold },
  streakLabel: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 16, color: Colors.ink, marginTop: 4 },
  streakSub: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkMid, marginTop: 6 },
  rankLabel: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 14, color: Colors.inkMid },
  rankPercent: { fontFamily: 'BeVietnamPro-Bold', fontSize: 44, color: Colors.teal700 },
  rankSub: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkMid },
  challengeBarContainer: { marginTop: Spacing.sm },
  challengeBar: { height: 6 },
  challengeSub: { fontFamily: 'BeVietnamPro-Regular', fontSize: 12, color: Colors.inkLight, marginTop: 4 },

  debtBanner: {
    backgroundColor: Colors.teal700,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: Colors.teal700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  debtBannerText: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 13, color: '#fff', textAlign: 'center' },

  profileBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.teal700,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.teal700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileBtnText: {
    fontFamily: 'BeVietnamPro-Bold', fontSize: 16, color: '#fff',
  },

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.teal50,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.teal100,
  },
  streakEmoji: { fontSize: 32, marginRight: 12 },
  streakTitle: { fontFamily: 'BeVietnamPro-Bold', fontSize: 16, color: Colors.teal700 },
  streakSubText: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkMid },

  sectionTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },

  todoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 251, 241, 0.6)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  todoItem: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.ink,
    marginTop: 12,
    paddingVertical: 4,
  },
  todoItemDone: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.teal700,
    marginTop: 12,
    paddingVertical: 4,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },

  badgeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 251, 241, 0.6)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  badgeItem: { fontFamily: 'BeVietnamPro-Regular', fontSize: 15, color: Colors.ink, marginTop: 10 },

  quickActions: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 251, 241, 0.6)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 13,
    color: Colors.teal700,
  },
  todoRow: {
    paddingVertical: 2,
  },
  moodFeedbackCard: {
    backgroundColor: '#CCFBF1',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  moodFeedbackText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkMid,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204, 251, 241, 0.5)',
  },
  journeyStepDone: { opacity: 0.5 },
  journeyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
  },
  journeyTitle: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15, color: Colors.ink },
  journeyTitleDone: {
    fontFamily: 'BeVietnamPro-SemiBold', fontSize: 15,
    color: Colors.teal700, textDecorationLine: 'line-through',
  },
  journeySub: { fontFamily: 'BeVietnamPro-Regular', fontSize: 13, color: Colors.inkMid, marginTop: 2 },
});