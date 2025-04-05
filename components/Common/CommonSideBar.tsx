"use client";
import Link from "next/link";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";
import { cn, groupByTimePeriods } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import { ChatSession } from "@prisma/client";
import React from "react";

const CommonSideBar = () => {
  const { profiles, fetchProfiles } = useProfileListStore();
  const { profileId, setProfileId } = useProfileStore();
  const { chatSessions, fetchChatSessions } = useChatSessionListStore();
  const { chatSessionId } = useChatSessionStore();
  const { isMobile, toggleSidebar } = useSidebar();

  // Fetch profiles from API
  useEffect(() => {
    fetchProfiles();
    fetchChatSessions();
  }, [fetchProfiles, fetchChatSessions]);

  useEffect(() => {
    if (!profileId && profiles.length > 0) {
      setProfileId(profiles[0]!.id);
    }
  }, [profiles, setProfileId, profileId]);

  const chatSessionMenuGroup = () => {
    const groups = groupByTimePeriods(chatSessions);
    return Object.entries(groups)
      .map(([key, chats]) => ({ key, chats }))
      .filter(({ chats }) => chats.length > 0);
  };

  const chatSessionMenuItem = (chat: Partial<ChatSession>) => {
    const isSelected = chatSessionId === chat.id;
    return (
      <SidebarMenuItem key={chat.id}>
        <SidebarMenuButton
          asChild
          className={cn(
            "rounded-md p-3 cursor-pointer hover:bg-muted/90",
            isSelected
              ? "scale-105 bg-muted/90"
              : "scale-100 bg-inherit text-inherit",
            "transition-transform duration-200 ease-in-out"
          )}
        >
          <Link
            href={`/chat/${chat.id}`}
            className="flex items-center"
            onClick={() => toggleSidebar()}
          >
            <MessageSquare className="h-5 w-5" />
            <div className="font-medium text-sm truncate">{chat.name}</div>
            <div className="text-xs text-muted-foreground">
              {chat.messageCount} messages · {chat?.createdAt?.toLocaleString()}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  // useEffect(() => {
  //   if (profileId && profiles.length > 0) {
  //     setCurrentProfile(profiles.find(p => p.id === profileId)!)
  //   }
  // }, [profileId, profiles, setCurrentProfile]);

  // Function to toggle sidebar collapse
  // const toggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  // Function to create a new profile
  // const createNewProfile = async () => {
  //   if (newProfileName.trim()) {
  //     const newProfile = {
  //       name: newProfileName,
  //     };

  //     // Send a POST request to create the new profile
  //     const response = await fetch('/api/profiles', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newProfile),
  //     });

  //     if (response.ok) {
  //       const createdProfile = await response.json();
  //       setProfiles([...profiles, createdProfile]);
  //       setCurrentProfile(createdProfile);
  //       setNewProfileName("");
  //       setIsNewProfileOpen(false);
  //     } else {
  //       // Handle error (optional)
  //       console.error('Failed to create profile');
  //     }
  //   }
  // }

  // Function to create a new chat session
  // const createNewChat = () => {
  //   const newChat = {
  //     id: chatSessions.length + 1,
  //     name: `New Chat ${chatSessions.length + 1}`,
  //     messages: 0,
  //     time: new Date().toLocaleString(),
  //   }
  //   setChatSessions([newChat, ...chatSessions])
  // }

  // Function to open ChatSessionForm

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between p-4">
        {isMobile ? null : <ProfileHeader />}
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        {/* <div className="mb-4">
        {collapsible === "icon" ? (
          <Button
            variant="outline"
            size="icon"
            onClick={openChatSessionForm}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-center py-6 text-base"
            onClick={openChatSessionForm}
          >
            Hỏi AI
          </Button>
        )}
      </div> */}

        <div className="mt-6">
          <SidebarMenu>
            <ScrollArea className="flex-1">
              {chatSessionMenuGroup().map(({ key, chats }) => {
                return (
                  <div key={key}>
                    <h3 className="mb-2 px-4 text-sm font-normal text-muted-foreground">
                      {key}
                    </h3>
                    {chats.map((chat) => chatSessionMenuItem(chat))}
                  </div>
                );
              })}
            </ScrollArea>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t p-4">
        {/* Bottom Actions */}

        <UserButton>
          {/* <UserButton.UserProfilePage label="Custom Page" url="custom" labelIcon={<DotIcon />}>
<div>
<h1>Custom page</h1>
<p>This is the content of the custom page.</p>
</div>
</UserButton.UserProfilePage>
<UserButton.UserProfileLink label="Homepage" url="/" labelIcon={<DotIcon />} /> */}
          <UserButton.UserProfilePage label="account" />
          <UserButton.UserProfilePage label="security" />
        </UserButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default React.memo(CommonSideBar);
