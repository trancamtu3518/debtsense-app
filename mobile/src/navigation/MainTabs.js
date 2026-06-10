import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import VoiceAssistantScreen from '../screens/VoiceAssistantScreen';
import AICoachScreen from '../screens/AICoachScreen';
import AchievementScreen from '../screens/AchievementScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_DETAILS = {
  Home: { label: 'Trang chủ', emoji: '🏠' },
  Debt: { label: 'Khoản nợ', emoji: '💳' },
  Voice: { label: 'Trợ lý AI', emoji: '🎤' },
  Coach: { label: 'AI Coach', emoji: '🤖' },
  Achievement: { label: 'Thành tích', emoji: '🏆' },
  Profile: { label: 'Hồ sơ', emoji: '👤' },
};

function CustomTopTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const detail = TAB_DETAILS[route.name] || { label: route.name, emoji: '📌' };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{detail.emoji}</Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {detail.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTopTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
      />
      <Tab.Screen
        name="Debt"
        component={DebtDetailScreen}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceAssistantScreen}
      />
      <Tab.Screen
        name="Coach"
        component={AICoachScreen}
      />
      <Tab.Screen
        name="Achievement"
        component={AchievementScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 99, 255, 0.1)',
    zIndex: 1000,
    elevation: 8,
    justifyContent: 'center',
    // Frosted glass effect for web
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.12)',
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 13,
    color: '#64748B',
  },
  tabLabelActive: {
    fontFamily: 'BeVietnamPro-Bold',
    color: '#6C63FF',
  },
});
