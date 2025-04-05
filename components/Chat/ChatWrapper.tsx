"use client";

import React, { useEffect } from "react";
import useChatHistoryStore from "@/store/useChatHistoryStore";
import { useFirebase } from "@/store/useFirebase";
import Loading from "../ui/loading";
import ChatWindow from "./ChatWindow";

interface ChatWrapperProps {
  chatId: string;
}

const ChatWrapper = function ({ chatId }: ChatWrapperProps) {
  const { user, signInFirebase } = useFirebase();
  const { chatHistory, isLoading, fetchChatHistories, saveChatHistory } =
    useChatHistoryStore();

  useEffect(() => {
    if (!user) {
      signInFirebase();
    } else if (chatId) {
      fetchChatHistories(chatId);
    }
  }, [user, chatId, signInFirebase, fetchChatHistories]);

  return !user || isLoading ? (
    <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
      <Loading />
    </div>
  ) : (
    <ChatWindow
      key={chatId}
      chatId={chatId}
      chatHistory={chatHistory}
      saveChatHistory={saveChatHistory}
    ></ChatWindow>
  );
};

export default React.memo(ChatWrapper);
