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
import DebtDetailScreen from './src/screens/DebtDetailScreen';
import CheckInScreen from './src/screens/CheckInScreen';

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
