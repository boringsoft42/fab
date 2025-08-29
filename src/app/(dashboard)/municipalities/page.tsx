"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  MapPin,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { BACKEND_ENDPOINTS } from "@/lib/backend-config";

interface Municipality {
  id: string;
  name: string;
  department: string;
  region: string;
  population: number;
}

export default function MunicipalitiesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch municipalities from the backend
  const fetchMunicipalities = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_ENDPOINTS.MUNICIPALITIES_PUBLIC);
      if (!response.ok) {
        throw new Error('Error al cargar los municipios');
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (err) {
      console.error('Error fetching municipalities:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Load municipalities on component mount
  React.useEffect(() => {
    fetchMunicipalities();
  }, []);

  const filteredMunicipalities = municipalities.filter(
    (municipality) =>
      municipality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      municipality.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      municipality.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
        <Image
          src="/images/municipalities/directory-banner.jpg"
          alt="Directorio de Municipios"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-900/40 flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Directorio de Municipios
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Explora los municipios que forman parte de nuestra red de
              desarrollo local y oportunidades
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar municipios por nombre, departamento o región..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando municipios...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">Error al cargar los municipios</p>
            <p className="text-red-500 text-sm">{error}</p>
            <Button 
              onClick={fetchMunicipalities} 
              variant="outline" 
              className="mt-4"
            >
              Intentar nuevamente
            </Button>
          </div>
        </div>
      )}

      {/* Municipalities Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMunicipalities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-600 font-medium mb-2">
                  {searchQuery ? 'No se encontraron municipios' : 'No hay municipios disponibles'}
                </p>
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Los municipios aparecerán aquí cuando estén disponibles'}
                </p>
              </div>
            </div>
          ) : (
            filteredMunicipalities.map((municipality) => (
              <Card key={municipality.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {municipality.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{municipality.department}, {municipality.region}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-green-700 font-medium">
                            {formatPopulation(municipality.population)} habitantes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-muted-foreground">
                      ID: {municipality.id}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
