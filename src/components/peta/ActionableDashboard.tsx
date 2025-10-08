'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users,
  FileText,
  Calendar,
  ArrowRight
} from 'lucide-react'

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

interface ActionableDashboardProps {
  filteredData: SPPGData[]
  totalData: SPPGData[]
  className?: string
}

const ActionableDashboard = ({ filteredData, totalData, className = '' }: ActionableDashboardProps) => {
  const pendingCount = filteredData.filter(s => s.status === 'PENDING').length
  const inactiveCount = filteredData.filter(s => s.status === 'TIDAK_AKTIF').length
  const activeCount = filteredData.filter(s => s.status === 'AKTIF').length
  
  // Priority actions based on data
  const priorityActions = []
  
  if (pendingCount > 0) {
    priorityActions.push({
      type: 'urgent',
      title: 'Review Diperlukan',
      description: `${pendingCount} SPPG menunggu verifikasi`,
      action: 'Review Sekarang',
      icon: Clock,
      color: 'yellow'
    })
  }
  
  if (inactiveCount > 0) {
    priorityActions.push({
      type: 'critical',
      title: 'Tindak Lanjut',
      description: `${inactiveCount} SPPG perlu reactivation`,
      action: 'Lihat Detail',
      icon: AlertTriangle,
      color: 'red'
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 space-y-0">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 space-y-3">
          {priorityActions.map((action, index) => (
            <Alert key={index} className={`border-${action.color}-200 bg-${action.color}-50 py-3 px-4`}>
              <action.icon className={`h-4 w-4 text-${action.color}-600`} />
              <AlertDescription className={`text-${action.color}-800`}>
                <div className="space-y-1 flex flex-col w-full justify-between">
                  <div>
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <span className="text-xs">{action.action}</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
          
          {priorityActions.length === 0 && (
            <Alert className="border-green-200 bg-green-50 py-3 px-4">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">Semua SPPG dalam kondisi baik</div>
                    <div className="text-xs opacity-90">Tidak ada tindakan mendesak diperlukan</div>
                  </div>
                  <div className="flex justify-end">
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      

      {/* Monthly Targets */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Target Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verifikasi Target</span>
              <Badge variant="secondary">95%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Progress Saat Ini</span>
              <Badge variant={activeCount/totalData.length >= 0.9 ? "default" : "destructive"}>
                {Math.round((activeCount/totalData.length) * 100)}%
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              Perlu {Math.max(0, Math.ceil(totalData.length * 0.95) - activeCount)} verifikasi lagi
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            Laporan Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Users className="h-3 w-3 mr-2" />
              Export Daftar SPPG Pending
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <TrendingUp className="h-3 w-3 mr-2" />
              Analisis Sebaran Regional
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionableDashboard