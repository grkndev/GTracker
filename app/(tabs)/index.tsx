import HeadBar from "@/components/HeadBar";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      <HeadBar />
      <Text>Home</Text>
    </View>
  )
}