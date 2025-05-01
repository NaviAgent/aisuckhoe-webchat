"use client"; // Add this directive

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Profile } from "@prisma/client";
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
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders, relationships } from "@/lib/constant";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useI18n } from "@/app/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Define Zod schema for validation
const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.coerce // Use coerce to convert string input to number
    .number()
    .int()
    .min(0, { message: "Age must be 0 or greater" })
    .max(120, { message: "Age must be 120 or less" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  // medicalHistory: z.string().optional(), // Keep commented if not used
  // avatar: z.string().optional(), // Keep commented if not used
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileCreateDialogProps {
  userId: string;
  onSuccess: (newProfile: Profile) => void;
  fullscreen?: boolean; // Add optional fullscreen prop
}

const ProfileCreateDialog: React.FC<ProfileCreateDialogProps> = ({
  userId,
  onSuccess,
  fullscreen = false, // Default fullscreen to false
}) => {
  const t = useI18n();
  const { createProfile } = useProfileListStore();
  const { setProfileId } = useProfileStore();
  const [open, setOpen] = useState(false);

  // Initialize react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      relationship: "",
      // medicalHistory: "",
      // avatar: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch, // Add watch
    setValue, // Add setValue
    formState: { isSubmitting, errors },
  } = form;

  // Watch the gender field
  const selectedGender = watch("gender");

  // Define gender-specific relationship keys
  const maleRelationships = useMemo(
    () => [
      "father",
      "brother",
      "son",
      "paternal_grandfather",
      "maternal_grandfather",
      "paternal_uncle",
      "maternal_uncle",
      "male_cousin",
      "great_grandfather",
      "father_in_law_husband",
      "father_in_law_wife",
      "brother_in_law_sister_husband",
      "son_in_law",
      "stepfather",
      "half_brother",
    ],
    []
  );

  const femaleRelationships = useMemo(
    () => [
      "mother",
      "sister",
      "daughter",
      "paternal_grandmother",
      "maternal_grandmother",
      "paternal_aunt",
      "maternal_aunt",
      "female_cousin",
      "great_grandmother",
      "mother_in_law_husband",
      "mother_in_law_wife",
      "sister_in_law_brother_wife",
      "daughter_in_law",
      "stepmother",
      "half_sister",
    ],
    []
  );

  // Determine filtered relationships based on selected gender
  const filteredRelationships = useMemo(() => {
    if (selectedGender === genders.male) {
      return maleRelationships;
    }
    if (selectedGender === genders.female) {
      return femaleRelationships;
    }
    return []; // Return empty if no gender selected or other value
  }, [selectedGender, maleRelationships, femaleRelationships]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    const dob = new Date(
      new Date().setMonth(0, 1) - data.age * 365 * 24 * 60 * 60 * 1000
    );

    try {
      const newProfile = await createProfile({
        name: data.name,
        age: data.age,
        gender: data.gender,
        relationship: data.relationship,
        ownerId: userId,
        dob: dob,
        avatar: null, // Handle avatar separately if needed
        medicalHistory: "", // Handle medical history separately if needed
        metadata: {},
      });
      setProfileId(newProfile.id);
      onSuccess(newProfile);
      setOpen(false); // Close dialog on success
    } catch (err) {
      console.error("Error submitting profile creation:", err);
      // Display error using FormMessage or a dedicated error state if needed
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Function to reset form when dialog closes or opens
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset(); // Reset form fields and errors
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("ProfileCreateDialog.title")}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p> {t("ProfileCreateDialog.title")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className={
          fullscreen
            ? "h-full w-full max-w-full flex flex-col" // Fullscreen styles
            : "sm:max-w-[425px] flex flex-col" // Default styles
        }
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ProfileCreateDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("ProfileCreateDialog.description")}
          </DialogDescription>
        </DialogHeader>

        {/* Avatar Section - Placeholder (Keep commented) */}
        {/* ... */}

        {/* Use Form component */}
        {/* Wrap form in a scrollable container */}
        <ScrollArea className="flex-grow">
          <Form {...form}>
            {/* Added id to form */}
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4"> {/* Added padding */}
              <FormField
                control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">
                    {t("ProfileCreateDialog.nameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3"
                      placeholder={t("ProfileCreateDialog.namePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="age"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">
                    {t("ProfileCreateDialog.ageLabel")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert value to number
                      defaultValue={String(field.value)} // Convert defaultValue to string
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue
                          placeholder={t("ProfileCreateDialog.agePlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 101 }, (_, i) => ( // Generate numbers 0-100
                          <SelectItem key={i} value={String(i)}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">
                    {t("ProfileCreateDialog.genderLabel")}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("relationship", ""); // Reset relationship on gender change
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue
                          placeholder={t(
                            "ProfileCreateDialog.genderPlaceholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(genders).map((key) => (
                        <SelectItem key={key} value={key}>
                          {t(`common.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="relationship"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">
                    {t("ProfileCreateDialog.relationshipLabel")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedGender} // Disable if no gender selected
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue
                          placeholder={
                            !selectedGender
                              ? t(
                                  "ProfileCreateDialog.selectGenderFirstPlaceholder"
                                ) // New placeholder
                              : t(
                                  "ProfileCreateDialog.relationshipPlaceholder"
                                ) // Original placeholder
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Map over filtered relationships */}
                      {filteredRelationships.map((key) => (
                        <SelectItem key={key} value={key}>
                          {/* Ensure the key exists in the original relationships object for safety */}
                          {relationships[key as keyof typeof relationships]
                            ? t(
                                `common.relationship.${
                                  relationships[key as keyof typeof relationships]
                                }`
                              )
                            : key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            {/* Medical History - Keep commented if not used */}
            {/* <FormField ... /> */}

            {/* Display root error message if any */}
            {errors.root && (
              <p className="text-sm text-red-500 px-1 py-2">
                {errors.root.message}
              </p>
            )}

            {/* Removed DialogFooter from here */}
          </form>
        </Form>
      </ScrollArea>
      {/* Moved DialogFooter outside ScrollArea */}
      <DialogFooter className="mt-auto p-4 border-t"> {/* Added padding and border */}
        <Button
          type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
        >
          {t("common.cancel")}
        </Button>
        {/* Link button to form using form attribute */}
        <Button type="submit" disabled={isSubmitting} form="profile-form">
          {isSubmitting ? t("common.processing") : t("common.create")}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  );
};

export default ProfileCreateDialog;
