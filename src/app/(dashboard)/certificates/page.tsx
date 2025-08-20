"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Award,
  Download,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Star,
  CheckCircle,
  FileText,
  Share2,
} from "lucide-react";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
import Link from "next/link";

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  issuedAt: string;
  grade: number;
  status: "ISSUED" | "PENDING" | "EXPIRED";
  downloadUrl?: string;
  certificateNumber: string;
}

export default function CertificatesPage() {
  const { enrollments, loading, error } = useCourseEnrollments();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filtrar solo cursos completados para generar certificados
  const completedEnrollments = enrollments?.filter(e => e.status === "COMPLETED") || [];
  
  // Simular certificados basados en inscripciones completadas
  const certificates: Certificate[] = completedEnrollments.map(enrollment => ({
    id: `cert_${enrollment.id}`,
    courseId: enrollment.course.id,
    courseTitle: enrollment.course.title,
    courseCategory: enrollment.course.category,
    issuedAt: enrollment.completedAt || new Date().toISOString(),
    grade: Math.floor(Math.random() * 20) + 80, // Simular calificación entre 80-100
    status: "ISSUED" as const,
    certificateNumber: `CERT-${enrollment.id.slice(-8).toUpperCase()}`,
  }));

  // Estadísticas
  const stats = {
    total: certificates.length,
    thisMonth: certificates.filter(c => {
      const issuedDate = new Date(c.issuedAt);
      const now = new Date();
      return issuedDate.getMonth() === now.getMonth() && 
             issuedDate.getFullYear() === now.getFullYear();
    }).length,
    averageGrade: certificates.length > 0 
      ? Math.round(certificates.reduce((sum, c) => sum + c.grade, 0) / certificates.length)
      : 0,
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      SOFT_SKILLS: "Habilidades Blandas",
      BASIC_COMPETENCIES: "Competencias Básicas",
      JOB_PLACEMENT: "Inserción Laboral",
      ENTREPRENEURSHIP: "Emprendimiento",
      TECHNICAL_SKILLS: "Habilidades Técnicas",
      DIGITAL_LITERACY: "Alfabetización Digital",
      COMMUNICATION: "Comunicación",
      LEADERSHIP: "Liderazgo",
    };
    return labels[category] || category;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-800";
    if (grade >= 80) return "bg-blue-100 text-blue-800";
    if (grade >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return "Excelente";
    if (grade >= 80) return "Muy Bueno";
    if (grade >= 70) return "Bueno";
    return "Aceptable";
  };

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch = certificate.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certificate.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || certificate.courseCategory === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "SOFT_SKILLS", label: "Habilidades Blandas" },
    { value: "BASIC_COMPETENCIES", label: "Competencias Básicas" },
    { value: "JOB_PLACEMENT", label: "Inserción Laboral" },
    { value: "ENTREPRENEURSHIP", label: "Emprendimiento" },
    { value: "TECHNICAL_SKILLS", label: "Habilidades Técnicas" },
    { value: "DIGITAL_LITERACY", label: "Alfabetización Digital" },
    { value: "COMMUNICATION", label: "Comunicación" },
    { value: "LEADERSHIP", label: "Liderazgo" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Certificados</h1>
          <p className="text-muted-foreground">
            Descarga y comparte tus certificados de cursos completados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Certificados Obtenidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                  <p className="text-sm text-muted-foreground">Este Mes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.averageGrade}%</p>
                  <p className="text-sm text-muted-foreground">Promedio General</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar certificados..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredCertificates.length} certificados encontrados
          </p>
        </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error al cargar los certificados: {error}</p>
            </CardContent>
          </Card>
        )}

        {filteredCertificates.length === 0 && !loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {stats.total === 0 
                  ? "Aún no has completado ningún curso para obtener certificados" 
                  : "No se encontraron certificados con los filtros aplicados"
                }
              </p>
              {stats.total === 0 && (
                <Button asChild>
                  <Link href="/courses">
                    Explorar Cursos
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {certificate.courseTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {getCategoryLabel(certificate.courseCategory)}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getGradeColor(certificate.grade)}>
                        {certificate.grade}% - {getGradeLabel(certificate.grade)}
                      </Badge>
                      <Badge variant="outline">
                        {certificate.certificateNumber}
                      </Badge>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emitido el:</span>
                    <span>
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Emitido
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
