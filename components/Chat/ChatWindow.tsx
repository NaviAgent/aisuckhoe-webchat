"use client";

import React, { useEffect, useRef } from "react";
import FlowiseChatbot, {
  FlowiseChatbotHandle,
} from "@/components/FlowiseChatbot";
import { StorageAdapter } from "@ivannguyendev/flowise-embed/dist/utils/storage/storageAdapter";
import Flowise from "@/types/flowise";
import { MessageType } from "@ivannguyendev/flowise-embed/dist/components/Bot";
import { BubbleTheme } from "@ivannguyendev/flowise-embed/dist/features/bubble/types";

const welcomeMessage = `Xin chào! 😊
Tôi là Aisuckhoe, trợ lý sức khỏe AI của bạn. Tôi luôn sẵn sàng cung cấp thông tin y tế đáng tin cậy, dựa trên các nguồn uy tín.

Hãy chia sẻ với tôi nhé! 💙`;

const customCSS = `
span.chatbot-host-bubble[data-testid="host-bubble"] {
  width: auto !important;
}
`;

interface ChatWindowProps {
  chatId: string;
  chatHistory: Record<string, Flowise.ListChatMessagesParams>[];
  saveChatHistory: (
    chatId: string,
    historyData: {
      lead: Flowise.Lead;
      chatHistory: Record<string, Flowise.ListChatMessagesParams>[];
    }
  ) => Promise<void>;
}

const ChatWindow = ({
  chatId,
  chatHistory,
  saveChatHistory,
}: ChatWindowProps) => {
  console.log("[ChatWindow] init", chatId);
  const chatRef = useRef<FlowiseChatbotHandle | null>(null);
  const logoURL = `https://res.cloudinary.com/ivanistao/image/upload/t_Profile/v1740834460/aisuckhoe/logo/logo-light_a53s1a.png?${Math.floor(Date.now() / 100000)}`;
  const chatflowid = "be686718-e28e-4fad-af47-f53d3a73d5b4";
  const apiHost = "https://flowise.aisuckhoe.com";
  const chatflowConfig = {
    /* Chatflow Config */
    sessionId: "5d707fb5-b027-48dc-9596-acce11f5c066",
    // customerId
  };

  const storageAdapter: StorageAdapter = {
    async getMessages(chatflowid, chatId) {
      return { chatHistory, chatId, lead: null };
    },
    async removeMessages(chatflowid, chatId) {
      console.log("removeMessages", chatId);
    },
    async saveMessages(chatflowid, { chatId, chatHistory, lead }) {
      if (!chatHistory) return;
      saveChatHistory(chatId!, { chatHistory, lead });
    },
  };

  const observersConfig = {
    // User input has changed
    observeUserInput: (
      userInput: string | boolean | object | MessageType[]
    ) => {
      if (
        typeof userInput === "string" &&
        userInput.length > 10 &&
        theme.chatWindow?.textInput?.maxChars
      ) {
        theme.chatWindow.textInput.maxCharsWarningMessage =
          "You exceeded the question limit";
        // theme.chatWindow.textInput.maxChars = 1;
        // theme.chatWindow.textInput.maxCharsWarningMessage = 1;
      } else if (theme.chatWindow?.textInput?.maxChars) {
        theme.chatWindow.textInput.maxCharsWarningMessage = "";
        // theme.chatWindow.textInput.maxChars = 500;
      }
      console.log({ userInput });
    },
    // The bot message stack has changed
    observeMessages: (messages: string | boolean | object | MessageType[]) => {
      console.log({ messages });
      // console.log({ messages });
    },
    // The bot loading signal changed
    observeLoading: (loading: string | boolean | object | MessageType[]) => {
      // console.log({ loading });
    },
  };

  const theme: BubbleTheme = {
    button: {
      backgroundColor: "#3B81F6",
      right: 20,
      bottom: 20,
      size: 48,
      dragAndDrop: true,
      iconColor: "white",
      customIconSrc:
        "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
      autoWindowOpen: {
        autoOpen: true,
        openDelay: 2,
        autoOpenOnMobile: false,
      },
    },
    tooltip: {
      showTooltip: true,
      tooltipMessage: "Hi There 👋!",
      tooltipBackgroundColor: "black",
      tooltipTextColor: "white",
      tooltipFontSize: 16,
    },
    disclaimer: {
      title: "Disclaimer",
      message:
        'By using this chatbot, you agree to the <a target="_blank" href="https://aisuckhoe.com/terms">Terms & Condition</a>',
      textColor: "black",
      buttonColor: "#3b82f6",
      buttonText: "Bắt đầu",
      buttonTextColor: "white",
      blurredBackgroundColor: "rgba(0, 0, 0, 0.4)", //The color of the blurred background that overlays the chat interface
      backgroundColor: "white",
      denyButtonText: "Cancel",
      denyButtonBgColor: "#ef4444",
    },
    customCSS: customCSS,
    chatWindow: {
      showTitle: false,
      showAgentMessages: true,
      title: "Aisuckhoe",
      // titleAvatarSrc: logoURL,
      welcomeMessage: welcomeMessage,
      errorMessage: "This is a custom error message",
      backgroundColor: "#ffffff",
      backgroundImage: "enter image path or link",
      // height: '100%',
      // width: '100%',
      fontSize: 16,
      // starterPrompts: [
      //   "Tôi bị ho dai dẳng, khó thở và tức ngực. Tôi lo lắng không biết mình có bị bệnh gì nghiêm trọng không?",
      //   "Who are you?"
      // ],
      starterPromptFontSize: 15,
      clearChatOnReload: false,
      sourceDocsTitle: "Sources:",
      renderHTML: true,
      botMessage: {
        backgroundColor: "#f7f8ff",
        textColor: "#303235",
        showAvatar: true,
        avatarSrc: logoURL,
      },
      userMessage: {
        backgroundColor: "#3B81F6",
        textColor: "#ffffff",
        showAvatar: false,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
      },
      textInput: {
        placeholder: "Type your question",
        backgroundColor: "#ffffff",
        textColor: "#303235",
        sendButtonColor: "#3B81F6",
        maxChars: 500,
        maxCharsWarningMessage:
          "You exceeded the characters limit. Please input less than 500 characters.",
        autoFocus: true, // If not used, autofocus is disabled on mobile and enabled on desktop. true enables it on both, false disables it on both.
        sendMessageSound: true,
        // sendSoundLocation: "send_message.mp3", // If this is not used, the default sound effect will be played if sendSoundMessage is true.
        receiveMessageSound: true,
        // receiveSoundLocation: "receive_message.mp3", // If this is not used, the default sound effect will be played if receiveSoundMessage is true.
      },
      feedback: {
        color: "#303235",
      },
      dateTimeToggle: {
        date: true,
        time: true,
      },
      footer: {
        showFooter: false,
        textColor: "#303235",
        text: "Powered by",
        company: "Aisuckhoe",
        companyLink: "https://aisuckhoe.com",
      },
    },
  };

  const onReady = ()=>{
    if (!chatRef?.current) return;
    chatRef.current.sendMessage("xinc hào");
  }

  return (
    <FlowiseChatbot
      ref={chatRef}
      chatflowid={chatflowid}
      apiHost={apiHost}
      chatflowConfig={chatflowConfig}
      observersConfig={observersConfig}
      theme={theme}
      chatId={chatId}
      storageAdapter={storageAdapter}
      onReady={onReady}
    />
  );
};

export default React.memo(ChatWindow);
