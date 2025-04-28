"use client";

import React, { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileStore } from "@/store/useProfileStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileListStore } from "@/store/useProfileListStore";
import ProfileCreateDialog from "../Profile/ProfileCreateDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import ProfileDisplay from "../Profile/ProfileDisplay";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18n } from "@/app/i18n";
import Loading from "../ui/loading";

const ChatProfileSwitcher = () => {
  const t = useI18n();
  const { profiles, fetchProfiles } = useProfileListStore();
  const { profileId, setProfileId } = useProfileStore();
  // Keep selectedProfile state local to ProfileHeader for now
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // Update local selectedProfile when profileId changes or profiles load
  useEffect(() => {
    if (profileId && profiles.length > 0) {
      setSelectedProfile(profiles.find((p) => p.id === profileId));
    } else if (profiles.length > 0 && !profileId) {
      // Default to the first profile if none is selected in the store
      const defaultProfile = profiles[0];
      setSelectedProfile(defaultProfile);
      if (defaultProfile) {
        // Add explicit check
        setProfileId(defaultProfile.id); // Update store as well
      }
    } else {
      setSelectedProfile(undefined); // Handle case where profiles are empty
    }
  }, [profileId, profiles, setProfileId]);

  const handleProfileChange = (id: string) => {
    // Update store first
    setProfileId(id);
    // Update local state (optional, could rely solely on store + useEffect)
    // setSelectedProfile(profile);
    // Close dropdown
    setOpen(false);
  };

  // Fetch profiles from API on mount
  useEffect(() => {
    console.log("[ProfileHeader] fetch profiles");
    fetchProfiles();
  }, [fetchProfiles]);

  // Handler to refresh profiles after successful edit/create
  const handleSuccess = () => {
    console.log("[ProfileHeader] Refreshing profiles after success");
    fetchProfiles();
  };

  if (!selectedProfile) {
    return <Loading></Loading>;
  }
  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                {/* Use ProfileDisplay for the trigger content */}
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start p-0 hover:bg-transparent"
                  disabled={!selectedProfile}
                >
                  <ProfileDisplay profile={selectedProfile} isMobile={true} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("ChatProfileSwitcher.profileSelect")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-80 bg-white rounded-lg" align="end">
          {/* Render Profile Switcher */}
          <DropdownMenuRadioGroup
            className="px-2"
            value={selectedProfile!.id}
            onValueChange={handleProfileChange}
          >
            {profiles.map((profile) => (
              <DropdownMenuRadioItem
                key={profile.id}
                value={profile.id}
                className="px-4"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 rounded">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32&text=${profile.name[0]}`}
                      alt={profile.name}
                      className={`rounded bg-gradient-to-br ${profile.avatar}`}
                    />
                    <AvatarFallback
                      className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
                    >
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium">{profile.name}</p>
                    {/* Optional: Display age/gender if needed */}
                    {/* <p className="text-xs text-muted-foreground">
                  {profile.age} | {profile.gender}
                </p> */}
                  </div>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          {/* Render Create Profile Dialog Trigger and pass onSuccess handler */}
          <div className="px-2 py-2">
            {isMobile ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/profiles/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("ChatProfileSwitcher.addProfileButton")}
                </Link>
              </Button>
            ) : (
              <ProfileCreateDialog
                userId={selectedProfile!.ownerId}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Using React.memo might be less effective now if selectedProfile state is local,
// but keep it for now as profileId from store still influences it.
export default React.memo(ChatProfileSwitcher);
