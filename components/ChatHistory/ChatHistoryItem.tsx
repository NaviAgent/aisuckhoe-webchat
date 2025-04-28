"use client";

import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatSession } from "@prisma/client";
import Link from "next/link";
import { useI18n } from "@/app/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function ChatHistoryItem({
  chat,
  selected,
}: {
  chat: Partial<ChatSession>;
  selected: boolean;
}) {
  const t = useI18n();
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 focus:bg-gray-300"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="sr-only">{t("common.edit")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("ChatHistoryItem.editButton")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 focus:bg-gray-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t("common.delete")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("ChatHistoryItem.deleteButton")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Link>
  );
}
