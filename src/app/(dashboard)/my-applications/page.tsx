"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { JobApplication, ApplicationStatus } from "@/types/jobs";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationStats {
  total: number;
  sent: number;
  underReview: number;
  preSelected: number;
  rejected: number;
  hired: number;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    sent: 0,
    underReview: 0,
    preSelected: 0,
    rejected: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL"
  );
  const [companyFilter, setCompanyFilter] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, companyFilter]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/my-applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las aplicaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(query) ||
          app.companyName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Company filter
    if (companyFilter) {
      filtered = filtered.filter((app) =>
        app.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const response = await fetch(
        `/api/my-applications?applicationId=${applicationId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        toast({
          title: "Aplicación retirada",
          description: "Tu aplicación ha sido retirada exitosamente",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "No se pudo retirar la aplicación",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo retirar la aplicación",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "SENT":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "UNDER_REVIEW":
        return <Eye className="w-4 h-4 text-orange-600" />;
      case "PRE_SELECTED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "HIRED":
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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

  const canWithdraw = (status: ApplicationStatus) => {
    return status === "SENT";
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mis Aplicaciones
        </h1>
        <p className="text-gray-600">
          Gestiona y da seguimiento a tus postulaciones laborales
        </p>
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
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-600">Enviadas</div>
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
            <div className="text-sm text-gray-600">Preseleccionado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-600">Rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por trabajo o empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ApplicationStatus | "ALL")
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="SENT">Enviadas</SelectItem>
                <SelectItem value="UNDER_REVIEW">En revisión</SelectItem>
                <SelectItem value="PRE_SELECTED">Preseleccionado</SelectItem>
                <SelectItem value="REJECTED">Rechazadas</SelectItem>
                <SelectItem value="HIRED">Contratado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filtrar por empresa..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full md:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={application.companyLogo}
                        alt={application.companyName}
                      />
                      <AvatarFallback>
                        {application.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3
                            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              router.push(`/jobs/${application.jobId}`)
                            }
                          >
                            {application.jobTitle}
                          </h3>
                          <p className="text-gray-600">
                            {application.companyName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getStatusColor(application.status)} border-0`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span>{getStatusLabel(application.status)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Aplicado:</span>{" "}
                          {formatDate(application.appliedAt)}
                        </div>
                        <div>
                          <span className="font-medium">
                            Última actualización:
                          </span>{" "}
                          {formatDate(application.updatedAt)}
                        </div>
                        {application.rating && (
                          <div>
                            <span className="font-medium">Valoración:</span>{" "}
                            {application.rating}/5 ⭐
                          </div>
                        )}
                      </div>

                      {application.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">
                              Notas del empleador:
                            </span>{" "}
                            {application.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/jobs/${application.jobId}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver oferta
                          </Button>

                          {/* {application.cvUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(application.cvUrl, "_blank")
                              }
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Ver CV
                            </Button>
                          )} */}
                        </div>

                        {canWithdraw(application.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleWithdrawApplication(application.id)
                            }
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Retirar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {applications.length === 0
                ? "No has aplicado a ningún empleo"
                : "No se encontraron aplicaciones"}
            </h3>
            <p className="text-gray-600 mb-6">
              {applications.length === 0
                ? "Comienza explorando oportunidades laborales que se ajusten a tu perfil."
                : "Intenta ajustar tus filtros de búsqueda."}
            </p>
            <Button onClick={() => router.push("/jobs")}>
              {applications.length === 0
                ? "Explorar empleos"
                : "Ver todos los empleos"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
