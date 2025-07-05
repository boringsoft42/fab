&ldquo;use client&rdquo;;

import { MapContainer, TileLayer, Marker } from &ldquo;react-leaflet&rdquo;;
import L from &ldquo;leaflet&rdquo;;
import &ldquo;leaflet/dist/leaflet.css&rdquo;;

type Location = {
  latitude: number;
  longitude: number;
};

interface LocationMapProps {
  location?: Location; // puede ser opcional si aún no se carga
}

const markerIcon = new L.Icon({
  iconUrl: &ldquo;https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png&rdquo;,
  iconRetinaUrl: &ldquo;https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png&rdquo;,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: &ldquo;https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png&rdquo;,
  shadowSize: [41, 41],
});

export const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  const latitude = location?.latitude ?? -17.3935;
  const longitude = location?.longitude ?? -66.1570;

  return (
    <div className=&ldquo;rounded-xl overflow-hidden border border-gray-200&rdquo; style={{ height: &ldquo;300px&rdquo; }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: &ldquo;100%&rdquo;, height: &ldquo;100%&rdquo; }}
      >
        <TileLayer
          attribution='&copy; <a href=&ldquo;https://osm.org/copyright&rdquo;>OpenStreetMap</a>'
          url=&ldquo;https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png&rdquo;
        />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
};
