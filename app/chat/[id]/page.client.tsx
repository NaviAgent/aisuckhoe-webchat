"use client";

import ChatSideBar from "@/components/Chat/ChatSideBar";
import ChatWrapper from "@/components/Chat/ChatWrapper";
import { CommonHeader } from "@/components/Common/CommonHeader";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatIdClientPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { chatSessionId, setChatSessionId } = useChatSessionStore();

  useEffect(() => {
    setChatSessionId(params.id);
  }, [router, params.id]);

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
  console.log("[ChatIdPageClient] rendered with ID:", params.id); // Use the ID
  return (
    <div className="flex flex-row h-screen bg-background">
      <div className="hidden md:flex">
        <ChatSideBar />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          <CommonHeader className="absolute z-10 w-full bg-white"></CommonHeader>
        </div>
        <div>
          {chatSessionId ? (
            <ChatWrapper
              key={chatSessionId}
              chatId={chatSessionId}
            ></ChatWrapper>
          ) : (
            <p> Hỏi câu mới</p>
          )}
        </div>
      </div>
    </div>
  );
}
