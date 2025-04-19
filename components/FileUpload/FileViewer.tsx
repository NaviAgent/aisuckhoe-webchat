"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CldImage } from "next-cloudinary";
import type { FileAsset } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs"; // Import dayjs
import { Trash2, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  deleteFileAsset,
  getFileAssetById,
  updateFileAssetMetadata,
} from "@/services/fileAssetService";
import { useUser } from "@clerk/nextjs";

interface FileViewerProps {
  fileId: string | null; // ID of the file to view
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeleted?: (fileId: string) => void; // Callback after successful deletion
  onUpdated?: (file: FileAsset) => void; // Callback after successful update
}

// Helper to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function FileViewer({
  fileId,
  isOpen,
  onOpenChange,
  onDeleted,
  onUpdated,
}: FileViewerProps) {
  const { user } = useUser();
  const [file, setFile] = useState<FileAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPendingUpdate, startUpdateTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (isOpen && fileId) {
      setIsLoading(true);
      setFile(null); // Reset previous file data
      setIsEditing(false); // Reset editing state
      getFileAssetById(fileId, user!.id)
        .then(({ data }) => {
          setFile(data || null);
          // Initialize edit fields if data is loaded
          if (data) {
            setAltText(data.altText || "");
            setCaption(data.caption || "");
            setTags(data.tags || []);
          }
        })
        .catch((error) => {
          console.error("Error fetching file details:", error);
          // Handle error (e.g., show notification)
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, fileId]);

  const handleSaveChanges = () => {
    if (!file) return;
    startUpdateTransition(async () => {
      const result = await updateFileAssetMetadata(file.id, user!.id, {
        altText,
        caption,
        tags,
      });
      if (result.success && result.data) {
        setFile(result.data); // Update local state with new data
        onUpdated?.(result.data);
        setIsEditing(false); // Exit editing mode
        // Show success notification
      } else {
        console.error("Failed to update metadata:", result.error);
        // Show error notification
      }
    });
  };

  const handleDeleteFile = () => {
    if (!file) return;
    if (
      window.confirm(
        `Are you sure you want to delete "${file.fileName}"? This action cannot be undone.`
      )
    ) {
      startDeleteTransition(async () => {
        const result = await deleteFileAsset(file.id, user!.id);
        if (result.success) {
          onDeleted?.(file.id);
          onOpenChange(false); // Close dialog after deletion
          // Show success notification
        } else {
          console.error("Failed to delete file:", result.error);
          // Show error notification
        }
      });
    }
  };

  const renderMetadataField = (label: string, value: React.ReactNode) => (
    <div className="mb-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="text-sm">{value || "-"}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:grid sm:grid-cols-3 sm:gap-6">
        {/* Adjust layout */}
        {/* File Preview Section */}
        <div className="sm:col-span-2">
          <DialogHeader className="sm:hidden">
            {/* Show header on small screens */}
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border bg-muted sm:mt-0">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : file ? (
              file.resourceType === "image" ? (
                <CldImage
                  src={file.cloudinaryPublicId}
                  width={800} // Adjust size
                  height={600}
                  alt={file.altText || file.fileName}
                  className="h-full w-full object-contain" // Use contain to see full image
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <span>Preview not available for {file.format}</span>
                </div>
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span>File not found or error loading.</span>
              </div>
            )}
          </div>
        </div>
        {/* Metadata Sidebar Section */}
        <div className="mt-6 sm:col-span-1 sm:mt-0">
          <DialogHeader className="hidden sm:block">
            {/* Hide header on small screens */}
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : file ? (
              <>
                {renderMetadataField("File Name", file.fileName)}
                {renderMetadataField(
                  "Type",
                  `${file.resourceType}/${file.format}`
                )}
                {renderMetadataField("Size", formatBytes(file.sizeBytes))}
                {file.width &&
                  file.height &&
                  renderMetadataField(
                    "Dimensions",
                    `${file.width} x ${file.height}`
                  )}
                {renderMetadataField(
                  "Uploaded",
                  dayjs(file.createdAt).format("YYYY-MM-DD HH:mm:ss")
                )}{" "}
                {/* Use dayjs */}
                <hr />
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="altText">Alt Text</Label>
                      <Input
                        id="altText"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                      />
                    </div>
                    {/* Basic Tag input - could be improved with a dedicated tag component */}
                    <div className="space-y-1">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tags.join(", ")}
                        onChange={(e) =>
                          setTags(
                            e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean)
                          )
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {renderMetadataField("Alt Text", file.altText)}
                    {renderMetadataField("Caption", file.caption)}
                    {renderMetadataField(
                      "Tags",
                      file.tags.length > 0
                        ? file.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="mr-1 mb-1"
                            >
                              {tag}
                            </Badge>
                          ))
                        : "-"
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No details available.
              </p>
            )}
          </div>

          <DialogFooter className="mt-6 flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteFile}
              disabled={!file || isPendingDelete || isPendingUpdate}
            >
              {isPendingDelete ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isPendingUpdate}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveChanges}
                    disabled={!file || isPendingUpdate}
                  >
                    {isPendingUpdate ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={!file || isPendingDelete}
                >
                  Edit Metadata
                </Button>
              )}
            </div>
          </DialogFooter>
          {/* Add a manual close button as DialogFooter might not always contain one */}
          <DialogClose asChild className="sm:hidden mt-4">
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
