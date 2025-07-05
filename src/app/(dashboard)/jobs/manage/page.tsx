&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { JobOffer, JobStatus } from &ldquo;@/types/jobs&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;

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
      const response = await fetch(&ldquo;/api/jobs&rdquo;);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);

        // Calculate stats
        const jobStats = data.jobs.reduce(
          (acc: JobStats, job: JobOffer) => ({
            total: acc.total + 1,
            active: acc.active + (job.status === &ldquo;ACTIVE&rdquo; ? 1 : 0),
            paused: acc.paused + (job.status === &ldquo;PAUSED&rdquo; ? 1 : 0),
            closed: acc.closed + (job.status === &ldquo;CLOSED&rdquo; ? 1 : 0),
            draft: acc.draft + (job.status === &ldquo;DRAFT&rdquo; ? 1 : 0),
          }),
          { total: 0, active: 0, paused: 0, closed: 0, draft: 0 }
        );

        setStats(jobStats);
      }
    } catch (error) {
      console.error(&ldquo;Error fetching company jobs:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudieron cargar los empleos&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: &ldquo;PUT&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
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
          title: &ldquo;Estado actualizado&rdquo;,
          description: `El empleo ha sido ${getStatusLabel(newStatus).toLowerCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo actualizar el estado del empleo&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const handleDuplicateJob = async (job: JobOffer) => {
    try {
      const duplicatedJob = {
        ...job,
        title: `${job.title} (Copia)`,
        status: &ldquo;DRAFT&rdquo; as JobStatus,
        publishedAt: undefined,
        applicationCount: 0,
        viewCount: 0,
      };

      const response = await fetch(&ldquo;/api/jobs&rdquo;, {
        method: &ldquo;POST&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
        },
        body: JSON.stringify(duplicatedJob),
      });

      if (response.ok) {
        const newJob = await response.json();
        setJobs((prev) => [newJob, ...prev]);

        toast({
          title: &ldquo;Empleo duplicado&rdquo;,
          description: &ldquo;Se ha creado una copia del empleo como borrador&rdquo;,
        });
      }
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo duplicar el empleo&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case &ldquo;ACTIVE&rdquo;:
        return &ldquo;Activo&rdquo;;
      case &ldquo;PAUSED&rdquo;:
        return &ldquo;Pausado&rdquo;;
      case &ldquo;CLOSED&rdquo;:
        return &ldquo;Cerrado&rdquo;;
      case &ldquo;DRAFT&rdquo;:
        return &ldquo;Borrador&rdquo;;
      default:
        return status;
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case &ldquo;ACTIVE&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;PAUSED&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;CLOSED&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      case &ldquo;DRAFT&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      year: &ldquo;numeric&rdquo;,
      month: &ldquo;short&rdquo;,
      day: &ldquo;numeric&rdquo;,
    });
  };

  if (loading) {
    return (
      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
        <div className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex justify-between items-center&rdquo;>
            <Skeleton className=&ldquo;h-8 w-64&rdquo; />
            <Skeleton className=&ldquo;h-10 w-32&rdquo; />
          </div>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className=&ldquo;h-24&rdquo; />
            ))}
          </div>
          <Skeleton className=&ldquo;h-96&rdquo; />
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center mb-8&rdquo;>
        <div>
          <h1 className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>
            Gestión de Empleos
          </h1>
          <p className=&ldquo;text-gray-600&rdquo;>
            Administra tus ofertas laborales y candidatos
          </p>
        </div>
        <Button onClick={() => router.push(&ldquo;/jobs/create&rdquo;)}>
          <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
          Crear Empleo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>
              {stats.total}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
              {stats.active}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-yellow-600&rdquo;>
              {stats.paused}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Pausados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-red-600&rdquo;>
              {stats.closed}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Cerrados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-gray-600&rdquo;>
              {stats.draft}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Borradores</div>
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
                  <TableHead className=&ldquo;text-right&rdquo;>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className=&ldquo;font-medium&rdquo;>{job.title}</div>
                        <div className=&ldquo;text-sm text-gray-600&rdquo;>
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
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Users className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                        <span>{job.applicationCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Eye className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                        <span>{job.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Calendar className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                        <span className=&ldquo;text-sm&rdquo;>
                          {formatDate(job.publishedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.closingDate ? (
                        <div className=&ldquo;flex items-center space-x-1&rdquo;>
                          <Calendar className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                          <span className=&ldquo;text-sm&rdquo;>
                            {formatDate(job.closingDate)}
                          </span>
                        </div>
                      ) : (
                        <span className=&ldquo;text-sm text-gray-400&rdquo;>Sin fecha</span>
                      )}
                    </TableCell>
                    <TableCell className=&ldquo;text-right&rdquo;>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                            <MoreHorizontal className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align=&ldquo;end&rdquo;>
                          <DropdownMenuItem
                            onClick={() => router.push(`/jobs/${job.id}`)}
                          >
                            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/jobs/${job.id}/edit`)}
                          >
                            <Edit className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/jobs/${job.id}/candidates`)
                            }
                          >
                            <Users className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver candidatos ({job.applicationCount})
                          </DropdownMenuItem>

                          {job.status === &ldquo;ACTIVE&rdquo; && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, &ldquo;PAUSED&rdquo;)
                              }
                            >
                              <Pause className=&ldquo;w-4 h-4 mr-2&rdquo; />
                              Pausar
                            </DropdownMenuItem>
                          )}

                          {job.status === &ldquo;PAUSED&rdquo; && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, &ldquo;ACTIVE&rdquo;)
                              }
                            >
                              <Play className=&ldquo;w-4 h-4 mr-2&rdquo; />
                              Reactivar
                            </DropdownMenuItem>
                          )}

                          {(job.status === &ldquo;ACTIVE&rdquo; ||
                            job.status === &ldquo;PAUSED&rdquo;) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, &ldquo;CLOSED&rdquo;)
                              }
                            >
                              <Archive className=&ldquo;w-4 h-4 mr-2&rdquo; />
                              Cerrar
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleDuplicateJob(job)}
                          >
                            <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
            <div className=&ldquo;text-center py-12&rdquo;>
              <Briefcase className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold text-gray-900 mb-2&rdquo;>
                No has publicado ningún empleo
              </h3>
              <p className=&ldquo;text-gray-600 mb-6&rdquo;>
                Comienza creando tu primera oferta laboral para atraer talento.
              </p>
              <Button onClick={() => router.push(&ldquo;/jobs/create&rdquo;)}>
                <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
                Crear primer empleo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
