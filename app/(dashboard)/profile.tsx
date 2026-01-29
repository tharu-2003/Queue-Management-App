import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getProfileImage, uploadFileToCloudinary } from "@/services/imageService";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/utils/userUtil";
import { logout } from "@/services/authService";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from "@expo/vector-icons";

const Profile = () => {
    const router = useRouter()
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // --- Custom Modal States ---
    const [saveAlertVisible, setSaveAlertVisible] = useState(false);
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: "", msg: "", type: "success" as "success" | "error" });

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
            setAlertConfig({ title: "Error", msg: "Name cannot be empty", type: "error" });
            setSaveAlertVisible(true);
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
                    setAlertConfig({ title: "Error", msg: "Image upload failed.", type: "error" });
                    setSaveAlertVisible(true);
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
                    setUser({ ...user, displayName: name, photoURL: finalImageUrl } as any);
                }
                setAlertConfig({ title: "Success", msg: "Profile updated successfully!", type: "success" });
                setSaveAlertVisible(true);
                setIsEditing(false);
            }
        } catch (error) {
            setAlertConfig({ title: "Error", msg: "Something went wrong.", type: "error" });
            setSaveAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        setLogoutAlertVisible(false);
        try {
            await logout();
            router.replace("/login")
        } catch (error) {
            console.log("Logout Error", error);
        }
    };

    return (
        <View className="flex-1">
            {/* --- SAVE / GENERAL ALERT MODAL --- */}
            <Modal visible={saveAlertVisible} transparent={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50 px-8">
                    <View className="bg-white w-full rounded-[35px] p-8 items-center shadow-2xl">
                        <View className={`${alertConfig.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'} p-5 rounded-full mb-5`}>
                            <Ionicons 
                                name={alertConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                                size={40} 
                                color={alertConfig.type === 'success' ? "#10b981" : "#ef4444"} 
                            />
                        </View>
                        <Text className="text-gray-900 text-2xl font-bold text-center mb-2">{alertConfig.title}</Text>
                        <Text className="text-gray-500 text-center text-base mb-8">{alertConfig.msg}</Text>
                        <TouchableOpacity 
                            onPress={() => setSaveAlertVisible(false)}
                            className={`w-full ${alertConfig.type === 'success' ? 'bg-indigo-600' : 'bg-red-500'} py-4 rounded-2xl`}
                        >
                            <Text className="text-white text-center font-bold text-base">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            <Modal visible={logoutAlertVisible} transparent={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50 px-8">
                    <View className="bg-white w-full rounded-[35px] p-8 items-center shadow-2xl">
                        <View className="bg-orange-100 p-5 rounded-full mb-5">
                            <Feather name="log-out" size={40} color="#f97316" />
                        </View>
                        <Text className="text-gray-900 text-2xl font-bold text-center mb-2">Logout</Text>
                        <Text className="text-gray-500 text-center text-base mb-8">Are you sure you want to log out from your account?</Text>
                        <View className="flex-row gap-3 w-full">
                            <TouchableOpacity onPress={() => setLogoutAlertVisible(false)} className="flex-1 bg-gray-100 py-4 rounded-2xl">
                                <Text className="text-gray-600 text-center font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onLogout} className="flex-1 bg-red-500 py-4 rounded-2xl shadow-lg shadow-red-200">
                                <Text className="text-white text-center font-bold">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View className="flex-1 bg-blue-50 bottom-16" >
                {/* Header Section */}
                <View className="relative">
                    <View className="h-36 bg-gradient-to-br from-indigo-600 to-purple-600">
                        <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="h-full w-full" />
                    </View>

                    {/* Profile Image */}
                    <View className="items-center -mt-16 px-6">
                        <TouchableOpacity onPress={isEditing ? pickImage : undefined} disabled={loading} activeOpacity={isEditing ? 0.7 : 1}>
                            <View className="relative">
                                <View className="bg-white p-1.5 rounded-full shadow-lg">
                                    <Image source={getProfileImage(userData.image)} className="w-32 h-32 rounded-full bg-gray-200" />
                                </View>
                                {isEditing && (
                                    <View className="absolute bottom-1 right-1 bg-indigo-600 rounded-full p-3 border-4 border-white shadow-lg">
                                        <Text style={{ fontSize: 16 }}>📷</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>

                        <View className="items-center mt-4 mb-6">
                            {isEditing ? (
                                <View className="w-full px-4">
                                    <TextInput
                                        value={userData.name}
                                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                                        className="text-2xl font-bold text-gray-900 bg-white border-2 border-indigo-600 rounded-xl px-4 py-3 mb-2 text-center"
                                        placeholder="Enter name"
                                    />
                                </View>
                            ) : (
                                <Text className="text-3xl font-bold text-gray-900 mb-1">{userData.name || "No Name"}</Text>
                            )}
                            <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full mt-2">
                                <Text className="text-sm">✉️</Text>
                                <Text className="text-gray-600 ml-2 font-medium">{user?.email}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-6">
                    {/* Save / Edit Buttons */}
                    <TouchableOpacity
                        onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={loading}
                        className={`${loading ? 'bg-indigo-400' : 'bg-indigo-600'} p-4 rounded-2xl mb-3 shadow-lg`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View className="flex-row items-center justify-center">
                                <Text className="text-2xl mr-2">{isEditing ? "💾" : "✏️"}</Text>
                                <Text className="text-white font-bold text-base">{isEditing ? "Save Profile" : "Edit Profile"}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {isEditing && !loading && (
                        <TouchableOpacity onPress={() => setIsEditing(false)} className="bg-gray-200 p-4 rounded-2xl mb-6 border-2 border-gray-300">
                            <Text className="text-gray-700 text-center font-bold">Cancel</Text>
                        </TouchableOpacity>
                    )}

                    {/* Info Card */}
                    <View className="bg-white rounded-3xl p-6 mb-6 shadow-md border border-gray-100">
                        <Text className="text-gray-900 font-bold text-lg mb-5">👤 Account Information</Text>
                        <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                            <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">Full Name</Text>
                            <Text className="text-gray-900 font-semibold text-base">{userData.name || "Not Set"}</Text>
                        </View>
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">Email Address</Text>
                            <Text className="text-gray-900 font-semibold text-base">{user?.email}</Text>
                        </View>
                    </View>

                    {/* Settings Actions */}
                    <View className="mx-0 gap-2">
                        <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
                            <View className="flex-row items-center">
                                <Feather name="shield" size={18} color="#3B82F6" />
                                <Text className="text-gray-900 font-medium ml-4">Privacy Settings</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
                            <View className="flex-row items-center">
                                <Feather name="bell" size={18} color="#F59E0B" />
                                <Text className="text-gray-900 font-medium ml-4">Notifications</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Logout Trigger */}
                    <View className="mt-8 mb-12">
                        <TouchableOpacity 
                            className="bg-red-500 p-4 rounded-2xl flex-row items-center justify-center shadow-md"
                            onPress={() => setLogoutAlertVisible(true)}
                        >
                            <Feather name="log-out" size={18} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Profile;