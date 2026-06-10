import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [debtSummary, setDebtSummary] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRaw, profileRaw, debtRaw] = await Promise.all([
          AsyncStorage.getItem('userProfile'),
          AsyncStorage.getItem('stressProfile'),
          AsyncStorage.getItem('debtData'),
        ]);

        const userData = userRaw ? JSON.parse(userRaw) : null;
        const profileData = profileRaw ? JSON.parse(profileRaw) : null;
        const debtData = debtRaw ? JSON.parse(debtRaw) : null;

        setUser(userData);
        setProfile(profileData);

        if (debtData?.debts?.length) {
          const debts = debtData.debts;
          const totalDebt = debts.reduce((s, d) => s + (d.total || 0), 0);
          const totalMonthly = debts.reduce((s, d) => s + (d.monthly || 0), 0);
          setDebtSummary({ totalDebt, totalMonthly });
        }
      } catch (err) {
        console.error("Error loading profile data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất và xóa dữ liệu demo không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.teal700} />
      </View>
    );
  }

  const profileLabel = profile?.profileType === 'avoider' ? 'Người Né Tránh (Avoider)' :
                       profile?.profileType === 'worrier' ? 'Người Lo Lắng (Worrier)' :
                       profile?.profileType === 'ostrich' ? 'Người Trì Hoãn (Ostrich)' : 'Chưa đánh giá';

  const profileEmoji = profile?.profileType === 'avoider' ? '🌱' :
                       profile?.profileType === 'worrier' ? '🌊' :
                       profile?.profileType === 'ostrich' ? '🔥' : '👤';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Người dùng DebtSense'}</Text>
        <Text style={styles.email}>{user?.email || 'user@debtsense.vn'}</Text>
      </View>

      {/* Stress Assessment Profile */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cá nhân hóa của bạn</Text>
        <View style={styles.profileRow}>
          <Text style={styles.profileEmoji}>{profileEmoji}</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileLabel}</Text>
            <Text style={styles.profileDesc}>
              Hành trình thoát nợ của bạn đang được điều chỉnh theo nhóm tâm lý này.
            </Text>
          </View>
        </View>
      </View>

      {/* Debt Summary Statistics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tóm tắt nợ</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {debtSummary ? `${(debtSummary.totalDebt / 1e6).toFixed(1)}M` : '0đ'}
            </Text>
            <Text style={styles.statLabel}>Tổng nợ đang quản lý</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {debtSummary ? `${(debtSummary.totalMonthly / 1e6).toFixed(1)}M` : '0đ'}
            </Text>
            <Text style={styles.statLabel}>Trả mỗi tháng</Text>
          </View>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cài đặt ứng dụng</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>🔔 Nhắc nhở check-in hàng tuần</Text>
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: Colors.border, true: Colors.teal100 }}
            thumbColor={notifEnabled ? Colors.teal700 : '#f4f3f4'}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Thông tin', 'Phiên bản MVP 1.0.0')}>
          <Text style={styles.settingText}>ℹ️ Về ứng dụng DebtSense</Text>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Đăng xuất & Xóa dữ liệu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: Colors.bg,
    flexGrow: 1,
    gap: Spacing.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.teal700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  avatarText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 32,
    color: '#fff',
  },
  name: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 20,
    color: Colors.ink,
  },
  email: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: Colors.inkLight,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  cardTitle: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 15,
    color: Colors.ink,
    marginBottom: Spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileEmoji: {
    fontSize: 36,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 15,
    color: Colors.teal700,
  },
  profileDesc: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: Colors.inkMid,
    marginTop: 4,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 22,
    color: Colors.teal700,
  },
  statLabel: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 12,
    color: Colors.inkMid,
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 14,
    color: Colors.inkMid,
  },
  chevron: {
    fontSize: 18,
    color: Colors.inkLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderColor: '#ff4d4f',
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logoutBtnText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 15,
    color: '#ff4d4f',
  },
});
