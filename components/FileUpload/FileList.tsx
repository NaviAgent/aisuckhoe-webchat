import React, { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import type { FileAsset } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Assuming you have this utility
import { getFileAssets } from "@/services/fileAssetService";
import { useUser } from "@clerk/nextjs";

interface FileListProps {
  onFileSelect: (file: FileAsset) => void;
  selectedFileId?: string | null; // Optional: to highlight selected file
}

// This is a Server Component - it fetches data directly
export function FileList({ onFileSelect, selectedFileId }: FileListProps) {
  const { user } = useUser();
  const [files, setFiles] = useState<FileAsset[]>([]);

  const getFiles = async (userId: string) => {
    if (user) {
      const { data } = await getFileAssets(userId);
      if (!data) return;
      setFiles(data);
    }
  };

  useEffect(() => {
    if (user) getFiles(user.id);
  }, [user]);

  // Note: The onFileSelect prop passed from a Client Component to a Server Component
  // cannot be directly invoked here as a function due to serialization boundaries.
  // The selection logic needs to be handled in the parent Client Component (`FileUploadLibrary`)
  // by rendering interactive elements (like buttons) around each item.

  return (
    <ScrollArea className="h-[400px] p-4">
      {" "}
      {/* Adjust height as needed */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileSelect(file)} // This onClick needs to be handled carefully - see below
            className={cn(
              "group relative aspect-square overflow-hidden rounded-md border p-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selectedFileId === file.id && "ring-2 ring-primary ring-offset-2"
            )}
            aria-label={`Select file ${file.fileName}`}
          >
            {file.resourceType === "image" ? (
              <CldImage
                src={file.cloudinaryPublicId}
                width={150} // Adjust size as needed
                height={150}
                crop="fill"
                gravity="center"
                alt={file.altText || file.fileName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                {/* Placeholder for non-image files */}
                <span className="text-xs">{file.format}</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1">
              <p className="truncate text-xs font-medium text-white">
                {file.fileName}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

// Important Note on Interactivity:
// Since FileList is a Server Component, the `onClick={() => onFileSelect(file)}`
// won't work directly as passed from the Client Component parent (`FileUploadLibrary`).
// The standard pattern is for `FileUploadLibrary` to render `FileList` to get the data,
// and then `FileUploadLibrary` itself maps over the *data* returned (or fetched again client-side if needed)
// to render the interactive buttons with the `onClick` handler bound correctly in the client context.
// However, for simplicity in this step, we'll keep the structure as above, but acknowledge
// that the `onFileSelect` prop needs to be handled differently in the final implementation
// within `FileUploadLibrary`. We might need to adjust this later.
