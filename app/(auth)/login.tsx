import { View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { login } from "@/services/authService";
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const { showLoader, hideLoader, isLoading } = useLoader();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom Alert States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", msg: "", type: "success" as "success" | "error" });

  const router = useRouter();

  const showAlert = (title: string, msg: string, type: "success" | "error") => {
    setAlertConfig({ title, msg, type });
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      showAlert("Missing Info", "Please fill all the fields!", "error");
      return;
    }

    try {
      showLoader();
      await login(email, password);
      showAlert("Welcome!", "Successfully logged in!", "success");
      
      // Modal eka dakinna podi delay ekak dala navigate karamu
      setTimeout(() => {
        setAlertVisible(false);
        router.replace("/home");
      }, 1500);

    } catch (error) {
      showAlert("Login Failed", "Invalid email or password. Please try again.", "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* --- CUSTOM ALERT MODAL --- */}
        <Modal
          visible={alertVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAlertVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60 px-8">
            <View className="bg-white w-full rounded-[35px] p-8 items-center shadow-2xl">
              <View className={`${alertConfig.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'} p-5 rounded-full mb-5`}>
                <Ionicons 
                  name={alertConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                  size={40} 
                  color={alertConfig.type === 'success' ? "#10b981" : "#ef4444"} 
                />
              </View>
              
              <Text className="text-slate-800 text-2xl font-black text-center mb-2">
                {alertConfig.title}
              </Text>
              
              <Text className="text-slate-500 text-center text-base mb-8 leading-5">
                {alertConfig.msg}
              </Text>

              <TouchableOpacity 
                onPress={() => setAlertVisible(false)}
                className={`w-full ${alertConfig.type === 'success' ? 'bg-indigo-600' : 'bg-red-500'} py-4 rounded-2xl shadow-lg`}
              >
                <Text className="text-white text-center font-bold text-base uppercase tracking-wider">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' }}
          className="flex-1"
          resizeMode="cover"
        >
          <View className="flex-1 bg-black/40 justify-center items-center px-6">
            <Text className="text-4xl font-black text-white mb-12 tracking-tight">
              Welcome Back
            </Text>

            {/* Email Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-4 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="white" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#cbd5e1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-4 text-white font-medium"
              />
            </View>

            {/* Password Input */}
            <View className="w-full bg-white/20 border border-white/30 rounded-full px-6 py-4 mb-8 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="white" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#cbd5e1"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-4 text-white font-medium"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              className="w-full bg-indigo-500 rounded-full py-5 mb-6 shadow-xl shadow-indigo-400/50 border border-indigo-400"
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Log In</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row items-center">
              <Text className="text-slate-200">
                New here?{" "}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/register")}
              >
                <Text className="text-white font-black text-base underline">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;