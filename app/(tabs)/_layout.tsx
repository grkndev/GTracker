import React from 'react';
import TabBar from '@/components/TabBar';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <Tabs
        tabBar={props => <TabBar {...props} />}
        initialRouteName='index'
        screenOptions={{
          // animation:"none",
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}
