"use client";

import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatSession } from "@prisma/client";
import Link from "next/link";

export function ChatHistoryItem({
  chat,
  selected,
}: {
  chat: Partial<ChatSession>;
  selected: boolean;
}) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      // onClick={(e) => setChatSessionId(chat?.id!)}
    >
      <div
        className={cn(
          "flex items-center justify-between py-3 border-b border-gray-100 rounded-md p-3 cursor-pointer hover:bg-muted/90",
          selected
            ? "scale-105 bg-muted/90"
            : "scale-100 bg-inherit text-inherit",
          "transition-transform duration-200 ease-in-out"
        )}
      >
        <span className="font-medium text-sm truncate">{chat.name}</span>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus:bg-gray-300"
          >
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus:bg-gray-300"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
