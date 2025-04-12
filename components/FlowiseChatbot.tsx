"use client";

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { BubbleProps } from "@ivannguyendev/flowise-embed";
import Loading from "./ui/loading";

type Props = BubbleProps & {
  style?: React.CSSProperties;
  className?: string;
  onReady?: () => void; // Add the onReady callback prop
};

type FullPageChatElement = HTMLElement & Props;

// Define the type for the exposed methods
export interface FlowiseChatbotHandle {
  sendMessage: (text: string, files?: File[]) => void;
}

const FlowiseChatbot = forwardRef<FlowiseChatbotHandle, Props>(
  ({ style, className, onReady, ...assignableProps }, ref) => {
    // Destructure onReady
    const chatRef = useRef<FullPageChatElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    let isReady = false;

    useEffect(() => {
      let isMounted = true; // Flag to prevent state updates on unmounted component
      (async () => {
        // Ensure this import runs only once on mount
        await import("@ivannguyendev/flowise-embed/dist/web.js");
        if (isMounted) {
          setIsLoading(false); // Set loading to false after import
        }
      })();

      // Cleanup function for the effect
      return () => {
        isMounted = false; // Set flag to false on unmount
        // Assuming the custom element cleans itself up when removed from DOM.
        console.log(
          "FlowiseChatbot unmounted, relying on custom element cleanup."
        );
      };
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
      // Apply props only after the component is loaded and chatRef is available
      if (!chatRef.current || isLoading) return;
      Object.assign(chatRef.current, assignableProps);

      // Check if not already ready and trigger onReady
      if (!isReady) {
        isReady = true;
        onReady?.(); // Call the callback if provided
      }
    }, [assignableProps, isLoading, isReady, onReady]); // Add dependencies

    // Expose the sendMessage function using useImperativeHandle
    useImperativeHandle(
      ref,
      () => ({
        // Ensure sendMessage is only callable when ready
        sendMessage: (text: string, files?: File[]) => {
          if (!chatRef.current || !isReady) {
            // Check isReady state
            console.error(
              "Flowise chatbot element not found or not ready. Make sure the chatbot is initialized before sending messages."
            );
            return;
          }
          // ... rest of sendMessage logic
          try {
            (chatRef.current as any).externalCommand = {
              text,
              files: files || [],
              timestamp: Date.now(),
            };
          } catch (error) {
            console.error(
              "Failed to set externalCommand property on the chatbot element:",
              error
            );
          }
        },
      }),
    ); // Add isReady dependency to re-create the handle when readiness changes

    return isLoading ? (
      <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
        <Loading />
      </div>
    ) : (
      // @ts-expect-error - Ignore type checking for flowise-fullchatbot custom element
      <flowise-fullchatbot ref={chatRef} style={style} class={className} />
    );
  }
);

// Add display name for better debugging
FlowiseChatbot.displayName = "FlowiseChatbot";

// Use React.memo for performance optimization
export default React.memo(FlowiseChatbot);
