import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Text from "./Text";
import { StyleSheet } from "react-native";

export function HelloWave() {
    const rotationAnimation = useSharedValue(0);

    useEffect(() => {
        rotationAnimation.value = withRepeat(
            withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
            4 // Run the animation 4 times
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotationAnimation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Text variant="xl">👋</Text>
        </Animated.View>
    );
}
const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
    },
});