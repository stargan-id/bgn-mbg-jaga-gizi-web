'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, MapPin, BarChart3, AlertCircle, Settings, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavigasiProps {
  children?: React.ReactNode;
}

const menuItems = [
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

export function SidebarNavigasi({ children }: SidebarNavigasiProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-green-600 text-white">
        <h2 className="text-xl font-bold">JAGA GIZI</h2>
        <p className="text-sm text-green-100 mt-1">BGN Command Center</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 BGN Indonesia</p>
          <p>v1.0.0 - MVP</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white border shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}