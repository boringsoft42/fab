"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Upload,
  X,
  FileText,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessReport {
  id: string;
  title: string;
  summary: string;
  status: "DRAFT" | "IN_REVIEW" | "COMPLETED" | "APPROVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  period: string;
  department: string;
  reportType: string;
  metrics: {
    revenue?: number;
    growth?: number;
    efficiency?: number;
  };
  attachments: number;
  reviewedBy?: string;
  approvedBy?: string;
}

export default function BusinessReportsPage() {
  const [reports, setReports] = useState<BusinessReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    draft: 0,
    inReview: 0,
    approved: 0,
  });

  // Report creation form state
  const [newReport, setNewReport] = useState({
    title: "",
    summary: "",
    content: "",
    reportType: "",
    department: "",
    period: "",
    priority: "MEDIUM",
    status: "DRAFT",
    metrics: {
      revenue: "",
      growth: "",
      efficiency: "",
    },
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      // Simulated data for demo
      const mockReports: BusinessReport[] = [
        {
          id: "1",
          title: "Reporte Financiero Q4 2023",
          summary:
            "Análisis completo de resultados financieros del cuarto trimestre",
          status: "APPROVED",
          priority: "HIGH",
          createdAt: "2024-01-15",
          period: "Q4 2023",
          department: "Finanzas",
          reportType: "Financiero",
          metrics: { revenue: 2500000, growth: 15, efficiency: 87 },
          attachments: 3,
          reviewedBy: "María González",
          approvedBy: "Carlos Mendoza",
        },
        {
          id: "2",
          title: "Análisis de Ventas Diciembre 2023",
          summary: "Reporte mensual de performance de ventas y proyecciones",
          status: "COMPLETED",
          priority: "MEDIUM",
          createdAt: "2024-01-10",
          period: "Diciembre 2023",
          department: "Ventas",
          reportType: "Comercial",
          metrics: { revenue: 450000, growth: 8, efficiency: 92 },
          attachments: 2,
          reviewedBy: "Ana Pérez",
        },
        {
          id: "3",
          title: "Reporte de Recursos Humanos - Año 2023",
          summary:
            "Análisis anual de gestión de talento y clima organizacional",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          createdAt: "2024-01-08",
          period: "Año 2023",
          department: "RRHH",
          reportType: "Recursos Humanos",
          metrics: { efficiency: 78 },
          attachments: 5,
          reviewedBy: "Luis Rodríguez",
        },
        {
          id: "4",
          title: "Análisis de Marketing Digital Q4",
          summary:
            "Performance de campañas digitales y ROI del último trimestre",
          status: "DRAFT",
          priority: "LOW",
          createdAt: "2024-01-05",
          period: "Q4 2023",
          department: "Marketing",
          reportType: "Marketing",
          metrics: { growth: 25, efficiency: 65 },
          attachments: 1,
        },
      ];

      const filteredReports =
        statusFilter === "all"
          ? mockReports
          : mockReports.filter((r) => r.status.toLowerCase() === statusFilter);

      setReports(filteredReports);
      setStats({
        total: mockReports.length,
        completed: mockReports.filter((r) => r.status === "COMPLETED").length,
        draft: mockReports.filter((r) => r.status === "DRAFT").length,
        inReview: mockReports.filter((r) => r.status === "IN_REVIEW").length,
        approved: mockReports.filter((r) => r.status === "APPROVED").length,
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAttachmentUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
  };

  const handleCreateReport = async () => {
    try {
      const reportData = {
        ...newReport,
        companyId: "company-1",
        createdAt: new Date().toISOString(),
        attachments: attachmentFile ? 1 : 0,
      };

      // Simulate API call
      console.log("Creating report:", reportData);

      setShowCreateDialog(false);
      setNewReport({
        title: "",
        summary: "",
        content: "",
        reportType: "",
        department: "",
        period: "",
        priority: "MEDIUM",
        status: "DRAFT",
        metrics: {
          revenue: "",
          growth: "",
          efficiency: "",
        },
      });
      setAttachmentFile(null);
      fetchReports();
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-blue-100 text-blue-800";
      case "LOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Aprobado";
      case "COMPLETED":
        return "Completado";
      case "IN_REVIEW":
        return "En Revisión";
      case "DRAFT":
        return "Borrador";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "Crítica";
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Media";
      case "LOW":
        return "Baja";
      default:
        return priority;
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes Empresariales</h1>
          <p className="text-muted-foreground">
            Gestiona y analiza todos los reportes de tu organización
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Reporte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Reporte</DialogTitle>
              <DialogDescription>
                Genera un nuevo reporte empresarial para análisis y seguimiento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* Attachment Upload Section */}
              <div className="grid gap-2">
                <Label>Archivo Adjunto</Label>
                {attachmentFile ? (
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{attachmentFile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeAttachment}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Adjunta documentos de soporte (Excel, PDF, Word)
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.xlsx,.xls,.docx,.doc"
                      onChange={handleAttachmentUpload}
                      className="hidden"
                      id="attachment-upload"
                    />
                    <Label
                      htmlFor="attachment-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Archivo
                    </Label>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Título del Reporte *</Label>
                <Input
                  id="title"
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  placeholder="Ej: Reporte Financiero Q1 2024"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="summary">Resumen Ejecutivo *</Label>
                <Textarea
                  id="summary"
                  value={newReport.summary}
                  onChange={(e) =>
                    setNewReport({ ...newReport, summary: e.target.value })
                  }
                  placeholder="Breve resumen de los hallazgos principales..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenido del Reporte *</Label>
                <Textarea
                  id="content"
                  value={newReport.content}
                  onChange={(e) =>
                    setNewReport({ ...newReport, content: e.target.value })
                  }
                  placeholder="Análisis detallado, metodología, conclusiones..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reportType">Tipo de Reporte</Label>
                  <Select
                    value={newReport.reportType}
                    onValueChange={(value) =>
                      setNewReport({ ...newReport, reportType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financiero">Financiero</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Operacional">Operacional</SelectItem>
                      <SelectItem value="Recursos Humanos">
                        Recursos Humanos
                      </SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Estratégico">Estratégico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select
                    value={newReport.department}
                    onValueChange={(value) =>
                      setNewReport({ ...newReport, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar depto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="RRHH">RRHH</SelectItem>
                      <SelectItem value="Operaciones">Operaciones</SelectItem>
                      <SelectItem value="TI">Tecnología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newReport.priority}
                    onValueChange={(value) =>
                      setNewReport({ ...newReport, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baja</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                      <SelectItem value="CRITICAL">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="period">Período del Reporte</Label>
                <Input
                  id="period"
                  value={newReport.period}
                  onChange={(e) =>
                    setNewReport({ ...newReport, period: e.target.value })
                  }
                  placeholder="Ej: Q1 2024, Enero 2024, Año 2023"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="revenue">Ingresos (Bs.)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={newReport.metrics.revenue}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: {
                          ...newReport.metrics,
                          revenue: e.target.value,
                        },
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="growth">Crecimiento (%)</Label>
                  <Input
                    id="growth"
                    type="number"
                    value={newReport.metrics.growth}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: {
                          ...newReport.metrics,
                          growth: e.target.value,
                        },
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="efficiency">Eficiencia (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    value={newReport.metrics.efficiency}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: {
                          ...newReport.metrics,
                          efficiency: e.target.value,
                        },
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateReport}
                  disabled={
                    !newReport.title || !newReport.summary || !newReport.content
                  }
                >
                  Crear como Borrador
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewReport({ ...newReport, status: "COMPLETED" });
                    handleCreateReport();
                  }}
                  disabled={
                    !newReport.title || !newReport.summary || !newReport.content
                  }
                >
                  Marcar como Completado
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reportes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.completed}
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
              {stats.inReview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.draft}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="in_review">En Revisión</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Reportes</CardTitle>
          <CardDescription>
            Gestiona todos tus reportes empresariales y su estado de revisión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporte</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Métricas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando reportes...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron reportes
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium line-clamp-1">
                            {report.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {report.summary}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.attachments} archivo(s) adjunto(s)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(report.priority)}>
                        {getPriorityText(report.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{report.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.period}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {report.metrics.revenue && (
                          <div>
                            Ingresos: Bs.{" "}
                            {report.metrics.revenue.toLocaleString()}
                          </div>
                        )}
                        {report.metrics.growth && (
                          <div className="text-green-600">
                            +{report.metrics.growth}% crecimiento
                          </div>
                        )}
                        {report.metrics.efficiency && (
                          <div>{report.metrics.efficiency}% eficiencia</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
