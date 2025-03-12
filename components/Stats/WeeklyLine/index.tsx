import { LineChart } from "react-native-chart-kit";
import { View } from "react-native";
import { Dimensions } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Text } from "@/components/ui";
const screenWidth = Dimensions.get("window").width;

const data = {
    labels: ["Çar", "Per", "Cum", "Cmt", "Paz", "Pzt", "Sal", "Çar"],
    datasets: [
        {
            data: [207, 200, 258, 80, 0, 205, 80, 207],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
        }
    ],
};
const chartConfig: AbstractChartConfig = {

    backgroundColor: "#e26a00",
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    decimalPlaces: 0,


};

export default function WeeklyLine() {
    return (
        <View className="p-4 flex flex-col items-center gap-2 border border-zinc-200 rounded-2xl">
            <Text variant="lg" bold>Haftalık Soru Çözüm Raporu</Text>
            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                transparent
                segments={8}
            />
        </View>
    )
}