import { create } from 'zustand';

interface ProfileState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileId: null,
  setProfileId: (profileId: string | null) => set({ profileId: profileId }),
}));
