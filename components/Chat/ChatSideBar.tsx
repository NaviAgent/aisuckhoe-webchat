"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";
import { cn, groupByTimePeriods } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ChatSession } from "@prisma/client";
import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";

const ChatSidebar = () => {
  const { profiles, fetchProfiles } = useProfileListStore();
  const { profileId, setProfileId } = useProfileStore();
  const { chatSessions, fetchChatSessions } = useChatSessionListStore();
  const { chatSessionId } = useChatSessionStore();
  const { collapsible } = useSidebarStore();

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
            collapsible === "icon" ? "flex justify-center p-2" : "",
            isSelected
              ? "scale-105 bg-muted/90"
              : "scale-100 bg-inherit text-inherit",
            "transition-transform duration-200 ease-in-out"
          )}
        >
          <Link
            href={`/chat/${chat.id}`}
            className="flex items-center"
            // onClick={(e) => setChatSessionId(chat?.id!)}
          >
            {collapsible === "icon" ? (
              <MessageSquare className="h-5 w-5" />
            ) : (
              <>
                <div className="font-medium text-sm truncate">{chat.name}</div>
                <div className="text-xs text-muted-foreground">
                  {chat.messageCount} messages ·{" "}
                  {chat?.createdAt?.toLocaleString()}
                </div>
              </>
            )}
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
  const openChatSessionForm = () => {
    // Logic to open ChatSessionForm
  };

  return (
    <SidebarProvider open={collapsible !== "icon"}>
      <Sidebar className="border-r-2 border-r-slate-200" collapsible={collapsible}>
        <SidebarHeader className="flex flex-row items-center justify-between p-4">
          {collapsible === "icon" ? null : (
            <ProfileHeader profiles={profiles} />
          )}
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setCollapsible(collapsible === "icon" ? "offcanvas" : "icon")
            }
          >
            {collapsible === "icon" ? <X /> : <Menu />}
          </Button> */}
        </SidebarHeader>

        <SidebarContent className="px-3 py-2">
          <div className="mb-4">
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
          </div>

          {/* <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#" className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>Community</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#" className="flex items-center">
                  <Library className="mr-2 h-5 w-5" />
                  <span>Library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#" className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.07989 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.07989 21 8.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#" className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Feedback</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu> */}

          {/* <div className="mt-6">
            <h3 className="mb-2 px-4 text-sm font-normal text-muted-foreground">
              Projects
            </h3>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 rotate-45" />
                    <span>requirement2testcase</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 rotate-45" />
                    <span>aisuckhoe</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-1 px-4">
              <Link
                href="#"
                className="flex items-center text-xs text-muted-foreground hover:underline"
              >
                View All <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div> */}

          <div className="mt-6">
            <SidebarMenu>
              <ScrollArea className="flex-1">
                {chatSessionMenuGroup().map(({ key, chats }) => {
                  return (
                    <div key={key}>
                      {collapsible === "icon" ? (
                        <hr />
                      ) : (
                        <h3 className="mb-2 px-4 text-sm font-normal text-muted-foreground">
                          {key}
                        </h3>
                      )}
                      {chats.map((chat) => chatSessionMenuItem(chat))}
                    </div>
                  );
                })}
              </ScrollArea>
            </SidebarMenu>
            {/* <div className="mt-1 px-4">
              <Link
                href="#"
                className="flex items-center text-xs text-muted-foreground hover:underline"
              >
                View All <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div> */}
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
    </SidebarProvider>
  );
};

export default React.memo(ChatSidebar);
