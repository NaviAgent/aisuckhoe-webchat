import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists for merging classes
import { Loader2 } from 'lucide-react'; // Using lucide icon for spinner

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ className, size = 'md', ...props }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center', // Center the spinner
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary', // Use primary color and spin animation
          sizeClasses[size] // Apply size class
        )}
      />
    </div>
  );
};

export default Loading;
