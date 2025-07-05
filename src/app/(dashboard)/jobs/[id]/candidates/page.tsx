&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams, useRouter } from &ldquo;next/navigation&rdquo;;
import {
  ArrowLeft,
  Download,
  Star,
  MessageCircle,
  Calendar,
  Filter,
  Eye,
  Check,
  X,
  UserPlus,
} from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { JobApplication, ApplicationStatus, JobOffer } from &ldquo;@/types/jobs&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;

interface ApplicationStats {
  sent: number;
  underReview: number;
  preSelected: number;
  rejected: number;
  hired: number;
}

export default function CandidatesPage() {
  const { toast } = useToast();

  const jobId = params.id as string;

  const [job, setJob] = useState<JobOffer | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [stats, setStats] = useState<ApplicationStats>({
    sent: 0,
    underReview: 0,
    preSelected: 0,
    rejected: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | &ldquo;ALL&rdquo;>(
    &ldquo;ALL&rdquo;
  );
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [updateNotes, setUpdateNotes] = useState(&ldquo;&rdquo;);
  const [updateRating, setUpdateRating] = useState(0);

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter]);

  const fetchJobAndApplications = async () => {
    try {
      // Fetch job details
      const jobResponse = await fetch(`/api/jobs/${jobId}`);
      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        setJob(jobData);
      }

      // Fetch applications
      const applicationsResponse = await fetch(
        `/api/jobs/${jobId}/applications`
      );
      if (applicationsResponse.ok) {
        const data = await applicationsResponse.json();
        setApplications(data.applications || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error(&ldquo;Error fetching data:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudieron cargar los datos&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (statusFilter !== &ldquo;ALL&rdquo;) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Sort by application date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    rating?: number
  ) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/applications`, {
        method: &ldquo;PUT&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
          notes,
          rating,
        }),
      });

      if (response.ok) {
        const updatedApplication = await response.json();

        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? updatedApplication : app
          )
        );

        toast({
          title: &ldquo;Estado actualizado&rdquo;,
          description: `La aplicación ha sido ${getStatusLabel(newStatus).toLowerCase()}`,
        });

        return true;
      }
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo actualizar el estado&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
    return false;
  };

  const handleQuickAction = async (
    applicationId: string,
    action: ApplicationStatus
  ) => {
    await updateApplicationStatus(applicationId, action);
  };

  const handleDetailedUpdate = async () => {
    if (!selectedApplication) return;

    const success = await updateApplicationStatus(
      selectedApplication.id,
      selectedApplication.status,
      updateNotes,
      updateRating
    );

    if (success) {
      setSelectedApplication(null);
      setUpdateNotes(&ldquo;&rdquo;);
      setUpdateRating(0);
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case &ldquo;SENT&rdquo;:
        return &ldquo;Enviada&rdquo;;
      case &ldquo;UNDER_REVIEW&rdquo;:
        return &ldquo;En revisión&rdquo;;
      case &ldquo;PRE_SELECTED&rdquo;:
        return &ldquo;Preseleccionado&rdquo;;
      case &ldquo;REJECTED&rdquo;:
        return &ldquo;Rechazada&rdquo;;
      case &ldquo;HIRED&rdquo;:
        return &ldquo;Contratado&rdquo;;
      default:
        return status;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case &ldquo;SENT&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;UNDER_REVIEW&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      case &ldquo;PRE_SELECTED&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;REJECTED&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      case &ldquo;HIRED&rdquo;:
        return &ldquo;bg-purple-100 text-purple-800&rdquo;;
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

  const renderStarRating = (
    rating: number,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className=&ldquo;flex space-x-1&rdquo;>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 cursor-pointer ${
              star <= rating
                ? &ldquo;text-yellow-400 fill-yellow-400&rdquo;
                : &ldquo;text-gray-300&rdquo;
            }`}
            onClick={() => onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
        <div className=&ldquo;space-y-6&rdquo;>
          <Skeleton className=&ldquo;h-8 w-64&rdquo; />
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

  if (!job) {
    return (
      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center&rdquo;>
        <h1 className=&ldquo;text-2xl font-bold text-gray-900 mb-4&rdquo;>
          Empleo no encontrado
        </h1>
        <Button onClick={() => router.push(&ldquo;/jobs/manage&rdquo;)}>
          Volver a mis empleos
        </Button>
      </div>
    );
  }

  return (
    <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
        <div className=&ldquo;flex items-center space-x-4&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; onClick={() => router.push(&ldquo;/jobs/manage&rdquo;)}>
            <ArrowLeft className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Volver a empleos
          </Button>
          <div>
            <h1 className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>{job.title}</h1>
            <p className=&ldquo;text-gray-600&rdquo;>Gestión de candidatos</p>
          </div>
        </div>
        <div className=&ldquo;flex items-center space-x-2&rdquo;>
          <Button
            variant=&ldquo;outline&rdquo;
            onClick={() => router.push(`/jobs/${jobId}`)}
          >
            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Ver oferta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-5 gap-4 mb-8&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>
              {applications.length}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Total aplicaciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>{stats.sent}</div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Nuevas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-orange-600&rdquo;>
              {stats.underReview}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>En revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
              {stats.preSelected}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Preseleccionados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-purple-600&rdquo;>
              {stats.hired}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Contratados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardContent className=&ldquo;p-4&rdquo;>
          <div className=&ldquo;flex items-center space-x-4&rdquo;>
            <Filter className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ApplicationStatus | &ldquo;ALL&rdquo;)
              }
            >
              <SelectTrigger className=&ldquo;w-48&rdquo;>
                <SelectValue placeholder=&ldquo;Filtrar por estado&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;ALL&rdquo;>Todos los estados</SelectItem>
                <SelectItem value=&ldquo;SENT&rdquo;>Nuevas</SelectItem>
                <SelectItem value=&ldquo;UNDER_REVIEW&rdquo;>En revisión</SelectItem>
                <SelectItem value=&ldquo;PRE_SELECTED&rdquo;>Preseleccionados</SelectItem>
                <SelectItem value=&ldquo;REJECTED&rdquo;>Rechazadas</SelectItem>
                <SelectItem value=&ldquo;HIRED&rdquo;>Contratados</SelectItem>
              </SelectContent>
            </Select>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>
              Mostrando {filteredApplications.length} de {applications.length}{&ldquo; &rdquo;}
              aplicaciones
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Valoración</TableHead>
                  <TableHead>Aplicado</TableHead>
                  <TableHead>CV</TableHead>
                  <TableHead className=&ldquo;text-right&rdquo;>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className=&ldquo;flex items-center space-x-3&rdquo;>
                        <Avatar className=&ldquo;w-10 h-10&rdquo;>
                          <AvatarFallback>
                            {application.applicantName
                              .split(&ldquo; &rdquo;)
                              .map((n) => n[0])
                              .join(&ldquo;&rdquo;)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className=&ldquo;font-medium&rdquo;>
                            {application.applicantName}
                          </div>
                          <div className=&ldquo;text-sm text-gray-600&rdquo;>
                            {application.applicantEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(application.status)} border-0`}
                      >
                        {getStatusLabel(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.rating ? (
                        renderStarRating(application.rating)
                      ) : (
                        <span className=&ldquo;text-gray-400 text-sm&rdquo;>
                          Sin valorar
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Calendar className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                        <span className=&ldquo;text-sm&rdquo;>
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {application.cvUrl && (
                        <Button
                          variant=&ldquo;outline&rdquo;
                          size=&ldquo;sm&rdquo;
                          onClick={() =>
                            window.open(application.cvUrl, &ldquo;_blank&rdquo;)
                          }
                        >
                          <Download className=&ldquo;w-4 h-4 mr-1&rdquo; />
                          CV
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className=&ldquo;text-right&rdquo;>
                      <div className=&ldquo;flex items-center justify-end space-x-1&rdquo;>
                        {application.status === &ldquo;SENT&rdquo; && (
                          <Button
                            size=&ldquo;sm&rdquo;
                            variant=&ldquo;outline&rdquo;
                            onClick={() =>
                              handleQuickAction(application.id, &ldquo;UNDER_REVIEW&rdquo;)
                            }
                          >
                            <Eye className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        )}

                        {(application.status === &ldquo;SENT&rdquo; ||
                          application.status === &ldquo;UNDER_REVIEW&rdquo;) && (
                          <Button
                            size=&ldquo;sm&rdquo;
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-green-600 border-green-300 hover:bg-green-50&rdquo;
                            onClick={() =>
                              handleQuickAction(application.id, &ldquo;PRE_SELECTED&rdquo;)
                            }
                          >
                            <Check className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        )}

                        {application.status === &ldquo;PRE_SELECTED&rdquo; && (
                          <Button
                            size=&ldquo;sm&rdquo;
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-purple-600 border-purple-300 hover:bg-purple-50&rdquo;
                            onClick={() =>
                              handleQuickAction(application.id, &ldquo;HIRED&rdquo;)
                            }
                          >
                            <UserPlus className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        )}

                        {(application.status === &ldquo;SENT&rdquo; ||
                          application.status === &ldquo;UNDER_REVIEW&rdquo;) && (
                          <Button
                            size=&ldquo;sm&rdquo;
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-red-600 border-red-300 hover:bg-red-50&rdquo;
                            onClick={() =>
                              handleQuickAction(application.id, &ldquo;REJECTED&rdquo;)
                            }
                          >
                            <X className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size=&ldquo;sm&rdquo;
                              variant=&ldquo;outline&rdquo;
                              onClick={() => {
                                setSelectedApplication(application);
                                setUpdateNotes(application.notes || &ldquo;&rdquo;);
                                setUpdateRating(application.rating || 0);
                              }}
                            >
                              Ver detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className=&ldquo;max-w-2xl max-h-[90vh] overflow-y-auto&rdquo;>
                            <DialogHeader>
                              <DialogTitle>Detalle de Candidato</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className=&ldquo;space-y-6&rdquo;>
                                {/* Candidate Info */}
                                <div className=&ldquo;flex items-center space-x-4&rdquo;>
                                  <Avatar className=&ldquo;w-16 h-16&rdquo;>
                                    <AvatarFallback className=&ldquo;text-lg&rdquo;>
                                      {selectedApplication.applicantName
                                        .split(&ldquo; &rdquo;)
                                        .map((n) => n[0])
                                        .join(&ldquo;&rdquo;)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                                      {selectedApplication.applicantName}
                                    </h3>
                                    <p className=&ldquo;text-gray-600&rdquo;>
                                      {selectedApplication.applicantEmail}
                                    </p>
                                    <p className=&ldquo;text-sm text-gray-500&rdquo;>
                                      Aplicó el{&ldquo; &rdquo;}
                                      {formatDate(
                                        selectedApplication.appliedAt
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Cover Letter */}
                                {selectedApplication.coverLetter && (
                                  <div>
                                    <Label className=&ldquo;text-base font-medium&rdquo;>
                                      Carta de presentación
                                    </Label>
                                    <div className=&ldquo;mt-2 p-4 bg-gray-50 rounded-lg&rdquo;>
                                      <p className=&ldquo;text-sm whitespace-pre-wrap&rdquo;>
                                        {selectedApplication.coverLetter}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Answers */}
                                {selectedApplication.answers &&
                                  selectedApplication.answers.length > 0 && (
                                    <div>
                                      <Label className=&ldquo;text-base font-medium&rdquo;>
                                        Respuestas a preguntas
                                      </Label>
                                      <div className=&ldquo;mt-2 space-y-3&rdquo;>
                                        {selectedApplication.answers.map(
                                          (answer, i) => (
                                            <div
                                              key={i}
                                              className=&ldquo;p-3 border rounded-lg&rdquo;
                                            >
                                              <p className=&ldquo;font-medium text-sm mb-1&rdquo;>
                                                {answer.question}
                                              </p>
                                              <p className=&ldquo;text-sm text-gray-700&rdquo;>
                                                {answer.answer}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Rating */}
                                <div>
                                  <Label className=&ldquo;text-base font-medium&rdquo;>
                                    Valoración
                                  </Label>
                                  <div className=&ldquo;mt-2&rdquo;>
                                    {renderStarRating(
                                      updateRating,
                                      setUpdateRating
                                    )}
                                  </div>
                                </div>

                                {/* Notes */}
                                <div>
                                  <Label
                                    htmlFor=&ldquo;notes&rdquo;
                                    className=&ldquo;text-base font-medium&rdquo;
                                  >
                                    Notas internas
                                  </Label>
                                  <Textarea
                                    id=&ldquo;notes&rdquo;
                                    placeholder=&ldquo;Agrega comentarios sobre este candidato...&rdquo;
                                    value={updateNotes}
                                    onChange={(e) =>
                                      setUpdateNotes(e.target.value)
                                    }
                                    className=&ldquo;mt-2&rdquo;
                                  />
                                </div>

                                {/* Status Update */}
                                <div>
                                  <Label className=&ldquo;text-base font-medium&rdquo;>
                                    Estado de la aplicación
                                  </Label>
                                  <Select
                                    value={selectedApplication.status}
                                    onValueChange={(value) =>
                                      setSelectedApplication((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              status:
                                                value as ApplicationStatus,
                                            }
                                          : null
                                      )
                                    }
                                  >
                                    <SelectTrigger className=&ldquo;mt-2&rdquo;>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value=&ldquo;SENT&rdquo;>
                                        Enviada
                                      </SelectItem>
                                      <SelectItem value=&ldquo;UNDER_REVIEW&rdquo;>
                                        En revisión
                                      </SelectItem>
                                      <SelectItem value=&ldquo;PRE_SELECTED&rdquo;>
                                        Preseleccionado
                                      </SelectItem>
                                      <SelectItem value=&ldquo;REJECTED&rdquo;>
                                        Rechazada
                                      </SelectItem>
                                      <SelectItem value=&ldquo;HIRED&rdquo;>
                                        Contratado
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Actions */}
                                <div className=&ldquo;flex justify-end space-x-2 pt-4 border-t&rdquo;>
                                  <Button
                                    variant=&ldquo;outline&rdquo;
                                    onClick={() => setSelectedApplication(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleDetailedUpdate}>
                                    Guardar cambios
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className=&ldquo;text-center py-12&rdquo;>
              <Users className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold text-gray-900 mb-2&rdquo;>
                {applications.length === 0
                  ? &ldquo;No hay aplicaciones&rdquo;
                  : &ldquo;No hay aplicaciones con este filtro&rdquo;}
              </h3>
              <p className=&ldquo;text-gray-600&rdquo;>
                {applications.length === 0
                  ? &ldquo;Aún no has recibido aplicaciones para este empleo.&rdquo;
                  : &ldquo;Intenta cambiar los filtros para ver más resultados.&rdquo;}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
