import { View, Text, TouchableOpacity } from "react-native";

export default function MyToken() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white p-6 rounded-xl">
        <Text className="text-xl font-bold mb-2">Token A-025</Text>
        <Text className="text-gray-600">Estimated Time: 15 mins</Text>
        <Text className="text-gray-600 mb-4">People Ahead: 3</Text>

        <TouchableOpacity className="bg-red-500 p-3 rounded-xl">
          <Text className="text-white text-center">Cancel Token</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
