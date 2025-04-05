'use client'

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, Users } from 'lucide-react'; // Import Users icon
import { cn } from '@/lib/utils';

export default function CommonFooter() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/profiles', label: 'Contacts', icon: Users }, // Added Contacts item
    { href: '/chats', label: 'Chats', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <footer className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <nav className="flex items-center justify-around h-14">
        {menuItems.map((item) => {
          // Updated isActive check to handle potential sub-routes like /profiles/new
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link href={item.href} key={item.href} legacyBehavior>
              <Button
                variant="ghost"
                className={cn(
                  'flex flex-col items-center justify-center h-full px-4 rounded-none [&_svg]:size-6',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5 mb-0.5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
