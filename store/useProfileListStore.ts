import { create } from "zustand";
import { Profile } from "@prisma/client";
import {
  createProfile,
  deleteProfile,
  getAllProfiles,
  updateProfile,
} from "@/lib/prisma/profile.service";

interface ProfileListState {
  profiles: Profile[];
  isLoading: boolean;
  error: any;
  fetchProfiles: () => Promise<void>;
  createProfile: (
    data: Omit<Profile, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Promise<void>;
  updateProfile: (id: string, data: Partial<Profile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
}

export const useProfileListStore = create<ProfileListState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,
  fetchProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await getAllProfiles();
      set({ profiles, isLoading: false });
    } catch (error) {
      set({ error: error, isLoading: false });
    }
  },
  createProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProfile = await createProfile(data);
      set({ profiles: [...get().profiles, newProfile], isLoading: false });
    } catch (error) {
      set({ error: error, isLoading: false });
    }
  },
  updateProfile: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await updateProfile(id, data);
      set({
        profiles: get().profiles.map((profile) =>
          profile.id === id ? updatedProfile : profile
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error, isLoading: false });
    }
  },
  deleteProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProfile(id);
      set({
        profiles: get().profiles.filter((profile) => profile.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error, isLoading: false });
    }
  },
}));
