"use client";

import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { createFileAsset } from "@/services/fileAssetService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useI18n } from "@/app/[locale]/i18n";
import { FileAsset } from "@prisma/client";

// Define the props for FileUploadMenu
interface FileUploadMenuProps {
  onUploadSuccess?: (result: FileAsset) => void; // Callback after successful upload and DB save
  onFileSelect?: (file: FileAsset) => void; // Callback when a file is selected from the library
  folder?: string; // Optional folder to upload to
  ownerId: string; // Optional owner ID for the file
}

export function ImageUploadMenu({
  onUploadSuccess,
  ownerId,
}: FileUploadMenuProps) {
  const t = useI18n();
  // const [isLibraryOpen, setIsLibraryOpen] = useState(false);

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
        onUploadSuccess?.(saveResult.data); // Pass the DB record back
        // Optionally close library or menu if open
      } else {
        console.error(
          "[ImageUploadMenu] Failed to save FileAsset:",
          saveResult.error
        );
        // Handle error (e.g., show a notification)
      }
    }
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
          clientAllowedFormats: ["png", "jpeg", "jpg", "gif", "webp"],
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
      >
        {({ open }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => open?.()}
                >
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">
                    {t("FileUploadMenu.uploadImageAlt")}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("FileUploadMenu.uploadImageAlt")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CldUploadWidget>
    </>
  );
}
