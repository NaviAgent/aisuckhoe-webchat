"use client";

import React from "react";
// import { CldImage } from "next-cloudinary"; // Removed CldImage
import { Button } from "@/components/ui/button";
import { X, File as FileIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilePreviewProps {
  file: File; // Only accept File objects
  onRemove?: () => void; // Callback to remove/cancel the upload
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  React.useEffect(() => {
    let objectUrl: string | null = null;
    if (isImage) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    // Cleanup function to revoke the object URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null); // Reset preview URL on cleanup
      }
    };
  }, [file, isImage]); // Re-run effect if file or isImage changes

  return (
    <div className="relative flex items-center space-x-3 rounded-md border p-3">
      {/* Thumbnail/Icon */}
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-full w-full object-cover"
            // No need for onLoad revoke here, useEffect handles cleanup
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* File Info */}
      {/* <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
      </div> */}

      {/* Remove Button */}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Example Skeleton for FilePreview
export const FilePreviewSkeleton = () => (
  <div className="flex items-center space-x-3 rounded-md border p-3">
    <Skeleton className="h-12 w-12 rounded-md" />
    <div className="flex-1 space-y-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-1 w-full" />
    </div>
  </div>
);
