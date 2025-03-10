import { View } from 'react-native'
import React from 'react'
import { Text } from '@ui/index'
import Icons from "@/lib/Icons";
export default function () {
    return (
        <View className='gap-4'>
            <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
                <View className="flex-row justify-between items-center w-full">
                    <Text className="text-zinc-400">Favori çalışma konusu</Text>
                    <Icons name="BookHeart" size={20} color="#a1a1aa" />
                </View>
                <View className="flex items-start justify-start ">
                    <Text variant="3xl" bold>Matematik</Text>
                </View>
            </View>
            <View className="flex flex-row w-full gap-4">
                <View className="flex-auto px-8 py-4 flex flex-col items-center justify-center gap-4 border-zinc-200 border rounded-3xl">
                    <View className="flex-row justify-between items-center w-full">
                        <Text className="text-zinc-400">Soru sayısı</Text>
                        <Icons name="Rocket" size={16} color="#a1a1aa" />
                    </View>
                    <View className="flex flex-col items-center gap-y-2 justify-center">
                        <Text variant="4xl" bold>505</Text>
                        <Text variant="sm" className="text-zinc-400">Düne göre %10 artış</Text>
                    </View>

                </View>
                <View className="flex-auto px-8 py-4 flex flex-col items-center justify-center gap-4 border-zinc-200 border rounded-3xl">
                    <View className="flex-row justify-between items-center w-full">
                        <Text className="text-zinc-400">Günlük Seri</Text>
                        <Icons name="Flame" size={16} color="#a1a1aa" />
                    </View>
                    <View className="flex flex-col items-center gap-y-2 justify-center">
                        <Text variant="4xl" bold>3</Text>
                        <Text variant="sm" className="text-zinc-400">İşte aradığım motivasyon!</Text>
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
    )
}