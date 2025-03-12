import { PieChart } from "react-native-chart-kit";
import { View } from "react-native";
import { Dimensions } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Text } from "@/components/ui";
const screenWidth = Dimensions.get("window").width;

const data = [
    {
        name: "Fizik",
        solved: 17 + 25 + 50,
        color: "#2662D9",
        legendFontColor: "#2662D9",
        legendFontSize: 12
    },
    {
        name: "Matematik",
        solved: 100 + 55 + 155,
        color: "#E23670",
        legendFontColor: "#E23670",
        legendFontSize: 12
    },
    {
        name: "Biyoloji",
        solved: 30,
        color: "#AF57DB",
        legendFontColor: "#AF57DB",
        legendFontSize: 12
    },
    {
        name: "Deneme",
        solved: 83,
        color: "#E88C30",
        legendFontColor: "#E88C30",
        legendFontSize: 12
    },
    {
        name: "Kimya",
        solved: 60 + 25 + 50,
        color: "#2EB88A",
        legendFontColor: "#2EB88A",
        legendFontSize: 12
    }
];
const chartConfig: AbstractChartConfig = {
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    
};

export default function LecturePie() {
    return (
        <View className="p-4 flex flex-col items-center gap-2 border border-zinc-200 rounded-2xl">
            <Text variant="lg" bold>Haftalık Ders Dağılımı</Text>
            <PieChart
                data={data}
                width={screenWidth}
                height={160}
                chartConfig={chartConfig}
                accessor={"solved"}
                backgroundColor={"transparent"}
                paddingLeft={"12"}

            />
        </View>
    )
}