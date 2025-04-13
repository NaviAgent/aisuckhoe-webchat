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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { relationships } from '@/lib/relationship'; // Import relationships
import { JsonValue } from "@prisma/client/runtime/library"; // Import JsonValue if needed, or adjust Omit

// Define initial empty state based on Profile structure (excluding server-generated fields + ownerId, metadata, deletedAt)
const initialFormData: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'dob' | 'avatar' | 'ownerId' | 'metadata' | 'deletedAt'> = {
  name: '',
  gender: '',
  age: 0,
  relationship: '',
  medicalHistory: '',
};

interface ProfileCreateDialogProps {
  onSuccess: () => void; // Add onSuccess prop
}

const ProfileCreateDialog: React.FC<ProfileCreateDialogProps> = ({ onSuccess }) => {
  // State for form data
  const [formData, setFormData] = useState(initialFormData);
   // State to manage dialog open/close
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

   // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true); // Set loading true
    setError(null); // Clear previous errors

    const newProfileData = {
        ...formData,
        age: Number(formData.age) // Ensure age is a number
    };
    // dob is likely calculated server-side or not needed based on ProfileForm
    // avatar is likely handled separately or uses a default

    try {
        const res = await fetch(`/api/profiles`, { // POST to base profiles endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfileData),
        });

        if (res.ok) {
            onSuccess(); // Call success handler (e.g., refresh list)
            setOpen(false); // Close dialog on success
            setFormData(initialFormData); // Reset form
        } else {
            const errorData = await res.text();
            setError(`Failed to create profile: ${errorData || 'Unknown error'}`);
            console.error("Failed to create profile:", errorData);
        }
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
      setFormData(initialFormData);
      setError(null);
    }
    setOpen(isOpen);
  };

  // Determine fallback character outside JSX
  const fallbackChar = (typeof formData.name === 'string' && formData.name.length > 0)
    ? formData.name.charAt(0).toUpperCase() // Use charAt(0)
    : '?';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Keep Trigger as is */}
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm người thân
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm người thân</DialogTitle>
          <DialogDescription>
            Enter the details for the new profile. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Wrap in form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Avatar Section - Placeholder */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 rounded">
                <AvatarFallback className="rounded bg-gradient-to-br from-blue-400 to-purple-400">
                  {/* Use pre-calculated fallback character */}
                  {fallbackChar}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" type="button"> {/* Set type="button" */}
                Choose Avatar {/* TODO: Implement avatar selection */}
              </Button>
            </div>
            {/* Form Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-name" className="text-right"> {/* Use unique ID */}
                Name
              </Label>
              <Input
                id="create-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Profile Name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-age" className="text-right"> {/* Use unique ID */}
                Age
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
                placeholder="Age"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-gender" className="text-right"> {/* Use unique ID */}
                Gender
              </Label>
              {/* Use select for gender */}
              <select
                id="create-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-relationship" className="text-right"> {/* Use unique ID */}
                Relationship
              </Label>
              <Input
                id="create-relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g., Self, Son, Daughter"
                list="relationship-options-create" // Unique datalist ID
                required
              />
              <datalist id="relationship-options-create">
                {Object.keys(relationships).map((key) => (
                  <option key={key} value={relationships[key as keyof typeof relationships]} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-medicalHistory" className="text-right"> {/* Use unique ID */}
                Medical History
              </Label>
              {/* Use textarea */}
              <textarea
                id="create-medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory || ''}
                onChange={handleChange}
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling
                placeholder="Optional: Any relevant medical history"
              />
            </div>
          </div>
           {/* Display error message if any */}
          {error && <p className="text-sm text-red-500 px-1 py-2">{error}</p>}
          <DialogFooter>
             {/* Add Cancel button */}
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Profile'} {/* Show loading state */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCreateDialog;
