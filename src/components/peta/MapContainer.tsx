'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SppgMapData } from '@/lib/services/sppg';
import { MapPlaceholder } from './MapPlaceholder';

declare global {
  interface Window {
    mapkit: any;
  }
}

interface MapContainerProps {
  sppgData: SppgMapData[];
  onMarkerClick?: (sppg: SppgMapData) => void;
  height?: string;
  className?: string;
}

export function MapContainer({ 
  sppgData, 
  onMarkerClick, 
  height = '600px',
  className = '' 
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMapPlaceholder, setUseMapPlaceholder] = useState(false);

  // Initialize MapKit JS
  useEffect(() => {
    const initializeMapKit = async () => {
      try {
        // Load MapKit JS if not already loaded
        if (!window.mapkit) {
          const script = document.createElement('script');
          script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
          script.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Initialize MapKit with JWT token
        if (!window.mapkit.isInitialized) {
          const mapkitToken = process.env.NEXT_PUBLIC_MAPKIT_JS_TOKEN;
          
          if (!mapkitToken || mapkitToken === 'your_jwt_token_here' || mapkitToken === 'your_mapkit_js_token_here') {
            // For development without MapKit token, use placeholder
            console.warn('MapKit JS token not configured. Using development placeholder.');
            setUseMapPlaceholder(true);
            return;
          }

          window.mapkit.init({
            authorizationCallback: function(done: (token: string) => void) {
              done(mapkitToken);
            }
          });
        }

        setIsMapReady(true);
      } catch (err) {
        console.error('Failed to initialize MapKit JS:', err);
        setError('Gagal memuat peta. Silakan muat ulang halaman.');
      }
    };

    initializeMapKit();
  }, []);

  // Create map instance
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Center map on Indonesia
      const indonesiaCenter = new window.mapkit.Coordinate(-2.5489, 118.0149);
      
      const map = new window.mapkit.Map(mapRef.current, {
        center: indonesiaCenter,
        span: new window.mapkit.CoordinateSpan(15, 20), // Zoom level for Indonesia view
        mapType: window.mapkit.Map.MapTypes.Standard,
        showsCompass: window.mapkit.FeatureVisibility.Visible,
        showsMapTypeControl: true,
        showsZoomControl: true,
        showsUserLocationControl: false
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Failed to create map:', err);
      setError('Gagal membuat peta.');
    }
  }, [isMapReady]);

  // Add markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !sppgData.length) return;

    // Clear existing markers
    if (markersRef.current.length > 0) {
      mapInstanceRef.current.removeAnnotations(markersRef.current);
      markersRef.current = [];
    }

    // Create new markers
    const markers = sppgData.map(sppg => {
      const coordinate = new window.mapkit.Coordinate(sppg.latitude, sppg.longitude);
      
      // Create marker with status-based styling
      const marker = new window.mapkit.MarkerAnnotation(coordinate, {
        title: sppg.nama,
        subtitle: sppg.alamat,
        data: sppg, // Store SPPG data in marker
        color: getMarkerColor(sppg.statusVerifikasi),
        glyphColor: '#ffffff'
      });

      // Add click event
      marker.addEventListener('select', () => {
        if (onMarkerClick) {
          onMarkerClick(sppg);
        }
      });

      return marker;
    });

    // Add markers to map
    mapInstanceRef.current.addAnnotations(markers);
    markersRef.current = markers;

    // Fit map to show all markers if there are markers
    if (markers.length > 0) {
      const coordinates = markers.map(marker => marker.coordinate);
      const region = window.mapkit.boundingRegionForCoordinates(coordinates, 0.1, 0.1);
      mapInstanceRef.current.setRegionAnimated(region, true);
    }
  }, [sppgData, onMarkerClick]);

  const getMarkerColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return '#22c55e'; // Green
      case 'UNDER_REVIEW':
        return '#f59e0b'; // Yellow
      case 'REJECTED':
        return '#ef4444'; // Red
      case 'SUSPENDED':
        return '#6b7280'; // Gray
      case 'DRAFT':
      default:
        return '#3b82f6'; // Blue
    }
  };

  if (useMapPlaceholder) {
    return (
      <MapPlaceholder
        sppgData={sppgData}
        onMarkerClick={onMarkerClick}
        height={height}
        className={className}
      />
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isMapReady) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg animate-pulse ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">🗺️</div>
          <p className="text-gray-500">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}