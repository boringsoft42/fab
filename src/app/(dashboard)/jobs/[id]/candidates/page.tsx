"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUpdateApplicationStatus, useHireCandidate, useRejectCandidate, usePreselectCandidate } from "@/hooks/use-job-applications";
import { useCompanyJobApplications } from "@/hooks/useJobApplicationApi";
import { useAuthContext } from "@/hooks/use-auth";
import { useJobOffer } from "@/hooks/use-job-offers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Users, 
  Calendar,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Filter,
  MoreHorizontal,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApplicationStatus } from "@/types/jobs";

export default function JobCandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const jobId = params.id as string;
  
  const { data: jobOffer, isLoading: jobLoading } = useJobOffer(jobId);
  const companyId = user?.company?.id || user?.id;
  console.log('🏢 JobCandidatesPage - User info:', {
    userId: user?.id,
    userCompanyId: user?.company?.id,
    finalCompanyId: companyId,
    userRole: user?.role
  });
  const { data: applications, loading: applicationsLoading } = useCompanyJobApplications(companyId || "");
  const updateStatusMutation = useUpdateApplicationStatus();
  const hireCandidateMutation = useHireCandidate();
  const rejectCandidateMutation = useRejectCandidate();
  const preselectCandidateMutation = usePreselectCandidate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number>(0);

  // Filter applications for this specific job
  const jobApplications = applications?.filter(app => app.jobOffer.id === jobId) || [];
  
  const filteredApplications = jobApplications.filter((app) => {
    const matchesSearch = 
      app.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants = {
      SENT: "outline",
      UNDER_REVIEW: "secondary",
      PRE_SELECTED: "default",
      REJECTED: "destructive",
      HIRED: "default",
    } as const;

    const labels = {
      SENT: "Enviada",
      UNDER_REVIEW: "En Revisión",
      PRE_SELECTED: "Preseleccionado",
      REJECTED: "Rechazado",
      HIRED: "Contratado",
    };

    return (
      <Badge variant={variants[status]} className={
        status === "HIRED" ? "bg-green-100 text-green-800" : ""
      }>
        {labels[status]}
      </Badge>
    );
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: applicationId,
        data: {
          status: newStatus,
          notes,
          rating: rating > 0 ? rating : undefined
        }
      });
      setNotes("");
      setRating(0);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleHire = async (applicationId: string) => {
    try {
      await hireCandidateMutation.mutateAsync({
        id: applicationId,
        notes,
        rating: rating > 0 ? rating : undefined
      });
      setNotes("");
      setRating(0);
    } catch (error) {
      console.error('Error hiring candidate:', error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await rejectCandidateMutation.mutateAsync({
        id: applicationId,
        notes,
        rating: rating > 0 ? rating : undefined
      });
      setNotes("");
      setRating(0);
    } catch (error) {
      console.error('Error rejecting candidate:', error);
    }
  };

  const handlePreselect = async (applicationId: string) => {
    try {
      await preselectCandidateMutation.mutateAsync({
        id: applicationId,
        notes,
        rating: rating > 0 ? rating : undefined
      });
      setNotes("");
      setRating(0);
    } catch (error) {
      console.error('Error preselecting candidate:', error);
    }
  };

  if (jobLoading || applicationsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Cargando candidatos...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Candidatos</h1>
            <p className="text-sm text-muted-foreground">
              {jobOffer?.title} - {jobApplications.length} aplicaciones
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {jobApplications.filter(app => app.status === "SENT").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {jobApplications.filter(app => app.status === "UNDER_REVIEW").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preseleccionados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {jobApplications.filter(app => app.status === "PRE_SELECTED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobApplications.filter(app => app.status === "HIRED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar candidatos</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filtrar por estado</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "ALL")}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="ALL">Todos los estados</option>
                <option value="SENT">Enviadas</option>
                <option value="UNDER_REVIEW">En Revisión</option>
                <option value="PRE_SELECTED">Preseleccionados</option>
                <option value="REJECTED">Rechazados</option>
                <option value="HIRED">Contratados</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <Users className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {jobApplications.length === 0 
                  ? "No hay aplicaciones para este puesto aún" 
                  : "No se encontraron candidatos con los filtros aplicados"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {application.applicant.firstName} {application.applicant.lastName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{application.applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(application.appliedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Carta de presentación:</strong> {application.coverLetter.substring(0, 150)}...
                      </div>
                    )}

                    {application.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{application.rating}/10</span>
                      </div>
                    )}

                    {application.notes && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Notas:</strong> {application.notes}
                      </div>
                    )}

                    {application.questionAnswers && application.questionAnswers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {application.questionAnswers.length} pregunta{application.questionAnswers.length !== 1 ? 's' : ''} respondida{application.questionAnswers.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(application.status)}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        
                        {application.status === "SENT" && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(application.id, "UNDER_REVIEW")}>
                              <Eye className="mr-2 h-4 w-4" />
                              Marcar en revisión
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePreselect(application.id)}>
                              <Star className="mr-2 h-4 w-4" />
                              Preseleccionar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(application.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {application.status === "UNDER_REVIEW" && (
                          <>
                            <DropdownMenuItem onClick={() => handlePreselect(application.id)}>
                              <Star className="mr-2 h-4 w-4" />
                              Preseleccionar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(application.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {application.status === "PRE_SELECTED" && (
                          <>
                            <DropdownMenuItem onClick={() => handleHire(application.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Contratar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(application.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar CV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Aplicación</DialogTitle>
            <DialogDescription>
              Información completa del candidato y su aplicación
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Candidato</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Nombre completo</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.applicant.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detalles de la Aplicación</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Estado actual</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                  <div>
                    <Label>Fecha de aplicación</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedApplication.appliedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <Label>Carta de presentación</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="text-sm">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.cvData && (
                  <div className="space-y-3">
                    <Label>Información del CV</Label>
                    <div className="space-y-2">
                      {selectedApplication.cvData.education && (
                        <div>
                          <strong className="text-sm">Educación:</strong>
                          <p className="text-sm text-muted-foreground">{selectedApplication.cvData.education}</p>
                        </div>
                      )}
                      {selectedApplication.cvData.experience && (
                        <div>
                          <strong className="text-sm">Experiencia:</strong>
                          <p className="text-sm text-muted-foreground">{selectedApplication.cvData.experience}</p>
                        </div>
                      )}
                      {selectedApplication.cvData.skills && selectedApplication.cvData.skills.length > 0 && (
                        <div>
                          <strong className="text-sm">Habilidades:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedApplication.cvData.skills.map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedApplication.questionAnswers && selectedApplication.questionAnswers.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Preguntas del Empleo y Respuestas</Label>
                    <div className="space-y-3">
                      {selectedApplication.questionAnswers.map((qa: any, index: number) => (
                        <div key={qa.id} className="p-4 border rounded-lg bg-card">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground mb-2">{qa.question}</p>
                              <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">{qa.answer}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Acciones</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Agregar notas sobre el candidato..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Calificación (1-10)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="0"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex gap-2">
                    {selectedApplication.status === "SENT" && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => handleStatusChange(selectedApplication.id, "UNDER_REVIEW")}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          En Revisión
                        </Button>
                        <Button 
                          onClick={() => handlePreselect(selectedApplication.id)}
                          disabled={preselectCandidateMutation.isPending}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Preseleccionar
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleReject(selectedApplication.id)}
                          disabled={rejectCandidateMutation.isPending}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    
                    {selectedApplication.status === "UNDER_REVIEW" && (
                      <>
                        <Button 
                          onClick={() => handlePreselect(selectedApplication.id)}
                          disabled={preselectCandidateMutation.isPending}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Preseleccionar
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleReject(selectedApplication.id)}
                          disabled={rejectCandidateMutation.isPending}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    
                    {selectedApplication.status === "PRE_SELECTED" && (
                      <>
                        <Button 
                          onClick={() => handleHire(selectedApplication.id)}
                          disabled={hireCandidateMutation.isPending}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Contratar
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleReject(selectedApplication.id)}
                          disabled={rejectCandidateMutation.isPending}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
