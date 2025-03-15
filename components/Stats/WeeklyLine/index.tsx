import React from 'react';
import { LineChart } from "react-native-chart-kit";
import { View, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { Text } from "@/components/ui";
import Svg, { Text as SvgText } from 'react-native-svg';
const screenWidth = Dimensions.get("window").width;

// Orijinal veri noktalarımız
const originalData: number[] = [207, 200, 258, 80, 0, 205, 80, 207];

// Maksimum Y değeri
const maxValue = Math.max(...originalData);

// Veri ölçeklendirme fonksiyonu - gerçek verilerle doğru orantılı değerler üretir
const scaleData = (dataPoints: number[]): number[] => {
  // Verileri doğrusal olarak ölçeklendir (0-1 aralığında)
  return dataPoints.map((value: number) => (value / maxValue));
};

// Ölçeklendirilmiş veriler (0-1 aralığında)
const scaledData = scaleData(originalData);

const data = {
    labels: ["Çar", "Per", "Cum", "Cmt", "Paz", "Pzt", "Sal", "Çar"],
    datasets: [
        {
            data: scaledData,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        }
    ],
};

const chartConfig: AbstractChartConfig = {
    backgroundColor: "#e26a00",
    // Y ekseni etiketleri için ayarlar (gizlemek için)
    formatYLabel: () => "",
    // X ekseni etiketleri için ayarlar (görünür olmalı)
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    decimalPlaces: 0,
    // Y ekseni etiketlerini gizle, X ekseni etiketlerini göster
    propsForHorizontalLabels: {
        fontSize: 0,
        fill: "rgba(0,0,0,0)"
    },
    // X ekseni etiketleri için stil
    propsForVerticalLabels: {
        fontSize: 12,
        fill: "black",
        rotation: 0
    },
};

// Grafiğin genişliğini hesapla (iç kenar boşluklarını hesaba katarak)
const chartWidth = screenWidth; // 16px sol padding + 16px sağ padding + ek iç boşluk

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        borderRadius: 16,
        width: '100%', // Tam genişlikte konteyner
    },
    chartContainer: {
        position: 'relative',
        alignItems: 'center', // İçeriği yatayda ortala
        justifyContent: 'center', // İçeriği dikeyde ortala
        width: '100%', // Tam genişlikte chart container
        left: -16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center', // Metni ortala
    }
});

export default function WeeklyLine() {
    return (
        <View style={styles.container}>
            <Text variant="lg" bold>Haftalık Soru Çözüm Raporu</Text>
            <View style={styles.chartContainer}>
                <LineChart
                    data={data}
                    width={chartWidth}
                    height={220}
                    chartConfig={chartConfig}
                    transparent
                    segments={5}
                    fromZero={true}
                    bezier={false}
                    withDots={true}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    // Y ekseni etiketlerini gizle
                    withHorizontalLabels={false}
                    // X ekseni etiketlerini göster
                    withVerticalLabels={true}
                    withInnerLines={true}
                    withOuterLines={true}
                    withShadow={false}
                    xLabelsOffset={5}
                    horizontalLabelRotation={0}
                    renderDotContent={({x, y, index}) => {
                        // Her noktanın üzerinde gerçek değeri gösterme
                        const actualValue = originalData[index];
                        return (
                            <SvgText
                                key={index}
                                x={x}
                                y={y - 10}
                                fill="black"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {actualValue}
                            </SvgText>
                        );
                    }}
                />
            </View>
        </View>
    )
}