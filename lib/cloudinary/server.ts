import { v2 } from "cloudinary"; // Try default import
import { getClientEnv, getServerEnv } from "../env";

// Configure Cloudinary (ensure environment variables are set)
// Note: Ensure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set in your .env
export async function initCloudinary() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();
  v2.config({
    // Access config via v2 property
    cloud_name: clientEnv!.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: clientEnv!.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: serverEnv!.CLOUDINARY_API_SECRET,
    secure: true, // Recommended for secure URLs
  });
  return v2;
}
