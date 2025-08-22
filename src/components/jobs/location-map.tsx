"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  location: string;
  companyName?: string;
}

export function LocationMap({
  latitude,
  longitude,
  location,
  companyName,
}: LocationMapProps) {
  // Default coordinates for Cochabamba, Bolivia
  const defaultLat = -17.3895;
  const defaultLng = -66.1568;

  const lat = latitude || defaultLat;
  const lng = longitude || defaultLng;

  // Create Google Maps and OpenStreetMap URLs
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;

  // Create an embedded map URL (using OpenStreetMap with Leaflet)
  const embedMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Ubicación</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Embedded Map */}
          <div className="h-64 w-full rounded-lg border border-gray-200 overflow-hidden">
            <iframe
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title={`Mapa de ubicación - ${location}`}
              className="rounded-lg"
            />
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-lg font-medium">{location}</p>
              {companyName && (
                <p className="text-sm text-gray-600">{companyName}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {latitude && longitude
                  ? "Ubicación exacta"
                  : "Ubicación aproximada (Cochabamba, Bolivia)"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(googleMapsUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </div>

            {/* Coordinates Display */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>
                Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
