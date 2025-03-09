import HeadBar from "@/components/HeadBar";
import { View } from "react-native";
import TimeCard from "@/components/TimeCard";
import StatsCards from "@/components/StatsCards";

export default function Home() {
  return (
    <View className="flex-1 bg-white flex flex-col gap-6">
      <HeadBar />
      <View className="flex flex-col gap-4 px-6">
        <TimeCard />
        <StatsCards />
      </View>
    </View>
  )
}
