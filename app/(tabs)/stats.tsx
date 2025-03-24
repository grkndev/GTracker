import ContributionChart from "@/components/Stats/Contribution";
import LecturePie from "@/components/Stats/LucturePie";
import SolvedQuestion from "@/components/Stats/SolvedQuestion";
import WeeklyLine from "@/components/Stats/WeeklyLine";
import { ScrollView } from "react-native-gesture-handler";


export default function StatsScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4 flex-col" contentContainerStyle={{ gap: 24 }}>
      <SolvedQuestion />
      <WeeklyLine />
      <LecturePie />
      <ContributionChart />
    </ScrollView>
  )
}