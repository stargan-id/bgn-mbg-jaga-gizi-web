'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dynamic import untuk menghindari SSR issues
const LeafletMap = dynamic(() => import('./leaflet/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Spinner className="h-6 w-6" />
      <span className="ml-2">Loading map...</span>
    </div>
  )
})

const MarkerWithPopup = dynamic(() => import('./leaflet/MarkerWithPopup'), {
  ssr: false
})

const MapControls = dynamic(() => import('./leaflet/MapControls'), {
  ssr: false
})

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

interface MapContainerLeafletProps {
  className?: string
}

const MapContainerLeaflet = ({ className = '' }: MapContainerLeafletProps) => {
  const [sppgData, setSppgData] = useState<SPPGData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Center map di Indonesia (Jakarta sebagai center point)
  const defaultCenter: [number, number] = [-6.2088, 106.8456]
  const defaultZoom = 5

  useEffect(() => {
    const fetchSppgData = async () => {
      try {
        setLoading(true)
        // Simulate API call - replace with actual API endpoint
        const response = await fetch('/api/sppg')
        if (!response.ok) {
          throw new Error('Failed to fetch SPPG data')
        }
        const data = await response.json()
        setSppgData(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching SPPG data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        
        // Fallback: use mock data for demo
        const mockData: SPPGData[] = [
          {
            id: '1',
            nama: 'SPPG Jakarta Pusat',
            alamat: 'Jl. Merdeka No. 1',
            kecamatan: 'Gambir',
            kabupaten: 'Jakarta Pusat',
            provinsi: 'DKI Jakarta',
            latitude: -6.1751,
            longitude: 106.8650,
            status: 'AKTIF'
          },
          {
            id: '2',
            nama: 'SPPG Surabaya',
            alamat: 'Jl. Pahlawan No. 10',
            kecamatan: 'Sukolilo',
            kabupaten: 'Surabaya',
            provinsi: 'Jawa Timur',
            latitude: -7.2575,
            longitude: 112.7521,
            status: 'AKTIF'
          },
          {
            id: '3',
            nama: 'SPPG Medan',
            alamat: 'Jl. Sisingamangaraja No. 5',
            kecamatan: 'Medan Kota',
            kabupaten: 'Medan',
            provinsi: 'Sumatera Utara',
            latitude: 3.5952,
            longitude: 98.6722,
            status: 'PENDING'
          },
          {
            id: '4',
            nama: 'SPPG Makassar',
            alamat: 'Jl. Ahmad Yani No. 15',
            kecamatan: 'Makassar',
            kabupaten: 'Makassar',
            provinsi: 'Sulawesi Selatan',
            latitude: -5.1477,
            longitude: 119.4327,
            status: 'TIDAK_AKTIF'
          }
        ]
        setSppgData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchSppgData()
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-2" />
          <p className="text-gray-600">Loading SPPG locations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      {error && (
        <Alert className="absolute top-4 left-4 z-[1000] max-w-sm">
          <AlertDescription>
            {error} (Using demo data)
          </AlertDescription>
        </Alert>
      )}
      
      <LeafletMap 
        center={defaultCenter} 
        zoom={defaultZoom}
        className="rounded-lg"
      >
        {sppgData.map((sppg) => (
          <MarkerWithPopup 
            key={sppg.id} 
            data={sppg} 
          />
        ))}
        <MapControls className="absolute top-4 left-4 z-[1000]" />
      </LeafletMap>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-md">
        <p className="text-xs text-gray-600">
          Showing {sppgData.length} SPPG locations
        </p>
      </div>
    </div>
  )
}

export default MapContainerLeaflet