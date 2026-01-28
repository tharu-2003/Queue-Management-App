import { View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, Alert, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { registerUser } from "@/services/authService";
import { useLoader } from "@/hooks/useLoader";
import { Ionicons } from '@expo/vector-icons';

const Register = () => {

  const router = useRouter()

  const { showLoader, hideLoader, isLoading } = useLoader()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comformPassword, setComformPassword] = useState("");


  const handleRegister = async () => {

    if(isLoading){
        return
    }

    if(!name || !email || !password){
        Alert.alert("Please fill all the fields!")
        return
    }

    if(password !== comformPassword){
        Alert.alert("Password Do not match!")
        return
    }

    try {
        showLoader()
        await registerUser(name, email, password)
        Alert.alert("Account created!")
        router.replace("/login")
    } catch (error) {
        Alert.alert("Register failed!")
    } finally{
        hideLoader()
    }
  }
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard?.dismiss}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' }}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Overlay */}
        <View className="flex-1 bg-black/40 justify-center items-center px-6">

          <Text className="text-4xl font-bold text-white mb-12">
            Create an Account
          </Text>

          {/* Name Input */}
          <View className="w-full bg-white/45 rounded-full px-5 py-2 mb-4 flex-row items-center">
            <Ionicons name="person-outline" size={20} color="gray" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
              className="flex-1 ml-3 text-gray-800"
            />
          </View>

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
          <View className="w-full bg-white/45 rounded-full px-5 py-2 mb-4 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="gray" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="flex-1 ml-3 text-gray-800"
            />
          </View>

          {/* Confirm Password Input */}
          <View className="w-full bg-white/45 rounded-full px-5 py-2 mb-6 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="gray" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              secureTextEntry
              value={comformPassword}
              onChangeText={setComformPassword}
              className="flex-1 ml-3 text-gray-800"
            />
          </View>

          {/* Create Button */}
          <TouchableOpacity 
            onPress={handleRegister}
            className="w-full bg-blue-400 rounded-3xl py-2 mb-2 border border-white/30 overflow-hidden"
            activeOpacity={0.7}
            >
            <Text className="text-white text-center font-semibold text-lg tracking-wider">
                CREATE
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center">
            <Text className="text-white">
              Don't you have an existing account?{" "}
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/login")}
            >
              <Text className="text-white font-bold text-sm underline">
                Log in
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default Register;