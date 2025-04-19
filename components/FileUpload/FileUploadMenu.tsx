"use client";

import React, { useState } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadCloud, Library, Paperclip } from "lucide-react";
import { FileUploadLibrary } from "./FileUploadLibrary"; // Will be created later
import { createFileAsset } from "@/services/fileAssetService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18n } from "@/app/[locale]/i18n";

// Define the props for FileUploadMenu
interface FileUploadMenuProps {
  onUploadSuccess?: (result: any) => void; // Callback after successful upload and DB save
  onFileSelect?: (file: any) => void; // Callback when a file is selected from the library
  folder?: string; // Optional folder to upload to
  ownerId: string; // Optional owner ID for the file
}

export function FileUploadMenu({
  onUploadSuccess,
  onFileSelect,
  folder,
  ownerId,
}: FileUploadMenuProps) {
  const t = useI18n();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const handleUploadResult = async (result: CloudinaryUploadWidgetResults) => {
    const uploadedResult = result.info;
    if (
      result.event === "success" &&
      uploadedResult &&
      typeof uploadedResult !== "string"
    ) {
      // Call the server action to save to DB
      const saveResult = await createFileAsset({
        cloudinaryPublicId: uploadedResult.public_id,
        fileName: uploadedResult.original_filename || uploadedResult.public_id, // Use original name or public_id
        format: uploadedResult.format,
        resourceType: uploadedResult.resource_type,
        sizeBytes: uploadedResult.bytes,
        width: uploadedResult.width,
        height: uploadedResult.height,
        url: uploadedResult.url,
        secureUrl: uploadedResult.secure_url,
        tags: uploadedResult.tags || [],
        ownerId,
        // Initialize optional fields if needed
        // folder: folder || "",
        altText: "",
        caption: "",
      });
      if (saveResult.success && saveResult.data) {
        console.log("FileAsset created:", saveResult.data);
        onUploadSuccess?.(saveResult.data); // Pass the DB record back
        // Optionally close library or menu if open
      } else {
        console.error("Failed to save FileAsset:", saveResult.error);
        // Handle error (e.g., show a notification)
      }
    }
  };

  const handleLibrarySelect = (file: any) => {
    onFileSelect?.(file);
    setIsLibraryOpen(false); // Close library after selection
  };

  return (
    <>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={handleUploadResult}
        options={{
          sources: ["local"],
          multiple: true,
          folder: `/${ownerId}`,
          maxFiles: 5,
          maxFileSize: 5000000, // 5MB
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
      >
        {({ open }) => (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">
                        {t("FileUploadMenu.attachFileAlt")}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("FileUploadMenu.attachFileAlt")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => open?.()}>
                <UploadCloud className="mr-2 h-4 w-4" />
                <span>Upload from Computer</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsLibraryOpen(true)}>
                <Library className="mr-2 h-4 w-4" />
                <span>Select from Library</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CldUploadWidget>

      {/* File Upload Library Dialog */}
      <FileUploadLibrary
        isOpen={isLibraryOpen}
        folder={folder}
        ownerId={ownerId}
        onOpenChange={setIsLibraryOpen}
        onFileSelect={handleLibrarySelect}
      />
    </>
  );
}
