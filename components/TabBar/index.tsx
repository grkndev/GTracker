import { View, Text, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Icons from '@/lib/Icons'
import { cn } from '@/utils/utils'

const TabBarComponent = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        // Cleanup
        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    const currentRoute = state.routes[state.index].name
    return (
        <>
            {!isKeyboardVisible && (<View className='border-zinc-100 border-t bg-white flex flex-row items-center justify-center w-full h-24'>

                {/* HOME */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("index")}
                    className={`flex h-full w-1/5 items-center justify-center $`}>

                    <Icons name={"House"} color={currentRoute === 'index' ? '#000' : '#a1a1aa'} />
                </TouchableOpacity>

                {/* STATS */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("stats")}
                    className={`flex h-full w-1/5 items-center justify-center`}>

                    <Icons name={"ChartArea"} color={currentRoute === 'stats' ? '#000' : '#a1a1aa'} />
                </TouchableOpacity>

                {/* ADD */}
                <TouchableOpacity
                    // onPress={() => navigation.navigate("stats")}
                    className={`flex h-full w-1/5 items-center justify-center`}>

                    <View className='flex flex-row items-center justify-center relative'>
                        <Icons name={"Plus"} color={'#fff'} />
                        <View className='absolute -z-10' >
                            <Icons size={48} name={"Hexagon"} color={'#000'} fill={"#000"} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* LECTURES */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("lectures")}
                    className={
                        `flex h-full w-1/5 items-center justify-center`
                    }>
                    <Icons name={"Book"} color={currentRoute === 'lectures' ? '#000' : '#a1a1aa'} />
                </TouchableOpacity>

                {/* SETTINGS */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("settings")}
                    className={` flex h-full w-1/5 items-center justify-center`}>
                    <Icons name={"Settings"} color={currentRoute === 'settings' ? '#000' : '#a1a1aa'} />
                </TouchableOpacity>

            </View>)}</>
    )
}

export default TabBarComponent