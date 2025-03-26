import { create } from "zustand";
import { ChatSession } from "@prisma/client";
import {
  createChatSession,
  deleteChatSession,
  getAllChatSessions,
  getAllChatSessionsByProfile,
  updateChatSession,
} from "@/lib/prisma/chat-session.service";

interface ChatSessionListState {
  chatSessions: ChatSession[];
  isLoading: boolean;
  error: any;
  fetchChatSessions: () => Promise<void>;
  fetchChatSessionsByProfile: (profileId: string) => Promise<void>;
  createChatSession: (
    data: Omit<ChatSession, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateChatSession: (id: string, data: Partial<ChatSession>) => Promise<void>;
  deleteChatSession: (id: string) => Promise<void>;
}

export const useChatSessionListStore = create<ChatSessionListState>(
  (set, get) => ({
    chatSessions: [],
    isLoading: false,
    error: null,
    fetchChatSessions: async () => {
      set({ isLoading: true, error: null });
      try {
        const chatSessions = await getAllChatSessions();
        set({ chatSessions: chatSessions, isLoading: false });
      } catch (error) {
        set({ error: error, isLoading: false });
      }
    },
    fetchChatSessionsByProfile: async (profileId) => {
      set({ isLoading: true, error: null });
      try {
        const chatSessions = await getAllChatSessionsByProfile(profileId);
        set({ chatSessions: chatSessions, isLoading: false });
      } catch (error) {
        set({ error: error, isLoading: false });
      }
    },
    createChatSession: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const newChatSession = await createChatSession(data);
        set({
          chatSessions: [...get().chatSessions, newChatSession],
          isLoading: false,
        });
      } catch (error) {
        set({ error: error, isLoading: false });
      }
    },
    updateChatSession: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const updatedChatSession = await updateChatSession(id, data);
        set({
          chatSessions: get().chatSessions.map((chatSession) =>
            chatSession.id === id ? updatedChatSession : chatSession
          ),
          isLoading: false,
        });
      } catch (error) {
        set({ error: error, isLoading: false });
      }
    },
    deleteChatSession: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await deleteChatSession(id);
        set({
          chatSessions: get().chatSessions.filter(
            (chatSession) => chatSession.id !== id
          ),
          isLoading: false,
        });
      } catch (error) {
        set({ error: error, isLoading: false });
      }
    },
  })
);
