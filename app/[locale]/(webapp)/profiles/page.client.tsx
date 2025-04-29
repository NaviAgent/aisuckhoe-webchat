"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon, SearchIcon } from "lucide-react";
import CommonLayout from "@/components/Common/CommonLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CommonFooter from "@/components/Common/CommonFooter";
import { useProfileListStore } from "@/store/useProfileListStore"; // Import the store
import { useI18n } from "../../i18n";

// Helper to get initials (keep for fallback if store doesn't provide)
const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function ProfilePageClient() {
  const t = useI18n()
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Initialize router
  const { profiles, fetchProfiles, isLoading, error } = useProfileListStore(); // Use isLoading

  // Fetch profiles when the component mounts
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Filter profiles from the store
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name && // Add null check for name
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle profile click
  const handleProfileClick = (profileId: string) => {
    router.push(`/profiles/${profileId}`);
  };

  // Optional: Loading and error handling
  if (isLoading) { // Use isLoading
    // You can replace this with a proper Skeleton loader component
    return (
      <CommonLayout>
        <div className="flex justify-center items-center h-full">Loading profiles...</div>
        <CommonFooter />
      </CommonLayout>
    );
  }

  if (error) {
    return (
      <CommonLayout>
        <div className="flex justify-center items-center h-full text-red-500">Error loading profiles: {error.message}</div>
        <CommonFooter />
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className="flex flex-col h-full bg-background text-foreground">
        {/* Custom Header for Profiles Page */}
        <div className="flex items-center justify-between p-3 border-b border-border sticky top-0 bg-background z-10">
          <Button variant="ghost" size="sm" className="[&_svg]:size-6">
            {/* Sort */}
          </Button>
          <h1 className="text-lg font-semibold">Contacts</h1>
          <Link href="/profiles/new" passHref>
            {" "}
            {/* Link to create new profile page (to be created) */}
            <Button variant="ghost" size="icon" className="[&_svg]:size-6">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')+'...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-muted border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md h-9" // Adjusted styling
            />
          </div>
        </div>

        {/* Profile List Area */}
        <ScrollArea className="flex-1">
          <div className="p-0">
            {/* Remove padding for full width items */}
            {/* Invite Friends */}
            {/* <div className="flex items-center p-3 space-x-3 cursor-pointer hover:bg-muted">
              <UserPlusIcon className="h-6 w-6 text-blue-500" />
              <span className="text-blue-500 font-medium">Invite Friends</span>
            </div> */}
            {/* <Separator /> */}
            {/* Profile List - Use filteredProfiles from store */}
            {filteredProfiles.map((profile) => (
              <React.Fragment key={profile.id}>
                {/* Add onClick handler */}
                <div
                  className="flex items-center p-3 space-x-3 cursor-pointer hover:bg-muted"
                  onClick={() => handleProfileClick(profile.id)} // Navigate on click
                  >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={profile.avatar || undefined} // Use profile.avatar
                      alt={profile.name}
                    />
                    <AvatarFallback className="bg-muted-foreground text-background font-semibold">
                      {/* Assuming profile object might not have initials, use helper */}
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{profile.name}</p>
                    {/* Assuming profile object might not have lastSeen or other details */}
                    {/* <p className="text-xs text-muted-foreground">{profile.lastSeen}</p> */}
                  </div>
                </div>
                <Separator className="ml-16" />
              </React.Fragment>
            ))}
            {/* Handle case where there are no profiles */}
            {filteredProfiles.length === 0 && !isLoading && ( // Use isLoading
               <div className="p-4 text-center text-muted-foreground">No contacts found.</div>
            )}
          </div>
        </ScrollArea>

        {/* Common Footer */}
        <CommonFooter />
      </div>
    </CommonLayout>
  );
}
