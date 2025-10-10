'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Clock, 
  AlertTriangle, 
  Calendar,
  Target,
  TrendingUp,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isAfter, isBefore, addHours, startOfDay, endOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { 
  getTingkatPrioritasLabel,
  getPriorityColor,
  getJenisPeringatanLabel
} from "@/zod/schema/peringatan";
import { JenisPeringatan, TingkatPrioritas, StatusPeringatan } from "@prisma/client";

interface TimelinePeringatanData {
  id: string;
  judul: string;
  deskripsi: string;
  jenisPeringatan: JenisPeringatan;
  tingkatPrioritas: TingkatPrioritas;
  statusPeringatan: StatusPeringatan;
  batasWaktuTindakan?: Date;
  createdAt: Date;
  sppg?: {
    nama: string;
    organisasi: {
      singkatan?: string;
    };
  };
}

interface TimelinePrioritasProps {
  data: TimelinePeringatanData[];
  className?: string;
}

const priorityOrder = {
  'KRITIS': 0,
  'TINGGI': 1,
  'SEDANG': 2,
  'RENDAH': 3,
  'INFO': 4
};

const priorityColors = {
  'KRITIS': 'bg-red-500',
  'TINGGI': 'bg-orange-500',
  'SEDANG': 'bg-yellow-500',
  'RENDAH': 'bg-blue-500',
  'INFO': 'bg-gray-500'
};

export function TimelinePrioritas({ data, className }: TimelinePrioritasProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '24h' | '3d' | '7d'>('24h');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time setiap menit untuk real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update setiap menit

    return () => clearInterval(interval);
  }, []);

  // Filter data berdasarkan periode yang dipilih
  const getFilteredData = () => {
    const now = new Date();
    let endTime: Date;
    
    switch (selectedPeriod) {
      case 'today':
        endTime = endOfDay(now);
        break;
      case '24h':
        endTime = addHours(now, 24);
        break;
      case '3d':
        endTime = addHours(now, 72);
        break;
      case '7d':
        endTime = addHours(now, 168);
        break;
      default:
        endTime = addHours(now, 24);
    }

    return data
      .filter(item => 
        item.batasWaktuTindakan && 
        item.statusPeringatan === 'AKTIF' &&
        isBefore(item.batasWaktuTindakan, endTime)
      )
      .sort((a, b) => {
        // Sort by priority first, then by deadline
        const priorityDiff = priorityOrder[a.tingkatPrioritas] - priorityOrder[b.tingkatPrioritas];
        if (priorityDiff !== 0) return priorityDiff;
        
        if (!a.batasWaktuTindakan && !b.batasWaktuTindakan) return 0;
        if (!a.batasWaktuTindakan) return 1;
        if (!b.batasWaktuTindakan) return -1;
        
        return a.batasWaktuTindakan.getTime() - b.batasWaktuTindakan.getTime();
      });
  };

  const filteredData = getFilteredData();

  // Helper function untuk menentukan status urgency
  const getUrgencyStatus = (deadline: Date) => {
    const now = currentTime;
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return { status: 'overdue', label: 'Terlambat', color: 'bg-red-600' };
    if (hoursLeft < 2) return { status: 'critical', label: 'Sangat Urgent', color: 'bg-red-500' };
    if (hoursLeft < 6) return { status: 'urgent', label: 'Urgent', color: 'bg-orange-500' };
    if (hoursLeft < 24) return { status: 'today', label: 'Hari Ini', color: 'bg-yellow-500' };
    return { status: 'upcoming', label: 'Mendatang', color: 'bg-blue-500' };
  };

  // Helper untuk format waktu relatif
  const getTimeLabel = (deadline: Date) => {
    const now = currentTime;
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) {
      return `Terlambat ${Math.abs(Math.floor(hoursLeft))} jam`;
    } else if (hoursLeft < 1) {
      const minutesLeft = Math.floor(hoursLeft * 60);
      return `${minutesLeft} menit lagi`;
    } else if (hoursLeft < 24) {
      return `${Math.floor(hoursLeft)} jam lagi`;
    } else {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${daysLeft} hari lagi`;
    }
  };

  if (filteredData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline Prioritas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-2">
            <Target className="w-12 h-12 text-muted-foreground/50" />
            <h3 className="font-medium">Tidak ada deadline mendatang</h3>
            <p className="text-sm text-center">
              Semua peringatan telah diselesaikan atau tidak memiliki deadline dalam periode ini
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline Prioritas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedPeriod === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('today')}
            >
              Hari Ini
            </Button>
            <Button
              variant={selectedPeriod === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('24h')}
            >
              24 Jam
            </Button>
            <Button
              variant={selectedPeriod === '3d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('3d')}
            >
              3 Hari
            </Button>
            <Button
              variant={selectedPeriod === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('7d')}
            >
              7 Hari
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-b pb-2">
            <div className="w-16">Prioritas</div>
            <div className="flex-1">Peringatan</div>
            <div className="w-24">SPPG</div>
            <div className="w-32">Deadline</div>
            <div className="w-20">Status</div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <TooltipProvider>
              {filteredData.map((item) => {
                const urgency = item.batasWaktuTindakan ? getUrgencyStatus(item.batasWaktuTindakan) : null;
                const timeLabel = item.batasWaktuTindakan ? getTimeLabel(item.batasWaktuTindakan) : '';
                
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                        urgency?.status === 'overdue' && "border-red-200 bg-red-50",
                        urgency?.status === 'critical' && "border-orange-200 bg-orange-50",
                        urgency?.status === 'urgent' && "border-yellow-200 bg-yellow-50"
                      )}>
                        {/* Priority Indicator */}
                        <div className="w-16 flex items-center gap-2">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            priorityColors[item.tingkatPrioritas]
                          )} />
                          <span className="text-xs font-medium">
                            {getTingkatPrioritasLabel(item.tingkatPrioritas).charAt(0)}
                          </span>
                        </div>

                        {/* Alert Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.judul}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {getJenisPeringatanLabel(item.jenisPeringatan)}
                          </div>
                        </div>

                        {/* SPPG Info */}
                        <div className="w-24 text-xs text-muted-foreground truncate">
                          {item.sppg ? (
                            <span title={item.sppg.nama}>
                              {item.sppg.organisasi.singkatan || item.sppg.nama}
                            </span>
                          ) : (
                            '-'
                          )}
                        </div>

                        {/* Deadline */}
                        <div className="w-32 text-xs">
                          {item.batasWaktuTindakan ? (
                            <div className="space-y-1">
                              <div className="font-medium">
                                {format(item.batasWaktuTindakan, 'dd/MM HH:mm')}
                              </div>
                              <div className={cn(
                                "text-xs",
                                urgency?.status === 'overdue' && "text-red-600 font-medium",
                                urgency?.status === 'critical' && "text-orange-600 font-medium",
                                urgency?.status === 'urgent' && "text-yellow-600 font-medium"
                              )}>
                                {timeLabel}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>

                        {/* Urgency Status */}
                        <div className="w-20">
                          {urgency && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-2 py-1",
                                urgency.status === 'overdue' && "border-red-300 text-red-700 bg-red-50",
                                urgency.status === 'critical' && "border-orange-300 text-orange-700 bg-orange-50",
                                urgency.status === 'urgent' && "border-yellow-300 text-yellow-700 bg-yellow-50",
                                urgency.status === 'today' && "border-blue-300 text-blue-700 bg-blue-50",
                                urgency.status === 'upcoming' && "border-gray-300 text-gray-700 bg-gray-50"
                              )}
                            >
                              {urgency.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {urgency.status === 'critical' && <Clock className="w-3 h-3 mr-1" />}
                              <span className="truncate">{urgency.label}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-sm">
                      <div className="space-y-2">
                        <div className="font-medium">{item.judul}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.deskripsi}
                        </div>
                        {item.sppg && (
                          <div className="text-sm">
                            <span className="font-medium">SPPG:</span> {item.sppg.nama}
                          </div>
                        )}
                        {item.batasWaktuTindakan && (
                          <div className="text-sm">
                            <span className="font-medium">Deadline:</span>{' '}
                            {format(item.batasWaktuTindakan, 'EEEE, dd MMMM yyyy HH:mm', { locale: id })}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Summary Statistics */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {filteredData.filter(item => {
                    if (!item.batasWaktuTindakan) return false;
                    const urgency = getUrgencyStatus(item.batasWaktuTindakan);
                    return urgency.status === 'overdue' || urgency.status === 'critical';
                  }).length}
                </div>
                <div className="text-xs text-muted-foreground">Urgent</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredData.filter(item => {
                    if (!item.batasWaktuTindakan) return false;
                    const urgency = getUrgencyStatus(item.batasWaktuTindakan);
                    return urgency.status === 'urgent';
                  }).length}
                </div>
                <div className="text-xs text-muted-foreground">Hari Ini</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredData.filter(item => item.tingkatPrioritas === 'KRITIS').length}
                </div>
                <div className="text-xs text-muted-foreground">Kritis</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {filteredData.length}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}