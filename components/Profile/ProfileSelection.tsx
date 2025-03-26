"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";

interface ProfileSelectionProps {
  profiles: Profile[];
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  isCollapsed: boolean;
  openProfileForm: () => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({
  profiles,
  currentProfile,
  setCurrentProfile,
  isCollapsed,
  openProfileForm,
}) => {
  return (
    //   <div className={cn("p-4 border-b border-border", isCollapsed ? "flex flex-col items-center" : "")}>
    //   {!isCollapsed ? (
    //     <div className="flex gap-2">
    //       {/* <Button variant="outline" className="flex-1">
    //         <Masquerade className="h-4 w-4 mr-2" />
    //         Mask
    //       </Button> */}

    //       <Button variant="outline" onClick={openChatSessionForm}>
    //         New Chat
    //       </Button>
    //     </div>
    //   ) : (
    //     <>
    //       {/* <Button variant="outline" size="icon" className="mb-2">
    //         <Masquerade className="h-4 w-4" />
    //       </Button> */}
    //       <Button variant="outline" size="icon" onClick={openChatSessionForm}>
    //         <Plus className="h-4 w-4" />
    //       </Button>
    //     </>
    //   )}
    // </div>
    <div className={cn("w-full flex p-4 border-b border-border items-center justify-center", isCollapsed ? "flex flex-col items-center" : "")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <Button variant="outline" size="icon">
              <Avatar className="h-4 w-4" src={currentProfile.avatar || ''} name={currentProfile.name} />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline">
                <Avatar className="mr-2 h-6 w-6" src={currentProfile.avatar || ''} name={currentProfile.name} />
                {currentProfile?.name}
              </Button>
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="border shadow-md rounded-md">
          {profiles.map((profile) => (
            <DropdownMenuItem key={profile.id} onClick={() => setCurrentProfile(profile)}>
              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6" src={profile.avatar || ''} />
                {profile.name}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openProfileForm} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileSelection;
