import { View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, Modal, TouchableWithoutFeedback, ActivityIndicator, Platform } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/authService";
import { useLoader } from "@/hooks/useLoader";
import { Ionicons } from '@expo/vector-icons';

const Register = () => {
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useLoader();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comformPassword, setComformPassword] = useState("");
  
  // Custom Alert States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", msg: "", type: "success" as "success" | "error" });

  const showAlert = (title: string, msg: string, type: "success" | "error") => {
    setAlertConfig({ title, msg, type });
    setAlertVisible(true);
  };

  const handleRegister = async () => {
    if (isLoading) return;

    if (!name || !email || !password) {
      showAlert("Missing Info", "Please fill all the fields!", "error");
      return;
    }

    if (password !== comformPassword) {
      showAlert("Password Error", "Passwords do not match!", "error");
      return;
    }

    try {
      showLoader();
      await registerUser(name, email, password);
      showAlert("Success! 🎉", "Your account has been created successfully.", "success");
      
      // Navigate to login after a short delay
      setTimeout(() => {
        setAlertVisible(false);
        router.replace("/login");
      }, 2000);

    } catch (error) {
      showAlert("Register Failed", "Something went wrong. Please try again.", "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        {/* --- CUSTOM ALERT MODAL --- */}
        <Modal
          visible={alertVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAlertVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60 px-8">
            <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
              <View className={`${alertConfig.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'} p-6 rounded-full mb-6`}>
                <Ionicons 
                  name={alertConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                  size={50} 
                  color={alertConfig.type === 'success' ? "#10b981" : "#ef4444"} 
                />
              </View>
              
              <Text className="text-slate-800 text-2xl font-black text-center mb-2">
                {alertConfig.title}
              </Text>
              
              <Text className="text-slate-500 text-center text-base mb-8 leading-5 px-2">
                {alertConfig.msg}
              </Text>

              <TouchableOpacity 
                onPress={() => setAlertVisible(false)}
                className={`w-full ${alertConfig.type === 'success' ? 'bg-indigo-600' : 'bg-red-500'} py-4 rounded-[20px] shadow-lg`}
              >
                <Text className="text-white text-center font-bold text-lg">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' }}
          className="flex-1"
          resizeMode="cover"
        >
          {/* Overlay */}
          <View className="flex-1 bg-black/45 justify-center items-center px-8">

            <Text className="text-4xl font-black text-white mb-2 tracking-tight text-center">
              Join Us
            </Text>
            <Text className="text-slate-300 text-base mb-10 text-center">
              Start managing your queue efficiently
            </Text>

            {/* Name Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-4 flex-row items-center">
              <Ionicons name="person-outline" size={20} color="#e2e8f0" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#cbd5e1"
                value={name}
                onChangeText={setName}
                className="flex-1 ml-4 text-white font-medium"
              />
            </View>

            {/* Email Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-4 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="#e2e8f0" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#cbd5e1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-4 text-white font-medium"
              />
            </View>

            {/* Password Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-4 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#e2e8f0" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#cbd5e1"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-4 text-white font-medium"
              />
            </View>

            {/* Confirm Password Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-10 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#e2e8f0" />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#cbd5e1"
                secureTextEntry
                value={comformPassword}
                onChangeText={setComformPassword}
                className="flex-1 ml-4 text-white font-medium"
              />
            </View>

            {/* Create Button */}
            <TouchableOpacity 
              onPress={handleRegister}
              className="w-full bg-indigo-500 rounded-full py-5 mb-6 shadow-xl shadow-indigo-400/50 border border-indigo-400"
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-black text-lg tracking-wider">
                    CREATE ACCOUNT
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row items-center">
              <Text className="text-slate-200">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/login")}
              >
                <Text className="text-white font-bold text-base underline">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;