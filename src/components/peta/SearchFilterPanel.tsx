'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, X, MapPin } from 'lucide-react'

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

interface SearchFilterPanelProps {
  sppgData: SPPGData[]
  onFilteredDataChange: (filteredData: SPPGData[]) => void
  className?: string
}

type StatusFilter = 'ALL' | 'AKTIF' | 'PENDING' | 'TIDAK_AKTIF'

const SearchFilterPanel = ({ sppgData, onFilteredDataChange, className = '' }: SearchFilterPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [provinsiFilter, setProvinsiFilter] = useState<string>('ALL')
  const [showFilters, setShowFilters] = useState(false)
  
  // Use ref to store callback to avoid dependency issues
  const onFilteredDataChangeRef = useRef(onFilteredDataChange)
  onFilteredDataChangeRef.current = onFilteredDataChange

  // Get unique provinces for filter dropdown
  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(sppgData.map(sppg => sppg.provinsi))]
    return uniqueProvinces.sort()
  }, [sppgData])

  // Filter logic
  const filteredData = useMemo(() => {
    return sppgData.filter(sppg => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        sppg.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sppg.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sppg.kabupaten.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sppg.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const statusMatch = statusFilter === 'ALL' || sppg.status === statusFilter

      // Province filter
      const provinsiMatch = provinsiFilter === 'ALL' || sppg.provinsi === provinsiFilter

      return searchMatch && statusMatch && provinsiMatch
    })
  }, [sppgData, searchQuery, statusFilter, provinsiFilter])

  // Update parent component when filtered data changes
  useEffect(() => {
    onFilteredDataChangeRef.current(filteredData)
  }, [filteredData])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setProvinsiFilter('ALL')
  }

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || provinsiFilter !== 'ALL'

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = filteredData.reduce((acc, sppg) => {
      acc[sppg.status] = (acc[sppg.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      AKTIF: counts.AKTIF || 0,
      PENDING: counts.PENDING || 0,
      TIDAK_AKTIF: counts.TIDAK_AKTIF || 0,
      total: filteredData.length
    }
  }, [filteredData])

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pencarian SPPG
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari nama SPPG, alamat, atau kabupaten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status Verifikasi
              </label>
              <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="TIDAK_AKTIF">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Provinsi
              </label>
              <Select value={provinsiFilter} onValueChange={setProvinsiFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Provinsi</SelectItem>
                  {provinces.map(provinsi => (
                    <SelectItem key={provinsi} value={provinsi}>
                      {provinsi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Hasil:</span>
            <span className="text-gray-600">{statusCounts.total} dari {sppgData.length} SPPG</span>
          </div>
          
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-green-500">
              Aktif: {statusCounts.AKTIF}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              Pending: {statusCounts.PENDING}
            </Badge>
            <Badge variant="destructive">
              Tidak Aktif: {statusCounts.TIDAK_AKTIF}
            </Badge>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-600">Filter Aktif:</span>
            <div className="flex flex-wrap gap-1">
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Pencarian: "{searchQuery}"
                </Badge>
              )}
              {statusFilter !== 'ALL' && (
                <Badge variant="outline" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
              {provinsiFilter !== 'ALL' && (
                <Badge variant="outline" className="text-xs">
                  Provinsi: {provinsiFilter}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SearchFilterPanel