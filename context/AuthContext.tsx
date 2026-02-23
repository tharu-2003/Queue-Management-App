import { useLoader } from "@/hooks/useLoader";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;     
    loading: boolean;      
    setUser: (user: User | null) => void; // User ව update කරන්න පාවිච්චි කරන function එක
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    setUser: () => { },
})

// 3. AuthProvider: මුළු App එකම wrap කරලා දත්ත බෙදාහරින ප්‍රධාන component එක
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const { showLoader, hideLoader, isLoading } = useLoader() 
    const [user, setUser] = useState<User | null>(null)     

    useEffect(() => {
        showLoader();

        // Firebase Auth listener එක - User login/logout වෙන එක නිරන්තරයෙන් අවධානයෙන් ඉන්නවා
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User කෙනෙක් ඉන්නවා නම්, Firestore එකේ "users" collection එකෙන් එයාගේ වැඩිදුර විස්තර ගන්නවා
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        
                        setUser({
                            ...currentUser,
                            displayName: currentUser.displayName,
                            photoURL: currentUser.photoURL, 
                        } as any);

                        hideLoader();
                    } else {
                        // Firestore එකේ doc එකක් නැත්නම් තියෙන currentUser දත්ත ඒ විදිහටම ගන්නවා
                        setUser(currentUser);
                        hideLoader();
                    }
                } catch (error) {
                    console.log("Error fetching user doc: ", error);
                    setUser(currentUser);
                }
            } else {
                // User කෙනෙක් login වෙලා නැත්නම් user null කරනවා
                setUser(null);
            }
            hideLoader();
        });

        // Component එක unmount වෙද්දී listener එක නවත්වනවා (Memory leak නොවෙන්න)
        return () => unsub();
    }, []);

    return (
        // මුළු ඇප් එකටම user, loading සහ setUser කියන තුනම ලබා දෙනවා
        <AuthContext.Provider value={{ user, loading: isLoading, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}