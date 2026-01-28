// tokenService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "./firebase";
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

/**
 * Token Data Type
 */
export type TokenData = {
  id?: string; // Firestore doc id
  userId: string;
  token: string;
  serviceCenter: string;
  serviceName: string;
  createdAt: Date;
  queuePosition: number;
  estimatedTime: string; // e.g., "15 minutes"
  status: "active" | "cancelled" | "completed" | "expired";
};

/**
 * Save a new token for the current user
 */
export const saveUserToken = async (
  serviceCenter: string,
  serviceName: string
): Promise<TokenData | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  // Generate token string (e.g., B-102)
  const tokenNumber = Math.floor(100 + Math.random() * 900);
  const token = `${serviceCenter.charAt(0)}-${tokenNumber}`;

  // Example: queue position & estimated time
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
    status: "active", // default active
  };

  // Save in Firestore in separate "tokens" collection
  const tokensCollectionRef = collection(db, "tokens");
  const docRef = await addDoc(tokensCollectionRef, tokenData);

  return { ...tokenData, id: docRef.id };
};

/**
 * Cancel a token by setting status = "cancelled"
 */
export const cancelToken = async (tokenId: string) => {
  if (!tokenId) return;
  const tokenRef = doc(db, "tokens", tokenId);
  await updateDoc(tokenRef, { status: "cancelled" });
};

/**
 * Get all active tokens for current logged-in user
 */
export const getActiveTokens = async (): Promise<TokenData[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const tokensRef = collection(db, "tokens");
  const q = query(
    tokensRef,
    where("userId", "==", user.uid),
    where("status", "==", "active")
  );

  const querySnapshot = await getDocs(q);
  const tokens: TokenData[] = [];

  querySnapshot.forEach((doc) => {
    tokens.push({ id: doc.id, ...doc.data() } as TokenData);
  });

  return tokens;
};

/**
 * Optional: Complete token (status = "completed")
 */
export const completeToken = async (tokenId: string) => {
  if (!tokenId) return;
  const tokenRef = doc(db, "tokens", tokenId);
  await updateDoc(tokenRef, { status: "completed" });
};

/**
 * Optional: Expire token (status = "expired")
 */
export const expireToken = async (tokenId: string) => {
  if (!tokenId) return;
  const tokenRef = doc(db, "tokens", tokenId);
  await updateDoc(tokenRef, { status: "expired" });
};
