import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getProfileImage, uploadFileToCloudinary } from "@/services/imageService";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/utils/userUtil";
import { logout } from "@/services/authService";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from "@expo/vector-icons";

const Profile = () => {

    const router = useRouter()

    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [userData, setUserData] = useState<any>({
        name: "",
        image: null
    });

    useEffect(() => {
        if (user) {
            setUserData({
                name: user?.displayName || "", 
                image: user?.photoURL || null
            });
        }
    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], 
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserData({ ...userData, image: result.assets[0] });
        }
    };

    const handleSaveProfile = async () => {
        if (!userData.name.trim()) {
            Alert.alert("Error", "Name cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const { name, image } = userData;
            let finalImageUrl = user?.photoURL;

            if (image && typeof image === 'object' && image.uri) {
                const uploadResp = await uploadFileToCloudinary(image, "profiles");
                if (uploadResp.success) {
                    finalImageUrl = uploadResp.data;
                } else {
                    Alert.alert("Error", "Cloudinary upload failed.");
                    setLoading(false);
                    return;
                }
            }

            const resp = await updateUser(user?.uid as string, {
                displayName: name,
                photoURL: finalImageUrl
            });

            if (resp.success) {
                if (setUser) {
                    setUser({
                        ...user,
                        displayName: name,
                        photoURL: finalImageUrl
                    } as any);
                }
                Alert.alert("Success", "Profile updated!");
                setIsEditing(false);
            } else {
                Alert.alert("Error", resp.msg);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        try {
            await logout();
            router.replace("/login")
        } catch (error) {
            console.log("Logout Error", error);
        }
    };

    return (
        // <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header Gradient Background */}
                <View className="relative">
                    <View className="h-40 bg-gradient-to-br from-indigo-600 to-purple-600">
                        <LinearGradient
                            colors={['#4F46E5', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="h-full w-full"
                        />
                    </View>

                    {/* Profile Image Container */}
                    <View className="items-center -mt-16 px-6">
                        <TouchableOpacity 
                            onPress={isEditing ? pickImage : undefined} 
                            disabled={loading}
                            activeOpacity={isEditing ? 0.7 : 1}
                        >
                            <View className="relative">
                                {/* Image with border and shadow */}
                                <View className="bg-white p-1.5 rounded-full shadow-lg">
                                    <Image
                                        source={getProfileImage(userData.image)}
                                        className="w-32 h-32 rounded-full bg-gray-200"
                                    />
                                </View>
                                
                                {isEditing && (
                                    <View className="absolute bottom-1 right-1 bg-indigo-600 rounded-full p-3 border-4 border-white shadow-lg">
                                        <Text style={{ fontSize: 16 }}>📷</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Name and Email */}
                        <View className="items-center mt-4 mb-6">
                            {isEditing ? (
                                <View className="w-full px-4">
                                    <TextInput
                                        value={userData.name}
                                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                                        className="text-2xl font-bold text-gray-900 bg-white border-2 border-indigo-600 rounded-xl px-4 py-3 mb-2 text-center shadow-sm"
                                        placeholder="Enter name"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            ) : (
                                <Text className="text-3xl font-bold text-gray-900 mb-1">
                                    {userData.name || "No Name"}
                                </Text>
                            )}
                            <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full mt-2">
                                <Text className="text-sm">✉️</Text>
                                <Text className="text-gray-600 ml-2 font-medium">{user?.email}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-6">
                    {/* Action Buttons */}
                    <TouchableOpacity
                        onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={loading}
                        className={`${loading ? 'bg-indigo-400' : 'bg-indigo-600'} p-4 rounded-2xl mb-3 shadow-lg`}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <View className="flex-row items-center justify-center">
                                <ActivityIndicator color="#fff" />
                                <Text className="text-white ml-3 font-semibold text-base">Processing...</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center justify-center">
                                <Text className="text-2xl mr-2">{isEditing ? "💾" : "✏️"}</Text>
                                <Text className="text-white font-bold text-base">
                                    {isEditing ? "Save Profile" : "Edit Profile"}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {isEditing && !loading && (
                        <TouchableOpacity
                            onPress={() => {
                                setIsEditing(false);
                                setUserData({ name: user?.displayName, image: user?.photoURL });
                            }}
                            className="bg-gray-200 p-4 rounded-2xl mb-6 border-2 border-gray-300"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center justify-center">
                                <Text className="text-xl mr-2">❌</Text>
                                <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Account Information Card */}
                    <View className="bg-white rounded-3xl p-6 mb-6 shadow-md border border-gray-100">
                        <View className="flex-row items-center mb-5">
                            <View className="bg-indigo-100 p-2 rounded-xl mr-3">
                                <Text className="text-2xl">👤</Text>
                            </View>
                            <Text className="text-gray-900 font-bold text-lg">Account Information</Text>
                        </View>

                        {/* Info Row 1 */}
                        <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                            <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">Full Name</Text>
                            <Text className="text-gray-900 font-semibold text-base">
                                {userData.name || "Not Set"}
                            </Text>
                        </View>

                        {/* Info Row 2 */}
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">Email Address</Text>
                            <Text className="text-gray-900 font-semibold text-base">{user?.email}</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="mx-6 mt-6 gap-2 space-y-3">
        
                        {/* Privacy Settings */}
                        <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
                        <View className="flex-row items-center">
                            <View className="bg-blue-100 p-2.5 rounded-full">
                            <Feather name="shield" size={18} color="#3B82F6" />
                            </View>
                            <Text className="text-gray-900 font-medium ml-4">Privacy Settings</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Notifications */}
                        <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
                        <View className="flex-row items-center">
                            <View className="bg-yellow-100 p-2.5 rounded-full">
                            <Feather name="bell" size={18} color="#F59E0B" />
                            </View>
                            <Text className="text-gray-900 font-medium ml-4">Notifications</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Help & Support */}
                        <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
                        <View className="flex-row items-center">
                            <View className="bg-green-100 p-2.5 rounded-full">
                            <Feather name="help-circle" size={18} color="#10B981" />
                            </View>
                            <Text className="text-gray-900 font-medium ml-4">Help & Support</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    <View className="mx-6 mt-6 mb-8">
                        <TouchableOpacity 
                            className="bg-red-500 p-4 rounded-2xl flex-row items-center justify-center shadow-md"
                            onPress={onLogout}
                            activeOpacity={0.7}
                        >
                            <Feather name="log-out" size={18} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">Log Out</Text>
                        </TouchableOpacity>
                    </View>

                   
                </View>
            </ScrollView>
        // </SafeAreaView>
    );
};

export default Profile;