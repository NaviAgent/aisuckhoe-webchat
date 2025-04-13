"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
  useMemo,
  useState, // Added useMemo
} from "react";
import type { BubbleProps } from "@ivannguyendev/flowise-embed";

// Define the shape of the context data
interface FlowiseChatbotContextType {
  chatRef: React.RefObject<FullPageChatElement | null>;
  isReady: boolean;
  setReady: (ready: boolean) => void;
  sendMessage: (text: string, files?: File[]) => void;
}

// Create the context with a default value (or null)
const FlowiseChatbotContext = createContext<FlowiseChatbotContextType | null>(
  null
);

// Define props for the Provider, including Flowise BubbleProps
type FlowiseChatbotProviderProps = {
  children: ReactNode;
};

type FullPageChatElement = HTMLElement & BubbleProps;

// Create the Provider component
export const FlowiseChatbotProvider: React.FC<FlowiseChatbotProviderProps> = ({
  children,
}) => {
  const chatRef = useRef<FullPageChatElement>(null);
  const [isReady, setIsReady] = useState(false); // Ref to track readiness state reliably

  // Define the sendMessage function using useCallback
  const sendMessage = useCallback(
    (text: string, files?: File[]) => {
      if (!chatRef.current) {
        // Check the ref for actual readiness
        console.error(
          "Flowise chatbot element not found or not ready. Cannot send message."
        );
        return;
      }
      try {
        // Ensure the custom element and property exist before assigning
        if ("externalCommand" in chatRef.current) {
          (chatRef.current as any).externalCommand = {
            text,
            files: files || [],
            timestamp: Date.now(),
          };
        } else {
          console.error(
            "externalCommand property not found on the chatbot element."
          );
        }
      } catch (error) {
        console.error(
          "Failed to set externalCommand property on the chatbot element:",
          error
        );
      }
    },
    [] // No dependencies needed as it checks the ref internally
  );

  const setReady = (ready: boolean) => {
    setIsReady(ready);
  };

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      chatRef,
      isReady,
      sendMessage,
      setReady,
    }),
    [isReady, chatRef, sendMessage, setReady]
  );

  return (
    <FlowiseChatbotContext.Provider value={contextValue}>
      {/* {isLoading ? (
        <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
          <Loading />
        </div>
      ) : (
        // Render the actual Flowise element, hidden until ready or managed by parent styles
        // @ts-expect-error - Ignore type checking for flowise-fullchatbot custom element
        <flowise-fullchatbot ref={chatRef} style={style} class={className} />
      )} */}
      {/* Render children components which can now use the context */}
      {children}
    </FlowiseChatbotContext.Provider>
  );
};

// Create the custom hook for consuming the context
export const useFlowiseChatbot = (): FlowiseChatbotContextType => {
  const context = useContext(FlowiseChatbotContext);
  if (!context) {
    throw new Error(
      "[useFlowiseChatbot] must be used within a FlowiseChatbotProvider"
    );
  }
  return context;
};
