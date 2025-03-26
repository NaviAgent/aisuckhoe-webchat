import { create } from "zustand";

interface ChatSessionState {
  chatSessionId: string | null;
  setChatSessionId: (chatSessionId: string | null) => void;
}

export const useChatSessionStore = create<ChatSessionState>((set) => ({
  chatSessionId: null,
  setChatSessionId: (chatSessionId: string | null) =>
    set({ chatSessionId: chatSessionId }),
}));
