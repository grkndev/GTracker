import React from 'react';
import TabBar from '@/components/TabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#FA0250",
        headerShown: false,
        tabBarStyle: {
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    />
  );
}
