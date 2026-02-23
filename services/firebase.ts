// firebaseConfig.ts

import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"; // User data phone එකේ save කරලා තියාගන්න
import { getFirestore } from "firebase/firestore" // Database 

// 1. Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyD1IWFsIxo9LAGyJiakYJqT7O6vbnYCrA8",
  authDomain: "queue-management-app-5a93a.firebaseapp.com",
  projectId: "queue-management-app-5a93a",
  storageBucket: "queue-management-app-5a93a.firebasestorage.app",
  messagingSenderId: "1043147846480",
  appId: "1:1043147846480:web:69a096d895c2eba5723255"
};

// 2. Firebase App එක Initialize කිරීම
// Config දත්ත පාවිච්චි කරලා App එක Backend එකට Connect කරනවා.
const app = initializeApp(firebaseConfig);

// 3. Authentication Configuration (ලොගින් පාලනය)
// මෙතනදී 'getReactNativePersistence' එක පාවිච්චි කරලා තියෙනවා. 
// ඒකෙන් කරන්නේ User ලොගින් වුණාම ඒ විස්තර 'AsyncStorage' එකේ (Phone memory) save කරන එක.
// එතකොට User ඇප් එක වහලා ආයේ ඇරියත් ලොගින් වෙලාම ඉන්න පුළුවන්.
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

// 4. Firestore Database එක Initialize කිරීම
// මුළු ඇප් එකේම දත්ත (Tokens, User data) store කරන්න මේ 'db' එක පාවිච්චි කරනවා.
export const db = getFirestore(app)