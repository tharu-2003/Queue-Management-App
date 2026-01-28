import { View, Text, Pressable, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar barStyle="light-content" />
      
      {/* Background Image: Put your service center image here */}
      <ImageBackground 
        source={require('../../assets/images/welcome.png')} 
        className="flex-1"
        resizeMode="cover"
      >
        
        {/* Dark Overlay for professional look */}
        <View className="flex-1 bg-slate-900/60 justify-end px-8 pb-16">
          
          {/* Service Center Branding */}
          <View className="mb-10">
            <View className="w-16 h-1 bg-blue-500 mb-4 rounded-full" />
            <Text className="text-white text-5xl font-extrabold tracking-tight mb-2">
              Expert{'\n'}Services.
            </Text>
            <Text className="text-blue-400 text-lg font-medium mb-4">
              Reliable Solutions for You.
            </Text>
            <Text className="text-slate-200 text-base leading-6">
              Book your slot today and experience the best 
              professional care for your equipment.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-y-4">
            {/* Main Button: Get Started / Book Now */}
            <Pressable 
              className="bg-blue-600 py-4 rounded-2xl shadow-lg active:bg-blue-700"
              onPress={() => router.push("/register")}
            >
              <Text className="text-white text-center font-bold text-lg">
                Get Started
              </Text>
            </Pressable>
            
            {/* Secondary Button: Login */}
            <TouchableOpacity 
              className="flex-row items-center justify-center py-2"
              onPress={() => router.push("/login")}
            >
              <Text className="text-slate-300 text-sm">Existing Customer? </Text>
              <Text className="text-white font-bold text-sm underline">Log in here</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <Text className="text-slate-400 text-center text-xs mt-8">
            Fast • Reliable • Professional
          </Text>

        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;