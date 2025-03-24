import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/Text'
import Icons from '@/lib/Icons'

export default function SolvedQuestion() {
    return (
        <View className="flex-1 bg-white flex-col gap-4">
            <View className="flex-row gap-4">
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
                        <Text className="text-zinc-400 w-full text-center">Günlük Seri</Text>
                    </View>
                    <View className="flex flex-col items-center gap-y-2 justify-center">
                        <Text variant="4xl" bold>3</Text>
                    </View>

                </View>
            </View>
            <View className="flex-auto px-8 py-4 flex flex-col items-start justify-center gap-4 border-zinc-200 border rounded-3xl">
                <View className="flex-row justify-between items-center w-full">
                    <Text className="text-zinc-400">En çok çözülen ders</Text>
                    <Icons name="Rocket" size={16} color="#a1a1aa" />
                </View>
                <View className="flex flex-col items-start gap-y-2 justify-center">
                    <Text variant="4xl" bold >Matematik</Text>
                </View>

            </View>
        </View>
    )
}