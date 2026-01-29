import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { getActiveTokens, cancelToken, TokenData } from "@/services/tokenService";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Install: npx expo install expo-linear-gradient
import { useFocusEffect } from "@react-navigation/native";


export default function MyToken() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();
  

  // useEffect(() => {
  //   fetchTokens();
  // }, []);

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
              
              // Data refresh wenakanma loading thiyana eka hodai
              await fetchTokens(); 
              
            } catch (error) {
              console.error("Cancel error:", error);
              Alert.alert("Error", "Could not cancel the token. Please try again.");
            } finally {
              setCancellingId(null); // Okkoma iwara unama loading nawattanawa
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 border-emerald-300";
      case "completed":
        return "bg-blue-100 border-blue-300";
      case "cancelled":
        return "bg-red-100 border-red-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-emerald-700";
      case "completed":
        return "text-blue-700";
      case "cancelled":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Text className="text-gray-600 text-lg">Loading tokens...</Text>
      </View>
    );
  }

  if (tokens.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <View className="bg-white p-8 rounded-3xl shadow-lg items-center">
          <Text className="text-6xl mb-4">🎫</Text>
          <Text className="text-gray-800 text-2xl font-bold mb-2">No Active Tokens</Text>
          <Text className="text-gray-500 text-center mb-6">
            You don't have any tokens yet. Get one to join the queue!
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 px-8 py-4 rounded-2xl shadow-md"
            onPress={() => router.replace("/take-token")}
          >
            <Text className="text-white text-lg font-semibold">Get a Token</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <View className="bg-white pt-2 pb-6 px-6 shadow-sm">
        <Text className="text-3xl font-bold text-gray-800 mb-1">My Tokens</Text>
        <Text className="text-gray-500">You have {tokens.length} token{tokens.length > 1 ? 's' : ''}</Text>
      </View>

      {/* Tokens List */}
      <ScrollView 
        className="flex-1 px-4 pt-4 mb-20"
        showsVerticalScrollIndicator={false}
      >
        {tokens.map((token, index) => (
          <View
            key={token.id || index}
            className="bg-white rounded-2xl shadow-md mb-3 overflow-hidden"
          >
            {/* Token Header with Gradient */}
            <View className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray text-xs opacity-80 mb-0.5">Token Number</Text>
                  <Text className="text-red text-3xl font-bold">{token.token}</Text>
                </View>
                <View className={`px-3 py-1.5 rounded-full border ${getStatusColor(token.status)}`}>
                  <Text className={`font-semibold text-sm capitalize ${getStatusTextColor(token.status)}`}>
                    {token.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Token Details */}
            <View className="p-4">
              {/* Service Center */}
              <View className="flex-row items-center mb-3">
                <View className="bg-indigo-100 p-2 rounded-lg mr-2">
                  <Text className="text-lg">🏢</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-0.5">Service Center</Text>
                  <Text className="text-gray-800 text-base font-semibold">
                    {token.serviceCenter}
                  </Text>
                </View>
              </View>

              {/* Service Name */}
              <View className="flex-row items-center mb-3">
                <View className="bg-purple-100 p-2 rounded-lg mr-2">
                  <Text className="text-lg">📋</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-0.5">Service</Text>
                  <Text className="text-gray-800 text-base font-semibold">
                    {token.serviceName}
                  </Text>
                </View>
              </View>

              {/* Queue Position & Time */}
              <View className="flex-row gap-2 mb-3">
                <View className="flex-1 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <Text className="text-amber-600 text-xs mb-0.5">Queue Position</Text>
                  <Text className="text-amber-900 text-xl font-bold">
                    #{token.queuePosition}
                  </Text>
                </View>
                <View className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <Text className="text-blue-600 text-xs mb-0.5">Est. Time</Text>
                  <Text className="text-blue-900 text-xl font-bold">
                    {token.estimatedTime}
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              {token.status === "active" && (
                <TouchableOpacity
                  className="bg-red-500 p-3 rounded-xl shadow-sm active:bg-red-600"
                  onPress={() => handleCancel(token)}
                  disabled={cancellingId !== null}
                >
                  {cancellingId === token.id ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator color="#fff" />
                      <Text className="text-white ml-3 font-semibold text-base">
                        Processing...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white text-center font-bold text-base">
                      ❌ Cancel Token
                    </Text>
                  )}
                  
                </TouchableOpacity>
              )}

              {token.status === "completed" && (
                <View className="bg-green-50 p-3 rounded-xl border border-green-200">
                  <Text className="text-green-700 text-center font-semibold text-sm">
                    ✅ Service Completed
                  </Text>
                </View>
              )}

              {token.status === "cancelled" && (
                <View className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <Text className="text-gray-600 text-center font-semibold text-sm">
                    🚫 This token was cancelled
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}