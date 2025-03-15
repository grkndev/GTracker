import { View } from 'react-native'
import React from 'react'
import { Text } from '@ui/index'
import Icons from "@/lib/Icons";
import TimeCard from '@/components/TimeCard';
import { useTimer } from '@/lib/TimerContext';

export default function TimerScreen() {
  // Using the shared timer context
  const { time, subjectTime, breakTime } = useTimer();
  
  return (
    <View className="flex-1 bg-white flex flex-col gap-6 px-6 pt-8">
      <TimeCard />
      <View className='gap-4'>
        <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-zinc-400">Çalışılan konu</Text>
            <Icons name="BookHeart" size={20} color="#a1a1aa" />
          </View>
          <View className="flex items-start justify-start ">
            <Text variant="3xl" bold>Matematik</Text>
          </View>
        </View>
        <View className="flex flex-col w-full gap-4">
          <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-zinc-400">Konu</Text>
              <Icons name="Rocket" size={16} color="#a1a1aa" />
            </View>
            <View className="flex flex-col items-center gap-y-2 justify-center">
              <Text variant="4xl" bold>{time ? subjectTime : "00:00:00"}</Text>
            </View>
          </View>
          <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-zinc-400">Mola</Text>
              <Icons name="Flame" size={16} color="#a1a1aa" />
            </View>
            <View className="flex flex-col items-center gap-y-2 justify-center">
              <Text variant="4xl" bold>{time ? breakTime : "00:00:00"}</Text>
            </View>
          </View>
        </View>
        <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-zinc-400">En çok çözülen ders</Text>
            <Icons name="GraduationCap" size={20} color="#a1a1aa" />
          </View>
          <View className="flex items-start justify-start">
            <Text variant="3xl" bold>Matematik</Text>
            <Text variant="sm" className="text-zinc-400">280 soru çözüldü</Text>
          </View>
        </View>
      </View>
    </View>
  )
}