import { create } from "zustand";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "lib/firebase/client";

interface ChatHistoryState {
  lead: Record<string, any> | null;
  chatHistory: Record<string, any>[];
  isLoading: boolean;
  error: Error | null;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error) => void;
  setHistories: (histories: Record<string, any>[]) => void;
  subscribeToChatHistories: (chatId: string) => () => void;
  saveChatHistory: (
    chatId: string,
    historyData: { lead: any; chatHistory: any[] }
  ) => Promise<void>;
  fetchChatHistories: (chatId: string) => Promise<void>;
  setLead: (lead: Record<string, any> | null) => void;
}

const useChatHistoryStore = create<ChatHistoryState>((set, get) => ({
  lead: null,
  chatHistory: [],
  isLoading: false,
  error: null,

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setHistories: (chatHistory) => set((state) => ({ chatHistory })),

  subscribeToChatHistories: (chatId: string) => {
    const historiesRef = collection(db, "chats", chatId!, "histories");
    const q = query(historiesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newHistories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      get().setHistories(newHistories);
    });

    return unsubscribe;
  },

  saveChatHistory: async (
    chatId: string,
    historyData: { lead: any; chatHistory: any[] }
  ) => {
    try {
      const historiesRef = doc(db, "chats", chatId, "histories", chatId);

      // Filter out undefined properties from the historyData object
      const filteredLeadData = Object.fromEntries(
        Object.entries(historyData.lead || {}).filter(
          ([_, value]) => value !== undefined
        )
      );

      const filteredHistoryData = historyData.chatHistory?.map((item) => {
        return Object.fromEntries(
          Object.entries(item).filter(([_, value]) => value !== undefined)
        );
      });

      await setDoc(
        historiesRef,
        {
          lead: filteredLeadData,
          chatHistory: filteredHistoryData,
        },
        { merge: true }
      );

      // Optimistically update the state
      set((state) => ({
        lead: filteredLeadData,
        chatHistory: filteredHistoryData,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating history:", error);
      get().setIsLoading(false);
      // Handle error appropriately, e.g., display an error message to the user
    }
  },

  fetchChatHistories: async (chatId) => {
    get().setIsLoading(true);
    try {
      console.log("fetchChatHistories", chatId);

      const historiesRef = doc(db, "chats", chatId!, "histories", chatId);
      const querySnapshot = await getDoc(historiesRef);

      const historyData = querySnapshot.data();

      set((state) => ({
        lead: historyData?.lead,
        chatHistory: historyData?.chatHistory || [],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Handle error appropriately, e.g., display an error message to the user
    } finally {
      get().setIsLoading(false);
    }
  },

  setLead: (lead) => set({ lead }),
}));

export default useChatHistoryStore;
