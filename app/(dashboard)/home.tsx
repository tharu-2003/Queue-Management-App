import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Welcome 👋</Text>

      <View className="bg-white p-4 rounded-xl mb-3">
        <Text className="font-semibold">Active Token</Text>
        <Text className="text-gray-500">No active token</Text>
      </View>

      <View className="bg-white p-4 rounded-xl">
        <Text className="font-semibold">Quick Actions</Text>
        <Text className="text-gray-500">Take a new token easily</Text>
      </View>
    </View>
  );
}
