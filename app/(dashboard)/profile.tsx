import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getProfileImage, uploadFileToCloudinary } from "@/services/imageService";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/utils/userUtil";
import { logout } from "@/services/authService";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {

    const router = useRouter()

    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [userData, setUserData] = useState<any>({
        name: "",
        image: null // Firebase eke photoURL eka methanata thama enne
    });

    useEffect(() => {
    if (user) {
        setUserData({
            // Firestore එකේ field එක photoURL නම් ඒක අනිවාර්යයෙන් දෙන්න
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
            // Local image eka state ekata damma
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
            let finalImageUrl = user?.photoURL; // Baseline URL

            // 1. Aluth image ekak pick karala nam eka upload karanna
            if (image && typeof image === 'object' && image.uri) {
                const uploadResp = await uploadFileToCloudinary(image, "profiles");
                if (uploadResp.success) {
                    finalImageUrl = uploadResp.data; // Cloudinary secure_url eka
                } else {
                    Alert.alert("Error", "Cloudinary upload failed.");
                    setLoading(false);
                    return;
                }
            }

            // 2. Firebase Update (Firestore update)
            // Firebase eke fields 'displayName' saha 'photoURL' widihata update karanawa
            const resp = await updateUser(user?.uid as string, {
                displayName: name,
                photoURL: finalImageUrl
            });

            if (resp.success) {
                // Local state update eka (Auth Context)
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
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <ScrollView className="flex-1 bg-gray-100 px-6">
                <View className="items-center mb-8 mt-6">
                    <TouchableOpacity onPress={isEditing ? pickImage : undefined} disabled={loading}>
                        <Image
                            // getProfileImage kiyana eka imageService eke thiyena eka use karanna
                            source={getProfileImage(userData.image)}
                            className="w-24 h-24 rounded-full mb-4 bg-gray-200"
                        />
                        {isEditing && (
                            <View className="absolute bottom-2 right-0 bg-indigo-600 rounded-full p-2 border-2 border-white">
                                <Text style={{ fontSize: 10 }}>📷</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {isEditing ? (
                        <TextInput
                            value={userData.name}
                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                            className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-600 px-2 mb-2 w-full text-center"
                            placeholder="Enter name"
                        />
                    ) : (
                        <Text className="text-2xl font-bold text-gray-900">{userData.name || "No Name"}</Text>
                    )}
                    <Text className="text-gray-500">{user?.email}</Text>
                </View>

                {/* Edit/Save Button */}
                <TouchableOpacity
                    onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={loading}
                    className={`${loading ? 'bg-indigo-400' : 'bg-indigo-600'} p-4 rounded-2xl mb-4`}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : (
                        <Text className="text-white text-center font-semibold text-lg">
                            {isEditing ? "Save Profile" : "Edit Profile"}
                        </Text>
                    )}
                </TouchableOpacity>

                {isEditing && !loading && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsEditing(false);
                            // Parana data tika ayeth set karanawa
                            setUserData({ name: user?.displayName, image: user?.photoURL });
                        }}
                        className="bg-gray-400 p-4 rounded-2xl mb-6"
                    >
                        <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
                    </TouchableOpacity>
                )}

                {/* Account Info */}
                <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                    <Text className="text-gray-700 font-bold mb-4">Account Information</Text>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-500">Full Name</Text>
                        <Text className="text-gray-900 font-medium">{userData.name}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Email Address</Text>
                        <Text className="text-gray-900 font-medium">{user?.email}</Text>
                    </View>
                </View>

                <TouchableOpacity className="bg-red-100 p-4 rounded-2xl mb-10" onPress={onLogout}>
                    <Text className="text-red-600 text-center font-semibold text-lg">Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;