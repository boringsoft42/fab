"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, MapPin, Building2, Users, TrendingUp, Image as ImageIcon } from "lucide-react";
import { Entrepreneurship } from "@/types/profile";

interface EntrepreneurshipCarouselProps {
  entrepreneurships: Entrepreneurship[];
  loading: boolean;
  error: Error | null;
}

export function EntrepreneurshipCarousel({ entrepreneurships, loading, error }: EntrepreneurshipCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEntrepreneurship, setSelectedEntrepreneurship] = useState<Entrepreneurship | null>(null);
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(entrepreneurships.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentItems = entrepreneurships.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const getBusinessStageColor = (stage: string) => {
    switch (stage) {
      case 'IDEA':
        return 'bg-blue-100 text-blue-800';
      case 'STARTUP':
        return 'bg-green-100 text-green-800';
      case 'GROWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ESTABLISHED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBusinessStageLabel = (stage: string) => {
    switch (stage) {
      case 'IDEA':
        return 'Idea';
      case 'STARTUP':
        return 'Startup';
      case 'GROWING':
        return 'En Crecimiento';
      case 'ESTABLISHED':
        return 'Establecida';
      default:
        return stage;
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

  const handleViewDetails = (entrepreneurship: Entrepreneurship) => {
    setSelectedEntrepreneurship(entrepreneurship);
    setImageCarouselIndex(0);
  };

  const nextImage = () => {
    if (selectedEntrepreneurship?.images) {
      setImageCarouselIndex((prev) => (prev + 1) % selectedEntrepreneurship.images.length);
    }
  };

  const prevImage = () => {
    if (selectedEntrepreneurship?.images) {
      setImageCarouselIndex((prev) => 
        prev === 0 ? selectedEntrepreneurship.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando emprendimientos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar emprendimientos: {error.message}</p>
      </div>
    );
  }

  if (entrepreneurships.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay emprendimientos públicos disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevPage}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextPage}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Entrepreneurship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((entrepreneurship) => (
          <Card
            key={entrepreneurship.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <Badge className={getBusinessStageColor(entrepreneurship.businessStage)}>
                  {getBusinessStageLabel(entrepreneurship.businessStage)}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {entrepreneurship.name}
              </CardTitle>
              <CardDescription className="text-gray-600 line-clamp-3">
                {entrepreneurship.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Categoría</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getCategoryLabel(entrepreneurship.category)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Ubicación</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {entrepreneurship.municipality}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fundado</p>
                    <p className="text-lg font-semibold text-green-600">
                      {entrepreneurship.founded ? new Date(entrepreneurship.founded).getFullYear() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Vistas</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {entrepreneurship.viewsCount}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full group-hover:bg-blue-600 transition-colors"
                onClick={() => handleViewDetails(entrepreneurship)}
              >
                Ver Detalles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedEntrepreneurship} onOpenChange={() => setSelectedEntrepreneurship(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEntrepreneurship && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEntrepreneurship.name}</DialogTitle>
                <DialogDescription className="text-lg">
                  {selectedEntrepreneurship.description}
                </DialogDescription>
              </DialogHeader>

              {/* Image Carousel */}
              {selectedEntrepreneurship.images && selectedEntrepreneurship.images.length > 0 ? (
                <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-100">
                  <div className="aspect-video relative">
                    <img
                      src={selectedEntrepreneurship.images[imageCarouselIndex]}
                      alt={`${selectedEntrepreneurship.name} - Imagen ${imageCarouselIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {selectedEntrepreneurship.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {selectedEntrepreneurship.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full ${
                                index === imageCarouselIndex
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Sin imágenes</p>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información General</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Categoría:</span>
                        <span className="ml-2">{getCategoryLabel(selectedEntrepreneurship.category)}</span>
                      </div>
                      {selectedEntrepreneurship.subcategory && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium">Subcategoría:</span>
                          <span className="ml-2">{selectedEntrepreneurship.subcategory}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Etapa:</span>
                        <Badge className={`ml-2 ${getBusinessStageColor(selectedEntrepreneurship.businessStage)}`}>
                          {getBusinessStageLabel(selectedEntrepreneurship.businessStage)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Municipio:</span>
                        <span className="ml-2">{selectedEntrepreneurship.municipality}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Departamento:</span>
                        <span className="ml-2">{selectedEntrepreneurship.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estadísticas</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Fundado:</span>
                        <span className="ml-2">
                          {selectedEntrepreneurship.founded 
                            ? new Date(selectedEntrepreneurship.founded).getFullYear()
                            : 'N/A'
                          }
                        </span>
                      </div>
                      {selectedEntrepreneurship.employees && (
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Empleados:</span>
                          <span className="ml-2">{selectedEntrepreneurship.employees}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Vistas:</span>
                        <span className="ml-2">{selectedEntrepreneurship.viewsCount}</span>
                      </div>
                    </div>
                  </div>

                  {selectedEntrepreneurship.businessModel && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Modelo de Negocio</h3>
                      <p className="text-sm text-gray-600">{selectedEntrepreneurship.businessModel}</p>
                    </div>
                  )}

                  {selectedEntrepreneurship.targetMarket && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mercado Objetivo</h3>
                      <p className="text-sm text-gray-600">{selectedEntrepreneurship.targetMarket}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(selectedEntrepreneurship.email || selectedEntrepreneurship.phone || selectedEntrepreneurship.website) && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedEntrepreneurship.email && (
                      <div className="text-sm">
                        <span className="font-medium">Email:</span>
                        <p className="text-blue-600">{selectedEntrepreneurship.email}</p>
                      </div>
                    )}
                    {selectedEntrepreneurship.phone && (
                      <div className="text-sm">
                        <span className="font-medium">Teléfono:</span>
                        <p className="text-gray-600">{selectedEntrepreneurship.phone}</p>
                      </div>
                    )}
                    {selectedEntrepreneurship.website && (
                      <div className="text-sm">
                        <span className="font-medium">Sitio Web:</span>
                        <a 
                          href={selectedEntrepreneurship.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline block"
                        >
                          {selectedEntrepreneurship.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
