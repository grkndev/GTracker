import React, { useRef } from 'react'
import Icons from "@/lib/Icons";
import { TouchableOpacity, View } from "react-native";
import { Text, Card } from '@ui/index'
import Timer from '@/lib/Timer';

export default function TimeCard() {
    const [time, setTime] = React.useState<string | null>(null);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const timerRef = useRef<Timer>(new Timer());

    return (
        <Card>
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-zinc-400">Çalışma süreniz</Text>
                <Icons name="Timer" size={20} color="#a1a1aa" />
            </View>
            <View className="flex flex-col items-center gap-y-2 justify-center">
                <Text variant="5xl" bold>{time ?? "00:00:00"}</Text>
                <Text className="text-zinc-400">16 saat mi? Aman tanrım sen insan mısın?</Text>
            </View>
            <View className="w-full flex flex-row items-center justify-center gap-4">
                {
                    time ? (
                        isPaused ? (
                            <TouchableOpacity 
                                onPress={() => {
                                    timerRef.current.start((time) => {
                                        setTime(time);
                                    });
                                    setIsPaused(false);
                                }} 
                                className="bg-green-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                            >
                                <Icons name="CirclePlay" size={20} color="#fff" />
                                <Text variant="sm" className="text-white">Devam Et</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                onPress={() => {
                                    timerRef.current.stop();
                                    setIsPaused(true);
                                }} 
                                className="bg-zinc-200 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                            >
                                <Icons name="CirclePause" size={20} color="#27272a" />
                                <Text variant="sm" className="text-zinc-800">Durdur</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <TouchableOpacity 
                            onPress={() => {
                                timerRef.current.reset();
                                timerRef.current.start((time) => {
                                    setTime(time);
                                });
                                setIsPaused(false);
                            }} 
                            className="bg-green-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                        >
                            <Icons name="CirclePlay" size={20} color="#fff" />
                            <Text variant="sm" className="text-white">Başlat</Text>
                        </TouchableOpacity>
                    )
                }
                {
                    time && <TouchableOpacity 
                        onPress={() => {
                            // Önce tüm istatistikleri hesapla
                            const totalTimeWithPauses = timerRef.current.getTotalElapsedTimeWithPauses();
                            const activeTime = timerRef.current.getTotalActiveTime();
                            
                            // Sonuçları konsola yazdır
                            console.log('Toplam geçen süre (durdurma süreleri dahil):', totalTimeWithPauses);
                            console.log('Aktif çalışma süresi (durdurma süreleri hariç):', activeTime);
                            
                            // Timer'ı durdur ve sıfırla
                            timerRef.current.stop();
                            timerRef.current.reset();
                            setTime(null);
                            setIsPaused(false);
                        }} 
                        className="bg-red-400 py-2 px-4 flex flex-row items-center justify-center gap-1 rounded-xl"
                    >
                        <Icons name="CircleStop" size={20} color="#fff" />
                        <Text variant="sm" className="text-white">Bitir</Text>
                    </TouchableOpacity>
                }
            </View>
        </Card>
    )
}