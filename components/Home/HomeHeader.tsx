"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle } from "lucide-react";
import ProfileHeader from "../Profile/ProfileHeader";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18n } from "@/app/[locale]/i18n";
import { ChatHistory } from "../ChatHistory/ChatHistory";

interface HomeHeaderProps {
  className?: string;
}

export function HomeHeader({ className }: HomeHeaderProps) {
  const isMobile = useIsMobile();
  const t = useI18n();
  return (
    <div
      className={cn(
        "flex bg-white items-center justify-center border-b px-3 py-3 transition-[left,width] duration-200 ease-linear",
        className
      )}
    >
      {/* {isMobile ? (
        <Button asChild variant="ghost" size="icon" className="[&_svg]:size-6">
          <Link href="/chats">
            <ChevronLeft/>
          </Link>
        </Button>
      ) : (
        <SidebarTrigger />
      )} */}

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

      <div className="flex justify-center items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={"ghost"}
                size="icon"
                className="rounded-full [&_svg]:size-6"
              >
                <Link href={"/chat"}>
                  <PlusCircle />
                  <span className="sr-only">
                    {t("HomeHeader.newChatButton")}
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("HomeHeader.newChatButton")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ChatHistory />
        {/* <Button variant="ghost" size="icon">
      <Ghost className="h-5 w-5" />
      <span className="sr-only">AI Assistant</span>
    </Button> */}
        {/* <ProfileHeader /> */}
      </div>
    </div>
  );
}
