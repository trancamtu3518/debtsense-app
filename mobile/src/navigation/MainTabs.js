import React from 'react';
import { Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import VoiceAssistantScreen from '../screens/VoiceAssistantScreen';
import AICoachScreen from '../screens/AICoachScreen';
import AchievementScreen from '../screens/AchievementScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="Debt"
        component={DebtDetailScreen}
        options={{
          tabBarLabel: 'Nợ',
          tabBarIcon: () => <Text>💳</Text>,
        }}
      />

      <Tab.Screen
        name="Voice"
        component={VoiceAssistantScreen}
        options={{
          tabBarLabel: 'AI',
          tabBarIcon: () => <Text>🎤</Text>,
        }}
      />

      <Tab.Screen
        name="Coach"
        component={AICoachScreen}
        options={{
          tabBarLabel: 'Coach',
          tabBarIcon: () => <Text>🤖</Text>,
        }}
      />

      <Tab.Screen
        name="Achievement"
        component={AchievementScreen}
        options={{
          tabBarLabel: 'Thành tích',
          tabBarIcon: () => <Text>🏆</Text>,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tôi',
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
