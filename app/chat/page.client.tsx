'use client'
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import SideBar from './SideBar'
import ChatWrapper from '@/components/Chat/ChatWrapper'
import { useChatSessionStore } from '@/store/useChatSessionStore'

export default function ChatClient() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const { chatSessionId } = useChatSessionStore()
  useEffect(() => {
    ; (async () => {
      // Protect the route by checking if the user is signed in
      if (!isSignedIn) {
        return router.replace('/auth/sign-in')
      }
    })()
  }, [isSignedIn, router])


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
  return (
    <div className="flex h-screen bg-background">
      <div className="flex min-w-fit">
        <SideBar />
      </div>

      <div className="flex max-w-screen-lg mx-auto">
        {chatSessionId ? <ChatWrapper chatId={chatSessionId}></ChatWrapper> : <p> Hỏi câu mới</p>}
      </div>
    </div>
  )
}


