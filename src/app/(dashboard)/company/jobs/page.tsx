"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { JobOffer } from "@/types/jobs";
import { JobOfferService } from "@/services/job-offer.service";
import { useAuth } from "@/providers/auth-provider";
import {
  Plus,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import JobApplicationsModal from "@/components/jobs/company/job-applications-modal";
import { useRouter } from "next/navigation";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-red-100 text-red-800",
  DRAFT: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  CLOSED: "Cerrado",
  DRAFT: "Borrador",
};

export default function CompanyJobsPage() {
  const { toast } = useToast();
  const { user, getCurrentUser } = useAuthContext();
  const router = useRouter();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(
    null
  );
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchJobOffers();
    }
  }, [user?.id]);

  const fetchJobOffers = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log("🔍 Fetching job offers for company:", user.id);
      console.log("🔍 User object:", user);

      // Obtener el usuario actual del backend para asegurar que tenemos el companyId correcto
      const currentUser = await getCurrentUser();
      const companyId = user?.company?.id || user?.id;

      console.log("🔍 Using companyId:", companyId);

      // Usar el método correcto con el parámetro companyId
      const data = await JobOfferService.getJobOffersByCompany(companyId);
      console.log("✅ Job offers fetched:", data);
      console.log("✅ Number of job offers:", data?.length || 0);

      setJobOffers(data || []);
    } catch (error) {
      console.error("❌ Error fetching job offers:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos de trabajo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobOfferCreated = (newJobOffer: JobOffer) => {
    setJobOffers((prev) => [newJobOffer, ...prev]);
    toast({
      title: "Éxito",
      description: "Puesto de trabajo creado correctamente",
    });
  };

  const handleJobOfferUpdated = (updatedJobOffer: JobOffer) => {
    setJobOffers((prev) =>
      prev.map((job) => (job.id === updatedJobOffer.id ? updatedJobOffer : job))
    );
    toast({
      title: "Éxito",
      description: "Puesto de trabajo actualizado correctamente",
    });
  };

  const handleDeleteJobOffer = async (jobOfferId: string) => {
    if (
      !confirm("¿Estás seguro de que quieres eliminar este puesto de trabajo?")
    ) {
      return;
    }

    try {
      await JobOfferService.deleteJobOffer(jobOfferId);
      setJobOffers((prev) => prev.filter((job) => job.id !== jobOfferId));
      toast({
        title: "Éxito",
        description: "Puesto de trabajo eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting job offer:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el puesto de trabajo",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStats = () => {
    const total = jobOffers.length;
    const active = jobOffers.filter((job) => job.status === "ACTIVE").length;
    const totalApplications = jobOffers.reduce(
      (sum, job) => sum + (job.applicationsCount || 0),
      0
    );
    const totalViews = jobOffers.reduce(
      (sum, job) => sum + (job.viewsCount || 0),
      0
    );

    return { total, active, totalApplications, totalViews };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Puestos de Trabajo</h1>
        <Button onClick={() => router.push("/jobs/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Puesto
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Puestos
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Puestos Activos
                </p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Aplicaciones
                </p>
                <p className="text-2xl font-bold">{stats.totalApplications}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Visualizaciones
                </p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de puestos de trabajo */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Mis Puestos de Trabajo</h2>
          <Button variant="outline" onClick={fetchJobOffers}>
            Actualizar
          </Button>
        </div>

        {jobOffers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay puestos de trabajo
              </h3>
              <p className="text-gray-500 mb-4">
                Comienza creando tu primer puesto de trabajo para atraer
                candidatos
              </p>
              <Button onClick={() => router.push("/jobs/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Puesto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobOffers.map((jobOffer) => (
              <Card
                key={jobOffer.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {jobOffer.title}
                        </h3>
                        <Badge className={statusColors[jobOffer.status]}>
                          {statusLabels[jobOffer.status]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Ubicación:</span>{" "}
                          {jobOffer.location}
                        </div>
                        <div>
                          <span className="font-medium">Tipo de contrato:</span>{" "}
                          {jobOffer.contractType}
                        </div>
                        <div>
                          <span className="font-medium">Modalidad:</span>{" "}
                          {jobOffer.workModality}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => {
                            setSelectedJobOffer(jobOffer);
                            setIsApplicationsModalOpen(true);
                          }}
                        >
                          <Users className="w-4 h-4" />
                          {jobOffer.applicationsCount || 0} aplicaciones
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {jobOffer.viewsCount || 0} visualizaciones
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Creado {formatDate(jobOffer.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/jobs/${jobOffer.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedJobOffer(jobOffer);
                          setIsApplicationsModalOpen(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Ver Aplicaciones
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJobOffer(jobOffer.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Aplicaciones */}
      <JobApplicationsModal
        jobOffer={selectedJobOffer}
        isOpen={isApplicationsModalOpen}
        onClose={() => {
          setIsApplicationsModalOpen(false);
          setSelectedJobOffer(null);
        }}
      />
    </div>
  );
}
