// firebaseConfig.ts
// lib/
import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyD1IWFsIxo9LAGyJiakYJqT7O6vbnYCrA8",
  authDomain: "queue-management-app-5a93a.firebaseapp.com",
  projectId: "queue-management-app-5a93a",
  storageBucket: "queue-management-app-5a93a.firebasestorage.app",
  messagingSenderId: "1043147846480",
  appId: "1:1043147846480:web:69a096d895c2eba5723255"
};

const app = initializeApp(firebaseConfig);

// for authenticate
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

// for data base
export const db = getFirestore(app)