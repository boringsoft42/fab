"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Mail, 
  Phone,
  Calendar,
  Building2,
  Eye
} from "lucide-react";
import { useAllEntrepreneurships } from "@/hooks/useEntrepreneurshipApi";

export default function EntrepreneurshipDirectoryPage() {
  const router = useRouter();
  const { entrepreneurships, loading, error, fetchAllEntrepreneurships } = useAllEntrepreneurships();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("");

  useEffect(() => {
    fetchAllEntrepreneurships();
  }, [fetchAllEntrepreneurships]);

  const categories = [
    { value: "", label: "Todas las categorías" },
    { value: "tecnologia", label: "Tecnología" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "alimentacion", label: "Alimentación" },
    { value: "educacion", label: "Educación" },
    { value: "servicios", label: "Servicios" },
    { value: "manufactura", label: "Manufactura" }
  ];

  const municipalities = [
    { value: "", label: "Todos los municipios" },
    { value: "Cochabamba", label: "Cochabamba" },
    { value: "Sacaba", label: "Sacaba" },
    { value: "Quillacollo", label: "Quillacollo" },
    { value: "La Paz", label: "La Paz" },
    { value: "Santa Cruz", label: "Santa Cruz" }
  ];

  const filteredEntrepreneurships = entrepreneurships.filter(entrepreneurship => {
    const matchesSearch = entrepreneurship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneurship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || entrepreneurship.category === categoryFilter;
    const matchesMunicipality = !municipalityFilter || entrepreneurship.municipality === municipalityFilter;
    
    return matchesSearch && matchesCategory && matchesMunicipality;
  });

  const getBusinessStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'idea':
        return 'bg-blue-100 text-blue-800';
      case 'startup':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      case 'established':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'tecnologia': 'Tecnología',
      'ecommerce': 'E-commerce',
      'alimentacion': 'Alimentación',
      'educacion': 'Educación',
      'servicios': 'Servicios',
      'manufactura': 'Manufactura'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando emprendimientos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchAllEntrepreneurships}>Intentar nuevamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Directorio de Emprendimientos</h1>
        <p className="text-muted-foreground">
          Descubre emprendimientos increíbles en tu comunidad
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar emprendimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={municipalityFilter} onValueChange={setMunicipalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Municipio" />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality.value} value={municipality.value}>
                    {municipality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {filteredEntrepreneurships.length} emprendimiento{filteredEntrepreneurships.length !== 1 ? 's' : ''} encontrado{filteredEntrepreneurships.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Entrepreneurships grid */}
      {filteredEntrepreneurships.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron emprendimientos</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntrepreneurships.map((entrepreneurship) => (
            <Card key={entrepreneurship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{entrepreneurship.name}</CardTitle>
                    <Badge className={getBusinessStageColor(entrepreneurship.businessStage)}>
                      {entrepreneurship.businessStage}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {entrepreneurship.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    {getCategoryLabel(entrepreneurship.category)}
                  </div>
                  {entrepreneurship.municipality && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {entrepreneurship.municipality}
                    </div>
                  )}
                  {entrepreneurship.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {entrepreneurship.email}
                    </div>
                  )}
                  {entrepreneurship.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {entrepreneurship.phone}
                    </div>
                  )}
                  {entrepreneurship.founded && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Fundado en {new Date(entrepreneurship.founded).getFullYear()}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/entrepreneurship/${entrepreneurship.id}`)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
