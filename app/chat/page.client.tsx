'use client'
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import SideBar from './SideBar'
import { FlowiseChatbot } from '@/components/FlowiseChatbot'

const welcomeMessage = `Xin chào! 😊
Tôi là Aisuckhoe, trợ lý sức khỏe AI của bạn. Tôi luôn sẵn sàng cung cấp thông tin y tế đáng tin cậy, dựa trên các nguồn uy tín.

Hãy chia sẻ với tôi nhé! 💙`

const customCSS = `
span.chatbot-host-bubble[data-testid="host-bubble"] {
  width: auto !important;
}
`

export default function ChatClient() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const logoURL = `https://res.cloudinary.com/ivanistao/image/upload/t_Profile/v1740834460/aisuckhoe/logo/logo-light_a53s1a.png?${Math.floor(Date.now() / 100000)}`
  const chatflowid = "be686718-e28e-4fad-af47-f53d3a73d5b4"
  const apiHost = "https://flowise.aisuckhoe.com"
  const chatflowConfig = {
    /* Chatflow Config */
    // sessionId: sessionId,
    // customerId
  }
  const observersConfig = {
    /* Observers Config */
    // // The userinput field submitted to bot ("" when reset by bot)
    observeUserInput: () => {
      //   console.log({ userInput });
    },
    // The bot message stack has changed
    observeMessages: () => {
      // console.log();
    },
    // // The bot loading signal changed
    observeLoading: () => {
      //   console.log({ loading });
    },
  }
  const theme = {
    button: {
      backgroundColor: '#3B81F6',
      right: 20,
      bottom: 20,
      size: 48,
      dragAndDrop: true,
      iconColor: 'white',
      customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
      autoWindowOpen: {
        autoOpen: true,
        openDelay: 2,
        autoOpenOnMobile: false
      }
    },
    tooltip: {
      showTooltip: true,
      tooltipMessage: 'Hi There 👋!',
      tooltipBackgroundColor: 'black',
      tooltipTextColor: 'white',
      tooltipFontSize: 16
    },
    disclaimer: {
      title: 'Disclaimer',
      message: 'By using this chatbot, you agree to the <a target="_blank" href="https://aisuckhoe.com/terms">Terms & Condition</a>',
      textColor: 'black',
      buttonColor: '#3b82f6',
      buttonText: 'Bắt đầu',
      buttonTextColor: 'white',
      blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)', //The color of the blurred background that overlays the chat interface
      backgroundColor: 'white',
      denyButtonText: 'Cancel',
      denyButtonBgColor: '#ef4444',
    },
    customCSS: customCSS,
    chatWindow: {
      showTitle: true,
      showAgentMessages: true,
      title: 'Aisuckhoe',
      // titleAvatarSrc: logoURL,
      welcomeMessage: welcomeMessage,
      errorMessage: 'This is a custom error message',
      backgroundColor: '#ffffff',
      backgroundImage: 'enter image path or link',
      // height: '100%',
      // width: '100%',
      fontSize: 16,
      // starterPrompts: [
      //   "Tôi bị ho dai dẳng, khó thở và tức ngực. Tôi lo lắng không biết mình có bị bệnh gì nghiêm trọng không?",
      //   "Who are you?"
      // ],
      starterPromptFontSize: 15,
      clearChatOnReload: false,
      sourceDocsTitle: 'Sources:',
      renderHTML: true,
      botMessage: {
        backgroundColor: '#f7f8ff',
        textColor: '#303235',
        showAvatar: true,
        avatarSrc: logoURL,
      },
      userMessage: {
        backgroundColor: '#3B81F6',
        textColor: '#ffffff',
        showAvatar: true,
        avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
      },
      textInput: {
        placeholder: 'Type your question',
        backgroundColor: '#ffffff',
        textColor: '#303235',
        sendButtonColor: '#3B81F6',
        maxChars: 500,
        maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 500 characters.',
        autoFocus: true, // If not used, autofocus is disabled on mobile and enabled on desktop. true enables it on both, false disables it on both.
        sendMessageSound: true,
        // sendSoundLocation: "send_message.mp3", // If this is not used, the default sound effect will be played if sendSoundMessage is true.
        receiveMessageSound: true,
        // receiveSoundLocation: "receive_message.mp3", // If this is not used, the default sound effect will be played if receiveSoundMessage is true.
      },
      feedback: {
        color: '#303235'
      },
      dateTimeToggle: {
        date: true,
        time: true
      },
      footer: {
        textColor: '#303235',
        text: 'Powered by',
        company: 'Aisuckhoe',
        companyLink: 'https://aisuckhoe.com',
      },
    }
  }

  useEffect(() => {
    ; (async () => {
      // Protect the route by checking if the user is signed in
      if (!isSignedIn) {
        return router.replace('/auth/sign-in')
      }
    })()
  }, [isSignedIn, router])

  // const { userId, sessionId, getToken } = await auth()
  return (
    <div className="flex h-screen bg-background">
      <SideBar />

      <div className="flex-1">
        <FlowiseChatbot chatflowid={chatflowid} apiHost={apiHost} chatflowConfig={chatflowConfig} observersConfig={observersConfig} theme={theme}/>
      </div>
    </div>
  )
}


