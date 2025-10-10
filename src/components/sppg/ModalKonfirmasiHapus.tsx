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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Building2, 
  MapPin,
  Users,
  Loader2
} from "lucide-react";
import { type SppgWithOrganisasi } from "@/lib/services/sppg";

interface ModalKonfirmasiHapusProps {
  sppg: SppgWithOrganisasi | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const statusLabels = {
  DRAFT: "Draft",
  UNDER_REVIEW: "Dalam Review", 
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  SUSPENDED: "Diskors"
};

export function ModalKonfirmasiHapus({
  sppg,
  open,
  onConfirm,
  onCancel,
  loading = false
}: ModalKonfirmasiHapusProps) {
  if (!sppg) return null;

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Konfirmasi Hapus SPPG
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-gray-600">
                Anda yakin ingin menghapus SPPG berikut? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
              </p>

              {/* SPPG Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{sppg.nama}</h4>
                      <p className="text-sm text-gray-600">{sppg.organisasi.nama}</p>
                    </div>
                  </div>
                  <Badge variant={sppg.statusVerifikasi === 'APPROVED' ? 'default' : 'secondary'}>
                    {statusLabels[sppg.statusVerifikasi]}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{sppg.alamat}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Kapasitas: {sppg.kapasitasProduksi} porsi/hari</span>
                  </div>

                  {sppg.kontak && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center">📞</span>
                      <span>{sppg.kontak}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Peringatan:</p>
                    <p>Menghapus SPPG ini akan menghapus semua data terkait termasuk:</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Dokumen kepatuhan</li>
                      <li>Checklist harian</li>
                      <li>Laporan bahan baku</li>
                      <li>Menu harian</li>
                      <li>Kegiatan pengolahan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus SPPG'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}