"use client";

import { ChatHeader } from "@/components/Chat/ChatHeader";
import ChatWrapper from "@/components/Chat/ChatWrapper";
import CommonSideBar from "@/components/Common/CommonSideBar";
import Loading from "@/components/ui/loading"; // Corrected to default import
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatIdClientPage() {
  const params = useParams<{ id: string }>();
  const { chatSessionId, setChatSessionId } = useChatSessionStore();

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
          {!chatSessionId || chatSessionId !== params.id ? (
            <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
              <Loading />
            </div>
          ) : (
            <ChatWrapper
              key={chatSessionId}
              chatId={chatSessionId}
            ></ChatWrapper>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}
