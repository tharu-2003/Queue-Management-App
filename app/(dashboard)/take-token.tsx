import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from "react-native";
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

  // Custom Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

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
        setGeneratedToken(result.token);
        setSelectedCenter(null); 
        setSelectedService(null);
        setModalVisible(true); // Default alert wenuwata modal eka open karanawa
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.replace("/my-token");
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* --- CUSTOM SUCCESS MODAL --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-8">
          <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
            <View className="bg-emerald-100 p-6 rounded-full mb-6">
              <Ionicons name="checkmark-circle" size={60} color="#10b981" />
            </View>
            
            <Text className="text-slate-800 text-2xl font-black text-center mb-2">
              Token Generated!
            </Text>
            
            <Text className="text-slate-500 text-center text-base mb-6">
              Your spot in the queue has been reserved successfully.
            </Text>

            <View className="bg-slate-50 w-full p-6 rounded-3xl border border-slate-100 items-center mb-8">
                <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Your Token Number</Text>
                <Text className="text-indigo-600 text-5xl font-black">{generatedToken}</Text>
            </View>

            <TouchableOpacity 
              onPress={handleCloseModal}
              className="w-full bg-indigo-600 py-4 rounded-2xl shadow-lg shadow-indigo-200"
            >
              <Text className="text-white text-center font-bold text-lg">View My Token</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- HEADER --- */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
      >
        <Text className="text-white/80 text-lg font-medium">Join the Queue</Text>
        <Text className="text-white text-3xl font-bold">Get Your Token</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-8" showsVerticalScrollIndicator={false}>
        {/* Service Centers */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-6">
          <Text className="text-slate-800 font-bold mb-4">Select Service Center</Text>
          <View className="flex-row flex-wrap gap-3">
            {serviceCenter.map((center) => (
              <TouchableOpacity
                key={center.id}
                onPress={() => {
                  setSelectedCenter(center.name);
                  setSelectedService(null);
                }}
                className={`flex-1 min-w-[45%] p-4 rounded-2xl border-2 items-center ${
                  selectedCenter === center.name
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-50 bg-slate-50"
                }`}
              >
                <Text className="text-3xl mb-2">{center.icon}</Text>
                <Text className="font-bold text-slate-700 text-center text-xs">
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
            <Text className="text-white text-center font-bold text-lg"> Confirm & Generate </Text>
          )}
        </TouchableOpacity>

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