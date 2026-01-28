import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { saveUserToken } from "@/services/tokenService"
import { useRouter } from "expo-router";


type ServiceType = {
  id: number;
  name: string;
  duration: string;
  icon: string;
};

export default function TakeToken() {
  const router = useRouter();
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const serviceCenter = [
    { id: 1, name: "Bank", icon: "🏦", color: "bg-blue-50", border: "border-blue-200" },
    { id: 2, name: "Hospital", icon: "🏥", color: "bg-red-50", border: "border-red-200" },
    { id: 3, name: "Government Office", icon: "🏛️", color: "bg-purple-50", border: "border-purple-200" },
    { id: 4, name: "Post Office", icon: "📮", color: "bg-orange-50", border: "border-orange-200" },
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
    const result = await saveUserToken(selectedCenter, selectedService.name);

    if (result) {
      Alert.alert(
        "Token Generated ✅",
        `Your token: ${result.token}`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/my-token"),
          },
        ]
      );
    } else {
      Alert.alert("Error ❌", "Token generation failed");
    }
  } catch (err) {
    console.log("Error generating token:", err);
    Alert.alert("Error ❌", "Something went wrong");
  }
};


  return (
    <ScrollView className="flex-1 bottom-20 bg-blue-50" showsVerticalScrollIndicator={true}>
      <View className="p-6">

        {/* Header */}
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Get Your Token
        </Text>
        <Text className="text-gray-500 mb-8">
          Skip the queue, book your spot instantly
        </Text>

        {/* Service Centers */}
        <Text className="text-lg font-semibold mb-3">
          Select Service Center
        </Text>
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

        {/* Services */}
        {selectedCenter && servicesByCenter[selectedCenter] && (
          <>
            <Text className="text-lg font-semibold mb-3">
              Choose Service
            </Text>

            {servicesByCenter[selectedCenter].map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(service)}
                className={`p-4 rounded-2xl mb-3 border-2 ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{service.icon}</Text>
                  <View>
                    <Text className="font-semibold text-gray-800">
                      {service.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Est. {service.duration}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerateToken}
          disabled={!selectedCenter || !selectedService}
          className={`p-5 rounded-2xl mt-6 ${
            selectedCenter && selectedService
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            Generate Token
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <Text className="text-amber-800 text-sm text-center">
            💡 Please arrive 5 minutes before your estimated time
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}
