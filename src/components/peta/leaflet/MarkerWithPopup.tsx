'use client'

import { Marker, Popup } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

interface MarkerWithPopupProps {
  data: SPPGData
}

// Custom icon untuk marker dengan warna berdasarkan status
const createIcon = (status: string) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AKTIF': return '#10b981' // green-500
      case 'PENDING': return '#f59e0b' // amber-500
      case 'TIDAK_AKTIF': return '#ef4444' // red-500
      default: return '#6b7280' // gray-500
    }
  }
  
  const color = getStatusColor(status)
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
        <circle fill="${color}" cx="12.5" cy="12.5" r="4"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41]
  })
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'AKTIF':
      return 'default'
    case 'PENDING':
      return 'secondary'
    case 'TIDAK_AKTIF':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const MarkerWithPopup = ({ data }: MarkerWithPopupProps) => {
  const position: LatLngExpression = [data.latitude, data.longitude]

  return (
    <Marker position={position} icon={createIcon(data.status)}>
      <Popup maxWidth={300} className="rounded-lg">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{data.nama}</CardTitle>
            <Badge 
              variant={getStatusBadgeVariant(data.status)} 
              className="w-fit text-xs"
            >
              {data.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <div className="text-xs text-gray-600">
              <p><strong>Alamat:</strong> {data.alamat}</p>
              <p><strong>Kecamatan:</strong> {data.kecamatan}</p>
              <p><strong>Kabupaten:</strong> {data.kabupaten}</p>
              <p><strong>Provinsi:</strong> {data.provinsi}</p>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Koordinat: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}</p>
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  )
}

export default MarkerWithPopup