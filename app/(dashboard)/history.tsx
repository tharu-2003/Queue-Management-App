import { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { getTokenHistory, TokenData } from "@/services/tokenService";
import { Timestamp } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Status eka anuwa icons saha colors wenas karanna
const getStatusStyles = (status: TokenData["status"]) => {
  switch (status) {
    case "completed":
      return { color: "text-emerald-600", bg: "bg-emerald-50", icon: "checkmark-done-circle" };
    case "cancelled":
      return { color: "text-red-600", bg: "bg-red-50", icon: "close-circle" };
    case "expired":
      return { color: "text-orange-600", bg: "bg-orange-50", icon: "alert-circle" };
    default:
      return { color: "text-gray-600", bg: "bg-gray-50", icon: "help-circle" };
  }
};

const formatDate = (createdAt: any) => {
  if (!createdAt) return "";
  const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function History() {
  const [history, setHistory] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const tokens = await getTokenHistory();
          setHistory(tokens);
        } catch (error) {
          console.error("History fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }, [])
  );

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header Section - Home Screen Style */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/80 text-lg font-medium">Activity Log</Text>
            <Text className="text-white text-3xl font-bold">Token History</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <Ionicons name="time-outline" size={24} color="white" />
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 -mt-8" showsVerticalScrollIndicator={false}>
          {history.length === 0 ? (
            <View className="bg-white p-10 rounded-[40px] shadow-sm items-center border border-slate-100">
              <Ionicons name="file-tray-outline" size={40} color="#cbd5e1" />
              <Text className="text-slate-400 font-medium mt-2">No token history yet</Text>
            </View>
          ) : (
            history.map((token) => {
              const status = getStatusStyles(token.status);
              return (
                <View key={token.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-3 p-4 flex-row items-center">
                  {/* Status Icon Area */}
                  <View className={`${status.bg} p-3 rounded-2xl mr-4`}>
                    <Ionicons name={status.icon as any} size={24} color={status.color.replace('text-', '')} />
                  </View>
                  
                  {/* Token Details Area */}
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-bold text-slate-800 text-lg">Token {token.token}</Text>
                      <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                        {formatDate(token.createdAt)}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                        <Text className="text-slate-500 text-xs" numberOfLines={1}>
                        {token.serviceCenter} • {token.serviceName}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mt-2">
                        <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                            <Text className="text-slate-500 text-[9px] font-bold">POS: #{token.queuePosition}</Text>
                        </View>
                        <Text className={`${status.color} text-[10px] font-bold uppercase`}>
                        {token.status}
                        </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-10" />
        </ScrollView>
      )}
    </View>
  );
}