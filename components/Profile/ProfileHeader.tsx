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
import ProfileDisplay from "./ProfileDisplay"; // Import new component
import ProfileEditDialog from "./ProfileEditDialog"; // Import new component
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Keep Avatar imports if needed here
import { useI18n } from "@/app/i18n";

const ProfileHeader = () => {
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

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {/* Use ProfileDisplay for the trigger content */}
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start p-0 hover:bg-transparent"
            disabled={!selectedProfile} // Disable trigger if no profile selected/loaded
          >
            <ProfileDisplay profile={selectedProfile} isMobile={isMobile} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align="end">
          {/* Display selected profile info and Edit button */}
          {selectedProfile && (
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 rounded">
                  <AvatarImage
                    src={`/placeholder.svg?height=48&width=48&text=${selectedProfile.name[0]}`}
                    alt={selectedProfile.name}
                    className={`rounded bg-gradient-to-br ${selectedProfile.avatar}`}
                  />
                  <AvatarFallback
                    className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
                  >
                    {selectedProfile.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-base font-medium">
                    {selectedProfile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfile.age} | {selectedProfile.gender}
                  </p>
                </div>
              </div>
              {/* Render Edit Dialog and pass onSuccess handler */}
              <ProfileEditDialog
                profile={selectedProfile}
                onSuccess={handleSuccess}
              />
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Render Profile Switcher */}
          <p className="mb-2 px-2 text-sm font-medium">
            {t("ProfileHeader.profileList")}
          </p>
          <DropdownMenuRadioGroup
            className="px-2"
            value={selectedProfile?.id}
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
          {/* <div className="px-2 py-2">
            <ProfileCreateDialog onSuccess={handleSuccess} />
          </div> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Using React.memo might be less effective now if selectedProfile state is local,
// but keep it for now as profileId from store still influences it.
export default React.memo(ProfileHeader);
