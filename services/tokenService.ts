// tokenService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "./firebase";
import { collection, addDoc, query, where, getDocs, doc, updateDoc , orderBy} from "firebase/firestore";

/**
 * 1. Token Data Type
 * TypeScript interface එකක් පාවිච්චි කරලා Token එකක තියෙන්න ඕනේ දත්ත වල ව්‍යුහය හදලා තියෙනවා.
 */
export type TokenData = {
  id?: string;           
  userId: string;        
  token: string;          
  serviceCenter: string;  
  serviceName: string;    
  createdAt: Date;        
  queuePosition: number;  
  estimatedTime: string; 
  status: "active" | "cancelled" | "completed" | "expired"; 
};

/**
 * 2. Save a new token
 */
export const saveUserToken = async (
  serviceCenter: string,
  serviceName: string
): Promise<TokenData | null> => {
  const user = auth.currentUser; // දැනට Login වී සිටින User ව ලබා ගැනීම
  if (!user) return null; 

  // Genarate Random Token (e.g., Bank එකක් නම් B-542 වගේ)
  const tokenNumber = Math.floor(100 + Math.random() * 900);
  const token = `${serviceCenter.charAt(0).toUpperCase()}-${tokenNumber}`;

  // පෝලිමේ ස්ථානය සහ කාලය දැනට Mock logic එකක් ලෙස සාදා ගනියි
  const queuePosition = Math.floor(Math.random() * 10) + 1;
  const estimatedTime = `${queuePosition * 5} minutes`;

  const tokenData: TokenData = {
    userId: user.uid,
    token,
    serviceCenter,
    serviceName,
    createdAt: new Date(),
    queuePosition,
    estimatedTime,
    status: "active", 
  };

  // Firestore එකේ "tokens" කියන collection එකට දත්ත ඇතුළත් කිරීම
  const tokensCollectionRef = collection(db, "tokens");
  const docRef = await addDoc(tokensCollectionRef, tokenData);

  return { ...tokenData, id: docRef.id }; // සාර්ථකව අවසන් වූ පසු ID එකත් සමඟ දත්ත ආපසු ලබා දෙයි
};

/**
 * 3. Cancel a token
 */
export const cancelToken = async (tokenId: string) => {
  if (!tokenId) return;
  const tokenRef = doc(db, "tokens", tokenId);
  // මුළු document එකම මකන්නේ නැතුව status එක විතරක් update කිරීම වඩාත් සුදුසුයි
  await updateDoc(tokenRef, { status: "cancelled" });
};

/**
 * 4. Get all active tokens
 */
export const getActiveTokens = async (): Promise<TokenData[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const tokensRef = collection(db, "tokens");
  
  // Firebase Query: අදාළ user ගේ සහ තත්ත්වය active වන දත්ත පමණක් ලබා ගැනීමට
  const q = query(
    tokensRef,
    where("userId", "==", user.uid),
    where("status", "==", "active")
  );

  const querySnapshot = await getDocs(q);
  const tokens: TokenData[] = [];

  querySnapshot.forEach((doc) => {
    // Document ID එක සහ දත්ත එකතු කර array එකක් සාදයි
    tokens.push({ id: doc.id, ...doc.data() } as TokenData);
  });

  return tokens;
};

/**
 * 5. Get Token History
 */
export const getTokenHistory = async (): Promise<TokenData[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const tokensRef = collection(db, "tokens");
  
  const q = query(tokensRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  // Active තත්ත්වයේ නැති දත්ත පමණක් filter කර ලබා දෙයි
  const history: TokenData[] = snapshot.docs
    .map(doc => ({ id: doc.id, ...(doc.data() as TokenData) }))
    .filter(token => token.status !== "active"); 

  return history;
};