import { View, Text, TextInput, Pressable, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { login } from "@/services/authService";

const Loging = () => {

  const { showLoader, hideLoader, isLoading } = useLoader()
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

    const handleLogin = async () => {
  
      if(isLoading){
          return
      }
  
      if(!email || !password || isLoading){
          Alert.alert("please fill all the fields..!")
          return
      }
  
      try {
          showLoader()
          await login( email, password)
          Alert.alert("Successfuly Loging..!")
          router.replace("/home")
      } catch (error) {
          Alert.alert("Login failed..!")
      } finally{
          hideLoader()
      }
    }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-100 px-6 justify-center items-center">

        <Text className="text-4xl font-bold text-gray-900">Welcome Back 👋</Text>
        <Text className="text-gray-500 mb-8">Login to continue</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          className="w-full bg-white p-4 rounded-2xl mb-4 border border-gray-300"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="w-full bg-white p-4 rounded-2xl mb-4 border border-gray-300"
        />

        <Pressable
          className="w-full bg-indigo-600 p-4 rounded-2xl"
          onPress={handleLogin }
        >
          <Text className="text-white text-center font-semibold text-lg">Login</Text>
        </Pressable>

        {/* Register Link */}
        <View className="w-full flex-row justify-center mt-4">
          <Text className="text-gray-600">
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-indigo-600 font-bold">Register</Text>
            </TouchableOpacity>
          </Text>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default Loging;
