'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSidebarStore } from '@/stores';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function TopBar({ title, subtitle, children }: TopBarProps) {
  const { toggleOpen } = useSidebarStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={toggleOpen}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Page Title */}
        {(title || subtitle) && (
          <div>
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Center Section - Custom Content */}
      <div className="flex-1 flex justify-center px-4">
        {children}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Search className="w-4 h-4" />
        </Button>
        
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-0 h-5"
          >
            3
          </Badge>
        </div>
        
        {/* User Avatar */}
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-green-100 text-green-600 text-sm font-medium">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}