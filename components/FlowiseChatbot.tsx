"use client";

import React, { useEffect, useState } from "react";
import type { BubbleProps } from "@ivannguyendev/flowise-embed";
import Loading from "./ui/loading";
import { useFlowiseChatbot } from "@/contexts/FlowiseChatbotContext";

type Props = BubbleProps & {
  style?: React.CSSProperties;
  className?: string;
};

// Define the type for the exposed methods
export interface FlowiseChatbotHandle {
  sendMessage: (text: string, files?: File[]) => void;
}

const FlowiseChatbot = ({ style, className, ...assignableProps }: Props) => {
  // Destructure onReady
  const { setReady, chatRef } = useFlowiseChatbot();
  const [isLoading, setIsLoading] = useState(true);
  let isReady = false;

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    (async () => {
      console.log("[FlowiseChatbot] init chat js");
      // Ensure this import runs only once on mount
      await import("@ivannguyendev/flowise-embed/dist/web.js");
      if (isMounted) {
        setIsLoading(false);
      }
    })();

    // Cleanup function for the effect
    return () => {
      isReady = false;
      // chatRef.current = null;
      setReady(false);
      isMounted = false;
      console.log(
        "[FlowiseChatbot] unmounted, relying on custom element cleanup."
      );
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Apply props only after the component is loaded and chatRef is available
    if (!chatRef.current || isLoading) return;
    Object.assign(chatRef.current, assignableProps);

    // Check if not already ready and trigger onReady
    if (!isReady) {
      console.log("[FlowiseChatbot] is ready to send message");
      isReady = true;
      setReady(true);
    }
  }, [assignableProps, isLoading]); // Add dependencies

  return isLoading ? (
    <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
      <Loading />
    </div>
  ) : (
    // @ts-expect-error - Ignore type checking for flowise-fullchatbot custom element
    <flowise-fullchatbot ref={chatRef} style={style} class={className} />
  );
};

// Add display name for better debugging
FlowiseChatbot.displayName = "FlowiseChatbot";

// Use React.memo for performance optimization
export default React.memo(FlowiseChatbot);
