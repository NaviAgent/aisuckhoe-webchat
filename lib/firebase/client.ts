import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { firebaseConfig } from "./config";
import { createFirebaseToken } from "./server";

// Initialize Firebase
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

// Initialize Firestore
export const db = getFirestore(firebaseApp);

export async function signInFirebase() {
  const auth = getAuth(firebaseApp);
  if (auth.currentUser) return auth.currentUser;
  
  const customToken = await createFirebaseToken(); // Gọi API server
  const account = await signInWithCustomToken(auth, customToken);
  console.log("[signInFirebase]", account);
  return account.user;
}
