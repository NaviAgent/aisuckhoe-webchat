"use client";

import React, { useEffect, useRef, useState } from "react";
import type { BubbleProps } from "@ivannguyendev/flowise-embed";
import Loading from "./ui/loading";

type Props = BubbleProps & {
  style?: React.CSSProperties;
  className?: string;
};

type FullPageChatElement = HTMLElement & Props;

const FlowiseChatbot = ({ style, className, ...assignableProps }: Props) => {
  const ref = useRef<FullPageChatElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await import("@ivannguyendev/flowise-embed/dist/web.js");
      setIsLoading(false);
    })();
  });

  useEffect(() => {
    if (!ref.current) return;
    Object.assign(ref.current, assignableProps);
  }, [assignableProps, isLoading]);

  return isLoading ? (
    <div className="flex pt-16 items-center justify-center w-full h-screen bg-background">
      <Loading />
    </div>
  ) : (
    // @ts-expect-error - Ignore type checking for flowise-fullchatbot
    <flowise-fullchatbot ref={ref} style={style} class={className} />
  );
};

export default React.memo(FlowiseChatbot);
