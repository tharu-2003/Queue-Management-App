import { auth, db } from "@/services/firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

interface ResponseType {
    success: boolean;
    msg?: string;
}

export const updateUser = async (
    uid: string,
    updatedData: any
): Promise<ResponseType> => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, updatedData);

        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: updatedData.displayName,
                photoURL: updatedData.photoURL
            });
        }
        return { success: true, msg: "Updated successfully" };
    } catch (error: any) {
        console.log("Error updating user: ", error);
        return { success: false, msg: error?.message };
    }
};