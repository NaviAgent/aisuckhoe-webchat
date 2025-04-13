import { create } from "zustand";

interface DraftMessageState {
  message: string;
  files: File[];
  images: File[];

  setMessage: (message: string) => void;
  setFiles: (files: File[]) => void;
  addFiles: (files: File[]) => void;
  setImages: (images: File[]) => void;
  addImages: (images: File[]) => void;
  reset: () => void;
}

const useDraftMessage = create<DraftMessageState>((set, get) => ({
  // chatId: null,
  message: "",
  files: [],
  images: [],

  setMessage: (message) => set((state) => ({ message })),

  setFiles: (files) => set((state) => ({ files })),

  addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),

  setImages: (images) => set((state) => ({ images })),

  addImages: (images) =>
    set((state) => ({ images: [...state.images, ...images] })),

  reset: () => set((state) => ({ message: "", files: [], images: [] })),
}));

export default useDraftMessage;
