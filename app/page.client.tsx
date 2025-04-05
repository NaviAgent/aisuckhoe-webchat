"use client";

import { HomeMain } from "@/components/Home/HomeMain";
import CommonSideBar from "@/components/Common/CommonSideBar";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeClientPage() {
  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        <CommonSideBar />
        <div className="w-full">
          <div className="relative w-full">
            <ChatHeader className="absolute z-10 w-full bg-white"></ChatHeader>
          </div>
          <div className="flex h-screen flex-col mx-auto">
            <HomeMain></HomeMain>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
