'use client'

import { useMap } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react'

interface MapControlsProps {
  className?: string
}

const MapControls = ({ className = '' }: MapControlsProps) => {
  const map = useMap()

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  const handleReset = () => {
    // Reset ke center Indonesia
    map.setView([-6.2088, 106.8456], 5)
  }

  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          map.setView([latitude, longitude], 13)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        className="p-2 w-8 h-8"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        className="p-2 w-8 h-8"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="h-1" /> {/* Separator */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="p-2 w-8 h-8"
        title="Reset View"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLocateUser}
        className="p-2 w-8 h-8"
        title="My Location"
      >
        <MapPin className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default MapControls