import React from 'react'
import Icons from "@/lib/Icons";
import { TouchableOpacity, View } from "react-native";
import { Text, Card } from '@ui/index'

export default function TimeCard() {
    return (
        <Card>
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-zinc-400">Çalışma süreniz</Text>
                <Icons name="Timer" size={20} color="#a1a1aa" />
            </View>
            <View className="flex flex-col items-center gap-y-2 justify-center">
                <Text variant="5xl" bold>16sa 47dk</Text>
                <Text className="text-zinc-400">16 saat mi? Aman tanrım sen insan mısın?</Text>
            </View>
            <View className="w-full flex flex-row items-center justify-center gap-4">
                <TouchableOpacity className="bg-zinc-200 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl">
                    <Icons name="CirclePause" size={20} color="#27272a" />
                    <Text variant="sm" className="text-zinc-800">Durdur</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl">
                    <Icons name="CircleStop" size={20} color="#fff" />
                    <Text variant="sm" className="text-white">Bitir</Text>
                </TouchableOpacity>
            </View>
        </Card>
    )
}