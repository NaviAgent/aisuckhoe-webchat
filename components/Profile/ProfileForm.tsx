import { Profile } from '@prisma/client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { relationships } from '@/lib/relationship';

export default function ProfileForm({ profile, open, onClose, onSuccess }: { profile: Profile | undefined, open: boolean, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState<Profile>(profile || {
    name: '',
    gender: '',
    age: 0,
    medicalHistory: '',
    relationship: ''
  } as Profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = profile ? 'PUT' : 'POST';
    const url = profile ? `/api/profiles/${profile.id}` : '/api/profiles';

    formData.age = Number(formData.age)
    formData.dob = new Date(new Date().setMonth(0, 1) - formData.age * 365 * 24 * 60 * 60 * 1000);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSuccess(); // Gọi hàm onSuccess khi thành công
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{profile ? 'Edit Profile' : 'Create New Profile'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter profile name"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">Avatar</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter avatar URL"
              />
            </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="col-span-3"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter age"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relationship" className="text-right">Relationship</Label>
              <Input
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter relationship status"
                list="relationship-options"
              />
              <datalist id="relationship-options">
                {Object.keys(relationships).map((key) => (
                  <option key={key} value={relationships[key as keyof typeof relationships]} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicalHistory" className="text-right">Medical History</Label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter medical history"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onClose()}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}