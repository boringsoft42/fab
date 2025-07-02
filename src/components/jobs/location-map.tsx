"use client";

import { MapPin } from "lucide-react";

interface LocationMapProps {
  location: string;
}

export function LocationMap({ location }: LocationMapProps) {
  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
      {/* This is a placeholder for a real map. In a real app, you'd use Google Maps, Mapbox, etc. */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">{location}</p>
        </div>
      </div>
    </div>
  );
}
