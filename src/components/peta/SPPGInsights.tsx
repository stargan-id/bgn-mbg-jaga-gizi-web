'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, AlertTriangle, Clock, Target, Users, MapPin } from 'lucide-react'

interface SPPGData {
  id: string
  nama: string
  alamat: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  latitude: number
  longitude: number
  status: 'AKTIF' | 'TIDAK_AKTIF' | 'PENDING'
}

interface SPPGInsightsProps {
  filteredData: SPPGData[]
  totalData: SPPGData[]
  className?: string
}

const SPPGInsights = ({ filteredData, totalData, className = '' }: SPPGInsightsProps) => {
  // Calculations
  const activePercentage = Math.round((filteredData.filter(s => s.status === 'AKTIF').length / totalData.length) * 100)
  const pendingCount = filteredData.filter(s => s.status === 'PENDING').length
  const inactiveCount = filteredData.filter(s => s.status === 'TIDAK_AKTIF').length
  
  // Get provinces with most SPPG
  const provinceStats = filteredData.reduce((acc, sppg) => {
    acc[sppg.provinsi] = (acc[sppg.provinsi] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topProvince = Object.entries(provinceStats)
    .sort(([,a], [,b]) => b - a)[0]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Key Metrics Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Tingkat Verifikasi:</strong> {activePercentage}% SPPG telah terverifikasi aktif
        </AlertDescription>
      </Alert>

      {/* Action Required */}
      {pendingCount > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Perlu Review:</strong> {pendingCount} SPPG menunggu verifikasi
          </AlertDescription>
        </Alert>
      )}

      {/* Critical Issues */}
      {inactiveCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Perhatian:</strong> {inactiveCount} SPPG tidak aktif/ditolak
          </AlertDescription>
        </Alert>
      )}

      {/* Regional Performance */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            Sebaran Regional
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {topProvince && (
              <div className="flex justify-between text-sm">
                <span>Terbanyak: <strong>{topProvince[0]}</strong></span>
                <Badge variant="secondary">{topProvince[1]} SPPG</Badge>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Provinsi Terlayani</span>
              <span>{Object.keys(provinceStats).length} provinsi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            Progress Verifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target Nasional</span>
              <span>{activePercentage}%</span>
            </div>
            <Progress value={activePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{filteredData.filter(s => s.status === 'AKTIF').length} Aktif</span>
              <span>{totalData.length} Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-700">
              {filteredData.filter(s => s.status === 'AKTIF').length}
            </div>
            <div className="text-xs text-green-600">Terverifikasi</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-700">
              {Math.round((filteredData.length / totalData.length) * 100)}%
            </div>
            <div className="text-xs text-blue-600">Coverage Area</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SPPGInsights