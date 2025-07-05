&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Star,
  Eye,
  Edit3,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  MoreHorizontal,
} from &ldquo;lucide-react&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { JobApplication, ApplicationStatus } from &ldquo;@/types/jobs&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;

interface CandidatesData {
  candidates: JobApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    byStatus: {
      sent: number;
      underReview: number;
      preSelected: number;
      rejected: number;
      hired: number;
    };
    byJob: Record<string, { jobTitle: string; count: number }>;
    averageRating: number;
  };
}

export default function CandidatesPage() {
  const [candidatesData, setCandidatesData] = useState<CandidatesData | null>(
    null
  );
  const [selectedCVs, setSelectedCVs] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(&ldquo;&rdquo;);
  const [statusFilter, setStatusFilter] = useState(&ldquo;all&rdquo;);
  const [jobFilter, setJobFilter] = useState(&ldquo;all&rdquo;);
  const [sortBy, setSortBy] = useState(&ldquo;appliedAt&rdquo;);
  const [sortOrder, setSortOrder] = useState(&ldquo;desc&rdquo;);
  const [selectedCandidate, setSelectedCandidate] =
    useState<JobApplication | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [candidateNotes, setCandidateNotes] = useState(&ldquo;&rdquo;);
  const [candidateRating, setCandidateRating] = useState<number>(0);
  const [candidateStatus, setCandidateStatus] =
    useState<ApplicationStatus>(&ldquo;SENT&rdquo;);
  const { toast } = useToast();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCandidates();
  }, [searchTerm, statusFilter, jobFilter, sortBy, sortOrder, page]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/candidates?${params}`);
      if (!response.ok) {
        throw new Error(&ldquo;Error al cargar candidatos&rdquo;);
      }

      const data = await response.json();
      setCandidatesData(data);
    } catch (error) {
      console.error(&ldquo;Error:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudieron cargar los candidatos&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (
    candidateId: string,
    updates: Partial<JobApplication>
  ) => {
    try {
      const response = await fetch(&ldquo;/api/jobs/candidates&rdquo;, {
        method: &ldquo;PUT&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
        },
        body: JSON.stringify({
          candidateId,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error(&ldquo;Error al actualizar candidato&rdquo;);
      }

      toast({
        title: &ldquo;Candidato actualizado&rdquo;,
        description: &ldquo;Los cambios se han guardado exitosamente&rdquo;,
      });

      fetchCandidates();
      setUpdateDialogOpen(false);
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo actualizar el candidato&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const handleStatusChange = (
    candidate: JobApplication,
    newStatus: ApplicationStatus
  ) => {
    updateCandidate(candidate.id, { status: newStatus });
  };

  const openUpdateDialog = (candidate: JobApplication) => {
    setSelectedCandidate(candidate);
    setCandidateNotes(candidate.notes || &ldquo;&rdquo;);
    setCandidateRating(candidate.rating || 0);
    setCandidateStatus(candidate.status);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedCandidate) return;

    updateCandidate(selectedCandidate.id, {
      notes: candidateNotes,
      rating: candidateRating || undefined,
      status: candidateStatus,
    });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      SENT: { label: &ldquo;Enviado&rdquo;, variant: &ldquo;secondary&rdquo; as const, icon: Clock },
      UNDER_REVIEW: {
        label: &ldquo;En Revisión&rdquo;,
        variant: &ldquo;default&rdquo; as const,
        icon: Eye,
      },
      PRE_SELECTED: {
        label: &ldquo;Preseleccionado&rdquo;,
        variant: &ldquo;default&rdquo; as const,
        icon: CheckCircle,
      },
      REJECTED: {
        label: &ldquo;Rechazado&rdquo;,
        variant: &ldquo;destructive&rdquo; as const,
        icon: XCircle,
      },
      HIRED: {
        label: &ldquo;Contratado&rdquo;,
        variant: &ldquo;default&rdquo; as const,
        icon: UserCheck,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className=&ldquo;flex items-center gap-1&rdquo;>
        <Icon className=&ldquo;w-3 h-3&rdquo; />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      day: &ldquo;2-digit&rdquo;,
      month: &ldquo;2-digit&rdquo;,
      year: &ldquo;numeric&rdquo;,
      hour: &ldquo;2-digit&rdquo;,
      minute: &ldquo;2-digit&rdquo;,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className=&ldquo;flex items-center gap-1&rdquo;>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? &ldquo;fill-yellow-400 text-yellow-400&rdquo;
                : &ldquo;text-gray-300&rdquo;
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div>
            <Skeleton className=&ldquo;h-8 w-64 mb-2&rdquo; />
            <Skeleton className=&ldquo;h-4 w-96&rdquo; />
          </div>
          <Skeleton className=&ldquo;h-10 w-32&rdquo; />
        </div>

        <div className=&ldquo;grid gap-4 md:grid-cols-2 lg:grid-cols-5&rdquo;>
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <Skeleton className=&ldquo;h-4 w-20&rdquo; />
                <Skeleton className=&ldquo;h-4 w-4&rdquo; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&ldquo;h-8 w-16 mb-2&rdquo; />
                <Skeleton className=&ldquo;h-3 w-32&rdquo; />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className=&ldquo;h-6 w-32&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;space-y-4&rdquo;>
              {[...Array(5)].map((_, i) => (
                <div key={i} className=&ldquo;flex items-center space-x-4&rdquo;>
                  <Skeleton className=&ldquo;h-10 w-10 rounded-full&rdquo; />
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Skeleton className=&ldquo;h-4 w-40&rdquo; />
                    <Skeleton className=&ldquo;h-3 w-24&rdquo; />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!candidatesData) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>
            Gestión de Candidatos
          </h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Revisa y gestiona todos los candidatos de tus ofertas de trabajo
          </p>
        </div>
        <Button
  disabled={selectedCVs.length === 0}
  onClick={() => {
    selectedCVs.forEach((url) => {
      const link = document.createElement(&ldquo;a&rdquo;);
      link.href = url;
      link.download = &ldquo;&rdquo;;
      link.target = &ldquo;_blank&rdquo;;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }}
>
  <Download className=&ldquo;mr-2 h-4 w-4&rdquo; />
  Descargar CVs Seleccionados
</Button>

      </div>

      {/* Statistics Cards */}
      <div className=&ldquo;grid gap-4 md:grid-cols-2 lg:grid-cols-5&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Total Candidatos
            </CardTitle>
            <UserCheck className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {candidatesData.stats.total}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              {candidatesData.stats.averageRating.toFixed(1)} ⭐ promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>En Revisión</CardTitle>
            <Eye className=&ldquo;h-4 w-4 text-blue-500&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>
              {candidatesData.stats.byStatus.underReview}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Preseleccionados
            </CardTitle>
            <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
              {candidatesData.stats.byStatus.preSelected}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              Listos para entrevista
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Contratados</CardTitle>
            <UserCheck className=&ldquo;h-4 w-4 text-purple-500&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-purple-600&rdquo;>
              {candidatesData.stats.byStatus.hired}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Proceso exitoso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Nuevos</CardTitle>
            <Clock className=&ldquo;h-4 w-4 text-orange-500&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-orange-600&rdquo;>
              {candidatesData.stats.byStatus.sent}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              Pendientes de revisar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;flex flex-col md:flex-row gap-4&rdquo;>
            <div className=&ldquo;flex-1&rdquo;>
              <div className=&ldquo;relative&rdquo;>
                <Search className=&ldquo;absolute left-2 top-2.5 h-4 w-4 text-muted-foreground&rdquo; />
                <Input
                  placeholder=&ldquo;Buscar por nombre, email o puesto...&rdquo;
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=&ldquo;pl-8&rdquo;
                />
              </div>
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className=&ldquo;w-full md:w-60&rdquo;>
                <SelectValue placeholder=&ldquo;Filtrar por puesto&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos los puestos</SelectItem>
                {Object.entries(candidatesData.stats.byJob).map(
                  ([jobId, job]) => (
                    <SelectItem key={jobId} value={jobId}>
                      {job.jobTitle} ({job.count})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className=&ldquo;w-full md:w-40&rdquo;>
                <SelectValue placeholder=&ldquo;Estado&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                <SelectItem value=&ldquo;SENT&rdquo;>Enviado</SelectItem>
                <SelectItem value=&ldquo;UNDER_REVIEW&rdquo;>En Revisión</SelectItem>
                <SelectItem value=&ldquo;PRE_SELECTED&rdquo;>Preseleccionado</SelectItem>
                <SelectItem value=&ldquo;REJECTED&rdquo;>Rechazado</SelectItem>
                <SelectItem value=&ldquo;HIRED&rdquo;>Contratado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className=&ldquo;w-full md:w-40&rdquo;>
                <SelectValue placeholder=&ldquo;Ordenar por&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;appliedAt&rdquo;>Fecha aplicación</SelectItem>
                <SelectItem value=&ldquo;applicantName&rdquo;>Nombre</SelectItem>
                <SelectItem value=&ldquo;rating&rdquo;>Calificación</SelectItem>
                <SelectItem value=&ldquo;status&rdquo;>Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Candidatos</CardTitle>
          <CardDescription>
            {candidatesData.candidates.length} de{&ldquo; &rdquo;}
            {candidatesData.pagination.total} candidatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>
  <div className=&ldquo;flex items-center gap-2&rdquo;>
    <Checkbox
      checked={selectedCVs.length === candidatesData.candidates.length}
      onCheckedChange={(checked) => {
        if (checked) {
          setSelectedCVs(
            candidatesData.candidates
              .filter((c) => c.cvUrl)
              .map((c) => c.cvUrl!)
          );
        } else {
          setSelectedCVs([]);
        }
      }}
    />
  </div>
</TableHead>

                <TableHead>Candidato</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Fecha Aplicación</TableHead>
                <TableHead className=&ldquo;text-right&rdquo;>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidatesData.candidates.map((candidate) => (
                
                <TableRow key={candidate.id}>
                  <TableCell>
  <Checkbox
    checked={selectedCVs.includes(candidate.cvUrl || &ldquo;&rdquo;)}
    onCheckedChange={(checked) => {
      if (checked) {
        setSelectedCVs([...selectedCVs, candidate.cvUrl!]);
      } else {
        setSelectedCVs(
          selectedCVs.filter((url) => url !== candidate.cvUrl)
        );
      }
    }}
    disabled={!candidate.cvUrl}
  />
</TableCell>

                  <TableCell>
                    <div className=&ldquo;flex items-center space-x-3&rdquo;>
                      <Avatar>
                        <AvatarImage
                          src=&ldquo;/api/placeholder/40/40&rdquo;
                          alt={candidate.applicantName}
                        />
                        <AvatarFallback>
                          {candidate.applicantName
                            .split(&ldquo; &rdquo;)
                            .map((n) => n[0])
                            .join(&ldquo;&rdquo;)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className=&ldquo;font-medium&rdquo;>
                          {candidate.applicantName}
                        </div>
                        <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          {candidate.applicantEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className=&ldquo;font-medium&rdquo;>{candidate.jobTitle}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                  <TableCell>
                    {candidate.rating ? (
                      renderStars(candidate.rating)
                    ) : (
                      <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        Sin calificar
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className=&ldquo;text-sm&rdquo;>
                      {formatDate(candidate.appliedAt)}
                    </div>
                  </TableCell>
                  <TableCell className=&ldquo;text-right&rdquo;>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant=&ldquo;ghost&rdquo; className=&ldquo;h-8 w-8 p-0&rdquo;>
                          <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align=&ldquo;end&rdquo;>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedCandidate(candidate);
                              }}
                            >
                              <Eye className=&ldquo;mr-2 h-4 w-4&rdquo; />
                              Ver Detalles
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </Dialog>
                        <DropdownMenuItem
                          onClick={() => openUpdateDialog(candidate)}
                        >
                          <Edit3 className=&ldquo;mr-2 h-4 w-4&rdquo; />
                          Actualizar Estado
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className=&ldquo;mr-2 h-4 w-4&rdquo; />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className=&ldquo;mr-2 h-4 w-4&rdquo; />
                          Programar Entrevista
                        </DropdownMenuItem>
                        {candidate.cvUrl && (
                          <DropdownMenuItem>
                            <FileText className=&ldquo;mr-2 h-4 w-4&rdquo; />
                            Descargar CV
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, &ldquo;PRE_SELECTED&rdquo;)
                          }
                          disabled={candidate.status === &ldquo;PRE_SELECTED&rdquo;}
                        >
                          <CheckCircle className=&ldquo;mr-2 h-4 w-4&rdquo; />
                          Preseleccionar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, &ldquo;REJECTED&rdquo;)
                          }
                          disabled={candidate.status === &ldquo;REJECTED&rdquo;}
                        >
                          <XCircle className=&ldquo;mr-2 h-4 w-4&rdquo; />
                          Rechazar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className=&ldquo;flex justify-between items-center mt-4&rdquo;>
  <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
    Página {candidatesData.pagination.page} de {candidatesData.pagination.totalPages}
  </span>
  <div className=&ldquo;space-x-2&rdquo;>
    <Button
      variant=&ldquo;outline&rdquo;
      size=&ldquo;sm&rdquo;
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
    >
      Anterior
    </Button>
    <Button
      variant=&ldquo;outline&rdquo;
      size=&ldquo;sm&rdquo;
      disabled={page === candidatesData.pagination.totalPages}
      onClick={() => setPage(page + 1)}
    >
      Siguiente
    </Button>
  </div>
</div>

        </CardContent>
      </Card>

      {/* Candidate Details Dialog */}
      {selectedCandidate && (
        <Dialog
          open={!!selectedCandidate}
          onOpenChange={() => setSelectedCandidate(null)}
        >
          <DialogContent className=&ldquo;max-w-4xl max-h-[80vh] overflow-y-auto&rdquo;>
            <DialogHeader>
              <DialogTitle>Detalles del Candidato</DialogTitle>
              <DialogDescription>
                Información completa de la aplicación de{&ldquo; &rdquo;}
                {selectedCandidate.applicantName}
              </DialogDescription>
            </DialogHeader>

            <div className=&ldquo;space-y-6&rdquo;>
              {/* Candidate Info */}
              <div className=&ldquo;flex items-start space-x-4&rdquo;>
                <Avatar className=&ldquo;h-16 w-16&rdquo;>
                  <AvatarImage
                    src=&ldquo;/api/placeholder/64/64&rdquo;
                    alt={selectedCandidate.applicantName}
                  />
                  <AvatarFallback className=&ldquo;text-lg&rdquo;>
                    {selectedCandidate.applicantName
                      .split(&ldquo; &rdquo;)
                      .map((n) => n[0])
                      .join(&ldquo;&rdquo;)}
                  </AvatarFallback>
                </Avatar>
                <div className=&ldquo;space-y-2&rdquo;>
                  <div>
                    <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                      {selectedCandidate.applicantName}
                    </h3>
                    <p className=&ldquo;text-muted-foreground&rdquo;>
                      {selectedCandidate.applicantEmail}
                    </p>
                  </div>
                  <div className=&ldquo;flex items-center gap-4&rdquo;>
                    {getStatusBadge(selectedCandidate.status)}
                    {selectedCandidate.rating &&
                      renderStars(selectedCandidate.rating)}
                  </div>
                  <div className=&ldquo;grid grid-cols-2 gap-4 text-sm&rdquo;>
                    <div>
                      <span className=&ldquo;font-medium&rdquo;>Puesto:</span>{&ldquo; &rdquo;}
                      {selectedCandidate.jobTitle}
                    </div>
                    <div>
                      <span className=&ldquo;font-medium&rdquo;>Aplicó:</span>{&ldquo; &rdquo;}
                      {formatDate(selectedCandidate.appliedAt)}
                    </div>
                    {selectedCandidate.updatedAt !==
                      selectedCandidate.appliedAt && (
                      <div>
                        <span className=&ldquo;font-medium&rdquo;>Actualizado:</span>{&ldquo; &rdquo;}
                        {formatDate(selectedCandidate.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cover Letter */}
              {selectedCandidate.coverLetter && (
                <div>
                  <h4 className=&ldquo;text-lg font-semibold mb-3&rdquo;>
                    Carta de Presentación
                  </h4>
                  <div className=&ldquo;bg-gray-50 p-4 rounded-lg&rdquo;>
                    <p className=&ldquo;text-sm whitespace-pre-wrap&rdquo;>
                      {selectedCandidate.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Question Answers */}
              {selectedCandidate.answers &&
                selectedCandidate.answers.length > 0 && (
                  <div>
                    <h4 className=&ldquo;text-lg font-semibold mb-3&rdquo;>
                      Respuestas a Preguntas
                    </h4>
                    <div className=&ldquo;space-y-4&rdquo;>
                      {selectedCandidate.answers.map((answer, index) => (
                        <div key={index} className=&ldquo;border rounded-lg p-4&rdquo;>
                          <h5 className=&ldquo;font-medium mb-2&rdquo;>
                            {answer.question}
                          </h5>
                          <p className=&ldquo;text-sm text-gray-700&rdquo;>
                            {answer.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Company Notes */}
              {selectedCandidate.notes && (
                <div>
                  <h4 className=&ldquo;text-lg font-semibold mb-3&rdquo;>
                    Notas de la Empresa
                  </h4>
                  <div className=&ldquo;bg-blue-50 p-4 rounded-lg&rdquo;>
                    <p className=&ldquo;text-sm&rdquo;>{selectedCandidate.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className=&ldquo;flex justify-end space-x-3 pt-4 border-t&rdquo;>
                {selectedCandidate.cvUrl && (
                  <Button variant=&ldquo;outline&rdquo; asChild>
                    <a
                      href={selectedCandidate.cvUrl}
                      target=&ldquo;_blank&rdquo;
                      rel=&ldquo;noopener noreferrer&rdquo;
                    >
                      <FileText className=&ldquo;mr-2 h-4 w-4&rdquo; />
                      Ver CV
                    </a>
                  </Button>
                )}
                <Button variant=&ldquo;outline&rdquo;>
                  <Mail className=&ldquo;mr-2 h-4 w-4&rdquo; />
                  Enviar Email
                </Button>
                <Button onClick={() => openUpdateDialog(selectedCandidate)}>
                  <Edit3 className=&ldquo;mr-2 h-4 w-4&rdquo; />
                  Actualizar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Candidate Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Candidato</DialogTitle>
            <DialogDescription>
              Actualiza el estado, calificación y notas del candidato
            </DialogDescription>
          </DialogHeader>

          <div className=&ldquo;space-y-4&rdquo;>
            <div>
              <Label htmlFor=&ldquo;status&rdquo;>Estado</Label>
              <Select
                value={candidateStatus}
                onValueChange={(value) =>
                  setCandidateStatus(value as ApplicationStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;SENT&rdquo;>Enviado</SelectItem>
                  <SelectItem value=&ldquo;UNDER_REVIEW&rdquo;>En Revisión</SelectItem>
                  <SelectItem value=&ldquo;PRE_SELECTED&rdquo;>Preseleccionado</SelectItem>
                  <SelectItem value=&ldquo;REJECTED&rdquo;>Rechazado</SelectItem>
                  <SelectItem value=&ldquo;HIRED&rdquo;>Contratado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor=&ldquo;rating&rdquo;>Calificación (1-5 estrellas)</Label>
              <div className=&ldquo;flex items-center gap-2 mt-2&rdquo;>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type=&ldquo;button&rdquo;
                    onClick={() => setCandidateRating(star)}
                    className=&ldquo;p-1&rdquo;
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= candidateRating
                          ? &ldquo;fill-yellow-400 text-yellow-400&rdquo;
                          : &ldquo;text-gray-300&rdquo;
                      }`}
                    />
                  </button>
                ))}
                <Button
                  variant=&ldquo;ghost&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => setCandidateRating(0)}
                  className=&ldquo;ml-2&rdquo;
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor=&ldquo;notes&rdquo;>Notas</Label>
              <Textarea
                id=&ldquo;notes&rdquo;
                placeholder=&ldquo;Agrega notas sobre el candidato...&rdquo;
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
                className=&ldquo;min-h-[100px]&rdquo;
              />
            </div>
          </div>

          <div className=&ldquo;flex justify-end space-x-3&rdquo;>
            <Button
              variant=&ldquo;outline&rdquo;
              onClick={() => setUpdateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateSubmit}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
