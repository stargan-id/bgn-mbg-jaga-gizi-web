'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { type SppgWithOrganisasi } from "@/lib/services/sppg";
import { type CreateSppgData, type UpdateSppgData } from "@/zod/schema/sppg";

interface FormSppgProps {
  sppg?: SppgWithOrganisasi;
  organisasiOptions: Array<{
    id: string;
    nama: string;
    singkatan: string | null;
  }>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function FormSppg({
  sppg,
  organisasiOptions,
  onSubmit,
  onCancel,
  loading = false
}: FormSppgProps) {
  const [formData, setFormData] = useState({
    nama: sppg?.nama || "",
    alamat: sppg?.alamat || "",
    kontak: sppg?.kontak || "",
    kapasitasProduksi: sppg?.kapasitasProduksi?.toString() || "",
    longitude: sppg?.longitude?.toString() || "",
    latitude: sppg?.latitude?.toString() || "",
    organisasiId: sppg?.organisasiId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gpsLoading, setGpsLoading] = useState(false);

  const isEdit = !!sppg;

  // Get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setGpsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama SPPG harus diisi";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama SPPG minimal 3 karakter";
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat harus diisi";
    } else if (formData.alamat.trim().length < 10) {
      newErrors.alamat = "Alamat harus lebih detail, minimal 10 karakter";
    }

    if (!formData.organisasiId) {
      newErrors.organisasiId = "Organisasi harus dipilih";
    }

    if (!formData.kapasitasProduksi) {
      newErrors.kapasitasProduksi = "Kapasitas produksi harus diisi";
    } else {
      const kapasitas = parseInt(formData.kapasitasProduksi);
      if (isNaN(kapasitas) || kapasitas < 1) {
        newErrors.kapasitasProduksi = "Kapasitas produksi harus minimal 1";
      }
    }

    // Validate coordinates if provided
    if (formData.longitude && formData.latitude) {
      const lng = parseFloat(formData.longitude);
      const lat = parseFloat(formData.latitude);
      
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "Longitude harus antara -180 dan 180";
      }
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "Latitude harus antara -90 dan 90";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    
    if (isEdit) {
      submitData.append('id', sppg.id);
      submitData.append('updatedBy', 'current-user'); // TODO: Get from auth context
    } else {
      submitData.append('createdBy', 'current-user'); // TODO: Get from auth context
    }

    submitData.append('nama', formData.nama.trim());
    submitData.append('alamat', formData.alamat.trim());
    submitData.append('organisasiId', formData.organisasiId);
    submitData.append('kapasitasProduksi', formData.kapasitasProduksi);
    
    if (formData.kontak.trim()) {
      submitData.append('kontak', formData.kontak.trim());
    }
    
    if (formData.longitude && formData.latitude) {
      submitData.append('longitude', formData.longitude);
      submitData.append('latitude', formData.latitude);
    }

    await onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {isEdit ? 'Edit SPPG' : 'Tambah SPPG Baru'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Dasar</h3>
            
            <div className="space-y-2">
              <Label htmlFor="nama">Nama SPPG *</Label>
              <Input
                id="nama"
                placeholder="Masukkan nama SPPG"
                value={formData.nama}
                onChange={(e) => handleInputChange('nama', e.target.value)}
                className={errors.nama ? "border-red-500" : ""}
              />
              {errors.nama && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nama}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organisasi">Organisasi *</Label>
              <Select 
                value={formData.organisasiId} 
                onValueChange={(value) => handleInputChange('organisasiId', value)}
              >
                <SelectTrigger className={errors.organisasiId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih organisasi" />
                </SelectTrigger>
                <SelectContent>
                  {organisasiOptions.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center gap-2">
                        <span>{org.nama}</span>
                        {org.singkatan && (
                          <Badge variant="outline" className="text-xs">
                            {org.singkatan}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organisasiId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.organisasiId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat *</Label>
              <Textarea
                id="alamat"
                placeholder="Masukkan alamat lengkap SPPG"
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                className={errors.alamat ? "border-red-500" : ""}
                rows={3}
              />
              {errors.alamat && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.alamat}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kontak">Kontak</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="kontak"
                    placeholder="Nomor telepon atau email"
                    value={formData.kontak}
                    onChange={(e) => handleInputChange('kontak', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kapasitas">Kapasitas Produksi (porsi/hari) *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="kapasitas"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formData.kapasitasProduksi}
                    onChange={(e) => handleInputChange('kapasitasProduksi', e.target.value)}
                    className={`pl-10 ${errors.kapasitasProduksi ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.kapasitasProduksi && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.kapasitasProduksi}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Informasi Lokasi</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className="flex items-center gap-2"
              >
                {gpsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {gpsLoading ? 'Mendapatkan Lokasi...' : 'Dapatkan Lokasi GPS'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="-6.200000"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={errors.latitude ? "border-red-500" : ""}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.latitude}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="106.816666"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={errors.longitude ? "border-red-500" : ""}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Koordinat lokasi tersedia</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? 'Menyimpan...' : 'Menambahkan...'}
                </>
              ) : (
                <>
                  {isEdit ? 'Simpan Perubahan' : 'Tambah SPPG'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}