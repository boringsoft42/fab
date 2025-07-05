// components/LocationMap.tsx
import React from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZHJvOTciLCJhIjoiY21jb3dpMGM3MDA1YTJpbjd1c2M4N3h1dyJ9.jPt50SudX3bf9KDOl4oS-A";

type Location = {
  latitude: number;
  longitude: number;
};

interface LocationMapProps {
  location: Location;
}

export const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: "300px" }}>
      <Map
        initialViewState={{
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom">
          <MapPin className="text-red-600 w-6 h-6" />
        </Marker>
      </Map>
    </div>
  );
};
