"use client";

import ChatSideBar from "@/components/Chat/ChatSideBar";
import ChatWrapper from "@/components/Chat/ChatWrapper";
import { CommonHeader } from "@/components/Common/CommonHeader";
import Loading from "@/components/ui/loading"; // Corrected to default import
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
      <div className="hidden md:flex">
        <ChatSideBar />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          <CommonHeader className="absolute z-10 w-full bg-white"></CommonHeader>
        </div>
        {!chatSessionId || chatSessionId !== params.id ? (
          <div className="flex items-center justify-center w-full h-screen bg-background">
            <Loading />
          </div>
        ) : (
          <ChatWrapper key={chatSessionId} chatId={chatSessionId}></ChatWrapper>
        )}
      </div>
    </div>
  );
}
