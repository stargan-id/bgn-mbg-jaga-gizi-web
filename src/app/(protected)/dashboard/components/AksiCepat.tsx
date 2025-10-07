'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Download, 
  Send, 
  Filter,
  Search,
  Bell,
  Settings
} from 'lucide-react';

export function AksiCepat() {
  const quickActions = [
    {
      label: 'Tambah SPPG',
      icon: Plus,
      color: 'bg-green-600 hover:bg-green-700 text-white',
      action: () => console.log('Add SPPG')
    },
    {
      label: 'Buat Laporan',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      action: () => console.log('Create Report')
    },
    {
      label: 'Ekspor Data',
      icon: Download,
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      action: () => console.log('Export Data')
    },
    {
      label: 'Kirim Notifikasi',
      icon: Send,
      color: 'bg-orange-600 hover:bg-orange-700 text-white',
      action: () => console.log('Send Notification')
    }
  ];

  const filterActions = [
    {
      label: 'Filter Wilayah',
      icon: Filter,
      variant: 'outline' as const
    },
    {
      label: 'Cari SPPG',
      icon: Search,
      variant: 'outline' as const
    },
    {
      label: 'Peringatan',
      icon: Bell,
      variant: 'outline' as const,
      badge: 5
    },
    {
      label: 'Pengaturan',
      icon: Settings,
      variant: 'outline' as const
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} flex flex-col items-center gap-2 h-auto py-4 px-3`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {filterActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                className="flex items-center gap-2 relative"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
                {action.badge && (
                  <Badge 
                    variant="destructive" 
                    className="ml-1 h-4 w-4 flex items-center justify-center text-xs p-0"
                  >
                    {action.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}