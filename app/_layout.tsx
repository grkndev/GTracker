import "@/global.css"
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from "expo-font"
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded] = useFonts({
    "SF-Pro": require("@/assets/fonts/SF-Pro-Display-Regular.otf"),
    "SF-Pro-Bold": require("@/assets/fonts/SF-Pro-Display-Bold.otf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false,animation: "simple_push" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
