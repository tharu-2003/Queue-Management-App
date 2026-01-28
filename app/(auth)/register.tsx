import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { registerUser } from "@/services/authService";
import { useLoader } from "@/hooks/useLoader";

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
        Alert.alert("please fill all the fields..!")
        return
    }

    if(password !== comformPassword){
        Alert.alert("Password Do not match..!")
        return
    }

    try {
        showLoader()
        await registerUser(name, email, password)
        Alert.alert("Acount created..!")
        router.replace("/login")
    } catch (error) {
        Alert.alert("Register failed..!")
    } finally{
        hideLoader()
    }
  }
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard?.dismiss}>
        <View className="flex-1 bg-gray-100 px-6 justify-center items-center">

        <Text className="text-4xl font-bold text-gray-900">
            Create Account ✨
        </Text>

        <Text className="text-gray-500 mb-8">
            Register to get started
        </Text>

        <TextInput
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            className="w-full bg-white p-4 rounded-2xl mb-4 border border-gray-300"
        />

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

        <TextInput
            placeholder="Comform Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={comformPassword}
            onChangeText={setComformPassword}
            className="w-full bg-white p-4 rounded-2xl mb-4 border border-gray-300"
        />

        <TouchableOpacity 
            onPress={handleRegister}
            className="w-full bg-indigo-600 p-4 rounded-2xl mt-2">
                
            <Text className="text-white text-center font-semibold text-lg">
            Register
            </Text>
        </TouchableOpacity>

        <View className="w-full flex-row justify-center mt-4">
            <Text className="text-gray-600 mt-4">
                Already have an account?{" "}
                <TouchableOpacity 
                    onPress={
                        () => {
                            // router.push("/login")
                            // router.replace("/login")
                            router.back()
                        }
                    }>
                    <Text className="text-indigo-600 font-bold"> Login </Text>
                </TouchableOpacity>
            </Text>
        </View>

        </View>
    </ TouchableWithoutFeedback>
  );
};

export default Register;
