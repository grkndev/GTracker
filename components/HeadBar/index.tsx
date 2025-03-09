import { View, Image } from 'react-native'
import { Text } from '../ui'
import React from 'react'

export default function HeadBar() {
    return (
        <View className='px-6 py-4 flex flex-row items-center gap-2 border-b border-zinc-100'>
            <View>
                <Image source={require('@/assets/images/icon.png')} className='w-16 h-16' />
            </View>
            <View className='flex flex-col'>
                <Text>Merhaba, iyi günler</Text>
                <View className='flex flex-row items-center gap-2'>
                    <Text variant='xl' className='font-bold'>Gürkan</Text>
                    <Text variant='xl' className='font-bold'>👋</Text>
                </View>
            </View>
        </View>
    )
}