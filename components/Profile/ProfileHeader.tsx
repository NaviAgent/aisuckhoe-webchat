"use client";

import React, { useEffect, useState } from "react";
import { Check, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useProfileStore } from "@/store/useProfileStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileListStore } from "@/store/useProfileListStore";

const ProfileHeader = () => {
  const { profiles, fetchProfiles } = useProfileListStore();
  const { profileId, setProfileId } = useProfileStore();
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleProfileChange = (profile: Profile) => {
    setProfileId(profile.id);
    setSelectedProfile(profile);
    setOpen(false);
  };

  useEffect(() => {
    if (profileId) {
      setSelectedProfile(profiles.find((p) => p.id === profileId));
    }
  });

  // Fetch profiles from API
  useEffect(() => {
    console.log("[ProfileHeader] fetch profiles");
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start p-0 hover:bg-transparent"
          >
            <Avatar className="h-10 w-10 rounded">
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40&text=${selectedProfile?.name[0]}`}
                alt={selectedProfile?.name}
                className={`rounded bg-gradient-to-br ${selectedProfile?.avatar}`}
              />
              <AvatarFallback
                className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
              >
                {selectedProfile?.name[0]}
              </AvatarFallback>
            </Avatar>

            {!isMobile ? (
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">{selectedProfile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedProfile?.age} | {selectedProfile?.gender}
                </p>
              </div>
            ) : null}

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-auto"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align="end">
          <div className="px-4 py-2 text-sm text-muted-foreground">
            {selectedProfile?.name}
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 rounded">
                <AvatarImage
                  src={`/placeholder.svg?height=48&width=48&text=${selectedProfile?.name[0]}`}
                  alt={selectedProfile?.name}
                  className={`rounded bg-gradient-to-br ${selectedProfile?.avatar}`}
                />
                <AvatarFallback
                  className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
                >
                  {selectedProfile?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-base font-medium">{selectedProfile?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProfile?.age} | {selectedProfile?.gender}
                </p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Edit profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile" className="space-y-4 pt-4">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24 rounded">
                        <AvatarImage
                          src={`/placeholder.svg?height=96&width=96&text=${selectedProfile?.name[0]}`}
                          alt={selectedProfile?.name}
                          className={`rounded bg-gradient-to-br ${selectedProfile?.avatar}`}
                        />
                        <AvatarFallback
                          className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
                        >
                          {selectedProfile?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue={selectedProfile?.name} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="gender">gender</Label>
                        <Input
                          id="gender"
                          defaultValue={selectedProfile?.gender}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="medicalHistory">medicalHistory</Label>
                        <Input
                          id="medicalHistory"
                          placeholder="Tell us about yourself"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <DropdownMenuSeparator />

          <div className="px-4 py-2">
            <p className="mb-2 text-sm font-medium">Switch Profile</p>
            <div className="space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  className={cn(
                    "flex w-full items-center rounded-md px-2 py-2 hover:bg-muted",
                    selectedProfile?.id === profile.id && "bg-muted"
                  )}
                  onClick={() => handleProfileChange(profile)}
                >
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
                    <p className="text-xs text-muted-foreground">
                      {selectedProfile?.age} | {selectedProfile?.gender}
                    </p>
                  </div>
                  {selectedProfile?.id === profile.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default React.memo(ProfileHeader);
