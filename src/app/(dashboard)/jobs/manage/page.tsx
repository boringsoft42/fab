"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  Edit,
  Pause,
  Play,
  Archive,
  MoreHorizontal,
  Users,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { JobOffer, JobStatus } from "@/types/jobs";
import { useToast } from "@/components/ui/use-toast";

interface JobStats {
  total: number;
  active: number;
  paused: number;
  closed: number;
  draft: number;
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    active: 0,
    paused: 0,
    closed: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const fetchCompanyJobs = async () => {
    try {
      // In real app, this would filter by company ID
      const response = await fetch("/api/jobs");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);

        // Calculate stats
        const jobStats = data.jobs.reduce(
          (acc: JobStats, job: JobOffer) => ({
            total: acc.total + 1,
            active: acc.active + (job.status === "ACTIVE" ? 1 : 0),
            paused: acc.paused + (job.status === "PAUSED" ? 1 : 0),
            closed: acc.closed + (job.status === "CLOSED" ? 1 : 0),
            draft: acc.draft + (job.status === "DRAFT" ? 1 : 0),
          }),
          { total: 0, active: 0, paused: 0, closed: 0, draft: 0 }
        );

        setStats(jobStats);
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los empleos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, status: newStatus } : job
          )
        );

        toast({
          title: "Estado actualizado",
          description: `El empleo ha sido ${getStatusLabel(newStatus).toLowerCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del empleo",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateJob = async (job: JobOffer) => {
    try {
      const duplicatedJob = {
        ...job,
        title: `${job.title} (Copia)`,
        status: "DRAFT" as JobStatus,
        publishedAt: undefined,
        applicationCount: 0,
        viewCount: 0,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedJob),
      });

      if (response.ok) {
        const newJob = await response.json();
        setJobs((prev) => [newJob, ...prev]);

        toast({
          title: "Empleo duplicado",
          description: "Se ha creado una copia del empleo como borrador",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo duplicar el empleo",
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case "ACTIVE":
        return "Activo";
      case "PAUSED":
        return "Pausado";
      case "CLOSED":
        return "Cerrado";
      case "DRAFT":
        return "Borrador";
      default:
        return status;
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Empleos
          </h1>
          <p className="text-gray-600">
            Administra tus ofertas laborales y candidatos
          </p>
        </div>
        <Button onClick={() => router.push("/jobs/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Empleo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.paused}
            </div>
            <div className="text-sm text-gray-600">Pausados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.closed}
            </div>
            <div className="text-sm text-gray-600">Cerrados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.draft}
            </div>
            <div className="text-sm text-gray-600">Borradores</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Empleos</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título del Empleo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Aplicaciones</TableHead>
                  <TableHead>Vistas</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead>Cierre</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-600">
                          {job.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(job.status)} border-0`}
                      >
                        {getStatusLabel(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{job.applicationCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{job.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(job.publishedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.closingDate ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(job.closingDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin fecha</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/jobs/${job.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/jobs/${job.id}/edit`)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/jobs/${job.id}/candidates`)
                            }
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Ver candidatos ({job.applicationCount})
                          </DropdownMenuItem>

                          {job.status === "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "PAUSED")
                              }
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </DropdownMenuItem>
                          )}

                          {job.status === "PAUSED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "ACTIVE")
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Reactivar
                            </DropdownMenuItem>
                          )}

                          {(job.status === "ACTIVE" ||
                            job.status === "PAUSED") && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "CLOSED")
                              }
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Cerrar
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleDuplicateJob(job)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No has publicado ningún empleo
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza creando tu primera oferta laboral para atraer talento.
              </p>
              <Button onClick={() => router.push("/jobs/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Crear primer empleo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
