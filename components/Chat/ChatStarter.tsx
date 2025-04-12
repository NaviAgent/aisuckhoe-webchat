"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Paperclip, Send, ChevronDown, ImagePlus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useProfileStore } from "@/store/useProfileStore";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useChatSessionListStore } from "@/store/useChatSessionListStore";

export function ChatStarter() {
  const router = useRouter(); // Initialize router
  const { profileId } = useProfileStore();
  const { profiles } = useProfileListStore();
  const { createChatSession } = useChatSessionListStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const profile = profiles.find((p) => p.id === profileId);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const sendHandler = async () => {
    if (!inputValue.trim() || !profileId) {
      console.error("Input value or profile ID is missing.");
      return;
    }

    setIsLoading(true);
    try {
      const newSession = await createChatSession({
        name: inputValue.substring(0, 50), // Use first 50 chars as name
        profileId: profileId,
        aiProfileId: "",
      });
      if(!newSession) throw new Error('Failed to start a new chat')
      // Navigate to the new chat session page
      router.push(`/chat/${newSession?.id}`);
    } catch (error) {
      console.error("Failed to start new chat:", error);
      alert("Sorry, couldn't start a new chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Shift + Enter or Cmd/Ctrl + Enter
    if ((event.shiftKey || event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault(); // Prevent default newline insertion
      if (!isLoading && inputValue.trim()) { // Only send if not loading and input is not empty
        sendHandler(); // Trigger the send action
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-normal">
          {getGreeting()}, {profile?.name}.
        </h1>
        <p className="mt-2 text-3xl text-muted-foreground">
          How can I help you today?
        </p>
      </div>

      {/* Input Area - Now in the center */}
      <div className="w-full max-w-3xl mb-8">
        <div className="relative">
          <Textarea
            placeholder="What do you want to know?"
            className="min-h-[120px] rounded-xl border-muted-foreground/10 p-4 pb-12 text-base shadow-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown handler
            disabled={isLoading} // Disable textarea while loading
          />

          {/* Footer with tools */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2  bg-background/80 border border-muted-foreground/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Upload image</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Attach file</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="flex items-center space-x-1 text-sm"
              >
                <span>Hỏi cho</span>
                <span>{profile?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={sendHandler} // Add onClick handler
                disabled={isLoading || !inputValue.trim()} // Add disabled state
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons - Now below the input */}
      {/* <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" className="rounded-full px-5 py-6 text-base">
          <Search className="mr-2 h-5 w-5" />
          Research
        </Button>
        <Button variant="outline" className="rounded-full px-5 py-6 text-base">
          <ImagePlus className="mr-2 h-5 w-5" />
          Create images
        </Button>
        <Button variant="outline" className="rounded-full px-5 py-6 text-base">
          <Sparkles className="mr-2 h-5 w-5" />
          How to
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button variant="outline" className="rounded-full px-5 py-6 text-base">
          <BarChart3 className="mr-2 h-5 w-5" />
          Analyze
        </Button>
        <Button variant="outline" className="rounded-full px-5 py-6 text-base">
          <Code2 className="mr-2 h-5 w-5" />
          Code
        </Button>
      </div> */}

      {/* Switch to Personas */}
      <Button variant="ghost" className="mt-16 text-base text-muted-foreground">
        Switch to Personas
      </Button>
    </div>
  );
}
