import { View, Text, TouchableOpacity } from "react-native";

export default function TakeToken() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Take a Token</Text>

      <Text className="font-semibold mb-2">Select Service Center</Text>
      <TouchableOpacity className="border p-3 rounded-xl mb-3">
        <Text>🏦 Bank</Text>
      </TouchableOpacity>

      <Text className="font-semibold mb-2">Choose Service</Text>
      <TouchableOpacity className="border p-3 rounded-xl mb-4">
        <Text>Account Opening</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-green-600 p-4 rounded-xl">
        <Text className="text-white text-center font-semibold">
          Generate Token (A-025)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
