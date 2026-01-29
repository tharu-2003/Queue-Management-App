import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { getTokenHistory, TokenData } from "@/services/tokenService";
import { Timestamp } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const getStatusColor = (status: TokenData["status"]) => {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    case "expired":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

const formatDate = (createdAt: any) => {
  if (!createdAt) return "";
  if (createdAt instanceof Timestamp) {
    return createdAt.toDate().toLocaleString();
  }
  return new Date(createdAt).toLocaleString();
};

export default function History() {
  const [history, setHistory] = useState<TokenData[]>([]);

  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     const tokens = await getTokenHistory();
  //     setHistory(tokens);
  //   };

  //   fetchHistory();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        try {
          const tokens = await getTokenHistory();
          setHistory(tokens);
        } catch (error) {
          console.error("History fetch error:", error);
        }
      };

      fetchHistory();
    }, [])
  );

 
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Token History</Text>

      {history.length === 0 && (
        <Text className="text-gray-500 text-center mt-4">
          No token history yet
        </Text>
      )}

      {history.map((token) => (
        <View
          key={token.id}
          className="border border-gray-200 bg-gray-50 p-4 rounded-2xl mb-3"
        >
          {/* Token Header */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold">
              Token {token.token}
            </Text>
            <Text className={`font-semibold ${getStatusColor(token.status)}`}>
              {token.status.toUpperCase()}
            </Text>
          </View>

          {/* Details */}
          <Text className="text-gray-700">
            Service Center:{" "}
            <Text className="font-medium">{token.serviceCenter}</Text>
          </Text>

          <Text className="text-gray-700">
            Service:{" "}
            <Text className="font-medium">{token.serviceName}</Text>
          </Text>

          <Text className="text-gray-700">
            Queue Position:{" "}
            <Text className="font-medium">#{token.queuePosition}</Text>
          </Text>

          <Text className="text-gray-700">
            Estimated Time:{" "}
            <Text className="font-medium">{token.estimatedTime}</Text>
          </Text>

          {/* Date */}
          <Text className="text-gray-400 text-sm mt-2">
            Created at: {formatDate(token.createdAt)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
