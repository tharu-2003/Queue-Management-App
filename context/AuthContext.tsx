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
    
    // useEffect(() => {
    //     showLoader()
    //     const unscribe = onAuthStateChanged(auth, (user) =>{ 
    //     // onAuthStateChanged -> Database eka diha balagena idala change ekak wuna gaman trigger wenawa . meka listner ekak.
    //         setUser(user)

    //         hideLoader()
    //     })
    //     return () => unscribe() // return eka call karanakota listen karan inna eka off wenawa
    // }, [])

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
                displayName: userData.name || currentUser.displayName,
                photoURL: userData.image || currentUser.photoURL, 
                } as any);
            } else {
                setUser(currentUser);
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