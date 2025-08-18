"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Building2,
  Edit,
  Share2,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import { useEntrepreneurship } from "@/hooks/useEntrepreneurshipApi";
import { useAuthContext } from "@/hooks/use-auth";

export default function EntrepreneurshipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { entrepreneurship, loading, error, fetchEntrepreneurship } = useEntrepreneurship(params.id);

  useEffect(() => {
    if (params.id) {
      fetchEntrepreneurship();
    }
  }, [params.id, fetchEntrepreneurship]);

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
          <span className="ml-2">Cargando emprendimiento...</span>
        </div>
      </div>
    );
  }

  if (error || !entrepreneurship) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Emprendimiento no encontrado'}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === entrepreneurship.owner?.id;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{entrepreneurship.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getBusinessStageColor(entrepreneurship.businessStage)}>
                {entrepreneurship.businessStage}
              </Badge>
              <Badge variant="outline">
                {getCategoryLabel(entrepreneurship.category)}
              </Badge>
              {entrepreneurship.subcategory && (
                <Badge variant="secondary">
                  {entrepreneurship.subcategory}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isOwner && (
              <Button
                variant="outline"
                onClick={() => router.push(`/entrepreneurship/${entrepreneurship.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {entrepreneurship.description}
              </p>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {entrepreneurship.businessModel && (
                <div>
                  <h4 className="font-semibold mb-2">Modelo de Negocio</h4>
                  <p className="text-muted-foreground">{entrepreneurship.businessModel}</p>
                </div>
              )}
              {entrepreneurship.targetMarket && (
                <div>
                  <h4 className="font-semibold mb-2">Mercado Objetivo</h4>
                  <p className="text-muted-foreground">{entrepreneurship.targetMarket}</p>
                </div>
              )}
              {entrepreneurship.employees && (
                <div>
                  <h4 className="font-semibold mb-2">Empleados</h4>
                  <p className="text-muted-foreground">{entrepreneurship.employees} empleados</p>
                </div>
              )}
              {entrepreneurship.annualRevenue && (
                <div>
                  <h4 className="font-semibold mb-2">Ingresos Anuales</h4>
                  <p className="text-muted-foreground">Bs. {entrepreneurship.annualRevenue.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entrepreneurship.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${entrepreneurship.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entrepreneurship.email}
                  </a>
                </div>
              )}
              {entrepreneurship.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${entrepreneurship.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entrepreneurship.phone}
                  </a>
                </div>
              )}
              {entrepreneurship.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={entrepreneurship.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visitar sitio web
                  </a>
                </div>
              )}
              {entrepreneurship.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{entrepreneurship.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {entrepreneurship.municipality && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{entrepreneurship.municipality}</span>
                </div>
              )}
              {entrepreneurship.department && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{entrepreneurship.department}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media */}
          {entrepreneurship.socialMedia && Object.values(entrepreneurship.socialMedia).some(value => value) && (
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {entrepreneurship.socialMedia.facebook && (
                  <a 
                    href={`https://facebook.com/${entrepreneurship.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </a>
                )}
                {entrepreneurship.socialMedia.instagram && (
                  <a 
                    href={`https://instagram.com/${entrepreneurship.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 hover:underline"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {entrepreneurship.socialMedia.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${entrepreneurship.socialMedia.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {entrepreneurship.founded && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Fundado en {new Date(entrepreneurship.founded).getFullYear()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{entrepreneurship.viewsCount || 0} visualizaciones</span>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          {entrepreneurship.owner && (
            <Card>
              <CardHeader>
                <CardTitle>Propietario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {entrepreneurship.owner.firstName?.[0]}{entrepreneurship.owner.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {entrepreneurship.owner.firstName} {entrepreneurship.owner.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entrepreneurship.owner.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
