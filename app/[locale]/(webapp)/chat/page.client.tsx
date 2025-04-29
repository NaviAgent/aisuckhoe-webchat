"use client";

import { ChatStarter } from "@/components/Chat/ChatStarter";
import { HomeHeader } from "@/components/Home/HomeHeader";
import Loading from "@/components/ui/loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@clerk/nextjs";

export default function ChatClientPage() {
  const { userId } = useAuth();
  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        {/* <CommonSideBar /> */}

        <div className="w-full">
          <div className="relative w-full">
            <HomeHeader className="absolute z-10 w-full bg-white"></HomeHeader>
          </div>

          {/* Removed pt-16 as CommonHeader now handles spacing */}
          <div className="flex h-screen flex-col mx-auto">
            {userId ? <ChatStarter userId={userId}></ChatStarter> : <Loading />}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
