"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Settings,
  Mic,
  Plus,
  ChevronDown,
  VenetianMaskIcon as Masquerade,
  PlugZap,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import ProfileForm from "../../components/Profile/ProfileForm"
import ProfileSelection from "@/components/Profile/ProfileSelection";
import { ChatSession, Profile } from "@prisma/client"
import Image from "next/image"

const defaultProfile: Profile = { id: 'default', name: "Default", avatar: null, gender: 'U', age: 0, dob: new Date(), medicalHistory: null, relationship: 'me', ownerId: '', createdAt: new Date() }

export default function Sidebar() {
  // State for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  // State for profile management
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile])
  const [currentProfile, setCurrentProfile] = useState<Profile>(profiles[0] || defaultProfile)

  // State for chat sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])

  // State for new profile dialog
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")

  // Fetch profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      
      const response = await fetch('/api/profiles');
      const data = await response.json();
      setProfiles(data);
      setCurrentProfile(data[0] || { id: 0, name: "Default" });
    };
    fetchProfiles();
  }, []);

  // Fetch chat sessions from API
  useEffect(() => {
    const fetchChatSessions = async () => {
      const response = await fetch('/api/chat-sessions');
      const data = await response.json();
      setChatSessions(data);
    };
    fetchChatSessions();
  }, []);

  // Function to toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Function to create a new profile
  const createNewProfile = async () => {
    if (newProfileName.trim()) {
      const newProfile = {
        name: newProfileName,
      };

      // Send a POST request to create the new profile
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
      });

      if (response.ok) {
        const createdProfile = await response.json();
        setProfiles([...profiles, createdProfile]);
        setCurrentProfile(createdProfile);
        setNewProfileName("");
        setIsNewProfileOpen(false);
      } else {
        // Handle error (optional)
        console.error('Failed to create profile');
      }
    }
  }

  // Function to create a new chat session
  // const createNewChat = () => {
  //   const newChat = {
  //     id: chatSessions.length + 1,
  //     name: `New Chat ${chatSessions.length + 1}`,
  //     messages: 0,
  //     time: new Date().toLocaleString(),
  //   }
  //   setChatSessions([newChat, ...chatSessions])
  // }

  // Function to open ProfileForm
  const openProfileForm = () => {
    setIsNewProfileOpen(true);
  };

  // Function to open ChatSessionForm
  const openChatSessionForm = () => {
    // Logic to open ChatSessionForm
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
        "hidden md:flex",
        isCollapsed ? "w-16" : "w-full md:w-80",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">

        {!isCollapsed && (
          <div className="flex-1 ml-2 flex items-center">
            <Image src="https://res.cloudinary.com/ivanistao/image/upload/t_Profile/v1740834460/aisuckhoe/logo/logo-light_a53s1a.png" alt="AI Sức Khỏe Logo" className="h-8 w-8 mr-2" />
            <h1 className="font-bold text-lg">Aisuckhoe</h1>
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          {isCollapsed ? <Menu /> : <X />}
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
          <Menu />
        </Button>
      </div>

      {/* Profile Selection */}
      <ProfileSelection
        profiles={profiles}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        isCollapsed={isCollapsed}
        openProfileForm={openProfileForm}
      />

      {/* Function Buttons */}
      <div className={cn("p-4 border-b border-border", isCollapsed ? "flex flex-col items-center" : "")}>
        {!isCollapsed ? (
          <div className="flex gap-2">
            {/* <Button variant="outline" className="flex-1">
              <Masquerade className="h-4 w-4 mr-2" />
              Mask
            </Button> */}

            <Button variant="outline" onClick={openChatSessionForm}>
              New Chat
            </Button>
          </div>
        ) : (
          <>
            {/* <Button variant="outline" size="icon" className="mb-2">
              <Masquerade className="h-4 w-4" />
            </Button> */}
            <Button variant="outline" size="icon" onClick={openChatSessionForm}>
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Chat Sessions */}
      <ScrollArea className="flex-1">
        <div className={cn("p-4", isCollapsed ? "flex flex-col items-center" : "")}>
          {!isCollapsed && <h2 className="text-sm font-medium mb-2">Chat History</h2>}

          <div className="space-y-2">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "border border-border rounded-md p-3 cursor-pointer hover:bg-muted/50",
                  isCollapsed ? "flex justify-center p-2" : "",
                )}
              >
                {isCollapsed ? (
                  <MessageSquare className="h-5 w-5" />
                ) : (
                  <>
                    <div className="font-medium text-sm truncate">{chat.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {chat.messageCount} messages · {chat.createdAt.toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}

      <div
        className={cn(
          "p-4 border-t border-border",
          isCollapsed ? "flex flex-col items-center space-y-2" : "grid grid-cols-4 gap-2",
        )}
      >
        <UserButton>
          {/* <UserButton.UserProfilePage label="Custom Page" url="custom" labelIcon={<DotIcon />}>
  <div>
    <h1>Custom page</h1>
    <p>This is the content of the custom page.</p>
  </div>
</UserButton.UserProfilePage>
<UserButton.UserProfileLink label="Homepage" url="/" labelIcon={<DotIcon />} /> */}
          <UserButton.UserProfilePage label="account" />
          <UserButton.UserProfilePage label="security" />
        </UserButton>
      </div>

      <div
        className={cn(
          "p-4 border-t border-border",
          isCollapsed ? "flex flex-col items-center space-y-2" : "grid grid-cols-4 gap-2",
        )}
      >
        {isCollapsed ? (
          <>
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mic className="h-4 w-4" />
            </Button>

          </>
        ) : (
          <>
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* New Profile Dialog */}
      <ProfileForm profile={undefined} open={isNewProfileOpen} onClose={() => setIsNewProfileOpen(false)} onSuccess={() => { }} />


      {/* ChatSessionForm Dialog (to be implemented) */}
      {/* <ChatSessionForm open={isChatSessionOpen} onClose={() => setIsChatSessionOpen(false)} /> */}
    </div>
  )
}
