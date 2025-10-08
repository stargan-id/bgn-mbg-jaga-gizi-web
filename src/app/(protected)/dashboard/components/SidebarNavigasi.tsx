'use client';

import { SidebarNavigation, MenuItem } from '@/components/navigation';
import { Home, MapPin, BarChart3, AlertCircle, Settings, Users, FileText, Utensils } from 'lucide-react';

interface SidebarNavigasiProps {
  children?: React.ReactNode;
}

const menuItems: MenuItem[] = [
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

  return (
    <SidebarNavigation 
      menuItems={menuItems}
      title="JAGA GIZI"
      subtitle="BGN Command Center"
      headerColor="bg-green-600"
      appIcon={Utensils}
    >
      {children}
    </SidebarNavigation>
  );
}