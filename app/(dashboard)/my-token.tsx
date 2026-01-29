import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { getActiveTokens, cancelToken, TokenData } from "@/services/tokenService";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MyToken() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchTokens();
    }, [])
  );

  const fetchTokens = async () => {
    setLoading(true);
    const fetchedTokens = await getActiveTokens();
    setTokens(fetchedTokens);
    setLoading(false);
  };

  const handleCancel = async (token: TokenData) => {
    if (!token?.id) return;
    Alert.alert(
      "Cancel Token",
      `Are you sure you want to cancel Token ${token.token}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancellingId(token.id!);
              await cancelToken(token.id!);
              Alert.alert("Success", `Token ${token.token} has been cancelled.`);
              await fetchTokens(); 
            } catch (error) {
              Alert.alert("Error", "Could not cancel the token.");
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (tokens.length === 0) {
    return (
        <ScrollView className="flex-1 bg-slate-50">
            <LinearGradient
                colors={["#4f46e5", "#7c3aed"]}
                className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
            >
                <Text className="text-white/80 text-lg font-medium">Your Queue</Text>
                <Text className="text-white text-3xl font-bold">My Tokens</Text>
            </LinearGradient>
            
            <View className="px-6 -mt-8">
                <View className="bg-white p-10 rounded-[40px] shadow-sm items-center border border-slate-100">
                    <View className="bg-indigo-50 p-6 rounded-full mb-4">
                        <Ionicons name="ticket-outline" size={50} color="#4f46e5" />
                    </View>
                    <Text className="text-slate-800 text-xl font-bold">No Active Tokens</Text>
                    <Text className="text-slate-400 text-center mt-2 mb-6">You don't have any tokens right now.</Text>
                    <TouchableOpacity 
                        onPress={() => router.push("/take-token")}
                        className="bg-indigo-600 px-8 py-3 rounded-2xl"
                    >
                        <Text className="text-white font-bold">Get a Token</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header Section - Home Screen Style */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-center">
            <View>
                <Text className="text-white/80 text-lg font-medium">Your Queue</Text>
                <Text className="text-white text-3xl font-bold">My Tokens</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-full">
                <Ionicons name="layers-outline" size={24} color="white" />
            </View>
        </View>
      </LinearGradient>

      {/* Tokens List - Overlapping the gradient */}
      <ScrollView className="flex-1 px-6 -mt-8" showsVerticalScrollIndicator={false}>
        {tokens.map((token, index) => (
          <View key={token.id || index} className="bg-white rounded-[32px] shadow-sm border border-slate-100 mb-6 overflow-hidden">
            {/* Top Info Bar */}
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50">
                <View className="flex-row items-center">
                    <Ionicons name="business-outline" size={18} color="#64748b" />
                    <Text className="text-slate-500 font-bold ml-2 uppercase text-[11px] tracking-tighter">
                        {token.serviceCenter}
                    </Text>
                </View>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                    <Text className="text-emerald-700 text-[10px] font-bold uppercase">{token.status}</Text>
                </View>
            </View>

            {/* Token Main Body */}
            <View className="p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-slate-400 text-xs font-bold uppercase">Token Number</Text>
                        <Text className="text-indigo-600 text-5xl font-black">{token.token}</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-slate-400 text-xs font-bold uppercase">Estimated Wait</Text>
                        <Text className="text-slate-800 text-2xl font-bold">{token.estimatedTime}</Text>
                    </View>
                </View>

                {/* Details Grid */}
                <View className="flex-row bg-slate-50 rounded-2xl p-4 mb-6">
                    <View className="flex-1 border-r border-slate-200 pr-2">
                        <Text className="text-slate-400 text-[10px] font-bold uppercase">Service</Text>
                        <Text className="text-slate-700 font-bold" numberOfLines={1}>{token.serviceName}</Text>
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-slate-400 text-[10px] font-bold uppercase">Position</Text>
                        <Text className="text-slate-700 font-bold">#{token.queuePosition} in line</Text>
                    </View>
                </View>

                {/* Cancel Button */}
                {token.status === "active" && (
                  <TouchableOpacity
                    onPress={() => handleCancel(token)}
                    disabled={cancellingId !== null}
                    className="bg-red-50 py-4 rounded-2xl flex-row justify-center items-center"
                  >
                    {cancellingId === token.id ? (
                      <ActivityIndicator size="small" color="#ef4444" />
                    ) : (
                      <Text className="text-red-500 font-bold">Cancel Token</Text>
                    )}
                  </TouchableOpacity>
                )}
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}