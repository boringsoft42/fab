"use client";

import {
  Building,
  Mail,
  Globe,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCompanyInterests } from "@/hooks/use-youth-applications";
import { CompanyInterest } from "@/services/youth-application.service";

interface CompanyInterestsListProps {
  applicationId: string;
}

export default function CompanyInterestsList({
  applicationId,
}: CompanyInterestsListProps) {
  const {
    data: interests,
    isLoading,
    error,
  } = useCompanyInterests(applicationId);

  const getStatusConfig = (status: string) => {
    const configs = {
      INTERESTED: {
        label: "Interesado",
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
      },
      CONTACTED: {
        label: "Contactado",
        color: "bg-yellow-100 text-yellow-800",
        icon: Mail,
      },
      INTERVIEW_SCHEDULED: {
        label: "Entrevista Programada",
        color: "bg-purple-100 text-purple-800",
        icon: Calendar,
      },
      HIRED: {
        label: "Contratado",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      NOT_INTERESTED: {
        label: "No Interesado",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    return configs[status as keyof typeof configs] || configs.INTERESTED;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intereses de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando intereses...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intereses de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">
              Error al cargar los intereses
            </p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!interests || interests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intereses de Empresas</CardTitle>
          <CardDescription>
            Empresas que han expresado interés en tu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay intereses aún</h3>
            <p className="text-muted-foreground">
              Cuando las empresas vean tu postulación y expresen interés,
              aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Intereses de Empresas ({interests.length})
        </CardTitle>
        <CardDescription>
          Empresas que han expresado interés en tu perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interests.map((interest) => {
            const statusConfig = getStatusConfig(interest.status);
            const StatusIcon = statusConfig.icon;
            const company = interest.company;

            return (
              <div
                key={interest.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={company?.logo} />
                      <AvatarFallback>
                        {company?.name ? getInitials(company.name) : "EM"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-semibold">
                        {company?.name || "Empresa"}
                      </h4>
                      {company?.businessSector && (
                        <p className="text-sm text-muted-foreground">
                          {company.businessSector}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {interest.message && (
                  <div className="mb-3">
                    <p className="text-sm bg-muted p-3 rounded-md">
                      "{interest.message}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {company?.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{company.email}</span>
                      </div>
                    )}

                    {company?.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Sitio web
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(interest.createdAt)}</span>
                  </div>
                </div>

                {interest.status === "INTERESTED" && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Responder
                      </Button>
                      <Button size="sm" variant="outline">
                        Ver perfil empresa
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
