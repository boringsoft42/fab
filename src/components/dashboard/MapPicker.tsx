"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onChange }: { onChange: (latlng: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onChange(newPos);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function MapPicker({ onChange }: { onChange: (latlng: [number, number]) => void }) {
  return (
    <MapContainer
      center={[-17.3935, -66.1570]} // Cochabamba
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onChange={onChange} />
    </MapContainer>
  );
}
