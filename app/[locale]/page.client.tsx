"use client";

import { HomeMain } from "@/components/Home/HomeMain";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeHeader } from "@/components/Home/HomeHeader";
import { useAuth } from "@clerk/nextjs";
import Loading from "@/components/ui/loading";

export default function HomeClientPage() {
  const { userId } = useAuth();

  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        {/* <CommonSideBar /> */}

        <div className="w-full">
          <div className="relative w-full">
            <HomeHeader className="absolute z-10 w-full bg-white"></HomeHeader>
          </div>

          <div className="flex h-screen flex-col mx-auto">
            {userId ? <HomeMain userId={userId}></HomeMain> : <Loading />}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
