"use client";

import { Search } from "lucide-react";
import { groupByTimePeriods, groupByTimePeriodsType } from "@/lib/utils";
import { ChatSession } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { ChatHistoryItem } from "./ChatHistoryItem";
import { useI18n } from "@/app/[locale]/i18n";

const ChatHistoryList = ({
  chatSessions,
  chatSessionId,
}: {
  chatSessions: ChatSession[];
  chatSessionId?: string | null;
}) => {
  const t = useI18n()
  const [searchQuery, setSearchQuery] = useState("");

  const groupChat = () => {
    const groups = groupByTimePeriods<ChatSession>(chatSessions);
    return Object.entries(groups)
      .map(([key, chats]) => ({ key, chats }))
      .filter(({ chats }) => chats.length > 0);
  };

  const searchChat = (chats: groupByTimePeriodsType<ChatSession>[]) => {
    const textSearch = searchQuery.toLowerCase();
    return chats.filter((chat) => chat.name.toLowerCase().includes(textSearch));
  };

  return (
    <>
      <div className="relative mb-4">
        <Input
          placeholder={t('common.search')+'...'}
          className="pl-10 pr-4 py-2 rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-muted-foreground">Actions</h3>
          <Button variant="link" className="text-sm">
            Show All
          </Button>
        </div> */}

      {/* <Button
          variant="outline"
          className="w-full justify-start rounded-lg bg-muted/50 mb-6"
        >
          <Ghost className="mr-2 h-5 w-5" />
          Create New Private Chat
        </Button> */}

      <ScrollArea>
        {groupChat().map(({ key, chats }) => {
          return (
            <div key={key}>
              <h3 className="mb-2 text-sm font-normal text-muted-foreground">
                {key}
              </h3>
              {searchChat(chats).map((chat) => (
                <ChatHistoryItem
                  key={chat.id}
                  chat={chat}
                  selected={chat.id === chatSessionId}
                ></ChatHistoryItem>
              ))}
            </div>
          );
        })}
      </ScrollArea>
    </>
  );
};

export default React.memo(ChatHistoryList);
