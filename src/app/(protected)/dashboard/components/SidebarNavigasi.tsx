'use client';

import { MenuItem, SidebarNavigation } from '@/components/navigation';
import { AlertCircle, BarChart3, FileText, Home, MapPin, Settings, Users, Utensils } from 'lucide-react';


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


export function SidebarNavigasi() {
  return (
    <SidebarNavigation 
      menuItems={menuItems}
      title="JAGA GIZI"
      subtitle="BGN Command Center"
      headerColor="bg-green-600"
      appIcon={Utensils}
    />
  );
}