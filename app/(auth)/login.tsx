import { View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
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
  
  const router = useRouter();

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    if (!email || !password) {
      Alert.alert("Please fill all the fields!");
      return;
    }

    try {
      showLoader();
      await login(email, password);
      Alert.alert("Successfully logged in!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Failed!");
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
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' }}
          className="flex-1"
          resizeMode="cover"
        >
          {/* Overlay */}
          <View className="flex-1 bg-black/40 justify-center items-center px-6">

            <Text className="text-4xl font-bold text-white mb-12">
              Welcome Back
            </Text>

            {/* Email Input */}
            <View className="w-full bg-white/45 rounded-full px-5 py-2 mb-4 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="gray" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-800"
              />
            </View>

            {/* Password Input */}
            <View className="w-full bg-white/45 rounded-full px-5 py-2 mb-6 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="gray" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-3 text-gray-800"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              className="w-full bg-blue-400 rounded-3xl py-2 mb-2 border border-white/30 overflow-hidden"
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? "Signing in..." : "Log in"}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row items-center">
              <Text className="text-white">
                Don't you have an existing account?{" "}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/register")}
              >
                <Text className="text-white font-bold text-sm underline">
                  Sign Up
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