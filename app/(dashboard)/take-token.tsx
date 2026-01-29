import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { saveUserToken } from "@/services/tokenService"
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type ServiceType = {
  id: number;
  name: string;
  duration: string;
  icon: string;
};

export default function TakeToken() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const serviceCenter = [
    { id: 1, name: "Bank", icon: "🏦", color: "bg-blue-50", border: "border-blue-100" },
    { id: 2, name: "Hospital", icon: "🏥", color: "bg-red-50", border: "border-red-100" },
    { id: 3, name: "Government Office", icon: "🏛️", color: "bg-purple-50", border: "border-purple-100" },
    { id: 4, name: "Post Office", icon: "📮", color: "bg-orange-50", border: "border-orange-100" },
  ];

  const servicesByCenter: Record<string, ServiceType[]> = {
    Bank: [
      { id: 1, name: "Account Opening", duration: "15 min", icon: "📝" },
      { id: 2, name: "Cash Deposit", duration: "5 min", icon: "💰" },
      { id: 3, name: "Loan Inquiry", duration: "20 min", icon: "🏠" },
      { id: 4, name: "Card Services", duration: "10 min", icon: "💳" },
    ],
    Hospital: [
      { id: 1, name: "OPD Consultation", duration: "10 min", icon: "👨‍⚕️" },
      { id: 2, name: "Lab Test", duration: "20 min", icon: "🧪" },
      { id: 3, name: "Pharmacy", duration: "5 min", icon: "💊" },
    ],
    "Government Office": [
      { id: 1, name: "NIC Services", duration: "15 min", icon: "🆔" },
      { id: 2, name: "License Renewal", duration: "20 min", icon: "📄" },
    ],
    "Post Office": [
      { id: 1, name: "Parcel Service", duration: "10 min", icon: "📦" },
      { id: 2, name: "Money Order", duration: "5 min", icon: "💸" },
    ],
  };

  const handleGenerateToken = async () => {
    if (!selectedCenter || !selectedService) return;
    try {
      setLoading(true);
      const result = await saveUserToken(selectedCenter, selectedService.name);
      if (result) {
        setSelectedCenter(null); 
        setSelectedService(null);
        Alert.alert("Token Generated ✅", `Your token: ${result.token}`, [
          { text: "OK", onPress: () => router.replace("/my-token") },
        ]);
      }
    } catch (err) {
      Alert.alert("Error ❌", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header Section */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
      >
        <Text className="text-white/80 text-lg font-medium">Join the Queue</Text>
        <Text className="text-white text-3xl font-bold">Get Your Token</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-8" showsVerticalScrollIndicator={false}>
        {/* Service Centers Grid */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-6">
          <Text className="text-slate-800 font-bold mb-4">Select Service Center</Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {serviceCenter.map((center) => (
              <TouchableOpacity
                key={center.id}
                onPress={() => {
                  setSelectedCenter(center.name);
                  setSelectedService(null);
                }}
                className={`flex-1 min-w-[45%] p-4 rounded-2xl border-2 ${
                  selectedCenter === center.name
                    ? "border-blue-500 bg-blue-100"
                    : `${center.border} ${center.color}`
                }`}
              >
                <Text className="text-3xl mb-2">{center.icon}</Text>
                <Text className="font-semibold text-gray-800">
                  {center.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Services List */}
        {selectedCenter && (
          <View className="mb-6">
            <Text className="text-slate-800 font-bold mb-4 ml-1">Choose Service</Text>
            {servicesByCenter[selectedCenter].map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(service)}
                className={`p-4 rounded-2xl mb-3 border-2 flex-row items-center justify-between ${
                  selectedService?.id === service.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-white bg-white"
                } shadow-sm`}
              >
                <View className="flex-row items-center">
                  <View className="bg-slate-100 p-2 rounded-xl mr-4">
                    <Text className="text-2xl">{service.icon}</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-slate-800">{service.name}</Text>
                    <Text className="text-slate-400 text-xs">Est. {service.duration}</Text>
                  </View>
                </View>
                {selectedService?.id === service.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4f46e5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerateToken}
          disabled={!selectedCenter || !selectedService || loading}
          className={`p-5 rounded-2xl mb-6 shadow-md ${
            selectedCenter && selectedService ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Confirm & Generate
            </Text>
          )}
        </TouchableOpacity>

        {/* Tip Box */}
        <View className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex-row items-center mb-10">
          <Ionicons name="bulb-outline" size={20} color="#b45309" />
          <Text className="text-amber-800 text-xs ml-3 flex-1">
            Please arrive 5 minutes before your estimated time to ensure your spot.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}