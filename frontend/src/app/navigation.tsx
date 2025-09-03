import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Disc3, History as HistoryIcon, Settings as SettingsIcon, LucideIcon } from 'lucide-react-native';

import type { RootStackParamList, TabRouteName } from './types';

import { WheelScreen } from '@/features/wheel';
import { HistoryScreen } from '@/features/history';
import { SettingsScreen } from '@/features/settings';
import { AuthComingSoonScreen } from '@/features/auth';
import { useTheme } from '@/shared/theme';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();


const TAB_ICON: Record<TabRouteName, LucideIcon> = {
  Wheel: Disc3,
  History: HistoryIcon,
  Settings: SettingsIcon,
};

function Tabs() {
  const t = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: t.colors.brand },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: t.colors.surface },
        tabBarActiveTintColor: t.colors.brand,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const IconComponent = TAB_ICON[route.name as TabRouteName];
          return <IconComponent size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Wheel" component={WheelScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNav() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={Tabs} />
        <RootStack.Screen name="AuthComingSoon" component={AuthComingSoonScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
