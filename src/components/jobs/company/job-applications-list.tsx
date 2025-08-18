'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { JobApplication, ApplicationStatus } from '@/types/jobs';
import { JobApplicationService } from '@/services/job-application.service';
import { Calendar, User, Mail, Star, FileText, MessageSquare, Eye } from 'lucide-react';

interface JobApplicationsListProps {
  jobOfferId?: string;
}

const statusColors = {
  SENT: 'bg-blue-100 text-blue-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  PRE_SELECTED: 'bg-orange-100 text-orange-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800'
};

const statusLabels = {
  SENT: 'Enviada',
  UNDER_REVIEW: 'En Revisión',
  PRE_SELECTED: 'Preseleccionado',
  REJECTED: 'Rechazado',
  HIRED: 'Contratado'
};

export default function JobApplicationsList({ jobOfferId }: JobApplicationsListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, [jobOfferId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (jobOfferId) {
        params.append('jobOfferId', jobOfferId);
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const data = await JobApplicationService.getJobApplications(params.toString());
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las aplicaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus, notes?: string, rating?: number) => {
    try {
      await JobApplicationService.updateJobApplication(applicationId, {
        status,
        notes,
        rating
      });
      
      toast({
        title: 'Éxito',
        description: 'Estado de la aplicación actualizado correctamente'
      });
      
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la aplicación',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aplicaciones ({applications.length})</h2>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="SENT">Enviadas</SelectItem>
              <SelectItem value="UNDER_REVIEW">En Revisión</SelectItem>
              <SelectItem value="PRE_SELECTED">Preseleccionados</SelectItem>
              <SelectItem value="REJECTED">Rechazados</SelectItem>
              <SelectItem value="HIRED">Contratados</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchApplications} variant="outline">
            Actualizar
          </Button>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No hay aplicaciones para mostrar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {application.applicant.firstName} {application.applicant.lastName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.applicant.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(application.appliedAt)}
                        </div>
                        {application.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {application.rating}/10
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[application.status]}>
                      {statusLabels[application.status]}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Aplicación</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Información del candidato */}
                          <div>
                            <h3 className="font-semibold mb-2">Información del Candidato</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Nombre:</span> {application.applicant.firstName} {application.applicant.lastName}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {application.applicant.email}
                              </div>
                              <div>
                                <span className="font-medium">Fecha de aplicación:</span> {formatDate(application.appliedAt)}
                              </div>
                              <div>
                                <span className="font-medium">Estado:</span> {statusLabels[application.status]}
                              </div>
                            </div>
                          </div>

                          {/* CV Data */}
                          {application.cvData && (
                            <div>
                              <h3 className="font-semibold mb-2">Información del CV</h3>
                              <div className="space-y-2 text-sm">
                                {application.cvData.education && (
                                  <div>
                                    <span className="font-medium">Educación:</span> {application.cvData.education}
                                  </div>
                                )}
                                {application.cvData.experience && (
                                  <div>
                                    <span className="font-medium">Experiencia:</span> {application.cvData.experience}
                                  </div>
                                )}
                                {application.cvData.skills && application.cvData.skills.length > 0 && (
                                  <div>
                                    <span className="font-medium">Habilidades:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.cvData.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Carta de presentación */}
                          {application.coverLetter && (
                            <div>
                              <h3 className="font-semibold mb-2">Carta de Presentación</h3>
                              <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                                {application.coverLetter}
                              </div>
                            </div>
                          )}

                          {/* Respuestas a preguntas */}
                          {application.questionAnswers && application.questionAnswers.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2">Respuestas a Preguntas</h3>
                              <div className="space-y-3">
                                {application.questionAnswers.map((qa, index) => (
                                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                                    <div className="font-medium text-sm mb-1">{qa.question}</div>
                                    <div className="text-sm text-gray-700">{qa.answer}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notas */}
                          {application.notes && (
                            <div>
                              <h3 className="font-semibold mb-2">Notas</h3>
                              <div className="bg-yellow-50 p-3 rounded text-sm">
                                {application.notes}
                              </div>
                            </div>
                          )}

                          {/* Acciones */}
                          <div className="border-t pt-4">
                            <h3 className="font-semibold mb-3">Acciones</h3>
                            <div className="flex flex-wrap gap-2">
                              <Select onValueChange={(value) => updateApplicationStatus(application.id, value as ApplicationStatus)}>
                                <SelectTrigger className="w-48">
                                  <SelectValue placeholder="Cambiar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="UNDER_REVIEW">En Revisión</SelectItem>
                                  <SelectItem value="PRE_SELECTED">Preseleccionar</SelectItem>
                                  <SelectItem value="REJECTED">Rechazar</SelectItem>
                                  <SelectItem value="HIRED">Contratar</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Agregar Nota
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Agregar Nota</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea placeholder="Escribe una nota sobre este candidato..." />
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline">Cancelar</Button>
                                      <Button>Guardar Nota</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateApplicationStatus(application.id, 'UNDER_REVIEW')}
                    disabled={application.status === 'UNDER_REVIEW'}
                  >
                    En Revisión
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateApplicationStatus(application.id, 'PRE_SELECTED')}
                    disabled={application.status === 'PRE_SELECTED'}
                  >
                    Preseleccionar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                    disabled={application.status === 'REJECTED'}
                  >
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateApplicationStatus(application.id, 'HIRED')}
                    disabled={application.status === 'HIRED'}
                  >
                    Contratar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
