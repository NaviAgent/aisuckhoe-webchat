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
} from "firebase/firestore";
import { db } from "lib/firebase/client";

interface ChatState {
  messages: Record<string, any>[];
  isLoading: boolean;
  error: Error | null;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error) => void;
  setMessages: (messages: Record<string, any>[]) => void;
  addMessage: (message: Record<string, any>) => void;
  subscribeToMessages: (chatId: string) => () => void;
  sendMessage: (
    chatId: string,
    senderId: string,
    message: any
  ) => Promise<void>;
  saveMessage: (chatId: string, id: string, message: any) => Promise<void>;
  fetchChatHistory: (chatId: string) => Promise<void>;
}

const useChatStore = create<ChatState>((set, get) => ({
  // chatId: null,
  messages: [],
  isLoading: false,
  error: null,

  // setChatId: (chatId) => set({ chatId }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setMessages: (messages) => set((state) => ({ messages })),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  subscribeToMessages: (chatId: string) => {
    const messagesRef = collection(db, "chats", chatId!, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      get().setMessages(newMessages);
    });

    return unsubscribe;
  },

  sendMessage: async (chatId, senderId, message) => {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");

      // Filter out undefined properties from the message object
      const filteredMessage = Object.fromEntries(
        Object.entries(message).filter(([_, value]) => value !== undefined)
      );

      const newDoc = await addDoc(messagesRef, filteredMessage);

      // Optimistically update the state
      get().addMessage({ ...filteredMessage, senderId, id: newDoc.id });
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error appropriately, e.g., display an error message to the user
    }
  },

  saveMessage: async (chatId, id, message) => {
    get().setIsLoading(true);
    try {
      const messageRef = doc(db, "chats", chatId, "messages", id);

      // Filter out undefined properties from the message object
      const filteredMessage = Object.fromEntries(
        Object.entries(message).filter(([_, value]) => value !== undefined)
      );

      await setDoc(messageRef, filteredMessage as Record<string, any>);

      // Optimistically update the state
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...filteredMessage } : msg
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating message:", error);
      get().setIsLoading(false);
      // Handle error appropriately, e.g., display an error message to the user
    }
  },

  fetchChatHistory: async (chatId) => {
    get().setIsLoading(true);
    try {
      console.log("fetchChatHistory", chatId);

      const messagesRef = collection(db, "chats", chatId!, "messages");
      const q = query(messagesRef);
      const querySnapshot = await getDocs(q);

      const chatHistory = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      get().setMessages([...chatHistory]);
      get().setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      get().setIsLoading(false);
      // Handle error appropriately, e.g., display an error message to the user
    }
  },
}));

export default useChatStore;
