import { create } from "zustand";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface UserState {
  userId: string | null;
  email: string | null;
  setUser: (userId: string, email: string) => void;
  syncUserWithFirestore: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  email: null,
  setUser: (userId, email) => set({ userId, email }),
  syncUserWithFirestore: async () => {
    const userId = useUser().user?.id || null;
    const email = useUser().user?.emailAddresses?.[0]?.emailAddress || null;

    if (!userId || !email) {
      console.log("User not logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create user in Firestore
        await setDoc(userDocRef, {
          userId: userId,
          email: email,
        });
        console.log("User added to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
    } catch (error) {
      console.error("Error syncing user with Firestore:", error);
    }
  },
}));
