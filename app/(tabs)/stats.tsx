import ContributionChart from "@/components/Stats/Contribution";
import LecturePie from "@/components/Stats/LucturePie";
import WeeklyLine from "@/components/Stats/WeeklyLine";
import { View } from "react-native";


export default function StatsScreen() {
  return (
    <View className="flex-1 bg-white p-4 flex-col gap-6">
      <WeeklyLine />
      <LecturePie />
      <ContributionChart />
    </View>
  )
}