import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // Expo wala built-in thiyenawa

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-blue-50">
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]} // Indigo to Purple
        className="pt-16 pb-10 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/80 text-lg font-medium">Hello, 👋</Text>
            <Text className="text-white text-3xl font-bold">Welcome Back</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View className="px-6 -mt-8">
        {/* Active Token Card */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <View className="flex-row items-center mb-4">
            <View className="bg-indigo-100 p-2 rounded-lg mr-3">
              <Ionicons name="ticket-outline" size={24} color="#4f46e5" />
            </View>
            <Text className="text-xl font-bold text-slate-800">Active Token</Text>
          </View>
          
          <View className="items-center py-4">
            <Text className="text-slate-400 text-base mb-4 italic">No active token at the moment</Text>
            <TouchableOpacity 
              onPress={() => router.push("/take-token")}
              className="bg-indigo-600 px-6 py-3 rounded-2xl flex-row items-center"
            >
              <Text className="text-white font-bold mr-2">Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text className="text-xl font-bold text-slate-800 mt-8 mb-4">Quick Actions</Text>
        
        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={() => router.push("/take-token")}
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 items-center"
          >
            <View className="bg-emerald-100 p-4 rounded-2xl mb-3">
              <Ionicons name="add-circle-outline" size={30} color="#059669" />
            </View>
            <Text className="font-bold text-slate-800">New Token</Text>
            <Text className="text-slate-400 text-xs text-center mt-1">Book your spot</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/my-token")}
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 items-center"
          >
            <View className="bg-blue-100 p-4 rounded-2xl mb-3">
              <Ionicons name="list-outline" size={30} color="#2563eb" />
            </View>
            <Text className="font-bold text-slate-800">My Queue</Text>
            <Text className="text-slate-400 text-xs text-center mt-1">Check status</Text>
          </TouchableOpacity>
        </View>

        {/* History Action */}
        <TouchableOpacity 
          onPress={() => router.push("/history")}
          className="mt-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between"
        >
          <View className="flex-row items-center"> 
            <View className="bg-orange-100 p-3 rounded-xl mr-4">
              <Ionicons name="time-outline" size={24} color="#ea580c" />
            </View>
            <View>
              <Text className="font-bold text-slate-800 text-lg">History</Text>
              <Text className="text-slate-400 text-sm">View your past tokens</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}