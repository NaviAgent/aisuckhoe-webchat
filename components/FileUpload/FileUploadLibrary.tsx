import React, { useState, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary"; // Using UploadButton for simplicity
import { FileList } from "./FileList"; // Import the Server Component
import type { FileAsset } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton"; // For Suspense fallback
import { createFileAsset } from "@/services/fileAssetService";

interface FileUploadLibraryProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFileSelect: (file: FileAsset) => void; // Callback when a file is selected
  folder?: string; // Optional folder to upload to
  ownerId: string; // Optional owner ID for the file
}

export function FileUploadLibrary({
  isOpen,
  onOpenChange,
  onFileSelect,
  ownerId,
  folder,
}: FileUploadLibraryProps) {
  const [selectedFile, setSelectedFile] = useState<FileAsset | null>(null);
  const [activeTab, setActiveTab] = useState("all"); // Default to 'all' tab

  const handleUploadResult = async (result: CloudinaryUploadWidgetResults) => {
    const uploadedResult = result.info;
    if (
      result.event === "success" &&
      uploadedResult &&
      typeof uploadedResult !== "string"
    ) {
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
        altText: "",
        caption: "",
      });
      if (saveResult.success && saveResult.data) {
        console.log("FileAsset created via library:", saveResult.data);
        // Optionally switch to 'all' tab and select the new file?
        // Or just close the dialog? For now, just log.
        // Maybe call onFileSelect directly?
        onFileSelect(saveResult.data); // Select the newly uploaded file
      } else {
        console.error("Failed to save FileAsset:", saveResult.error);
        // Handle error
      }
    }
  };

  // This function will be passed to FileList, but needs careful handling
  // due to Server/Client component boundaries.
  // The actual click handler should be attached in this component.
  const handleFileSelectionFromList = (file: FileAsset) => {
    setSelectedFile(file);
    // Keep the dialog open for confirmation or further action
  };

  const handleConfirmSelection = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      // onOpenChange(false); // Close dialog after selection confirmed
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {/* Adjust size as needed */}
        <DialogHeader>
          <DialogTitle>File Library</DialogTitle>
          <DialogDescription>
            Select an existing file or upload a new one.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="computer">Upload from Computer</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 min-h-[450px]">
            {/*
              Rendering the Server Component FileList directly.
              The interactivity (selecting a file) needs refinement.
              We pass handleFileSelectionFromList, but the actual onClick
              should ideally be managed here by mapping over fetched data client-side
              or using a more advanced pattern if direct RSC interaction is needed.
            */}
            <Suspense fallback={<FileListSkeleton />}>
              <FileList
                onFileSelect={handleFileSelectionFromList}
                selectedFileId={selectedFile?.id}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="computer" className="mt-4 min-h-[450px]">
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
              <p className="mb-4 text-muted-foreground">
                Click the button to upload files from your computer.
              </p>
              <CldUploadButton
                signatureEndpoint="/api/sign-cloudinary-params" // Ensure this endpoint exists
                onSuccess={handleUploadResult}
                options={{
                  sources: ["local"],
                  multiple: true,
                  folder: `/${ownerId}`,
                  maxFiles: 5,
                  maxFileSize: 5000000, // 5MB
                }}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} // Make sure preset is configured
              >
                <Button>Upload Files</Button>
              </CldUploadButton>
              {/* TODO: Add FilePreview components here for ongoing uploads */}
              <p className="mt-4 text-xs text-muted-foreground">
                You can upload images, videos, or other file types.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedFile || activeTab !== "all"} // Only enable if a file is selected in the 'all' tab
          >
            Select File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton loader for the FileList
const FileListSkeleton = () => (
  <div className="grid grid-cols-3 gap-4 p-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
    {[...Array(12)].map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-md" />
    ))}
  </div>
);
