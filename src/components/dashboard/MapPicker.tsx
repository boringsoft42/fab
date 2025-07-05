&ldquo;use client&rdquo;;

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from &ldquo;react-leaflet&rdquo;;
import { useEffect, useRef, useState } from &ldquo;react&rdquo;;
import L from &ldquo;leaflet&rdquo;;

const markerIcon = new L.Icon({
  iconUrl: &ldquo;https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png&rdquo;,
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

function ForceResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

export default function MapPicker({ onChange }: { onChange: (latlng: [number, number]) => void }) {
  return (
    <MapContainer
      center={[-17.3935, -66.1570]} // Cochabamba
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: &ldquo;300px&rdquo;, width: &ldquo;100%&rdquo;, borderRadius: &ldquo;0.5rem&rdquo; }}
    >
      <ForceResize />
      <TileLayer
        attribution='&copy; <a href=&ldquo;https://osm.org/copyright&rdquo;>OpenStreetMap</a>'
        url=&ldquo;https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png&rdquo;
      />
      <LocationMarker onChange={onChange} />
    </MapContainer>
  );
}
