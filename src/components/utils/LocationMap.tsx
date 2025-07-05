// components/LocationMap.tsx
import React from &ldquo;react&rdquo;;
import Map, { Marker } from &ldquo;react-map-gl&rdquo;;
import &ldquo;mapbox-gl/dist/mapbox-gl.css&rdquo;;
import { MapPin } from &ldquo;lucide-react&rdquo;;

const MAPBOX_TOKEN = &ldquo;pk.eyJ1IjoiZHJvOTciLCJhIjoiY21jb3dpMGM3MDA1YTJpbjd1c2M4N3h1dyJ9.jPt50SudX3bf9KDOl4oS-A&rdquo;;

type Location = {
  latitude: number;
  longitude: number;
};

interface LocationMapProps {
  location: Location;
}

export const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  return (
    <div className=&ldquo;rounded-xl overflow-hidden border border-gray-200&rdquo; style={{ height: &ldquo;300px&rdquo; }}>
      <Map
        initialViewState={{
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 12,
        }}
        style={{ width: &ldquo;100%&rdquo;, height: &ldquo;100%&rdquo; }}
        mapStyle=&ldquo;mapbox://styles/mapbox/streets-v11&rdquo;
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={location.longitude} latitude={location.latitude} anchor=&ldquo;bottom&rdquo;>
          <MapPin className=&ldquo;text-red-600 w-6 h-6&rdquo; />
        </Marker>
      </Map>
    </div>
  );
};
