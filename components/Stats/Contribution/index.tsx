import { View } from "react-native";
import { Text } from "@/components/ui";
import { ContributionGraph } from "react-native-chart-kit"
import { Dimensions } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { ScrollView } from "react-native-gesture-handler";
const screenWidth = Dimensions.get("window").width;

const commitsData = [
    { date: "2024-08-02", count: 3 },
    { date: "2024-08-07", count: 5 },
    { date: "2024-08-10", count: 2 },
    { date: "2024-08-15", count: 4 },
    { date: "2024-08-22", count: 6 },
    { date: "2024-08-28", count: 3 },
    { date: "2024-09-03", count: 7 },
    { date: "2024-09-08", count: 4 },
    { date: "2024-09-14", count: 2 },
    { date: "2024-09-21", count: 5 },
    { date: "2024-09-27", count: 3 },
    { date: "2024-10-02", count: 8 },
    { date: "2024-10-09", count: 3 },
    { date: "2024-10-16", count: 6 },
    { date: "2024-10-23", count: 2 },
    { date: "2024-10-30", count: 5 },
    { date: "2024-11-05", count: 4 },
    { date: "2024-11-12", count: 7 },
    { date: "2024-11-17", count: 3 },
    { date: "2024-11-24", count: 6 },
    { date: "2024-11-29", count: 2 },
    { date: "2024-12-04", count: 8 },
    { date: "2024-12-11", count: 3 },
    { date: "2024-12-18", count: 5 },
    { date: "2024-12-25", count: 4 },
    { date: "2025-01-01", count: 3 },
    { date: "2025-01-08", count: 7 },
    { date: "2025-01-15", count: 2 },
    { date: "2025-01-22", count: 6 },
    { date: "2025-01-29", count: 4 },
    { date: "2025-02-05", count: 5 },
    { date: "2025-02-12", count: 3 },
    { date: "2025-02-19", count: 9 },
    { date: "2025-02-26", count: 4 },
    { date: "2025-03-03", count: 5 },
    { date: "2025-03-10", count: 3 },
    { date: "2025-03-17", count: 6 },
    { date: "2025-03-23", count: 4 }
];

const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(134, 65, 255, ${opacity})`,
    

};

export default function ContributionChart() {
    return (
        <View className="overflow-hidden p-4 mb-8 flex flex-col items-center gap-2 border border-zinc-200 rounded-2xl">
            <Text variant="lg" bold>Haftalık Soru Çözüm Raporu</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                
            >
                <ContributionGraph
                    values={commitsData}
                    endDate={new Date("2025-03-24")}
                    numDays={236}
                    width={screenWidth*1.2}
                    height={7*12 + 32 + 32}
                    chartConfig={chartConfig}
                    squareSize={12}
                    gutterSize={1}
                    tooltipDataAttrs={(value) => ({})}
                />
            </ScrollView>
        </View>
    )
}