import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"


export const login = async (email:string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
}

export const registerUser = async (
    name: string,
    email:string, 
    password: string
) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredentials.user , {
        displayName: name,
        photoURL: ""
    })

    // role
    // firestore(db)
    setDoc(doc(db, "users", userCredentials.user.uid), {
        name, // name: name
        role: "",
        email,
        createdAt: new Date()
    })
    // database instance, collection, document id, document
    return userCredentials.user
}

export const logout = async () => {
    await signOut(auth)
    AsyncStorage.clear()
    // AsyncStorage.setItem("key", {})
    // AsyncStorage.setItem("key")
    return
}