"use client";

import { ChatHeader } from "@/components/Chat/ChatHeader";
import ChatWindow from "@/components/Chat/ChatWindow";
import CommonSideBar from "@/components/Common/CommonSideBar";
import Loading from "@/components/ui/loading"; // Corrected to default import
import { SidebarProvider } from "@/components/ui/sidebar";
import { FlowiseChatbotProvider } from "@/contexts/FlowiseChatbotContext";
import useChatHistoryStore from "@/store/useChatHistoryStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { useFirebase } from "@/store/useFirebase";
import { useParams } from "next/navigation";
import { useEffect } from "react";

// Define props interface
export default function ChatIdClientPage() {
  // Accept props
  const params = useParams<{ id: string }>();
  const { chatSessionId, setChatSessionId } = useChatSessionStore();
  const { user, signInFirebase } = useFirebase();
  const { chatHistory, isLoading, fetchChatHistories, saveChatHistory } =
    useChatHistoryStore();

  useEffect(() => {
    if (!user) {
      signInFirebase();
    } else if (chatSessionId) {
      fetchChatHistories(chatSessionId);
    }
  }, [user, chatSessionId, signInFirebase, fetchChatHistories]);

  useEffect(() => {
    // Ensure params.id is valid before setting
    if (params.id) {
      setChatSessionId(params.id);
    }
  }, [params.id, setChatSessionId]); // Added setChatSessionId to dependency array

  // useEffect(() => {
  //   // if(!chatSessionId && chatSessions.length === 0){
  //   //   // createChatSession({ ownerId: user?.id!, profileId: profileId!, name: 'Trống', messageCount: 0 })
  //   // }
  //   // if (!chatSessionId && chatSessions.length > 0) {
  //   //   setChatSessionId(chatSessions[0]?.id!)
  //   // }
  // }, [chatSessions, setChatSessionId])

  // useEffect(() => {
  //   if (chatSessionId !== chatId) {
  //     setChatId(chatSessionId!)
  //   }
  // }, [chatSessionId])

  // const { userId, sessionId, getToken } = await auth()
  console.log(
    "[ChatIdClientPage] rendered with ID:",
    params.id,
    "Current chatSessionId:",
    chatSessionId
  ); // Use the ID

  // Render the main chat interface once the ID is set
  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        <CommonSideBar />

        <div className="w-full">
          <div className="relative w-full">
            <ChatHeader className="absolute z-10 w-full bg-white"></ChatHeader>
          </div>
          {!chatSessionId ||
          chatSessionId !== params.id ||
          !user ||
          isLoading ? (
            <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
              <Loading />
            </div>
          ) : (
            <FlowiseChatbotProvider>
              <ChatWindow
                chatId={chatSessionId}
                chatHistory={chatHistory}
                saveChatHistory={saveChatHistory}
              ></ChatWindow>
            </FlowiseChatbotProvider>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}
