"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, ChevronDown } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useProfileStore } from "@/store/useProfileStore";
import { useProfileListStore } from "@/store/useProfileListStore";

export function HomeMain() {
  const { profileId } = useProfileStore();
  const { profiles } = useProfileListStore();
  const [inputValue, setInputValue] = useState("");

  const profile = profiles.find((p) => p.id === profileId);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <Textarea
            placeholder="What do you want to know?"
            className="h-32 max-w-screen-md rounded-xl border-muted-foreground/20 p-6 text-base shadow-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-end">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-3 flex items-end space-x-1">
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-sm"
            >
              <span>Hỏi cho</span>
              <span>{profile?.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Send className="h-5 w-5" />
            </Button>
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
