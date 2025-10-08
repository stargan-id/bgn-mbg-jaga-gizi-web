'use client';

import React from 'react';
import { SidebarNavigation, MenuItem } from '@/components/navigation';
import { TopBar } from './TopBar';
import { Home, MapPin, BarChart3, AlertCircle, Settings, Users, FileText, Utensils } from 'lucide-react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showTopBar?: boolean;
  topBarContent?: React.ReactNode;
}

const defaultMenuItems: MenuItem[] = [
  {
    label: 'Beranda',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Peta Nasional',
    href: '/dashboard/peta',
    icon: MapPin,
  },
  {
    label: 'Analitik',
    href: '/dashboard/analitik', 
    icon: BarChart3,
  },
  {
    label: 'Peringatan',
    href: '/dashboard/peringatan',
    icon: AlertCircle,
  },
  {
    label: 'SPPG',
    href: '/dashboard/sppg',
    icon: Users,
  },
  {
    label: 'Laporan',
    href: '/dashboard/laporan',
    icon: FileText,
  },
  {
    label: 'Pengaturan',
    href: '/dashboard/pengaturan',
    icon: Settings,
  },
];

export function ProtectedLayout({ 
  children, 
  title,
  subtitle,
  showTopBar = true,
  topBarContent
}: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNavigation 
        menuItems={defaultMenuItems}
        title="JAGA GIZI"
        subtitle="BGN Command Center"
        headerColor="bg-green-600"
        appIcon={Utensils}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        {showTopBar && (
          <TopBar 
            title={title}
            subtitle={subtitle}
          >
            {topBarContent}
          </TopBar>
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}