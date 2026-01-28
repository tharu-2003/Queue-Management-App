    import { useLoader } from "@/hooks/useLoader";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType{
    user: User | null
    loading: boolean,
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    setUser: () => { },
})

export const AuthProvider = ({ children } : { children: ReactNode }) => {

    const { showLoader, hideLoader, isLoading } = useLoader()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
    showLoader();

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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

                hideLoader()
            } else {
                setUser(currentUser);

                hideLoader()
            }
            } catch (error) {
            console.log("Error fetching user doc: ", error);
            setUser(currentUser);
            }
        } else {
            setUser(null);
        }
        hideLoader();
        });

        return () => unsub();
    }, []);

    return(
        <AuthContext.Provider value={{ user, loading:isLoading , setUser}}>
            {children}
        </AuthContext.Provider>
    )
}