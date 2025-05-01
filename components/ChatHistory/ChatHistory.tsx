"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Clock, ClockIcon } from "lucide-react";

import { useProfileListStore } from "@/store/useProfileListStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18n } from "@/app/i18n";
import ChatHistoryLists from "./ChatHistoryLists";

export function ChatHistory() {
  const t = useI18n();
  const { profiles, fetchProfiles } = useProfileListStore();
  const { profileId, setProfileId } = useProfileStore();
  const {
    chatSessions,
    isLoading: isLoadingChatSessions,
    fetchChatSessions,
    deleteChatSession,
    updateChatSession,
  } = useChatSessionListStore();
  const { chatSessionId } = useChatSessionStore();

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Updated onEdit to accept newName and call updateChatSession
  const handleSave = (chatId: string, newName: string) => {
    console.log("[ChatHistory] edit", chatId, newName);
    updateChatSession(chatId, { name: newName }); // Update the session name
  };

  const hanldeDelete = (chatId: string) => {
    console.log("[ChatHistory] delete", chatId);
    deleteChatSession(chatId);
  };

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

  // Helper to toggle the sidebar.

  //   const groupChat = () => {
  //     const groups = groupByTimePeriods(chatSessions);
  //     return Object.entries(groups)
  //       .map(([key, chats]) => ({ key, chats }))
  //       .filter(({ chats }) => chats.length > 0);
  //   };

  //   const searchChat = (chats: groupByTimePeriodsType[]) => {
  //     const textSearch = searchQuery.toLowerCase();
  //     return chats.filter((chat) => chat.name.toLowerCase().includes(textSearch));
  //   };

  //   const chatSessionMenuItem = (chat: Partial<ChatSession>) => {
  //     const isSelected = chatSessionId === chat.id;
  //     return (
  //       <div
  //         key={chat.id}
  //         className={cn(
  //           "flex items-center justify-between py-3 border-b border-gray-100 rounded-md p-3 cursor-pointer hover:bg-muted/90",
  //           isSelected
  //             ? "scale-105 bg-muted/90"
  //             : "scale-100 bg-inherit text-inherit",
  //           "transition-transform duration-200 ease-in-out"
  //         )}
  //       >
  //         <Link
  //           href={`/chat/${chat.id}`}
  //           className="flex items-center"
  //           // onClick={(e) => setChatSessionId(chat?.id!)}
  //         >
  //           <span className="font-medium text-sm truncate">{chat.name}</span>
  //         </Link>

  //         <div className="flex items-center space-x-2">
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="h-8 w-8 focus:bg-gray-300"
  //           >
  //             <Edit3 className="h-4 w-4" />
  //             <span className="sr-only">Share</span>
  //           </Button>
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="h-8 w-8 focus:bg-gray-300"
  //           >
  //             <Trash2 className="h-4 w-4" />
  //             <span className="sr-only">Delete</span>
  //           </Button>
  //         </div>
  //       </div>
  //     );
  // return (
  //   <SidebarMenuItem key={chat.id}>
  //     <SidebarMenuButton
  //       asChild
  //       className={cn(
  //         "rounded-md p-3 cursor-pointer hover:bg-muted/90",
  //         collapsible === "icon" ? "flex justify-center p-2" : "",
  //         isSelected
  //           ? "scale-105 bg-muted/90"
  //           : "scale-100 bg-inherit text-inherit",
  //         "transition-transform duration-200 ease-in-out"
  //       )}
  //     >
  //       <Link
  //         href={`/chat/${chat.id}`}
  //         className="flex items-center"
  //         // onClick={(e) => setChatSessionId(chat?.id!)}
  //       >
  //         {collapsible === "icon" ? (
  //           <MessageSquare className="h-5 w-5" />
  //         ) : (
  //           <>
  //             <div className="font-medium text-sm truncate">{chat.name}</div>
  //             <div className="text-xs text-muted-foreground">
  //               {chat.messageCount} messages ·{" "}
  //               {chat?.createdAt?.toLocaleString()}
  //             </div>
  //           </>
  //         )}
  //       </Link>
  //     </SidebarMenuButton>
  //   </SidebarMenuItem>
  // );

  return isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full [&_svg]:size-6"
              >
                <Clock></Clock>
                <span className="sr-only">
                  {t("ChatHistorySheet.historyButton")}
                </span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("ChatHistorySheet.historyButtonAlt")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent side="bottom" className="h-[95vh] rounded-t-xl px-6">
        <SheetHeader className="flex items-center justify-center pb-2">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </SheetHeader>

        <VisuallyHidden>
          <SheetTitle className="flex items-center justify-center pb-2"></SheetTitle>
          <SheetDescription className="flex items-center justify-center pb-2"></SheetDescription>
        </VisuallyHidden>

        {/* <ChatHistoryList
          key="for-sheet"
          chatSessions={chatSessions}
          chatSessionId={chatSessionId}
        ></ChatHistoryList> */}
        <ChatHistoryLists.Provider onDelete={hanldeDelete} onSave={handleSave}>
          <ChatHistoryLists.List
            chatSessions={chatSessions}
            chatSessionId={chatSessionId}
          />
        </ChatHistoryLists.Provider>

        {/* <div className="space-y-6 overflow-y-auto pb-20">
        {filteredHistory.map(
          (section) =>
            section.items.length > 0 && (
              <div key={section.section}>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {section.section}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100"
                    >
                      <span className="text-base">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div> */}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full [&_svg]:size-6"
              >
                <ClockIcon></ClockIcon>
                <span className="sr-only">
                  {t("ChatHistorySheet.historyButton")}
                </span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("ChatHistorySheet.historyButtonAlt")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="flex flex-col h-[80vh] rounded-xl sm:rounded-xl px-6">
        <DialogHeader className="flex items-center justify-center pb-2">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </DialogHeader>

        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>

        {/* <ChatHistoryList
          key="for-dialog"
          chatSessions={chatSessions}
          chatSessionId={chatSessionId}
        ></ChatHistoryList> */}

        <ChatHistoryLists.Provider onDelete={hanldeDelete} onSave={handleSave}>
          <ChatHistoryLists.List
            chatSessions={chatSessions}
            chatSessionId={chatSessionId}
            isLoading={isLoadingChatSessions}
          />
        </ChatHistoryLists.Provider>
      </DialogContent>
    </Dialog>
  );
}
