import React from "react";
import { Profile } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileDisplayProps {
  profile: Profile | undefined;
  isMobile: boolean;
  className?: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  profile,
  isMobile,
  className,
}) => {
  if (!profile) {
    // Handle case where profile is not yet loaded or selected
    return (
      <div className="flex items-center">
        <Avatar
          className={cn(
            "h-10 w-10 rounded",
            isMobile ? "h-8 w-8" : "h-10 w-10",
            className
          )}
        >
          <AvatarFallback className="rounded bg-gradient-to-br from-gray-400 to-gray-500">
            ?
          </AvatarFallback>
        </Avatar>
        {!isMobile && (
          <div className="ml-3 text-left">
            <p className="text-sm font-medium">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Avatar
        className={cn(
          "h-10 w-10 rounded",
          isMobile ? "h-8 w-8" : "h-10 w-10",
          className
        )}
      >
        <AvatarImage
          src={`/placeholder.svg?height=40&width=40&text=${profile.name[0]}`}
          alt={profile.name}
          className={`rounded bg-gradient-to-br ${profile.avatar}`}
        />
        <AvatarFallback
          className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
        >
          {profile.name[0]}
        </AvatarFallback>
      </Avatar>

      {!isMobile && (
        <div className="ml-3 text-left">
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="text-xs text-muted-foreground">
            {profile.age} | {profile.gender}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;
