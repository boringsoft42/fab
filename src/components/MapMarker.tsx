"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLngExpression, Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapMarkerProps {
  position: LatLngExpression
  name: string
}

export default function MapMarker({ position, name }: MapMarkerProps) {
  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  )
}
