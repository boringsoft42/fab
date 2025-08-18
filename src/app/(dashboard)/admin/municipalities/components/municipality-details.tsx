"use client";

import { Municipality } from "@/types/municipality";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  User,
  Palette,
  Hash
} from "lucide-react";

interface MunicipalityDetailsProps {
  municipality: Municipality;
}

export function MunicipalityDetails({ municipality }: MunicipalityDetailsProps) {
  const getInstitutionTypeLabel = (type: string) => {
    switch (type) {
      case "MUNICIPALITY":
        return "Municipio";
      case "NGO":
        return "ONG";
      case "FOUNDATION":
        return "Fundación";
      case "OTHER":
        return "Otro";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: municipality.primaryColor || "#1E40AF" }}
        >
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{municipality.name}</h2>
          <p className="text-muted-foreground">
            {getInstitutionTypeLabel(municipality.institutionType)}
            {municipality.customType && ` - ${municipality.customType}`}
          </p>
        </div>
        <Badge variant={municipality.isActive ? "default" : "secondary"}>
          {municipality.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{municipality.department}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Región</label>
                <div className="mt-1">
                  <span>{municipality.region || "No especificada"}</span>
                </div>
              </div>
            </div>
            
            

            <div>
              <label className="text-sm font-medium text-muted-foreground">Dirección</label>
              <div className="mt-1">
                <span>{municipality.address || "No especificada"}</span>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Principal</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{municipality.email}</span>
              </div>
            </div>
            
            {municipality.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{municipality.phone}</span>
                </div>
              </div>
            )}
            
            {municipality.website && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sitio Web</label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={municipality.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {municipality.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credenciales y Colores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Credenciales y Colores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Usuario</label>
              <div className="mt-1">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {municipality.username}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Colores de la Institución</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: municipality.primaryColor || "#1E40AF" }}
                  />
                  <span className="text-sm">Primario: {municipality.primaryColor || "#1E40AF"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: municipality.secondaryColor || "#F59E0B" }}
                  />
                  <span className="text-sm">Secundario: {municipality.secondaryColor || "#F59E0B"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Creado</label>
              <div className="mt-1">
                <span>{formatDate(municipality.createdAt)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
              <div className="mt-1">
                <span>{formatDate(municipality.updatedAt)}</span>
              </div>
            </div>
            {municipality.creator && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Creado por</label>
                <div className="mt-1">
                  <span>{municipality.creator.username} ({municipality.creator.role})</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 