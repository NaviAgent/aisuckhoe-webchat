"use client";
import { CommonHeader } from "@/components/Common/CommonHeader";
import { HomeMain } from "@/components/Home/HomeMain";
import ChatSideBar from "@/components/Chat/ChatSideBar";

export default function HomeClientPage() {
  return (
    <div className="flex flex-row h-screen bg-background">
      <div className="hidden md:flex">
        <ChatSideBar />
      </div>

      <div className="w-full">
        <div className="relative w-full">
          <CommonHeader className="absolute z-10 w-full bg-white"></CommonHeader>
        </div>
        <div className="flex h-screen flex-col mx-auto">
          <HomeMain></HomeMain>
        </div>
      </div>
    </div>
  );
}
