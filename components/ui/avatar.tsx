import * as React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "icon";
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = "md", className, ...props }) => {
  const avatarSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    icon: "h-10 w-10",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt="Avatar"
          className="h-full w-full rounded-full object-cover"
        />
      ) : name ? (
        <span>{name.charAt(0).toUpperCase()}</span>
      ) : (
        <span>NA</span>
      )}
    </div>
  );
};

export { Avatar };
