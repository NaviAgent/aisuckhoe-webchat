"use client";

import React, { useRef, useCallback, ChangeEvent, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming a Button component exists
import { cn } from "@/lib/utils"; // Assuming a utility for class names exists

interface FileChooseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback function triggered when files are chosen and validated.
   * @param files - An array of valid File objects.
   */
  onChoose: (files: File[]) => void;
  /**
   * Array of allowed file extensions (e.g., ['.jpg', '.png', '.pdf']). Case-insensitive.
   * If undefined, all file types are allowed.
   */
  allowFormat?: string[];
  /**
   * Maximum file size in bytes.
   * If undefined, no size limit is enforced.
   */
  maxFileSize?: number;
  /**
   * Maximum number of files allowed to be selected.
   * If undefined, no limit on the number of files.
   */
  maxFiles?: number;
  /**
   * Allow multiple file selection. Defaults to false.
   */
  multiple?: boolean;
  /**
   * The trigger element for the file input. If not provided, a default button is rendered.
   */
  children?: ReactNode;
  /**
   * Disable the file input and trigger.
   */
  disabled?: boolean;
}

const FileChoose = React.forwardRef<HTMLDivElement, FileChooseProps>(
  (
    {
      onChoose,
      allowFormat,
      maxFileSize,
      maxFiles,
      multiple = false,
      children,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList) return;

        const chosenFiles = Array.from(fileList);
        let validFiles: File[] = [];
        const errors: string[] = [];

        // Limit number of files early if maxFiles is set
        if (maxFiles !== undefined && chosenFiles.length > maxFiles) {
          errors.push(`Error: Cannot select more than ${maxFiles} file(s).`);
          // Optionally, slice the array to the max number allowed
          // chosenFiles = chosenFiles.slice(0, maxFiles);
          // For now, we just reject the whole batch if too many are selected initially
          console.warn(
            `Error: Cannot select more than ${maxFiles} file(s). Selected ${chosenFiles.length}.`
          );
          // Reset input value
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          // Potentially notify the user here
          return; // Stop processing
        }

        chosenFiles.forEach((file) => {
          let fileIsValid = true;
          // Validate format
          const fileExtension = file.type.split("/").pop();
          if (allowFormat && allowFormat.length > 0) {
            const lowerCaseAllowFormat = allowFormat.map((ext) =>
              ext.toLowerCase()
            );
            if (!lowerCaseAllowFormat.includes(fileExtension || "")) {
              errors.push(
                `Error: File "${file.name}" has an invalid format (${fileExtension}). Allowed formats: ${allowFormat.join(", ")}`
              );
              fileIsValid = false;
            }
          }

          // Validate size
          if (maxFileSize !== undefined && file.size > maxFileSize) {
            const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
            errors.push(
              `Error: File "${file.name}" exceeds the maximum size limit of ${maxSizeMB} MB.`
            );
            fileIsValid = false;
          }

          if (fileIsValid) {
            validFiles.push(file);
          }
        });

        // Check maxFiles again after validation (in case some were filtered out)
        // This logic might be redundant if we reject upfront, but kept for clarity
        if (maxFiles !== undefined && validFiles.length > maxFiles) {
          errors.push(
            `Error: Cannot select more than ${maxFiles} valid file(s).`
          );
          console.warn(
            `Error: Cannot select more than ${maxFiles} valid file(s). Valid files found: ${validFiles.length}.`
          );
          validFiles = validFiles.slice(0, maxFiles); // Keep only the allowed number
        }

        if (errors.length > 0) {
          // Handle errors (e.g., display notifications to the user)
          console.warn("File selection errors:", errors);
          // Depending on requirements, you might still call onChoose with validFiles
          // or prevent calling it if any error occurred.
          // For now, we proceed with the valid files found.
        }

        if (validFiles.length > 0) {
          onChoose(validFiles);
        }

        // Reset input value to allow selecting the same file again
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
      [onChoose, allowFormat, maxFileSize, maxFiles]
    );

    const triggerClick = useCallback(() => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    }, [disabled]);

    // Determine accepted formats for the input element
    const acceptAttr = allowFormat ? allowFormat.join(",") : undefined;

    // Use Slot to wrap the child element or render a default button
    const Trigger = children ? Slot : Button;

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        <Trigger
          onClick={triggerClick}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {children ? (
            children // Render provided children
          ) : (
            // Default Button Content
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Choose File{multiple ? "s" : ""}
            </>
          )}
        </Trigger>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={acceptAttr}
          disabled={disabled}
          style={{ display: "none" }} // Keep input hidden
          aria-hidden="true"
        />
      </div>
    );
  }
);

FileChoose.displayName = "FileChoose";

export { FileChoose };
