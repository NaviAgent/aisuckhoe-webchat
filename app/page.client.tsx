"use client";

import { HomeMain } from "@/components/Home/HomeMain";
import CommonSideBar from "@/components/Common/CommonSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeHeader } from "@/components/Home/HomeHeader";

export default function HomeClientPage() {
  return (
    <div className="flex flex-row h-screen bg-background">
      <SidebarProvider>
        <CommonSideBar />

        <div className="w-full">
          <div className="relative w-full">
            <HomeHeader className="absolute z-10 w-full bg-white"></HomeHeader>
          </div>
          
          <div className="flex h-screen flex-col mx-auto">
            <HomeMain></HomeMain>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
