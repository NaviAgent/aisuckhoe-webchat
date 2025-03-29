"use server";

import { auth } from "@clerk/nextjs/server";
import admin, { apps, credential } from "firebase-admin";

// Initialize Firebase
apps.length === 0
  ? admin.initializeApp({
      credential: credential.cert(process.env.FIREBASE_ADMIN_CERT_PATH || ""),
    })
  : apps[0]!;

export async function createFirebaseToken() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const firebaseToken = await admin.auth().createCustomToken(userId);
    return firebaseToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw new Error("Could not create custom token.");
  }
}
