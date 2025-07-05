&ldquo;use client&rdquo;

import type React from &ldquo;react&rdquo;

import { useState, useEffect } from &ldquo;react&rdquo;
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
} from &ldquo;lucide-react&rdquo;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;
import { Input } from &ldquo;@/components/ui/input&rdquo;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &ldquo;@/components/ui/select&rdquo;
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from &ldquo;@/components/ui/dropdown-menu&rdquo;
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from &ldquo;@/components/ui/table&rdquo;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;
import { Label } from &ldquo;@/components/ui/label&rdquo;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;

interface BusinessReport {
  id: string
  title: string
  summary: string
  status: &ldquo;DRAFT&rdquo; | &ldquo;IN_REVIEW&rdquo; | &ldquo;COMPLETED&rdquo; | &ldquo;APPROVED&rdquo;
  priority: &ldquo;LOW&rdquo; | &ldquo;MEDIUM&rdquo; | &ldquo;HIGH&rdquo; | &ldquo;CRITICAL&rdquo;
  createdAt: string
  period: string
  department: string
  reportType: string
  metrics: {
    revenue?: number
    growth?: number
    efficiency?: number
  }
  attachments: number
  reviewedBy?: string
  approvedBy?: string
}

export default function BusinessReportsPage() {
  const [reports, setReports] = useState<BusinessReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(&ldquo;&rdquo;)
  const [statusFilter, setStatusFilter] = useState(&ldquo;all&rdquo;)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    draft: 0,
    inReview: 0,
    approved: 0,
  })

  // Report creation form state
  const [newReport, setNewReport] = useState({
    title: &ldquo;&rdquo;,
    summary: &ldquo;&rdquo;,
    content: &ldquo;&rdquo;,
    reportType: &ldquo;&rdquo;,
    department: &ldquo;&rdquo;,
    period: &ldquo;&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    status: &ldquo;DRAFT&rdquo;,
    metrics: {
      revenue: &ldquo;&rdquo;,
      growth: &ldquo;&rdquo;,
      efficiency: &ldquo;&rdquo;,
    },
  })

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  useEffect(() => {
    fetchReports()
  }, [statusFilter])

  const fetchReports = async () => {
    try {
      setLoading(true)
      // Simulated data for demo
      const mockReports: BusinessReport[] = [
        {
          id: &ldquo;1&rdquo;,
          title: &ldquo;Reporte Financiero Q4 2023&rdquo;,
          summary: &ldquo;Análisis completo de resultados financieros del cuarto trimestre&rdquo;,
          status: &ldquo;APPROVED&rdquo;,
          priority: &ldquo;HIGH&rdquo;,
          createdAt: &ldquo;2024-01-15&rdquo;,
          period: &ldquo;Q4 2023&rdquo;,
          department: &ldquo;Finanzas&rdquo;,
          reportType: &ldquo;Financiero&rdquo;,
          metrics: { revenue: 2500000, growth: 15, efficiency: 87 },
          attachments: 3,
          reviewedBy: &ldquo;María González&rdquo;,
          approvedBy: &ldquo;Carlos Mendoza&rdquo;,
        },
        {
          id: &ldquo;2&rdquo;,
          title: &ldquo;Análisis de Ventas Diciembre 2023&rdquo;,
          summary: &ldquo;Reporte mensual de performance de ventas y proyecciones&rdquo;,
          status: &ldquo;COMPLETED&rdquo;,
          priority: &ldquo;MEDIUM&rdquo;,
          createdAt: &ldquo;2024-01-10&rdquo;,
          period: &ldquo;Diciembre 2023&rdquo;,
          department: &ldquo;Ventas&rdquo;,
          reportType: &ldquo;Comercial&rdquo;,
          metrics: { revenue: 450000, growth: 8, efficiency: 92 },
          attachments: 2,
          reviewedBy: &ldquo;Ana Pérez&rdquo;,
        },
        {
          id: &ldquo;3&rdquo;,
          title: &ldquo;Reporte de Recursos Humanos - Año 2023&rdquo;,
          summary: &ldquo;Análisis anual de gestión de talento y clima organizacional&rdquo;,
          status: &ldquo;IN_REVIEW&rdquo;,
          priority: &ldquo;MEDIUM&rdquo;,
          createdAt: &ldquo;2024-01-08&rdquo;,
          period: &ldquo;Año 2023&rdquo;,
          department: &ldquo;RRHH&rdquo;,
          reportType: &ldquo;Recursos Humanos&rdquo;,
          metrics: { efficiency: 78 },
          attachments: 5,
          reviewedBy: &ldquo;Luis Rodríguez&rdquo;,
        },
        {
          id: &ldquo;4&rdquo;,
          title: &ldquo;Análisis de Marketing Digital Q4&rdquo;,
          summary: &ldquo;Performance de campañas digitales y ROI del último trimestre&rdquo;,
          status: &ldquo;DRAFT&rdquo;,
          priority: &ldquo;LOW&rdquo;,
          createdAt: &ldquo;2024-01-05&rdquo;,
          period: &ldquo;Q4 2023&rdquo;,
          department: &ldquo;Marketing&rdquo;,
          reportType: &ldquo;Marketing&rdquo;,
          metrics: { growth: 25, efficiency: 65 },
          attachments: 1,
        },
      ]

      const filteredReports =
        statusFilter === &ldquo;all&rdquo; ? mockReports : mockReports.filter((r) => r.status.toLowerCase() === statusFilter)

      setReports(filteredReports)
      setStats({
        total: mockReports.length,
        completed: mockReports.filter((r) => r.status === &ldquo;COMPLETED&rdquo;).length,
        draft: mockReports.filter((r) => r.status === &ldquo;DRAFT&rdquo;).length,
        inReview: mockReports.filter((r) => r.status === &ldquo;IN_REVIEW&rdquo;).length,
        approved: mockReports.filter((r) => r.status === &ldquo;APPROVED&rdquo;).length,
      })
    } catch (error) {
      console.error(&ldquo;Error fetching reports:&rdquo;, error)
    } finally {
      setLoading(false)
    }
  }

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAttachmentFile(file)
    }
  }

  const removeAttachment = () => {
    setAttachmentFile(null)
  }

  const handleCreateReport = async () => {
    try {
      const reportData = {
        ...newReport,
        companyId: &ldquo;company-1&rdquo;,
        createdAt: new Date().toISOString(),
        attachments: attachmentFile ? 1 : 0,
      }

      // Simulate API call
      console.log(&ldquo;Creating report:&rdquo;, reportData)

      setShowCreateDialog(false)
      setNewReport({
        title: &ldquo;&rdquo;,
        summary: &ldquo;&rdquo;,
        content: &ldquo;&rdquo;,
        reportType: &ldquo;&rdquo;,
        department: &ldquo;&rdquo;,
        period: &ldquo;&rdquo;,
        priority: &ldquo;MEDIUM&rdquo;,
        status: &ldquo;DRAFT&rdquo;,
        metrics: {
          revenue: &ldquo;&rdquo;,
          growth: &ldquo;&rdquo;,
          efficiency: &ldquo;&rdquo;,
        },
      })
      setAttachmentFile(null)
      fetchReports()
    } catch (error) {
      console.error(&ldquo;Error creating report:&rdquo;, error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;APPROVED&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;
      case &ldquo;COMPLETED&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;
      case &ldquo;IN_REVIEW&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;
      case &ldquo;DRAFT&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case &ldquo;CRITICAL&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;
      case &ldquo;HIGH&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;
      case &ldquo;LOW&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case &ldquo;APPROVED&rdquo;:
        return &ldquo;Aprobado&rdquo;
      case &ldquo;COMPLETED&rdquo;:
        return &ldquo;Completado&rdquo;
      case &ldquo;IN_REVIEW&rdquo;:
        return &ldquo;En Revisión&rdquo;
      case &ldquo;DRAFT&rdquo;:
        return &ldquo;Borrador&rdquo;
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case &ldquo;CRITICAL&rdquo;:
        return &ldquo;Crítica&rdquo;
      case &ldquo;HIGH&rdquo;:
        return &ldquo;Alta&rdquo;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;Media&rdquo;
      case &ldquo;LOW&rdquo;:
        return &ldquo;Baja&rdquo;
      default:
        return priority
    }
  }

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Reportes Empresariales</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>Gestiona y analiza todos los reportes de tu organización</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Crear Reporte
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-3xl&rdquo;>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Reporte</DialogTitle>
              <DialogDescription>Genera un nuevo reporte empresarial para análisis y seguimiento</DialogDescription>
            </DialogHeader>
            <div className=&ldquo;grid gap-4 py-4 max-h-[70vh] overflow-y-auto&rdquo;>
              {/* Attachment Upload Section */}
              <div className=&ldquo;grid gap-2&rdquo;>
                <Label>Archivo Adjunto</Label>
                {attachmentFile ? (
                  <div className=&ldquo;flex items-center gap-2 p-3 border rounded-lg&rdquo;>
                    <FileText className=&ldquo;w-4 h-4&rdquo; />
                    <span className=&ldquo;text-sm&rdquo;>{attachmentFile.name}</span>
                    <Button size=&ldquo;sm&rdquo; variant=&ldquo;ghost&rdquo; onClick={removeAttachment}>
                      <X className=&ldquo;w-4 h-4&rdquo; />
                    </Button>
                  </div>
                ) : (
                  <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center&rdquo;>
                    <FileText className=&ldquo;w-8 h-8 text-gray-400 mx-auto mb-2&rdquo; />
                    <p className=&ldquo;text-sm text-gray-500 mb-2&rdquo;>Adjunta documentos de soporte (Excel, PDF, Word)</p>
                    <Input
                      type=&ldquo;file&rdquo;
                      accept=&ldquo;.pdf,.xlsx,.xls,.docx,.doc&rdquo;
                      onChange={handleAttachmentUpload}
                      className=&ldquo;hidden&rdquo;
                      id=&ldquo;attachment-upload&rdquo;
                    />
                    <Label
                      htmlFor=&ldquo;attachment-upload&rdquo;
                      className=&ldquo;cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90&rdquo;
                    >
                      <Upload className=&ldquo;w-4 h-4 mr-2&rdquo; />
                      Subir Archivo
                    </Label>
                  </div>
                )}
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;title&rdquo;>Título del Reporte *</Label>
                <Input
                  id=&ldquo;title&rdquo;
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder=&ldquo;Ej: Reporte Financiero Q1 2024&rdquo;
                />
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;summary&rdquo;>Resumen Ejecutivo *</Label>
                <Textarea
                  id=&ldquo;summary&rdquo;
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  placeholder=&ldquo;Breve resumen de los hallazgos principales...&rdquo;
                  rows={2}
                />
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;content&rdquo;>Contenido del Reporte *</Label>
                <Textarea
                  id=&ldquo;content&rdquo;
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  placeholder=&ldquo;Análisis detallado, metodología, conclusiones...&rdquo;
                  rows={6}
                />
              </div>

              <div className=&ldquo;grid grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;reportType&rdquo;>Tipo de Reporte</Label>
                  <Select
                    value={newReport.reportType}
                    onValueChange={(value) => setNewReport({ ...newReport, reportType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar tipo&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;Financiero&rdquo;>Financiero</SelectItem>
                      <SelectItem value=&ldquo;Comercial&rdquo;>Comercial</SelectItem>
                      <SelectItem value=&ldquo;Operacional&rdquo;>Operacional</SelectItem>
                      <SelectItem value=&ldquo;Recursos Humanos&rdquo;>Recursos Humanos</SelectItem>
                      <SelectItem value=&ldquo;Marketing&rdquo;>Marketing</SelectItem>
                      <SelectItem value=&ldquo;Estratégico&rdquo;>Estratégico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;department&rdquo;>Departamento</Label>
                  <Select
                    value={newReport.department}
                    onValueChange={(value) => setNewReport({ ...newReport, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar depto&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;Finanzas&rdquo;>Finanzas</SelectItem>
                      <SelectItem value=&ldquo;Ventas&rdquo;>Ventas</SelectItem>
                      <SelectItem value=&ldquo;Marketing&rdquo;>Marketing</SelectItem>
                      <SelectItem value=&ldquo;RRHH&rdquo;>RRHH</SelectItem>
                      <SelectItem value=&ldquo;Operaciones&rdquo;>Operaciones</SelectItem>
                      <SelectItem value=&ldquo;TI&rdquo;>Tecnología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;priority&rdquo;>Prioridad</Label>
                  <Select
                    value={newReport.priority}
                    onValueChange={(value) => setNewReport({ ...newReport, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;LOW&rdquo;>Baja</SelectItem>
                      <SelectItem value=&ldquo;MEDIUM&rdquo;>Media</SelectItem>
                      <SelectItem value=&ldquo;HIGH&rdquo;>Alta</SelectItem>
                      <SelectItem value=&ldquo;CRITICAL&rdquo;>Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;period&rdquo;>Período del Reporte</Label>
                <Input
                  id=&ldquo;period&rdquo;
                  value={newReport.period}
                  onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                  placeholder=&ldquo;Ej: Q1 2024, Enero 2024, Año 2023&rdquo;
                />
              </div>

              <div className=&ldquo;grid grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;revenue&rdquo;>Ingresos (Bs.)</Label>
                  <Input
                    id=&ldquo;revenue&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newReport.metrics.revenue}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: { ...newReport.metrics, revenue: e.target.value },
                      })
                    }
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;growth&rdquo;>Crecimiento (%)</Label>
                  <Input
                    id=&ldquo;growth&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newReport.metrics.growth}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: { ...newReport.metrics, growth: e.target.value },
                      })
                    }
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;efficiency&rdquo;>Eficiencia (%)</Label>
                  <Input
                    id=&ldquo;efficiency&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newReport.metrics.efficiency}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        metrics: { ...newReport.metrics, efficiency: e.target.value },
                      })
                    }
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;flex gap-2 pt-4&rdquo;>
                <Button
                  onClick={handleCreateReport}
                  disabled={!newReport.title || !newReport.summary || !newReport.content}
                >
                  Crear como Borrador
                </Button>
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={() => {
                    setNewReport({ ...newReport, status: &ldquo;COMPLETED&rdquo; })
                    handleCreateReport()
                  }}
                  disabled={!newReport.title || !newReport.summary || !newReport.content}
                >
                  Marcar como Completado
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-5 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Reportes</CardTitle>
            <FileText className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Aprobados</CardTitle>
            <BarChart3 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Completados</CardTitle>
            <PieChart className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>En Revisión</CardTitle>
            <Eye className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-yellow-600&rdquo;>{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Borradores</CardTitle>
            <Edit className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-gray-600&rdquo;>{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;flex gap-4&rdquo;>
            <div className=&ldquo;flex-1&rdquo;>
              <Input
                placeholder=&ldquo;Buscar reportes...&rdquo;
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=&ldquo;max-w-sm&rdquo;
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className=&ldquo;w-[180px]&rdquo;>
                <SelectValue placeholder=&ldquo;Estado&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                <SelectItem value=&ldquo;approved&rdquo;>Aprobados</SelectItem>
                <SelectItem value=&ldquo;completed&rdquo;>Completados</SelectItem>
                <SelectItem value=&ldquo;in_review&rdquo;>En Revisión</SelectItem>
                <SelectItem value=&ldquo;draft&rdquo;>Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Reportes</CardTitle>
          <CardDescription>Gestiona todos tus reportes empresariales y su estado de revisión</CardDescription>
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
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    Cargando reportes...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    No se encontraron reportes
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className=&ldquo;flex gap-3&rdquo;>
                        <div className=&ldquo;w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center&rdquo;>
                          <FileText className=&ldquo;w-6 h-6 text-blue-600&rdquo; />
                        </div>
                        <div>
                          <div className=&ldquo;font-medium line-clamp-1&rdquo;>{report.title}</div>
                          <div className=&ldquo;text-sm text-muted-foreground line-clamp-1&rdquo;>{report.summary}</div>
                          <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                            {report.attachments} archivo(s) adjunto(s)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>{getStatusText(report.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(report.priority)}>{getPriorityText(report.priority)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <span>{report.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Calendar className=&ldquo;w-3 h-3&rdquo; />
                        {report.period}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;text-sm space-y-1&rdquo;>
                        {report.metrics.revenue && <div>Ingresos: Bs. {report.metrics.revenue.toLocaleString()}</div>}
                        {report.metrics.growth && (
                          <div className=&ldquo;text-green-600&rdquo;>+{report.metrics.growth}% crecimiento</div>
                        )}
                        {report.metrics.efficiency && <div>{report.metrics.efficiency}% eficiencia</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                            <MoreVertical className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Descargar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className=&ldquo;text-red-600&rdquo;>
                            <Trash2 className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
  )
}
