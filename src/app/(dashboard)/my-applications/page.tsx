&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { JobApplication, ApplicationStatus } from &ldquo;@/types/jobs&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;

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
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | &ldquo;ALL&rdquo;>(
    &ldquo;ALL&rdquo;
  );
  const [companyFilter, setCompanyFilter] = useState(&ldquo;&rdquo;);

  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, companyFilter]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(&ldquo;/api/my-applications&rdquo;);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error(&ldquo;Error fetching applications:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudieron cargar las aplicaciones&rdquo;,
        variant: &ldquo;destructive&rdquo;,
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
    if (statusFilter !== &ldquo;ALL&rdquo;) {
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
          method: &ldquo;DELETE&rdquo;,
        }
      );

      if (response.ok) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        toast({
          title: &ldquo;Aplicación retirada&rdquo;,
          description: &ldquo;Tu aplicación ha sido retirada exitosamente&rdquo;,
        });
      } else {
        toast({
          title: &ldquo;Error&rdquo;,
          description: error.error || &ldquo;No se pudo retirar la aplicación&rdquo;,
          variant: &ldquo;destructive&rdquo;,
        });
      }
    } catch (error) {
      toast({
        title: &ldquo;Error de conexión&rdquo;,
        description: &ldquo;No se pudo retirar la aplicación&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case &ldquo;SENT&rdquo;:
        return <Clock className=&ldquo;w-4 h-4 text-blue-600&rdquo; />;
      case &ldquo;UNDER_REVIEW&rdquo;:
        return <Eye className=&ldquo;w-4 h-4 text-orange-600&rdquo; />;
      case &ldquo;PRE_SELECTED&rdquo;:
        return <CheckCircle className=&ldquo;w-4 h-4 text-green-600&rdquo; />;
      case &ldquo;REJECTED&rdquo;:
        return <XCircle className=&ldquo;w-4 h-4 text-red-600&rdquo; />;
      case &ldquo;HIRED&rdquo;:
        return <Users className=&ldquo;w-4 h-4 text-purple-600&rdquo; />;
      default:
        return <AlertCircle className=&ldquo;w-4 h-4 text-gray-600&rdquo; />;
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

  const canWithdraw = (status: ApplicationStatus) => {
    return status === &ldquo;SENT&rdquo;;
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
          <div className=&ldquo;space-y-4&rdquo;>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className=&ldquo;h-32&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-2xl font-bold text-gray-900 mb-2&rdquo;>
          Mis Aplicaciones
        </h1>
        <p className=&ldquo;text-gray-600&rdquo;>
          Gestiona y da seguimiento a tus postulaciones laborales
        </p>
      </div>

      <div className=&ldquo;mb-8 flex justify-between items-center&rdquo;>
  <div>
    <h1 className=&ldquo;text-2xl font-bold text-gray-900 mb-1&rdquo;>
      Mis Aplicaciones
    </h1>
    <p className=&ldquo;text-gray-600&rdquo;>
      Gestiona y da seguimiento a tus postulaciones laborales
    </p>
  </div>
  <Button onClick={() => router.push(&ldquo;/my-applications/new&rdquo;)}>
  + Nueva Postulación
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
            <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>{stats.sent}</div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Enviadas</div>
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
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Preseleccionado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-red-600&rdquo;>
              {stats.rejected}
            </div>
            <div className=&ldquo;text-sm text-gray-600&rdquo;>Rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardContent className=&ldquo;p-6&rdquo;>
          <div className=&ldquo;flex flex-col md:flex-row gap-4&rdquo;>
            <div className=&ldquo;flex-1&rdquo;>
              <div className=&ldquo;relative&rdquo;>
                <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4&rdquo; />
                <Input
                  placeholder=&ldquo;Buscar por trabajo o empresa...&rdquo;
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=&ldquo;pl-10&rdquo;
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ApplicationStatus | &ldquo;ALL&rdquo;)
              }
            >
              <SelectTrigger className=&ldquo;w-full md:w-48&rdquo;>
                <SelectValue placeholder=&ldquo;Filtrar por estado&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;ALL&rdquo;>Todos los estados</SelectItem>
                <SelectItem value=&ldquo;SENT&rdquo;>Enviadas</SelectItem>
                <SelectItem value=&ldquo;UNDER_REVIEW&rdquo;>En revisión</SelectItem>
                <SelectItem value=&ldquo;PRE_SELECTED&rdquo;>Preseleccionado</SelectItem>
                <SelectItem value=&ldquo;REJECTED&rdquo;>Rechazadas</SelectItem>
                <SelectItem value=&ldquo;HIRED&rdquo;>Contratado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder=&ldquo;Filtrar por empresa...&rdquo;
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className=&ldquo;w-full md:w-48&rdquo;
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className=&ldquo;space-y-4&rdquo;>
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className=&ldquo;hover:shadow-md transition-shadow&rdquo;
            >
              <CardContent className=&ldquo;p-6&rdquo;>
                <div className=&ldquo;flex items-start justify-between&rdquo;>
                  <div className=&ldquo;flex items-start space-x-4 flex-1&rdquo;>
                    <Avatar className=&ldquo;w-12 h-12&rdquo;>
                      <AvatarImage
                        src={application.companyLogo}
                        alt={application.companyName}
                      />
                      <AvatarFallback>
                        {application.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className=&ldquo;flex-1 min-w-0&rdquo;>
                      <div className=&ldquo;flex items-start justify-between mb-2&rdquo;>
                        <div>
                          <h3
                            className=&ldquo;text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600&rdquo;
                            onClick={() =>
                              router.push(`/jobs/${application.jobId}`)
                            }
                          >
                            {application.jobTitle}
                          </h3>
                          <p className=&ldquo;text-gray-600&rdquo;>
                            {application.companyName}
                          </p>
                        </div>
                        <div className=&ldquo;flex items-center space-x-2&rdquo;>
                          <Badge
                            className={`${getStatusColor(application.status)} border-0`}
                          >
                            <div className=&ldquo;flex items-center space-x-1&rdquo;>
                              {getStatusIcon(application.status)}
                              <span>{getStatusLabel(application.status)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4&rdquo;>
                        <div>
                          <span className=&ldquo;font-medium&rdquo;>Aplicado:</span>{&ldquo; &rdquo;}
                          {formatDate(application.appliedAt)}
                        </div>
                        <div>
                          <span className=&ldquo;font-medium&rdquo;>
                            Última actualización:
                          </span>{&ldquo; &rdquo;}
                          {formatDate(application.updatedAt)}
                        </div>
                        {application.rating && (
                          <div>
                            <span className=&ldquo;font-medium&rdquo;>Valoración:</span>{&ldquo; &rdquo;}
                            {application.rating}/5 ⭐
                          </div>
                        )}
                      </div>

                      {application.notes && (
                        <div className=&ldquo;bg-gray-50 rounded-lg p-3 mb-4&rdquo;>
                          <p className=&ldquo;text-sm text-gray-700&rdquo;>
                            <span className=&ldquo;font-medium&rdquo;>
                              Notas del empleador:
                            </span>{&ldquo; &rdquo;}
                            {application.notes}
                          </p>
                        </div>
                      )}

                      <div className=&ldquo;flex items-center justify-between&rdquo;>
                        <div className=&ldquo;flex items-center space-x-4&rdquo;>
                          <Button
                            variant=&ldquo;outline&rdquo;
                            size=&ldquo;sm&rdquo;
                            onClick={() =>
                              router.push(`/jobs/${application.jobId}`)
                            }
                          >
                            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver oferta
                          </Button>

                          {/* {application.cvUrl && (
                            <Button
                              variant=&ldquo;outline&rdquo;
                              size=&ldquo;sm&rdquo;
                              onClick={() =>
                                window.open(application.cvUrl, &ldquo;_blank&rdquo;)
                              }
                            >
                              <Download className=&ldquo;w-4 h-4 mr-2&rdquo; />
                              Ver CV
                            </Button>
                          )} */}
                        </div>

                        {canWithdraw(application.status) && (
                          <Button
                            variant=&ldquo;outline&rdquo;
                            size=&ldquo;sm&rdquo;
                            onClick={() =>
                              handleWithdrawApplication(application.id)
                            }
                            className=&ldquo;text-red-600 border-red-300 hover:bg-red-50&rdquo;
                          >
                            <Trash2 className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
          <CardContent className=&ldquo;flex flex-col items-center justify-center py-12 text-center&rdquo;>
            <Search className=&ldquo;w-12 h-12 text-gray-400 mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-semibold text-gray-900 mb-2&rdquo;>
              {applications.length === 0
                ? &ldquo;No has aplicado a ningún empleo&rdquo;
                : &ldquo;No se encontraron aplicaciones&rdquo;}
            </h3>
            <p className=&ldquo;text-gray-600 mb-6&rdquo;>
              {applications.length === 0
                ? &ldquo;Comienza explorando oportunidades laborales que se ajusten a tu perfil.&rdquo;
                : &ldquo;Intenta ajustar tus filtros de búsqueda.&rdquo;}
            </p>
            <Button onClick={() => router.push(&ldquo;/jobs&rdquo;)}>
              {applications.length === 0
                ? &ldquo;Explorar empleos&rdquo;
                : &ldquo;Ver todos los empleos&rdquo;}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
