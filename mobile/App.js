import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import AnxietyScanScreen from './src/screens/AnxietyScanScreen';
import ScanResultScreen from './src/screens/ScanResultScreen';
import DebtInputScreen from './src/screens/DebtInputScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DebtReframeScreen from './src/screens/DebtReframeScreen';
import AchievementScreen from './src/screens/AchievementScreen';
import DebtDetailScreen from './src/screens/DebtDetailScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import VoiceAssistantScreen from './src/screens/VoiceAssistantScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import ActionPlanScreen from './src/screens/ActionPlanScreen';
import DailyLessonScreen from './src/screens/DailyLessonScreen';
import MainTabs from './src/navigation/MainTabs';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AnxietyScan"
          component={AnxietyScanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ScanResult"
          component={ScanResultScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DebtInput"
          component={DebtInputScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DebtReframe"
          component={DebtReframeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Achievement"
          component={AchievementScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Achievements"
          component={AchievementScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="VoiceAssistant"
          component={VoiceAssistantScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AICoach"
          component={AICoachScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ActionPlan"
          component={ActionPlanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DailyLesson"
          component={DailyLessonScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DebtDetail"
          component={DebtDetailScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CheckIn"
          component={CheckInScreen}
          options={{ title: 'Check-in Hàng Tuần' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
