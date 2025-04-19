"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Send,
  ChevronDown,
  ImagePlus,
  Maximize2,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useProfileStore } from "@/store/useProfileStore";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useRouter } from "next/navigation";
import { useChatSessionListStore } from "@/store/useChatSessionListStore";
import ChatProfileSwitcher from "../Chat/ChatProfileSwitcher";
import useDraftMessage from "@/store/useDraftMessage";
import LogoAura from "../Logo/LogoAura";
import { TextareaEditor } from "../ui/textarea-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import { useI18n } from "@/app/[locale]/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
// import { ImageUploadMenu } from "../FileUpload/ImageUploadMenu";
// import { FileAsset } from "@prisma/client";
// import { deleteFileAsset } from "@/services/fileAssetService";
import { FilePreview } from "../FileUpload/FilePreview";
import { convertArrayToObject } from "@/lib/convertArrayToObject";
import { FileChoose } from "../FileUpload/FileChoose";

interface HomeMainProps {
  userId: string;
}

export function HomeMain({ userId }: HomeMainProps) {
  const t = useI18n();
  const router = useRouter(); // Initialize router
  const { profileId } = useProfileStore();
  const { profiles } = useProfileListStore();
  const { createChatSession } = useChatSessionListStore();
  const { setMessage, setImages } = useDraftMessage();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [triggerWave, setTriggerWave] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // State for selected files

  const profile = profiles.find((p) => p.id === profileId);

  // Handler to add a file (from upload or library selection)
  // const handleAddFile = (file: FileAsset) => {
  //   // Avoid adding duplicates
  //   setFiles((prevFiles) => {
  //     if (prevFiles.find((f) => f.id === file.id)) {
  //       return prevFiles;
  //     }
  //     return [...prevFiles, file];
  //   });
  // };

  const handleChoose = (files: File[]) => {
    // Avoid adding duplicates
    setFiles((prevFiles) => {
      const preFileMap = convertArrayToObject(prevFiles);
      const newFiles = files.filter((f) => !preFileMap[f.name]);
      if (newFiles.length > 0) {
        return [...prevFiles, ...newFiles];
      } else {
        return prevFiles;
      }
    });
  };

  // Handler to remove a file
  const handleRemoveFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
    // deleteFileAsset(file.id, userId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("HomeMain.greeting.morning");
    if (hour < 18) return t("HomeMain.greeting.afternoon");
    return t("HomeMain.greeting.evening");
  };

  const toggleWave = () => {
    setTriggerWave(!triggerWave);
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
      if (!newSession) throw new Error("Failed to start a new chat");
      // Navigate to the new chat session page
      setMessage(inputValue);
      setImages(files);
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
    if (
      (event.shiftKey || event.metaKey || event.ctrlKey) &&
      event.key === "Enter"
    ) {
      event.preventDefault(); // Prevent default newline insertion
      toggleWave();
      if (!isLoading && inputValue.trim()) {
        // Only send if not loading and input is not empty
        sendHandler(); // Trigger the send action
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <LogoAura trigger={triggerWave} />

      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-normal">
          {getGreeting()}, {profile?.name}.
        </h1>
        <p className="mt-2 text-3xl text-muted-foreground">
          {t("HomeMain.prompt")}
        </p>
      </div>

      {/* Input Area - Now in the center */}
      <div className="w-full max-w-2xl mb-8">
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 rounded-md border p-2">
            {files.map((file) => (
              <FilePreview
                key={file.name}
                file={file}
                onRemove={() => handleRemoveFile(file)}
              />
            ))}
          </div>
        )}

        <TextareaEditor>
          <TextareaEditor.Content
            className="border-none focus-visible:ring-0 resize-none bg-transparent"
            placeholder={t("HomeMain.inputPlaceholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Footer with tools */}
          <TextareaEditor.Footer>
            <div className="flex items-center space-x-2">
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">
                        {t("HomeMain.uploadImageAlt")}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("HomeMain.uploadImageAlt")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}

              {/* <FileChoose
                onChoose={handleChoose}
                multiple={true}
                maxFiles={5}
                maxFileSize={5000000} // 5MB
                allowFormat={["png", "jpeg", "jpg", "gif", "webp"]}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">
                    {t("chatStarter.uploadImageAlt")}
                  </span>
                </Button>
              </FileChoose> */}

              {/* <ImageUploadMenu
                ownerId={userId!}
                folder={`/${userId}`}
                onUploadSuccess={handleAddFile}
                onFileSelect={handleAddFile}
              /> */}

              <Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("HomeMain.fullscreenButtonAlt")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DialogContent className="max-w-3xl">
                  <VisuallyHidden>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </VisuallyHidden>
                  <Textarea
                    rows={30}
                    placeholder={t("HomeMain.inputPlaceholder")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="resize-none"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center space-x-2">
              <ChatProfileSwitcher></ChatProfileSwitcher>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={sendHandler} // Add onClick handler
                      disabled={isLoading || !inputValue.trim()} // Add disabled state
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">
                        {t("HomeMain.sendMessageAlt")}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("HomeMain.sendMessageAlt")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TextareaEditor.Footer>
        </TextareaEditor>
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
      {/* <Button variant="ghost" className="mt-16 text-base text-muted-foreground">
        Switch to Personas
      </Button> */}
    </div>
  );
}
