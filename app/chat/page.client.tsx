"use client";

import ChatSideBar from "@/components/Chat/ChatSideBar";
import { CommonHeader } from "@/components/Common/CommonHeader";
import { HomeMain } from "@/components/Home/HomeMain";

export default function ChatClientPage() {
  return (
    <div className="flex flex-row h-screen bg-background">
      <div className="hidden md:flex">
        <ChatSideBar />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          <CommonHeader className="absolute z-10 w-full bg-white"></CommonHeader>
        </div>
        {/* Removed pt-16 as CommonHeader now handles spacing */}
        <div className="flex h-screen flex-col mx-auto">
          <HomeMain></HomeMain>
        </div>
      </div>
    </div>
  );
}
