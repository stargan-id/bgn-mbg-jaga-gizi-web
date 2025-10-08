'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Menu, User, Settings, LogOut, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-0 h-5"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">Peringatan Stok Rendah</span>
                <span className="text-xs text-gray-500">2 menit lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Stok bahan makanan di SPPG Jakarta Utara menipis
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">Laporan Harian</span>
                <span className="text-xs text-gray-500">1 jam lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Laporan harian dari 15 SPPG telah diterima
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-3">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">System Update</span>
                <span className="text-xs text-gray-500">3 jam lalu</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Sistem telah diperbarui ke versi 2.1.0
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center p-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">
                Lihat semua notifikasi
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-green-100 text-green-600 text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}