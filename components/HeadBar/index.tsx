import { View, Image } from 'react-native'
import { Text } from '../ui'
import React, { useMemo } from 'react'
import { HelloWave } from '../ui/HelloWave';

export default function HeadBar() {
    const greeting = useMemo(() => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 10) {
            return "günaydın";
        } else if (currentHour >= 10 && currentHour < 18) {
            return "iyi günler";
        } else {
            return "iyi akşamlar";
        }
    }, []);

    return (
        <View className='px-6 py-4 flex flex-row items-center gap-2 border-b border-zinc-200'>
            <View>
                <Image source={require('@/assets/images/icon.png')} className='w-16 h-16' />
            </View>
            <View className='flex flex-col'>
                <Text>Merhaba, {greeting}</Text>
                <View className='flex flex-row items-center gap-2'>
                    <Text variant='xl' bold>Gürkan</Text>
                    <HelloWave />
                </View>
            </View>
        </View>
    )
}