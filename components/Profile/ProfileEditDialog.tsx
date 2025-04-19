import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Profile } from "@prisma/client";
import { Settings } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { relationships } from "@/lib/constant"; // Import relationships
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ProfileEditDialogProps {
  profile: Profile | undefined;
  onSuccess: () => void; // Add onSuccess prop
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  profile,
  onSuccess,
}) => {
  // State for form data
  const [formData, setFormData] = useState<Profile | undefined>(profile);
  // State to manage dialog open/close
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Update formData when profile prop changes
  useEffect(() => {
    setFormData(profile);
    setError(null); // Reset error when profile changes
  }, [profile]);

  if (!formData) {
    return null; // Don't render if no profile data
  }

  // Handle input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : undefined
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true); // Set loading true
    setError(null); // Clear previous errors

    const updatedData = {
      ...formData,
      age: Number(formData.age), // Ensure age is a number
    };
    // Remove dob calculation as it's not in the original ProfileForm logic shown
    // delete updatedData.dob;

    try {
      const res = await fetch(`/api/profiles/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        onSuccess(); // Call success handler (e.g., refresh list)
        setOpen(false); // Close dialog on success
      } else {
        const errorData = await res.text();
        setError(`Failed to update profile: ${errorData}`);
        console.error("Failed to update profile:", errorData);
      }
    } catch (err) {
      console.error("Error submitting profile update:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading false
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false);
          setError(null);
          setFormData(profile);
        } else {
          setOpen(true);
        }
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Edit profile</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p> Edit profile </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Wrap content in a form */}
        <form onSubmit={handleSubmit}>
          {/* Keep Tabs structure */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4 pt-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 rounded">
                  <AvatarImage
                    src={`/placeholder.svg?height=96&width=96&text=${formData.name[0]}`}
                    alt={formData.name}
                    className={`rounded bg-gradient-to-br ${formData.avatar}`}
                  />
                  <AvatarFallback
                    className={`rounded bg-gradient-to-br from-green-400 to-teal-400`}
                  >
                    {formData.name[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button">
                  {" "}
                  {/* Set type="button" */}
                  Change Avatar {/* TODO: Implement avatar change logic */}
                </Button>
              </div>
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    name="name" // Add name attribute
                    value={formData.name} // Controlled component
                    onChange={handleChange} // Add onChange handler
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  {/* Use select for gender */}
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>{" "}
                    {/* Added Other option */}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age" // Add name attribute
                    type="number"
                    min="0"
                    max="120" // Reasonable max age
                    value={formData.age} // Controlled component
                    onChange={handleChange} // Add onChange handler
                    required
                  />
                </div>
                {/* Add Relationship field */}
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    value={formData.relationship || ""} // Handle potential null/undefined
                    onChange={handleChange}
                    placeholder={Object.values(relationships).join(",")}
                    list="relationship-options"
                    required // Make relationship required like in ProfileForm
                  />
                  <datalist id="relationship-options">
                    {Object.keys(relationships).map((key) => (
                      <option
                        key={key}
                        value={relationships[key as keyof typeof relationships]}
                      />
                    ))}
                  </datalist>
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory" 
                    value={formData.medicalHistory || ""} 
                    onChange={handleChange}
                    placeholder="Tell us about your medical history"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                  />
                </div> */}
              </div>
            </TabsContent>
          </Tabs>
          {/* Display error message if any */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            {/* Add Cancel button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}{" "}
              {/* Show loading state */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
