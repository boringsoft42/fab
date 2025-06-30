"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { JobApplication, ApplicationStatus, JobOffer } from "@/types/jobs";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationStats {
  sent: number;
  underReview: number;
  preSelected: number;
  rejected: number;
  hired: number;
}

export default function CandidatesPage() {
  const params = useParams();
  const router = useRouter();
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
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL"
  );
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [updateNotes, setUpdateNotes] = useState("");
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
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (statusFilter !== "ALL") {
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
          title: "Estado actualizado",
          description: `La aplicación ha sido ${getStatusLabel(newStatus).toLowerCase()}`,
        });

        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
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
      setUpdateNotes("");
      setUpdateRating(0);
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case "SENT":
        return "Enviada";
      case "UNDER_REVIEW":
        return "En revisión";
      case "PRE_SELECTED":
        return "Preseleccionado";
      case "REJECTED":
        return "Rechazada";
      case "HIRED":
        return "Contratado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-orange-100 text-orange-800";
      case "PRE_SELECTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "HIRED":
        return "bg-purple-100 text-purple-800";
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

  const renderStarRating = (
    rating: number,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 cursor-pointer ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
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

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Empleo no encontrado
        </h1>
        <Button onClick={() => router.push("/jobs/manage")}>
          Volver a mis empleos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/jobs/manage")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a empleos
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">Gestión de candidatos</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/jobs/${jobId}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver oferta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Total aplicaciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-600">Nuevas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.underReview}
            </div>
            <div className="text-sm text-gray-600">En revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.preSelected}
            </div>
            <div className="text-sm text-gray-600">Preseleccionados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.hired}
            </div>
            <div className="text-sm text-gray-600">Contratados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ApplicationStatus | "ALL")
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="SENT">Nuevas</SelectItem>
                <SelectItem value="UNDER_REVIEW">En revisión</SelectItem>
                <SelectItem value="PRE_SELECTED">Preseleccionados</SelectItem>
                <SelectItem value="REJECTED">Rechazadas</SelectItem>
                <SelectItem value="HIRED">Contratados</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Mostrando {filteredApplications.length} de {applications.length}{" "}
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
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {application.applicantName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {application.applicantName}
                          </div>
                          <div className="text-sm text-gray-600">
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
                        <span className="text-gray-400 text-sm">
                          Sin valorar
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {application.cvUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(application.cvUrl, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-1" />
                          CV
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {application.status === "SENT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuickAction(application.id, "UNDER_REVIEW")
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}

                        {(application.status === "SENT" ||
                          application.status === "UNDER_REVIEW") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() =>
                              handleQuickAction(application.id, "PRE_SELECTED")
                            }
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}

                        {application.status === "PRE_SELECTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-purple-600 border-purple-300 hover:bg-purple-50"
                            onClick={() =>
                              handleQuickAction(application.id, "HIRED")
                            }
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}

                        {(application.status === "SENT" ||
                          application.status === "UNDER_REVIEW") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() =>
                              handleQuickAction(application.id, "REJECTED")
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(application);
                                setUpdateNotes(application.notes || "");
                                setUpdateRating(application.rating || 0);
                              }}
                            >
                              Ver detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalle de Candidato</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                {/* Candidate Info */}
                                <div className="flex items-center space-x-4">
                                  <Avatar className="w-16 h-16">
                                    <AvatarFallback className="text-lg">
                                      {selectedApplication.applicantName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {selectedApplication.applicantName}
                                    </h3>
                                    <p className="text-gray-600">
                                      {selectedApplication.applicantEmail}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Aplicó el{" "}
                                      {formatDate(
                                        selectedApplication.appliedAt
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Cover Letter */}
                                {selectedApplication.coverLetter && (
                                  <div>
                                    <Label className="text-base font-medium">
                                      Carta de presentación
                                    </Label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">
                                        {selectedApplication.coverLetter}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Answers */}
                                {selectedApplication.answers &&
                                  selectedApplication.answers.length > 0 && (
                                    <div>
                                      <Label className="text-base font-medium">
                                        Respuestas a preguntas
                                      </Label>
                                      <div className="mt-2 space-y-3">
                                        {selectedApplication.answers.map(
                                          (answer, i) => (
                                            <div
                                              key={i}
                                              className="p-3 border rounded-lg"
                                            >
                                              <p className="font-medium text-sm mb-1">
                                                {answer.question}
                                              </p>
                                              <p className="text-sm text-gray-700">
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
                                  <Label className="text-base font-medium">
                                    Valoración
                                  </Label>
                                  <div className="mt-2">
                                    {renderStarRating(
                                      updateRating,
                                      setUpdateRating
                                    )}
                                  </div>
                                </div>

                                {/* Notes */}
                                <div>
                                  <Label
                                    htmlFor="notes"
                                    className="text-base font-medium"
                                  >
                                    Notas internas
                                  </Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Agrega comentarios sobre este candidato..."
                                    value={updateNotes}
                                    onChange={(e) =>
                                      setUpdateNotes(e.target.value)
                                    }
                                    className="mt-2"
                                  />
                                </div>

                                {/* Status Update */}
                                <div>
                                  <Label className="text-base font-medium">
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
                                    <SelectTrigger className="mt-2">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="SENT">
                                        Enviada
                                      </SelectItem>
                                      <SelectItem value="UNDER_REVIEW">
                                        En revisión
                                      </SelectItem>
                                      <SelectItem value="PRE_SELECTED">
                                        Preseleccionado
                                      </SelectItem>
                                      <SelectItem value="REJECTED">
                                        Rechazada
                                      </SelectItem>
                                      <SelectItem value="HIRED">
                                        Contratado
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                  <Button
                                    variant="outline"
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
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {applications.length === 0
                  ? "No hay aplicaciones"
                  : "No hay aplicaciones con este filtro"}
              </h3>
              <p className="text-gray-600">
                {applications.length === 0
                  ? "Aún no has recibido aplicaciones para este empleo."
                  : "Intenta cambiar los filtros para ver más resultados."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
