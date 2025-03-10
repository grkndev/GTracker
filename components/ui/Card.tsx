import { View } from "react-native";
export default function Card({ children }: {
    children?: React.ReactNode
  }) {
    return (
      <View className="px-8 py-4 flex flex-col items-center justify-center gap-6 border-zinc-200 border rounded-3xl">
        {children}
      </View>
    )
  }