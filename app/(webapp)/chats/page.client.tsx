"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import CommonFooter from "@/components/Common/CommonFooter"; // Import CommonFooter
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from '@/components/ui/badge'; // Badge might not be needed if unread count isn't available
import { PlusCircle, Search } from "lucide-react"; // Removed Pin, VolumeX as they might not be in ChatSession
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import { groupByTimePeriods } from "@/lib/utils";
import { ChatSession } from "@prisma/client"; // Assuming ChatSession type is available
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "../../i18n";

// Helper function to format time (you might have a more sophisticated one in utils)
const formatChatTime = (date: Date | undefined): string => {
  if (!date) return "";
  // Example: return simple time for today, date for older
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString();
};

export default function ChatsPageClient() {
  const t = useI18n()
  const [searchTerm, setSearchTerm] = useState("");
  const { chatSessions, fetchChatSessions } = useChatSessionListStore();

  useEffect(() => {
    fetchChatSessions();
  }, [fetchChatSessions]);

  const groupedAndFilteredChats = useMemo(() => {
    const filtered = chatSessions.filter(
      (chat) => chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
      // Add other fields to search if needed, e.g., last message if available
      // || chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const groups = groupByTimePeriods(filtered);
    return Object.entries(groups)
      .map(([key, chats]) => ({ key, chats }))
      .filter(({ chats }) => chats.length > 0);
  }, [chatSessions, searchTerm]);

  return (
    // Adjust layout: Use min-h-screen and flex-col to push footer down
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <Button variant="ghost" size="default" className="text-lg">
                <Pencil className="h-5 w-5" />
                <span>Edit</span>
              </Button> */}
              {/* <h1 className="text-lg font-semibold">Chats</h1> */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="[&_svg]:size-6"
              >
                <Link href="/chat">
                  <PlusCircle />
                  {/* <span className="sr-only">New Chat</span> */}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')+'...'}
            className="pl-10 w-full bg-muted border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {groupedAndFilteredChats.length === 0 && !searchTerm && (
            <p className="p-4 text-center text-muted-foreground">
              No chats yet. Start a new conversation!
            </p>
          )}
          {groupedAndFilteredChats.length === 0 && searchTerm && (
            <p className="p-4 text-center text-muted-foreground">
              No chats found matching {searchTerm}.
            </p>
          )}
          {groupedAndFilteredChats.map(({ key, chats }) => (
            <React.Fragment key={key}>
              <h3 className="mb-1 mt-3 px-4 text-sm font-medium text-muted-foreground">
                {key}
              </h3>
              {chats.map((chat: ChatSession) => (
                <Link href={`/chat/${chat.id}`} key={chat.id} legacyBehavior>
                  <a className="flex items-center p-4 border-b border-border hover:bg-muted/50 cursor-pointer">
                    <Avatar className="h-12 w-12 mr-4">
                      {/* Assuming profile might have an image, or fallback */}
                      {/* <AvatarImage src={chat.profile?.imageUrl} alt={chat.name || 'Chat'} /> */}
                      <AvatarFallback>
                        {chat.name ? chat.name.charAt(0).toUpperCase() : "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium truncate">
                          {chat.name || "Untitled Chat"}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatChatTime(chat.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        {/* Placeholder for last message if available in ChatSession */}
                        <p className="text-sm text-muted-foreground truncate">
                          {/* {chat.lastMessage || 'No messages yet'} */}
                          {chat.messageCount
                            ? `${chat.messageCount} messages`
                            : "Start chatting..."}
                        </p>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {/* Removed Pin, Mute, Unread Badge as they are not directly in ChatSession based on CommonSideBar */}
                          {/* {chat.pinned && <Pin className="h-3 w-3 text-muted-foreground" />} */}
                          {/* {chat.muted && <VolumeX className="h-3 w-3 text-muted-foreground" />} */}
                          {/* {chat.unread > 0 && (
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                              {chat.unread}
                            </Badge>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </React.Fragment>
          ))}
          {/* TODO: Add loading state */}
        </div>
      </ScrollArea>

      {/* Common Footer */}
      <CommonFooter />
    </div>
  );
}
