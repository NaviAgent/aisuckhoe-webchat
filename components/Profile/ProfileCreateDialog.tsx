import React, { useState } from "react"; // Import useState
import { Profile } from "@prisma/client"; // Import Profile type
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { genders, relationships } from "@/lib/constant"; // Import relationships
import { useProfileListStore } from "@/store/useProfileListStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useI18n } from "@/app/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Select } from "../ui/select";

interface ProfileCreateDialogProps {
  userId: string;
  onSuccess: (newProfile: Profile) => void; // Add onSuccess prop
}

const ProfileCreateDialog: React.FC<ProfileCreateDialogProps> = ({
  userId,
  onSuccess,
}) => {
  const t = useI18n();
  const { createProfile } = useProfileListStore();
  const { setProfileId } = useProfileStore();
  // State for form data
  const [formData, setFormData] = useState<
    Omit<Profile, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >({
    name: "",
    avatar: null,
    relationship: "",
    ownerId: userId ?? "",
    age: 0,
    gender: "",
    medicalHistory: "",
    dob: new Date(),
    metadata: {},
  });

  // State to manage dialog open/close
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  // Handle input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true); // Set loading true
    setError(null); // Clear previous errors

    formData.age = Number(formData.age);
    formData.ownerId = userId || "";
    formData.dob = new Date(
      new Date().setMonth(0, 1) - formData.age * 365 * 24 * 60 * 60 * 1000
    );
    // avatar is likely handled separately or uses a default

    try {
      const newProfile = await createProfile({
        ...formData,
        metadata: {},
      });
      setProfileId(newProfile.id);
      onSuccess(newProfile);
    } catch (err) {
      console.error("Error submitting profile creation:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading false
    }
  };

  // Function to reset form and error when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      {/* Keep Trigger as is */}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("ProfileCreateDialog.title")}
                </Button>
              </DialogTrigger>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p> {t("ProfileCreateDialog.title")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ProfileCreateDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("ProfileCreateDialog.description")}
          </DialogDescription>
        </DialogHeader>
        {/* Avatar Section - Placeholder */}
        {/* <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 rounded">
            <AvatarImage src={formData.avatar || ""} alt={formData.name} />
            <AvatarFallback className="rounded bg-gradient-to-br from-blue-400 to-purple-400">
              {fallbackChar}
            </AvatarFallback>
          </Avatar>
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={handleUploadResult}
            options={{
              sources: ["local"],
              multiple: false,
              folder: `/${userId}`,
              maxFiles: 1,
              maxFileSize: 5000000,
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
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => open?.()}
                    >
                      {t("ProfileCreateDialog.chooseAvatar")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("ProfileCreateDialog.chooseAvatar")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CldUploadWidget>
        </div> */}
        {/* Wrap in form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Form Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-name" className="text-right">
                {t("ProfileCreateDialog.nameLabel")}
              </Label>
              <Input
                id="create-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder={t("ProfileCreateDialog.namePlaceholder")}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-age" className="text-right">
                {t("ProfileCreateDialog.ageLabel")}
              </Label>
              <Input
                id="create-age"
                name="age"
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="col-span-3"
                placeholder={t("ProfileCreateDialog.agePlaceholder")}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-gender" className="text-right">
                {t("ProfileCreateDialog.genderLabel")}
              </Label>
              {/* Use select for gender */}
              <Select
                name="gender"
                value={formData.gender}
                onValueChange={(value) =>
                  handleChange({ target: { name: "gender", value } })
                }
                required
              >
                <option value="">
                  {t("ProfileCreateDialog.genderPlaceholder")}
                </option>
                {Object.values(genders).map((key) => (
                  <option key={key} value={key}>
                    {t(`common.${key}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-relationship" className="text-right">
                {t("ProfileCreateDialog.relationshipLabel")}
              </Label>
              <Input
                id="create-relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="col-span-3"
                placeholder={Object.values(relationships).join(",")}
                list="relationship-options-create" // Unique datalist ID
                required
              />
              <datalist id="relationship-options-create">
                {Object.values(relationships).map((key) => (
                  <option key={key} value={t(`common.relationship.${key}`)} />
                ))}
              </datalist>
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-medicalHistory" className="text-right">
                Medical History
              </Label>
              <textarea
                id="create-medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory || ''}
                onChange={handleChange}
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                placeholder="Optional: Any relevant medical history"
              />
            </div> */}
          </div>
          {/* Display error message if any */}
          {error && <p className="text-sm text-red-500 px-1 py-2">{error}</p>}
          <DialogFooter>
            {/* Add Cancel button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("common.processing") : t("common.create")}
              {/* Show loading state */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCreateDialog;
