import React from 'react'
import Icons from "@/lib/Icons";
import { TouchableOpacity, View } from "react-native";
import { Text, Card } from '@ui/index'
import { useTimer } from '@/lib/TimerContext';

export default function TimeCard() {
    const { time, isPaused, startTimer, stopTimer, resetTimer, finishTimer } = useTimer();

    return (
        <Card>
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-zinc-400">Çalışma süreniz</Text>
                <Icons name="Timer" size={20} color="#a1a1aa" />
            </View>
            <View className="flex flex-col items-center gap-y-2 justify-center">
                {
                    time ? (
                        <>
                            <Text variant="5xl" bold>{time}</Text>
                            <Text className="text-zinc-400">16 saat mi? Aman tanrım sen insan mısın?</Text></>
                    ) : (
                        <View className='py-[6px] items-center'>
                            <Text variant="3xl" bold>Aktif sayacınız yok</Text>
                            <Text className="text-zinc-400">Hadi biraz çalışalım?</Text></View>
                    )
                }
            </View>
            <View className="w-full flex flex-row items-center justify-center gap-4">
                {
                    time ? (
                        isPaused ? (
                            <TouchableOpacity
                                onPress={startTimer}
                                className="bg-green-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                            >
                                <Icons name="CirclePlay" size={20} color="#fff" />
                                <Text variant="sm" className="text-white">Devam Et</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={stopTimer}
                                className="bg-zinc-200 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                            >
                                <Icons name="CirclePause" size={20} color="#27272a" />
                                <Text variant="sm" className="text-zinc-800">Durdur</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <TouchableOpacity
                            onPress={resetTimer}
                            className="py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                        >
                            <View className='-top-1'>
                                <Icons name="Play" size={16} strokeWidth={2.5} color="#3b82f6" />
                            </View>
                            <Text variant="xl" className="text-blue-500">Başlat</Text>
                        </TouchableOpacity>
                    )
                }
                {
                    time && <TouchableOpacity
                        onPress={finishTimer}
                        className="bg-red-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                    >
                        <Icons name="CircleStop" size={20} color="#fff" />
                        <Text variant="sm" className="text-white">Bitir</Text>
                    </TouchableOpacity>
                }
            </View>
        </Card>
    )
}