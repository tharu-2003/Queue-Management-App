import { View, Text } from "react-native";

export default function History() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Token History</Text>

      <View className="border p-3 rounded-xl mb-2">
        <Text>Token A-012</Text>
        <Text className="text-gray-500">Completed</Text>
      </View>

      <View className="border p-3 rounded-xl mb-2">
        <Text>Token A-018</Text>
        <Text className="text-gray-500">Cancelled</Text>
      </View>
    </View>
  );
}
