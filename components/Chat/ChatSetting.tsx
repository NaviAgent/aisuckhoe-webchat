import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SheetContent, // Import SheetContent
} from "@/components/ui/sheet"; // Import from sheet
import {
  Trash2,
  Share,
  MoreHorizontal,
  Search, // Using FileBox as placeholder for GIF icon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for members - replace with actual data later
const dummyMembers = [
  {
    id: "1",
    name: "Nhuận Nguyễn",
    status: "online",
    role: "admin",
    avatarUrl: "https://via.placeholder.com/40",
  },
  {
    id: "2",
    name: "Wellcare",
    status: "last seen recently",
    role: "admin",
    avatarFallback: "W",
  },
  {
    id: "3",
    name: "Khoa Nguyễn",
    status: "last seen recently",
    role: "admin",
    avatarUrl: "https://via.placeholder.com/40",
  },
  {
    id: "4",
    name: "Ân Phạm",
    status: "last seen within a month",
    role: "member",
    avatarFallback: "A",
  }, // Fixed fallback
];

// Dummy data for group info - replace with actual data later
const groupInfo = {
  name: "[Wellcare] admin group",
  memberCount: 6,
  avatarUrl: "https://via.placeholder.com/80", // Replace with actual group avatar
  avatarFallback: "W",
};

// Renamed to ChatSettingContent as it's now the content part
const ChatSettingContent = () => {
  // TODO: Implement actual logic for actions
  const handleDeleteChat = () => {
    console.log("Delete Chat clicked");
    // Add logic to delete chat
  };

  const handleShareChat = () => {
    console.log("Share Chat clicked");
    // Add logic for sharing chat snapshot (coming soon)
  };

  // const handleAddMembers = () => {
  //   console.log("Add Members clicked");
  //   // Add logic to open add members modal/view
  // };

  // Removed the outer div, SheetContent is the new root
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center pt-6">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage src={groupInfo.avatarUrl} alt={groupInfo.name} />
          <AvatarFallback className="text-3xl">
            {groupInfo.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{groupInfo.name}</h2>
        <p className="text-sm text-muted-foreground">
          {groupInfo.memberCount} members
        </p>
      </div>

      {/* Action Buttons Section - Adjusted styling */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {/* TODO: Add functionality to these buttons */}
        {/* Added bg-muted/50 and hover:bg-muted for darker background like the design */}
        {/* <Button variant="ghost" className="flex flex-col items-center h-auto p-2 rounded-lg bg-muted/50 hover:bg-muted">
          <Video className="w-5 h-5 mb-1 text-primary" />
          <span className="text-xs text-primary">Video Chat</span>
        </Button> */}
        {/* <Button variant="ghost" className="flex flex-col items-center h-auto p-2 rounded-lg bg-muted/50 hover:bg-muted">
          <Bell className="w-5 h-5 mb-1 text-primary" />
          <span className="text-xs text-primary">Mute</span>
        </Button> */}
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto p-2 rounded-lg bg-muted/50 hover:bg-muted"
        >
          <Search className="w-5 h-5 mb-1 text-primary" />
          <span className="text-xs text-primary">Search</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center h-auto p-2 rounded-lg bg-muted/50 hover:bg-muted"
            >
              <MoreHorizontal className="w-5 h-5 mb-1 text-primary" />
              <span className="text-xs text-primary">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDeleteChat}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareChat} disabled>
              <Share className="w-4 h-4 mr-2" />
              Share Chat (soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <Separator /> */}

      {/* Group Settings Link - Mimicking the design */}
      {/* <button className="flex items-center justify-between w-full px-4 py-3 text-left border-b border-border hover:bg-muted/50">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
          <span>Group Settings</span>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button> */}

      {/* Tabs Section - Added Media, Links, GIFs */}
      {/* Removed flex-1 and flex-col from Tabs as SheetContent handles scrolling */}
      <Tabs defaultValue="members" className="">
        {/* Updated grid-cols-4 for the new tabs */}
        <TabsList className="grid w-full grid-cols-1 p-0">
          <TabsTrigger value="members" className="">
            Members
          </TabsTrigger>
          {/* Added placeholder tabs */}
          {/* <TabsTrigger value="media" disabled className="relative rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-sm font-medium text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
            Media
          </TabsTrigger>
          <TabsTrigger value="links" disabled className="relative rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-sm font-medium text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
            Links
          </TabsTrigger>
          <TabsTrigger value="gifs" disabled className="relative rounded-none border-b-2 border-transparent bg-transparent px-2 py-3 text-sm font-medium text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
            GIFs
          </TabsTrigger> */}
        </TabsList>

        {/* Members Tab Content */}
        {/* Removed flex-1 and overflow-y-auto */}
        <TabsContent value="members" className="p-0">
          {/* <button
             onClick={handleAddMembers}
             className="flex items-center w-full px-4 py-3 text-left text-primary border-b border-border hover:bg-muted/50"
           >
             <UserPlus className="w-5 h-5 mr-3" />
             <span>Add Members</span>
           </button> */}
          <ul className="">
            {dummyMembers.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.avatarFallback || member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p
                      className={cn(
                        "text-xs",
                        member.status === "online"
                          ? "text-green-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {member.status}
                    </p>
                  </div>
                </div>
                {member.role === "admin" && (
                  <span className="text-xs text-muted-foreground">admin</span>
                )}
              </li>
            ))}
          </ul>
        </TabsContent>

        {/* Placeholder Content for other tabs */}
        {/* Removed flex-1 flex items-center justify-center */}
        <TabsContent value="files" className="p-4 text-center">
          <p className="text-muted-foreground">Files feature coming soon.</p>
        </TabsContent>
        <TabsContent value="media" className="p-4 text-center">
          <p className="text-muted-foreground">Media feature coming soon.</p>
        </TabsContent>
        <TabsContent value="links" className="p-4 text-center">
          <p className="text-muted-foreground">Links feature coming soon.</p>
        </TabsContent>
        <TabsContent value="gifs" className="p-4 text-center">
          <p className="text-muted-foreground">GIFs feature coming soon.</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

// The main export is now just a wrapper for SheetContent with props
const ChatSetting = () => {
  return (
    <SheetContent side="bottom" className="h-[95vh] rounded-t-xl">
      {/* SheetContent handles scrolling, apply flex-col here */}
      <ChatSettingContent />
    </SheetContent>
  );
};

export default ChatSetting;
