import { create } from "zustand";
import { signInFirebase } from "@/lib/firebase/client";
import { User } from "firebase/auth";

interface FirebaseState {
  user: User | null;
  setUser: (user: User) => void;
  signInFirebase: () => Promise<void>;
}

export const useFirebase = create<FirebaseState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  signInFirebase: async () => {
    const user = await signInFirebase();

    set((preUser) => {
      if (preUser.user?.uid === user.uid) {
        return preUser;
      } else {
        return { user };
      }
    });
  },
}));
