"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ChatHistorySheet } from "@/components/ChatHistory/ChatHistory";
import ProfileHeader from "../Profile/ProfileHeader";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";

interface ChatHeaderProps {
  className?: string;
}

export function ChatHeader({ className }: ChatHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "flex bg-white items-center justify-between border-b px-6 py-3 transition-[left,width] duration-200 ease-linear",
        className
      )}
    >
      <SidebarTrigger />

      {/* {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          // Hide toggle button on mobile as sidebar is controlled differently
          className="h-8 w-8"
          onClick={() => {
            setBack(!isBack);
            onBack ? onBack(!isBack) : null;
          }}
        >
          {isBack ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          // Hide toggle button on mobile as sidebar is controlled differently
          className="h-8 w-8"
          onClick={() => {
            setBack(!isBack);
            onBack ? onBack(!isBack) : null;
          }}
        >
          {isBack ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      )} */}

      {/* Placeholder for mobile menu trigger if needed */}
      {isMobile && <div className="w-8"></div>}

      <div className="flex items-center space-x-4">
        <Button asChild variant={"ghost"} size="icon">
          <Link href={"/chat"}>
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Link>
        </Button>

        <ChatHistorySheet />
        {/* <Button variant="ghost" size="icon">
      <Ghost className="h-5 w-5" />
      <span className="sr-only">AI Assistant</span>
    </Button> */}
        <ProfileHeader />
      </div>
    </div>
  );
}
