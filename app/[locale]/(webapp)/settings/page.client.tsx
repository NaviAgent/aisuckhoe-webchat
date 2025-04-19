"use client";

import React, { useState } from "react"; // Import useState
import CommonFooter from "@/components/Common/CommonFooter"; // Import CommonFooter
import { PremiumSheet } from "@/components/Premium/PremiumSheet"; // Import PremiumSheet
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  User,
  Camera,
  Bookmark,
  Phone,
  Laptop,
  LogOut,
  Star,
} from "lucide-react";

// Placeholder data - replace with actual user data fetching
const userData = {
  name: "Nhuần Nguyễn",
  phone: "+84 348375392",
  username: "@nhuannguyeenx",
  avatarUrl: "https://via.placeholder.com/100", // Placeholder image
  currentAccount: {
    name: "Ivan Nguyeenx",
    avatarUrl: "https://via.placeholder.com/40", // Placeholder image
  },
  deviceCount: 2,
};

export default function SettingsPageClient() {
  const [isPremiumSheetOpen, setIsPremiumSheetOpen] = useState(false); // State for sheet

  return (
    // Adjust layout: Use min-h-screen and flex-col to push footer down
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {" "}
        {/* Added flex-1 and padding */}
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="sm" className="[&_svg]:size-6">
            {/* Sort */}
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        {/* Profile Info Section */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <p className="text-sm text-muted-foreground">
            {userData.phone} • {userData.username}
          </p>
        </div>
        {/* Change Photo Button */}
        <Button
          variant="outline"
          className="w-full mb-6 flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Change Profile Photo
        </Button>
        {/* Account Section */}
        {/* <Card className="mb-6 p-0">
        <div className="flex items-center p-3 gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={userData.currentAccount.avatarUrl}
              alt={userData.currentAccount.name}
            />
            <AvatarFallback>
              {userData.currentAccount.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="flex-grow font-medium">
            {userData.currentAccount.name}
          </span>
        </div>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start p-3 text-blue-500 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </Button>
      </Card> */}
        {/* Options List 1 */}
        <Card className="mb-6 p-0">
          <SettingsItem icon={User} label="My Profile" href="/user-profile" />
        </Card>
        {/* Premium Card */}
        <Card className="mb-6 p-0">
          <SettingsItem
            icon={Star} // Use Star icon
            label="Gói Premium"
            onClick={() => setIsPremiumSheetOpen(true)} // Open sheet on click
          />
        </Card>
        {/* Options List 2 */}
        <Card className="mb-6 p-0">
          <SettingsItem icon={Bookmark} label="Saved Messages" />
          <Separator className="my-0" />
          <SettingsItem icon={Phone} label="Recent Calls" />
          <Separator className="my-0" />
          <SettingsItem
            icon={Laptop}
            label="Devices"
            value={userData.deviceCount.toString()}
          />
        </Card>
        {/* Logout Button - Added as a common settings action */}
        <Card className="mb-6 p-0">
          <Button
            variant="ghost"
            className="w-full justify-start p-3 text-red-500 flex items-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </Card>
      </div>{" "}
      {/* End Main Content Area */}
      {/* Common Footer */}
      <CommonFooter />
      {/* Premium Sheet Component */}
      <PremiumSheet
        open={isPremiumSheetOpen}
        onOpenChange={setIsPremiumSheetOpen}
      />
    </div>
  );
}

// Helper component for list items
interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void; // Add onClick prop
}

function SettingsItem({
  icon: Icon,
  label,
  value,
  href,
  onClick, // Destructure onClick
}: SettingsItemProps) {
  const content = (
    <div className="flex items-center p-3 gap-3 w-full">
      <Icon className="w-5 h-5 text-blue-500" /> {/* Example color */}
      <span className="flex-grow font-medium">{label}</span>
      {value && <span className="text-muted-foreground mr-2">{value}</span>}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </div>
  );

  // Use the provided onClick handler if available, otherwise handle href
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href; // Simple navigation for now
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full h-auto p-0 justify-start"
      onClick={handleClick}
    >
      {content}
    </Button>
  );
}
