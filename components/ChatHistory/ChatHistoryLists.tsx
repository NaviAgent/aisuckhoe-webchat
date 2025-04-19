"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  memo,
  MouseEvent,
  KeyboardEvent, // Import KeyboardEvent
} from "react";
import { ChatSession } from "@prisma/client";
import { Search, Trash2, Edit3, Check, X, Loader2 } from "lucide-react"; // Added Check and X icons
import { groupByTimePeriods, groupByTimePeriodsType, TimePeriodGroupType } from "@/lib/utils"; // Added util
import { ScrollArea } from "@/components/ui/scroll-area"; // Added ui component
import { Input } from "@/components/ui/input"; // Added ui component
import { Button } from "@/components/ui/button"; // Added ui component
import { cn } from "@/lib/utils"; // Added util
import Link from "next/link"; // Added Link
import { useI18n } from "@/app/[locale]/i18n"; // Added i18n hook
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added ui component

// --- Context Definition ---
interface ChatHistoryContextProps {
  onSave: (chatId: string, newName: string) => void; // Accept new name
  onDelete: (chatId: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const ChatHistoryContext = createContext<ChatHistoryContextProps | undefined>(
  undefined
);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
};

// --- Provider Component ---
interface ChatHistoryProviderProps {
  children: ReactNode;
  onSave: (chatId: string, newName: string) => void; // Accept new name
  onDelete: (chatId: string) => void;
}

const ChatHistoryProvider = ({
  children,
  onSave,
  onDelete,
}: ChatHistoryProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const value = {
    onSave,
    onDelete,
    onSearch: handleSearch,
    searchQuery,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

// --- List Component (Internal) ---
interface ListProps {
  chatSessions: ChatSession[];
  chatSessionId?: string | null;
  isLoading?: boolean;
}

const List = memo(({ chatSessions, chatSessionId, isLoading }: ListProps) => {
  const t = useI18n();
  const { searchQuery, onSearch, onSave, onDelete } = useChatHistory(); // Use contex
  const [editingChatId, setEditItem] = useState("");

  const groupChat = () => {
    // Filter based on context search query *before* grouping
    const filteredSessions = chatSessions.filter((session) =>
      session.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const groups = groupByTimePeriods<ChatSession>(filteredSessions);
    return Object.entries(groups)
      .map(([key, chats]) => ({ key, chats }))
      .filter(({ chats }) => chats.length > 0);
  };

  const handleDelete = (chatId: string) => {
    setEditItem(chatId);
    onDelete(chatId);
  };

  const handleEdit = (chatId: string) => {
    setEditItem(chatId);
  };

  const handleSave = (chatId: string, editedName: string) => {
    onSave(chatId, editedName);
  };

  return (
    <>
      <div className="relative mb-4">
        <Input
          placeholder={t("common.search") + "..."}
          className="pl-10 pr-4 py-2 rounded-lg"
          value={searchQuery} // Use context value
          onChange={(e) => onSearch(e.target.value)} // Use context handler
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        {/* Added flex-grow for better layout */}
        {groupChat().map(({ key, chats }) => (
          <div key={key}>
            <h3 className="mb-2 text-sm font-normal text-muted-foreground">
              {t(`common.${key as keyof TimePeriodGroupType}`)}
            </h3>
            {chats.map((chat) => (
              // Use Item component defined below
              <Item
                key={chat.id}
                mode={chat.id === editingChatId ? "edit" : "view"}
                chat={chat}
                selected={chat.id === chatSessionId}
                isLoading={editingChatId === chat.id ? isLoading : undefined}
                canDelete={chat.id !== chatSessionId}
                canEdit={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSave={handleSave}
              />
            ))}
          </div>
        ))}
      </ScrollArea>
    </>
  );
});
List.displayName = "ChatHistoryList"; // Add display name for DevTools

// --- Item Component (Internal) ---
interface ItemProps {
  mode: "view" | "edit" | "delete" | "disabled";
  chat: Partial<ChatSession>;
  selected: boolean;
  isLoading?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit: (chatId: string) => void;
  onSave: (chatId: string, newName: string) => void;
  onDelete: (chatId: string) => void;
}

const Item = memo(
  ({
    mode,
    chat,
    selected,
    isLoading,
    canEdit,
    canDelete,
    onEdit,
    onSave,
    onDelete,
  }: ItemProps) => {
    const t = useI18n();
    const [editedName, setEditedName] = useState(chat.name || "");

    // --- Edit Handlers ---
    const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit(chat.id!);
      setEditedName(chat.name || ""); // Initialize input with current name
    };

    // --- Delete Handler ---
    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Prevent Link navigation
      e.stopPropagation(); // Stop event bubbling
      if (chat.id) {
        onDelete(chat.id);
      }
    };

    // --- Render Logic ---
    const renderEdit = () => {
      const handleSaveEdit = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (chat.id && editedName.trim()) {
          onSave(chat.id, editedName.trim());
          onEdit("");
        } else {
          // Optionally handle empty name case, maybe revert or show error
          handleCancelEdit(); // Revert if name is empty
        }
      };

      const handleCancelEdit = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        e?.stopPropagation();
        onEdit("");
        // No need to reset editedName here, it resets on next edit click
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
      };

      const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          handleSaveEdit();
        } else if (e.key === "Escape") {
          handleCancelEdit();
        }
      };

      // Editing View: Input and Save/Cancel buttons
      return (
        <div className="flex items-center justify-between w-full space-x-2">
          <Input
            value={editedName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="h-8 flex-grow text-sm" // Adjusted styling
            autoFocus // Focus input on edit
            onFocus={(e) => e.target.select()} // Select text on focus
            disabled={isLoading}
          />
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:bg-green-100"
              onClick={handleSaveEdit}
              aria-label={t("common.save")}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-100"
              onClick={handleCancelEdit}
              aria-label={t("common.cancel")}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
            {/* Correctly close the Button tag */}
          </div>
        </div>
      );
    };

    const renderView = () => {
      // Default View: Name (linked) and Edit/Delete buttons
      return (
        <>
          {/* Link only wraps the name */}
          <Link
            href={`/chat/${chat.id}`}
            className="flex-grow truncate mr-2"
            onClick={(e) => {
              if (mode === "edit") e.preventDefault();
            }}
          >
            <span className="font-medium text-sm">{chat.name}</span>
          </Link>

          {/* Buttons are outside the link */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {canEdit ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted/80" // Adjusted hover
                      onClick={handleEditClick}
                      hidden={!canEdit}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit3 className="h-4 w-4" />
                      )}
                      <span className="sr-only">{t("common.edit")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("ChatHistoryItem.editButton")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}

            {canDelete ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-red-600 hover:bg-red-100" // Adjusted hover
                      onClick={handleDeleteClick}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">{t("common.delete")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("ChatHistoryItem.deleteButton")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        </>
      );
    };

    return (
      // Always use a div as the main container
      <div
        className={cn(
          "flex items-center justify-between py-2 px-3 border-b border-gray-100 rounded-md hover:bg-muted/90", // Adjusted padding, removed cursor-pointer from main div
          selected
            ? "scale-105 bg-muted/90"
            : "scale-100 bg-inherit text-inherit",
          selected
            ? "scale-105 bg-muted/90" // Apply selected styles here
            : "scale-100 bg-inherit text-inherit",
          "transition-transform duration-200 ease-in-out",
          mode === "edit" ? "cursor-default" : "cursor-pointer" // Add cursor based on state
        )}
      >
        {mode === "edit" ? renderEdit() : renderView()}
      </div>
    );
  }
);
Item.displayName = "ChatHistoryItem"; // Add display name for DevTools

export default {
  Provider: ChatHistoryProvider,
  List,
  Item,
};
