import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

export default function ActionPlanScreen({ navigation }) {
  const [profile, setProfile] = useState('avoider');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('stressProfile');

    if (!raw) return;

    const data = JSON.parse(raw);

    setProfile(data.profileType);
  };

  const plans = {
    avoider: [
      'Xem lại 1 khoản nợ',
      'Ghi lại cảm xúc',
      'Đọc Debt Reframe',
      'Check-in',
      'Cập nhật khoản trả',
      'Xem tiến độ',
      'Tự thưởng cho bản thân'
    ],

    worrier: [
      'Kiểm tra tài chính 1 lần',
      'Không kiểm tra lại trong ngày',
      'Debt Reframe',
      'Check-in',
      'Ghi nhận tiến bộ',
      'Thư giãn 10 phút',
      'Đánh giá tuần'
    ],

    ostrich: [
      'Mở app',
      'Check-in',
      'Xem Dashboard',
      'Debt Reframe',
      'Cập nhật khoản nợ',
      'Giữ streak',
      'Hoàn thành thử thách'
    ],
  };

  const currentPlan = plans[profile] || plans.avoider;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kế Hoạch Hành Động</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.title}>
        🎯 Kế hoạch 7 ngày
      </Text>

      <Text style={styles.subtitle}>
        Được cá nhân hóa theo hồ sơ tâm lý của bạn
      </Text>

      {currentPlan.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>
              {index + 1}
            </Text>
          </View>

          <Text style={styles.task}>
            {item}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.bg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: 40,
  },

  back: {
    fontSize: 24,
    color: Colors.ink,
  },

  headerTitle: {
    fontSize: 18,
    color: Colors.ink,
    fontFamily: 'BeVietnamPro-Bold',
  },

  title:{
    fontSize:28,
    fontFamily:'BeVietnamPro-Bold',
    color:Colors.teal900,
    marginBottom:8,
  },

  subtitle:{
    color:Colors.inkMid,
    marginBottom:24,
    fontFamily: 'BeVietnamPro-Regular',
  },

  card:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:Colors.surface,
    borderRadius:Radius.lg,
    padding:16,
    marginBottom:12,
    ...Shadow.card,
  },

  dayBadge:{
    width:36,
    height:36,
    borderRadius:18,
    backgroundColor:Colors.teal700,
    justifyContent:'center',
    alignItems:'center',
    marginRight:12,
  },

  dayText:{
    color:'#fff',
    fontFamily:'BeVietnamPro-Bold',
  },

  task:{
    flex:1,
    fontFamily:'BeVietnamPro-Medium',
    color:Colors.ink,
  },
});
