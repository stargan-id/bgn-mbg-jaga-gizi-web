import { NextRequest, NextResponse } from 'next/server'
import { getSppgMapDataAction } from '@/actions/sppg'

export async function GET(request: NextRequest) {
  try {
    const result = await getSppgMapDataAction()
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch SPPG data' },
        { status: 500 }
      )
    }

    // Transform data to match Leaflet component interface
    const transformedData = result.data.map(sppg => ({
      id: sppg.id,
      nama: sppg.nama,
      alamat: sppg.alamat || 'Alamat tidak tersedia',
      kecamatan: 'N/A', // Not available in current schema
      kabupaten: sppg.organisasi?.nama || 'N/A', // Use organisation name as substitute
      provinsi: 'Indonesia', // Default province
      latitude: sppg.latitude,
      longitude: sppg.longitude,
      status: sppg.statusVerifikasi === 'APPROVED' ? 'AKTIF' : 
              sppg.statusVerifikasi === 'UNDER_REVIEW' ? 'PENDING' : 'TIDAK_AKTIF'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching SPPG data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}