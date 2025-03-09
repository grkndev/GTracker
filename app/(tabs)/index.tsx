import HeadBar from "@/components/HeadBar";
import Icons from "@/lib/Icons";
import { TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Text, Card } from '@ui/index'

export default function Home() {
  return (
    <View className="flex-1 bg-white flex flex-col gap-6">
      <HeadBar />
      <View className="flex flex-col gap-4 px-6">
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
    </View>
  )
}
