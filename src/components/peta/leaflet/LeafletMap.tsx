'use client'

import { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '@/lib/leaflet-config' // Import configuration

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  className?: string
  children?: ReactNode
}

const LeafletMap = ({ center, zoom, className = '', children }: LeafletMapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false} // Disable built-in zoom control
      className={`h-full w-full ${className}`}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}

export default LeafletMap