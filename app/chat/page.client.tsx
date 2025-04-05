"use client";

import { ChatHeader } from "@/components/Chat/ChatHeader";
import { ChatStarter } from "@/components/Chat/ChatStarter";
import CommonSideBar from "@/components/Common/CommonSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChatClientPage() {
  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        <CommonSideBar />

        <div className="w-full">
          <div className="relative w-full">
            <ChatHeader className="absolute z-10 w-full bg-white"></ChatHeader>
          </div>

          {/* Removed pt-16 as CommonHeader now handles spacing */}
          <div className="flex h-screen flex-col mx-auto">
            <ChatStarter></ChatStarter>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
