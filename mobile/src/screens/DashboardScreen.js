import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';
import { AnimatedProgressBar } from '../components';

async function loadAllData() {
  const [userRaw, profileRaw, debtRaw] = await Promise.all([
    AsyncStorage.getItem('userProfile'),
    AsyncStorage.getItem('stressProfile'),
    AsyncStorage.getItem('debtData'),
  ]);
  return {
    user: userRaw ? JSON.parse(userRaw) : null,
    profile: profileRaw ? JSON.parse(profileRaw) : null,
    debt: debtRaw ? JSON.parse(debtRaw) : null,
  };
}

function calcDebtSummary(debt) {
  if (!debt?.debts?.length) return null;

  const debts = debt.debts;

  const totalDebt = debts.reduce((s, d) => s + (d.total || 0), 0);

  const totalMonthly = debts.reduce((s, d) => s + (d.monthly || 0), 0);

  const monthsRemaining =
    totalMonthly > 0
      ? Math.ceil(totalDebt / totalMonthly)
      : 0;

  const percentPaid = Math.min(
    Math.round((totalMonthly / totalDebt) * 100 * 6),
    100
  );

  return {
    totalDebt,
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

function TabBar({ active, onNavigate }) {
  const tabs = [
    { key: 'home', icon: '🏠', label: 'Trang chủ' },
    { key: 'debt', icon: '📊', label: 'Khoản nợ' },
    { key: 'checkin', icon: '🎙️', label: 'Check-in' },
    { key: 'badge', icon: '🏅', label: 'Huy hiệu' },
  ];

  const renderTab = (tab) => {
    const isActive = active === tab.key;

    return (
      <TouchableOpacity
        key={tab.key}
        style={[tabStyles.tab, isActive && tabStyles.tabActive]}
        onPress={() => onNavigate(tab.key)}
        activeOpacity={0.9}
      >
        <Text style={[tabStyles.icon, isActive && tabStyles.iconActive]}>{tab.icon}</Text>
        <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tabStyles.bar}>
      {tabs.map(renderTab)}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 28,
    paddingTop: 10,
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    gap: 3,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  tabActive: {
    backgroundColor: Colors.teal50,
  },
  icon: { fontSize: 22 },
  iconActive: {
    fontSize: 24,
  },
  label: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 11,
    color: Colors.inkLight,
  },
  labelActive: {
    fontFamily: 'BeVietnamPro-SemiBold',
    color: Colors.teal700,
  },
});

function AvoiderDashboard({ user, debtSummary, navigation }) {
  const [mood, setMood] = useState(null);
  const streak = 7;
  const moods = [
    { key: 'calm', emoji: '😌', label: 'Bình yên' },
    { key: 'okay', emoji: '😐', label: 'Bình thường' },
    { key: 'worried', emoji: '😰', label: 'Hơi lo' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greetingSmall}>{getTodayGreeting()},</Text>
          <Text style={styles.greetingName}>{user?.name || 'bạn'} 👋</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileBtnText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View>
          <Text style={styles.streakTitle}>{streak} ngày liên tiếp</Text>
          <Text style={styles.streakSubText}>Bạn đang duy trì thói quen rất tốt</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hôm nay bạn cảm thấy thế nào về tài chính?</Text>
        <View style={styles.moodRow}>
          {moods.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[styles.moodBtn, mood === m.key && styles.moodBtnActive]}
              onPress={() => setMood(m.key)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, mood === m.key && styles.moodLabelActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {mood === 'calm' && (
        <TouchableOpacity
          style={styles.softBtn}
          onPress={() => navigation.navigate('DebtDetail')}
        >
          <Text style={styles.softBtnText}>Tôi sẵn sàng xem thông tin →</Text>
        </TouchableOpacity>
      )}

      {debtSummary && (
        <View style={styles.card}>
          <Text style={styles.goalLabel}>🌱 Debt Reframe</Text>
          <Text
            style={{
              fontFamily: 'BeVietnamPro-Bold',
              fontSize: 20,
              color: Colors.ink,
              lineHeight: 30,
            }}
          >
            Chỉ khoảng{'\n'}
            {debtSummary.totalMonthly.toLocaleString('vi-VN')}đ/tháng
          </Text>
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🎯 Hôm nay</Text>
        <Text style={styles.todoItemDone}>☑ Check-in cảm xúc</Text>
        <Text style={styles.todoItem}>☐ Xem lại khoản nợ</Text>
        <Text style={styles.todoItem}>☐ Cập nhật thanh toán</Text>
      </View>

      <View style={styles.badgeCard}>
        <Text style={styles.sectionTitle}>🏆 Thành tích</Text>
        <Text style={styles.badgeItem}>🥉 Theo dõi đều đặn</Text>
        <Text style={styles.badgeItem}>🥈 10 lần check-in</Text>
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

function WorrierDashboard({ user, debtSummary, navigation }) {
  const percent = debtSummary?.percentPaid ?? 0;
  const months = debtSummary?.monthsRemaining ?? 0;
  const streak = 7;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greetingSmall}>{getTodayGreeting()},</Text>
          <Text style={styles.greetingName}>{user?.name || 'bạn'} 👋</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileBtnText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View>
          <Text style={styles.streakTitle}>{streak} ngày liên tiếp</Text>
          <Text style={styles.streakSubText}>Bạn đang duy trì thói quen rất tốt</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: Colors.teal50, borderColor: Colors.teal100 }]}
        onPress={() => navigation.navigate('DebtDetail')}
        activeOpacity={0.85}
      >
        <Text style={styles.cardLabel}>💳 Tổng nợ</Text>
        {debtSummary && (
          <Text style={styles.bigPercent}>
            {debtSummary.totalDebt.toLocaleString('vi-VN')}đ
          </Text>
        )}
        <AnimatedProgressBar progress={percent} style={styles.progressBar} />
        <Text style={styles.progressSub}>Đã thanh toán {percent}%</Text>
        {months > 0 && (
          <Text style={styles.progressMonths}>Còn khoảng {months} tháng nữa</Text>
        )}
      </TouchableOpacity>

      {debtSummary && (
        <View style={styles.card}>
          <Text style={styles.goalLabel}>🌱 Debt Reframe</Text>
          <Text
            style={{
              fontFamily: 'BeVietnamPro-Bold',
              fontSize: 20,
              color: Colors.ink,
              lineHeight: 30,
            }}
          >
            Chỉ khoảng{'\n'}
            {debtSummary.totalMonthly.toLocaleString('vi-VN')}đ/tháng
          </Text>
          <Text
            style={{
              fontFamily: 'BeVietnamPro-Regular',
              fontSize: 14,
              color: Colors.inkMid,
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            Bạn không cần giải quyết {debtSummary.totalDebt.toLocaleString('vi-VN')}đ hôm nay.
          </Text>
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🎯 Hôm nay</Text>
        <Text style={styles.todoItemDone}>☑ Check-in cảm xúc</Text>
        <Text style={styles.todoItem}>☐ Xem lại khoản nợ</Text>
        <Text style={styles.todoItem}>☐ Cập nhật thanh toán</Text>
      </View>

      <View style={styles.badgeCard}>
        <Text style={styles.sectionTitle}>🏆 Thành tích</Text>
        <Text style={styles.badgeItem}>🥉 Theo dõi đều đặn</Text>
        <Text style={styles.badgeItem}>🥈 10 lần check-in</Text>
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

function OstrichDashboard({ user, debtSummary, navigation }) {
  const streak = 7;
  const rank = 34;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greetingSmall}>{getTodayGreeting()},</Text>
          <Text style={styles.greetingName}>{user?.name || 'bạn'} 👋</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileBtnText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View>
          <Text style={styles.streakTitle}>{streak} ngày liên tiếp</Text>
          <Text style={styles.streakSubText}>Bạn đang duy trì thói quen rất tốt</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.rankLabel}>📈 Bạn đang ở top</Text>
        <Text style={styles.rankPercent}>{rank}%</Text>
        <Text style={styles.rankSub}>người dùng cùng mức nợ đang quản lý tốt hơn</Text>
      </View>

      {debtSummary && (
        <View style={styles.card}>
          <Text style={styles.goalLabel}>🌱 Debt Reframe</Text>
          <Text
            style={{
              fontFamily: 'BeVietnamPro-Bold',
              fontSize: 20,
              color: Colors.ink,
              lineHeight: 30,
            }}
          >
            Chỉ khoảng{'\n'}
            {debtSummary.totalMonthly.toLocaleString('vi-VN')}đ/tháng
          </Text>
        </View>
      )}

      <View style={styles.todoCard}>
        <Text style={styles.sectionTitle}>🎯 Hôm nay</Text>
        <Text style={styles.todoItemDone}>☑ Check-in cảm xúc</Text>
        <Text style={styles.todoItem}>☐ Xem lại khoản nợ</Text>
        <Text style={styles.todoItem}>☐ Cập nhật thanh toán</Text>
      </View>

      <View style={styles.badgeCard}>
        <Text style={styles.sectionTitle}>🏆 Thành tích</Text>
        <Text style={styles.badgeItem}>🥉 Theo dõi đều đặn</Text>
        <Text style={styles.badgeItem}>🥈 10 lần check-in</Text>
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
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    loadAllData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const handleTabNav = (tab) => {
    setActiveTab(tab);
    if (tab === 'debt') navigation.navigate('DebtDetail');
    if (tab === 'checkin') navigation.navigate('CheckIn');
  };

  if (loading) {
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
        <AvoiderDashboard user={user} debtSummary={debtSummary} navigation={navigation} />
      )}
      {profileType === 'worrier' && (
        <WorrierDashboard user={user} debtSummary={debtSummary} navigation={navigation} />
      )}
      {profileType === 'ostrich' && (
        <OstrichDashboard user={user} debtSummary={debtSummary} navigation={navigation} />
      )}

      <TabBar active={activeTab} onNavigate={handleTabNav} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: 20, gap: Spacing.md },

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
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    ...Shadow.card,
  },
  cardTitle: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 17, color: Colors.ink, marginBottom: Spacing.md, lineHeight: 24 },
  cardLabel: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 13, color: Colors.teal700, marginBottom: 4 },

  moodRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  moodBtn: {
    flex: 1, alignItems: 'center', padding: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  moodBtnActive: { borderColor: Colors.teal700, backgroundColor: Colors.teal50 },
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
    backgroundColor: Colors.teal700, paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  debtBannerText: { fontFamily: 'BeVietnamPro-SemiBold', fontSize: 13, color: '#fff' },

  profileBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.teal700,
    justifyContent: 'center', alignItems: 'center',
  },
  profileBtnText: {
    fontFamily: 'BeVietnamPro-Bold', fontSize: 15, color: '#fff',
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
  streakEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  streakTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: Colors.teal700,
  },
  streakSubText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkMid,
  },

  sectionTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 15,
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },

  todoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  todoItem: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.ink,
    marginTop: 10,
  },
  todoItemDone: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.teal700,
    marginTop: 10,
  },

  badgeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  badgeItem: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    color: Colors.ink,
    marginTop: 10,
  },

  quickActions: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.teal50,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.teal100,
  },
  actionBtnText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 13,
    color: Colors.teal700,
  },
});
