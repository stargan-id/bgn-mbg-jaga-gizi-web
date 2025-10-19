'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type PeringatanWithRelations } from "@/lib/services/peringatan";
import {
  getAlertTypeIcon,
  getJenisPeringatanLabel,
  getPriorityColor,
  getStatusPeringatanLabel,
  getTingkatPrioritasLabel
} from "@/zod/schema/peringatan";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import * as Icons from "lucide-react";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye
} from "lucide-react";
import { useState } from "react";

interface TabelPeringatanProps {
  data: PeringatanWithRelations[];
  loading: boolean;
  onResolve: (id: string, tindakan?: string, hasil?: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TabelPeringatan({ 
  data, 
  loading, 
  onResolve, 
  currentPage, 
  totalPages, 
  onPageChange 
}: TabelPeringatanProps) {
  const [selectedPeringatan, setSelectedPeringatan] = useState<PeringatanWithRelations | null>(null);
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [tindakanDilakukan, setTindakanDilakukan] = useState("");
  const [hasilTindakan, setHasilTindakan] = useState("");
  const [resolving, setResolving] = useState(false);

  const handleResolve = async (id: string) => {
    try {
      setResolving(true);
      await onResolve(id, tindakanDilakukan, hasilTindakan);
      setResolveDialog(null);
      setTindakanDilakukan("");
      setHasilTindakan("");
    } catch (error) {
      console.error('Error resolving peringatan:', error);
    } finally {
      setResolving(false);
    }
  };

  const getUrgencyIndicator = (peringatan: PeringatanWithRelations) => {
    if (!peringatan.batasWaktuTindakan) return null;
    
    const now = new Date();
    const deadline = new Date(peringatan.batasWaktuTindakan);
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) {
      return <Badge variant="destructive" className="text-xs">Terlambat</Badge>;
    } else if (hoursLeft < 4) {
      return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
    } else if (hoursLeft < 24) {
      return <Badge variant="outline" className="text-xs text-orange-600">Hari ini</Badge>;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Tidak ada peringatan</h3>
        <p className="text-muted-foreground">
          Tidak ada peringatan yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Peringatan</TableHead>
              <TableHead>SPPG</TableHead>
              <TableHead>Prioritas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((peringatan) => {
              const IconComponent = Icons[getAlertTypeIcon(peringatan.jenisPeringatan) as keyof typeof Icons] as React.ComponentType<{ className?: string }> | undefined;
              const urgencyIndicator = getUrgencyIndicator(peringatan);
              
              return (
                <TableRow key={peringatan.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {peringatan.judul}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getJenisPeringatanLabel(peringatan.jenisPeringatan)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(peringatan.createdAt), { 
                          addSuffix: true, 
                          locale: id 
                        })}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {peringatan.sppg ? (
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {peringatan.sppg.nama}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {peringatan.sppg.organisasi.singkatan}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(peringatan.tingkatPrioritas)}
                      >
                        {getTingkatPrioritasLabel(peringatan.tingkatPrioritas)}
                      </Badge>
                      {urgencyIndicator}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">
                      {getStatusPeringatanLabel(peringatan.statusPeringatan)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {peringatan.batasWaktuTindakan ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(peringatan.batasWaktuTindakan), 'dd MMM yyyy HH:mm', { locale: id })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPeringatan(peringatan)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detail Peringatan</DialogTitle>
                            <DialogDescription>
                              Informasi lengkap tentang peringatan ini
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPeringatan && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Judul</Label>
                                <p className="text-sm">{selectedPeringatan.judul}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Deskripsi</Label>
                                <p className="text-sm text-muted-foreground">{selectedPeringatan.deskripsi}</p>
                              </div>
                              {selectedPeringatan.sppg && (
                                <div>
                                  <Label className="text-sm font-medium">SPPG Terkait</Label>
                                  <div className="text-sm">
                                    <p>{selectedPeringatan.sppg.nama}</p>
                                    <p className="text-muted-foreground">{selectedPeringatan.sppg.alamat}</p>
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Prioritas</Label>
                                  <Badge className={getPriorityColor(selectedPeringatan.tingkatPrioritas)}>
                                    {getTingkatPrioritasLabel(selectedPeringatan.tingkatPrioritas)}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <Badge variant="outline">
                                    {getStatusPeringatanLabel(selectedPeringatan.statusPeringatan)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {peringatan.statusPeringatan === 'AKTIF' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => setResolveDialog(peringatan.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Selesaikan Peringatan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tandai peringatan ini sebagai diselesaikan. Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="tindakan">Tindakan yang Dilakukan</Label>
                                <Textarea
                                  id="tindakan"
                                  value={tindakanDilakukan}
                                  onChange={(e) => setTindakanDilakukan(e.target.value)}
                                  placeholder="Jelaskan tindakan yang telah dilakukan..."
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="hasil">Hasil Tindakan</Label>
                                <Textarea
                                  id="hasil"
                                  value={hasilTindakan}
                                  onChange={(e) => setHasilTindakan(e.target.value)}
                                  placeholder="Jelaskan hasil dari tindakan yang dilakukan..."
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleResolve(peringatan.id)}
                                disabled={resolving}
                              >
                                {resolving ? "Memproses..." : "Selesaikan"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {data.map((peringatan) => {
          const IconComponent = Icons[getAlertTypeIcon(peringatan.jenisPeringatan) as keyof typeof Icons] as React.ComponentType<{ className?: string }> | undefined;
          const urgencyIndicator = getUrgencyIndicator(peringatan);
          
          return (
            <div key={peringatan.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-medium text-sm">
                    {peringatan.judul}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {peringatan.deskripsi}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={getPriorityColor(peringatan.tingkatPrioritas)}
                >
                  {getTingkatPrioritasLabel(peringatan.tingkatPrioritas)}
                </Badge>
                <Badge variant="outline">
                  {getStatusPeringatanLabel(peringatan.statusPeringatan)}
                </Badge>
                {urgencyIndicator}
              </div>
              
              {peringatan.sppg && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="w-3 h-3" />
                  <span>{peringatan.sppg.nama} - {peringatan.sppg.organisasi.singkatan}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(peringatan.createdAt), { 
                    addSuffix: true, 
                    locale: id 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {peringatan.statusPeringatan === 'AKTIF' && (
                    <Button variant="default" size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}