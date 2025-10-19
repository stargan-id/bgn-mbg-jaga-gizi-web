import L from 'leaflet'

// Fix untuk icon markers yang hilang di Leaflet dengan Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete ((L.Icon.Default.prototype as unknown) as { [key: string]: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export { L }

