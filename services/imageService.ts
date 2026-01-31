import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants';
import axios from 'axios';

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;

export const uploadFileToCloudinary = async (file: any, folderName: string) => {
    try {
        if (!file || !file.uri) return { success: false, msg: "No file provided" };

        const formData = new FormData();
        
        // MimeType eka dynamic ganna eka thama 400 error eka nathi karanna hodama widiha
        const type = file.mimeType || "image/jpeg";
        const name = file.fileName || file.uri.split("/").pop() || "upload.jpg";

        formData.append("file", {
            uri: file.uri,
            type: type,
            name: name,
        } as any);

        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", folderName);

        const response = await axios.post(CLOUDINARY_API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return { success: true, data: response.data.secure_url };
    } catch (error: any) {
        console.log("Cloudinary Upload Error Details:", error.response?.data || error.message);
        return { success: false, msg: error.message };
    }
};

// export const getProfileImage = (file: any) => {
//     if (!file) return require("../assets/images/defaultProfile.png");
//     if (typeof file === 'string' || typeof file === 'object') return { uri: file };
//     if (file.uri) return { uri: file.uri };
//     return require("../assets/images/defaultProfile.png");
// };

export const getProfileImage = (file: any) => {
    if (!file) {
        return require("../assets/images/defaultProfile.png");
    }

    if (typeof file === 'string') {
        return { uri: file };
    }

    if (typeof file === 'object' && file.uri) {
        return { uri: file.uri };
    }

    return require("../assets/images/defaultProfile.png");
}