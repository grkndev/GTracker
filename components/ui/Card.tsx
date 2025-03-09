import { View } from "react-native";
export default function Card({ children }: {
    children?: React.ReactNode
  }) {
    return (
      <View className="px-8 py-4 flex flex-col items-center justify-center gap-8 border-zinc-100 border rounded-3xl">
        {children}
      </View>
    )
  }