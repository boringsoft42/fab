"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePublicApplications } from "@/hooks/use-youth-applications";
import { YouthApplication } from "@/services/youth-application.service";

export default function CompanyYouthApplicationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState<string>("all");

  const { data: applications, isLoading, error } = usePublicApplications();

  const filteredApplications =
    applications?.filter((app) => {
      const matchesSearch =
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.youthProfile?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.youthProfile?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.youthProfile?.skills?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesEducation =
        educationFilter === "all" ||
        app.youthProfile?.educationLevel === educationFilter;

      return matchesSearch && matchesStatus && matchesEducation;
    }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: "Activa", color: "bg-green-100 text-green-800" },
      PAUSED: { label: "Pausada", color: "bg-yellow-100 text-yellow-800" },
      CLOSED: { label: "Cerrada", color: "bg-red-100 text-red-800" },
      HIRED: { label: "Contratado", color: "bg-blue-100 text-blue-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando postulaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Error al cargar las postulaciones
            </p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Postulaciones de Jóvenes
          </h1>
          <p className="text-muted-foreground">
            Explora y conecta con jóvenes talentosos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Postulaciones
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.filter((app) => app.status === "ACTIVE").length ||
                0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Universitarios
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.filter(
                (app) => app.youthProfile?.educationLevel === "UNIVERSITY"
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Con Experiencia
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.filter(
                (app) =>
                  app.youthProfile?.workExperience &&
                  app.youthProfile.workExperience.length > 0
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, habilidades o título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activas</SelectItem>
                <SelectItem value="PAUSED">Pausadas</SelectItem>
                <SelectItem value="CLOSED">Cerradas</SelectItem>
                <SelectItem value="HIRED">Contratado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={educationFilter} onValueChange={setEducationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="HIGH_SCHOOL">Bachiller</SelectItem>
                <SelectItem value="UNIVERSITY">Universitario</SelectItem>
                <SelectItem value="GRADUATE">Graduado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron postulaciones
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ||
                statusFilter !== "all" ||
                educationFilter !== "all"
                  ? "No hay postulaciones que coincidan con los filtros aplicados"
                  : "No hay postulaciones públicas disponibles en este momento"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <YouthApplicationCard
              key={application.id}
              application={application}
              onView={() =>
                router.push(`/company/youth-applications/${application.id}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

interface YouthApplicationCardProps {
  application: YouthApplication;
  onView: () => void;
}

function YouthApplicationCard({
  application,
  onView,
}: YouthApplicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: "Activa", color: "bg-green-100 text-green-800" },
      PAUSED: { label: "Pausada", color: "bg-yellow-100 text-yellow-800" },
      CLOSED: { label: "Cerrada", color: "bg-red-100 text-red-800" },
      HIRED: { label: "Contratado", color: "bg-blue-100 text-blue-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const youthProfile = application.youthProfile;

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={youthProfile?.avatarUrl} />
              <AvatarFallback>
                {youthProfile
                  ? getInitials(youthProfile.firstName, youthProfile.lastName)
                  : "JD"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">
                  {youthProfile
                    ? `${youthProfile.firstName} ${youthProfile.lastName}`
                    : "Joven Desarrollador"}
                </h3>
                {getStatusBadge(application.status)}
              </div>

              <h4 className="text-md font-medium text-primary mb-2">
                {application.title}
              </h4>

              <p className="text-muted-foreground line-clamp-2 mb-3">
                {application.description}
              </p>

              {/* Skills */}
              {youthProfile?.skills && youthProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {youthProfile.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {youthProfile.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{youthProfile.skills.length - 5} más
                    </Badge>
                  )}
                </div>
              )}

              {/* Education & Location */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {youthProfile?.educationLevel && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      {youthProfile.educationLevel === "UNIVERSITY"
                        ? "Universitario"
                        : youthProfile.educationLevel === "HIGH_SCHOOL"
                          ? "Bachiller"
                          : youthProfile.educationLevel === "GRADUATE"
                            ? "Graduado"
                            : youthProfile.educationLevel}
                    </span>
                  </div>
                )}

                {youthProfile?.workExperience &&
                  youthProfile.workExperience.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {youthProfile.workExperience.length} experiencia(s)
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{application.viewsCount} vistas</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{application.applicationsCount} intereses</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Publicada {formatDate(application.createdAt)}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Ver perfil completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
