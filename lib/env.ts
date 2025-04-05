// Schema cho client-side
export const clientEnv = {
  app: {
    logo: "https://res.cloudinary.com/ivanistao/image/upload/t_Profile/v1740834460/aisuckhoe/logo/logo-light_a53s1a.png",
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  clerk: {
    publicKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  },
  vercel: {
    projectProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};

// Schema cho server-side
export const serverEnv = {
  app: {
    logo: "https://res.cloudinary.com/ivanistao/image/upload/t_Profile/v1740834460/aisuckhoe/logo/logo-light_a53s1a.png",
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
  },
  postgres: {
    url: process.env.POSTGRES_URL,
  },
};

// Validate env dựa trên môi trường
// const isServer = typeof window === "undefined";
// const env = isServer
//   ? serverEnvSchema.parse(process.env) // Server-side
//   : clientEnvSchema.parse(process.env); // Client-side

export default { serverEnv, clientEnv }
