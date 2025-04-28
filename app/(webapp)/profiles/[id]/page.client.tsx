"use client";

import React, { useState, useEffect, useMemo } from "react";
// import { useProfileStore } from '@/store/useProfileStore'; // Not used directly in this component for now
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Plus,
  Search,
  FileText,
  Calendar,
  Users,
  Heart,
} from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
import type { Profile, ChatSession } from "@prisma/client"; // Assuming Profile and ChatSession types exist
import { formatDateTime } from "@/lib/formatDateTime"; // Assuming this utility exists for date formatting
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { useI18n } from "@/app/i18n";
import { getProfileById } from "@/lib/prisma/profile.service";
import Loading from "@/components/ui/loading";
import { useProfileStore } from "@/store/useProfileStore";

export default function ProfileIdClientPage() {
  const t = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const profileId = params.id;

  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Correctly destructure from the store
  const { setProfileId } = useProfileStore();
  const { chatSessions, isLoading, fetchChatSessionsByProfile } =
    useChatSessionListStore();

  // Filter sessions based on search term
  const filteredChatSessions = useMemo(() => {
    if (!chatSessions) return [];
    // Filter logic: Assuming chatSessions fetched are already related to the profile.
    // Filter only by search term on the session name.
    return chatSessions.filter(
      (session: ChatSession) =>
        (session.name?.toLowerCase() || "").includes(
          debouncedSearchTerm.toLowerCase()
        )
      // Removed filter by lastMessage as it's not available directly on the session model
    );
  }, [chatSessions, debouncedSearchTerm]);

  const fetchProfile = async (profileId: string) => {
    const profile = await getProfileById(profileId);
    // const chatSessions = await getChatSessionsByUserId(profileId); // Fetch associated chat sessions
    if (!profile) return;
    setProfile(profile);
  };

  const handleEdit = () => {
    // TODO: Implement navigation to an edit profile page or open a modal
    console.log("Edit profile clicked");
  };

  const handleNewChat = () => {
    // TODO: Navigate to a new chat page, potentially pre-filled with this profile context
    router.push("/chat"); // Navigate to the general chat page for now
  };

  // Fetch sessions specific to this profile when the component mounts or profile changes
  useEffect(() => {
    if (profileId) {
      setProfileId(profileId);
      fetchProfile(profileId);
      fetchChatSessionsByProfile(profileId);
    }
  }, [fetchChatSessionsByProfile, profileId]);

  if (!profile) {
    return <Loading></Loading>;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <Button variant="ghost" size="icon" onClick={handleEdit}>
          <Edit className="h-5 w-5" />
          <span className="sr-only">Edit</span>
        </Button>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-center p-6 pt-4 border-b border-border">
        <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
          <AvatarImage
            src={profile.avatar || undefined}
            alt={profile.name ?? "User Avatar"}
          />
          <AvatarFallback>
            {profile.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{profile.name ?? "Unnamed User"}</h2>
        {/* TODO: Add dynamic online status */}
        <p className="text-sm text-muted-foreground mb-4">online</p>

        {/* Updated Profile Details */}
        <div className="w-full max-w-md space-y-2 text-sm">
          {/* Name (already displayed above, but can add here if needed) */}
          {/* <div className="flex items-center p-3 bg-muted rounded-lg">
            <User className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground flex-shrink-0 w-20">Name</span>
            <span>{profile.name}</span>
          </div> */}
          <div className="flex items-center p-3 bg-muted rounded-lg">
            <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground flex-shrink-0 w-20">
              Birthday
            </span>
            {/* Format date, assuming formatDateTime exists */}
            <span>{formatDateTime(profile.dob.valueOf())}</span>
          </div>
          <div className="flex items-center p-3 bg-muted rounded-lg">
            <Users className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground flex-shrink-0 w-20">
              Gender
            </span>
            <span className="capitalize">{profile.gender}</span>
          </div>
          <div className="flex items-center p-3 bg-muted rounded-lg">
            <Heart className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="text-muted-foreground flex-shrink-0 w-20">
              Relationship
            </span>
            <span className="capitalize">{profile.relationship}</span>
          </div>
          {/* Add medical history if needed */}
          {/* {profile.medicalHistory && (
             <div className="flex items-center p-3 bg-muted rounded-lg">
               <span className="text-muted-foreground flex-shrink-0 w-20">Medical History</span>
               <span>{profile.medicalHistory}</span>
             </div>
          )} */}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chats" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 sticky top-[69px] bg-background z-10 rounded-none border-b border-border">
          {/* Adjusted top value based on header height */}
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        {/* Chats Tab */}
        <TabsContent
          value="chats"
          className="flex-grow flex flex-col p-4 space-y-4 overflow-y-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("common.search") + "..."}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Chat Session List */}
          <div className="flex-grow space-y-2 overflow-y-auto">
            {isLoading ? ( // Use isLoading
              // Loading Skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center p-3 space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))
            ) : filteredChatSessions.length > 0 ? (
              // Actual Chat List
              filteredChatSessions.map(
                (
                  session: ChatSession // Add type annotation
                ) => (
                  <div
                    key={session.id}
                    className="flex items-center p-3 bg-card rounded-lg cursor-pointer hover:bg-muted"
                    onClick={() => router.push(`/chat/${session.id}`)} // Navigate to specific chat
                  >
                    {/* Use profile avatar or session name initial */}
                    <Avatar className="w-10 h-10 mr-3">
                      {/* TODO: Ideally fetch the profile associated with the session if needed, or use a generic fallback */}
                      <AvatarFallback>
                        {session.name?.charAt(0).toUpperCase() ?? "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      {" "}
                      {/* Added min-w-0 for proper truncation */}
                      <p className="font-semibold truncate">
                        {session.name ?? "Untitled Chat"}
                      </p>
                      {/* Removed lastMessage display */}
                      {/* Optionally display message count: */}
                      {/* <p className="text-sm text-muted-foreground truncate">Messages: {session.messageCount}</p> */}
                    </div>
                    {/* Use createdAt for timestamp */}
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {session.createdAt
                        ? formatDateTime(session.createdAt.valueOf())
                        : ""}
                    </span>
                  </div>
                )
              )
            ) : (
              // Empty State
              <p className="text-center text-muted-foreground mt-8">
                {searchTerm
                  ? "No matching chats found."
                  : "No chat sessions with this user yet."}
              </p>
            )}
          </div>

          {/* Ask Question Button - Consider if this should create a chat specifically with this profile */}
          <Button
            className="w-full mt-auto sticky bottom-4"
            onClick={handleNewChat}
          >
            <Plus className="mr-2 h-4 w-4" /> Đặt câu hỏi
          </Button>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent
          value="files"
          className="flex-grow flex flex-col items-center justify-center p-4 text-muted-foreground"
        >
          <FileText className="h-16 w-16 mb-4" />
          <p className="text-lg font-semibold">No Files Yet</p>
          <p className="text-sm text-center">
            Files shared in chats with this user will appear here.
          </p>
          {/* TODO: Add file upload/management functionality if needed */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
