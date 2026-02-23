import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Login Function
 */
export const login = async (email:string, password: string) => {
    // Firebase eken dena built-in function eka use karanawa
    return await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Registration Function
 */
export const registerUser = async (
    name: string,
    email:string, 
    password: string
) => {
    // 1. Email saha Password use karala Firebase Auth wala account eka hadanawa
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    
    // 2. Firebase Auth Profile eka update karanawa (Display Name eka set kireema)
    await updateProfile(userCredentials.user , {
        displayName: name,
        photoURL: "" // Muladi photo ekak nathi nisa empty string ekak yanawa
    })

    // 3. Firestore Database eke "users" kiyana collection eke aluth Document ekak hadanawa
    // Document ID eka widiyata user ge unique 'uid' eka use karanawa
    await setDoc(doc(db, "users", userCredentials.user.uid), {
        name: name,
        role: "user", // Default role eka "user" widiyata danna puluwan
        email: email,
        createdAt: new Date() // Account eka hadapu welawa save karanawa
    })
    
    return userCredentials.user
}

/**
 * Logout Function
 * Firebase session eka iwara karala, phone eke thiyena local data clear karanawa.
 */
export const logout = async () => {
    // 1. Firebase Auth session eka iwara karanawa
    await signOut(auth)
    
    // 2. AsyncStorage clear kireema (Local storage eke thiyena tokens/data okkoma ain wenawa)
    await AsyncStorage.clear()
    
    return
}