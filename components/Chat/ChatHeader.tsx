"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle, Settings } from "lucide-react"; // Added Settings icon
import { ChatHistorySheet } from "@/components/ChatHistory/ChatHistory";
import ProfileHeader from "../Profile/ProfileHeader";
import Link from "next/link";
import { Sheet, SheetTrigger } from "@/components/ui/sheet"; // Added Sheet imports
import ChatSetting from "@/components/Chat/ChatSetting"; // Added ChatSetting import
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
        "flex bg-white items-center justify-between border-b p-3 transition-[left,width] duration-200 ease-linear",
        className
      )}
    >
      {isMobile ? (
        <Button asChild variant="ghost" size="icon" className="[&_svg]:size-6">
          <Link href="/chats">
            <ChevronLeft />
          </Link>
        </Button>
      ) : (
        <SidebarTrigger />
      )}

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
        <Button asChild variant={"ghost"} size="icon" className="[&_svg]:size-6">
          <Link href={"/chat"}>
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Link>
        </Button>

        <ChatHistorySheet />
        {/* Chat Setting Sheet Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="[&_svg]:size-6">
              <Settings />
              <span className="sr-only">Chat Settings</span>
            </Button>
          </SheetTrigger>
          {/* ChatSetting component is rendered inside the Sheet */}
          <ChatSetting />
        </Sheet>
        {/* <Button variant="ghost" size="icon">
          <Ghost className="h-5 w-5" />
          <span className="sr-only">AI Assistant</span>
        </Button> */}
        {/* <ProfileHeader /> */}
      </div>
    </div>
  );
}
