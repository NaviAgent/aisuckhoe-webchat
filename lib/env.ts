import z from "zod";

// Schema cho client-side
const ENV = {
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  NEXT_PUBLIC_APP_LOGO:
    "https://res.cloudinary.com/aisuckhoe/image/upload/w_100,ar_1:1,c_fill,g_auto,e_art:hokusai/v1744884433/logo_lrpuv3.svg",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,

  // server env
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  POSTGRESQL_URL: process.env.POSTGRESQL_URL,
  FIREBASE_ADMIN_CERT_PATH: process.env.FIREBASE_ADMIN_CERT_PATH,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_TOKEN: process.env.REDIS_TOKEN,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_LOGO: z.string().url(),
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
});

const serverEnvSchema = z.object({
  CLERK_SECRET_KEY: z.string(),
  POSTGRESQL_URL: z.string(),
  FIREBASE_ADMIN_CERT_PATH: z.string(),
  REDIS_URL: z.string().url(),
  REDIS_TOKEN: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string(),
});

// Validate env dựa trên môi trường
const isServer = typeof window === "undefined";
// export const serverEnv = isServer ? serverEnvSchema.parse(ENV) : null;
// export const clientEnv = clientEnvSchema.parse(ENV);
export const getClientEnv = () => {
  console.log("ENV:client", ENV);
  return clientEnvSchema.parse(ENV);
};

export const getServerEnv = () => {
  console.log("ENV:server", ENV);
  if (isServer) return serverEnvSchema.parse(ENV);
  else throw new Error("Invalid env");
};
