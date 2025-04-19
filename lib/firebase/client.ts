import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { createFirebaseToken } from "./server";
import { getClientEnv } from "../env";

// Initialize Firebase
export const firebaseApp = () => {
  const clientEnv = getClientEnv();

  return getApps().length === 0
    ? initializeApp({
        apiKey: clientEnv?.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: clientEnv?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: clientEnv?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: clientEnv?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: clientEnv?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: clientEnv?.NEXT_PUBLIC_FIREBASE_APP_ID,
      })
    : getApps()[0]!;
};

// Initialize Firestore
export const db = getFirestore(firebaseApp());

export async function signInFirebase() {
  const auth = getAuth(firebaseApp());
  if (auth.currentUser) return auth.currentUser;

  const customToken = await createFirebaseToken(); // Gọi API server
  const account = await signInWithCustomToken(auth, customToken);
  console.log("[signInFirebase]", account);
  return account.user;
}
