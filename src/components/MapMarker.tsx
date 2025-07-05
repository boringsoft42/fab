&ldquo;use client&rdquo;

import { MapContainer, TileLayer, Marker, Popup } from &ldquo;react-leaflet&rdquo;
import { LatLngExpression, Icon } from &ldquo;leaflet&rdquo;
import &ldquo;leaflet/dist/leaflet.css&rdquo;
import L from &ldquo;leaflet&rdquo;

const markerIcon = new L.Icon({
  iconUrl: &ldquo;https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png&rdquo;,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapMarkerProps {
  position: LatLngExpression
  name: string
}

export default function MapMarker({ position, name }: MapMarkerProps) {
  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: &ldquo;300px&rdquo;, width: &ldquo;100%&rdquo; }}>
      <TileLayer
        attribution='&copy; <a href=&ldquo;https://www.openstreetmap.org/&rdquo;>OpenStreetMap</a>'
        url=&ldquo;https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png&rdquo;
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  )
}
