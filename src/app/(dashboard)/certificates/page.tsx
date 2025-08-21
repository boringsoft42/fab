"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Download, 
  FileText, 
  GraduationCap, 
  Calendar,
  Star,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useCertificates } from "@/hooks/useCertificates";

interface ModuleCertificate {
  id: string;
  moduleId: string;
  studentId: string;
  certificateUrl: string;
  issuedAt: string;
  grade: number;
  completedAt: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface CourseCertificate {
  id: string;
  userId: string;
  courseId: string;
  template: string;
  issuedAt: string;
  verificationCode: string;
  digitalSignature: string;
  isValid: boolean;
  url: string;
  course: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function CertificatesPage() {
  const {
    loading,
    error,
    downloading,
    loadModuleCertificates,
    loadCourseCertificates,
    downloadCertificate,
    setError
  } = useCertificates();

  const [moduleCertificates, setModuleCertificates] = useState<ModuleCertificate[]>([]);
  const [courseCertificates, setCourseCertificates] = useState<CourseCertificate[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setIsInitialized(true);
      setDebugInfo('Iniciando carga de certificados...');
      
      // Cargar certificados de módulos
      setDebugInfo('Cargando certificados de módulos...');
      const moduleCerts = await loadModuleCertificates();
      setModuleCertificates(moduleCerts);
      setDebugInfo(`Módulos cargados: ${moduleCerts.length}`);

      // Cargar certificados de cursos
      setDebugInfo('Cargando certificados de cursos...');
      const courseCerts = await loadCourseCertificates();
      setCourseCertificates(courseCerts);
      setDebugInfo(`Cursos cargados: ${courseCerts.length}`);

    } catch (err) {
      console.error('Error loading certificates:', err);
      setError('Error al cargar los certificados. Inténtalo de nuevo.');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleDownload = async (certificate: ModuleCertificate | CourseCertificate) => {
    try {
      const success = await downloadCertificate(certificate);
      if (!success) {
        alert('Error al descargar el certificado. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Error al descargar el certificado. Inténtalo de nuevo.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (grade >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const totalCertificates = moduleCertificates.length + courseCertificates.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Certificados</h1>
                <p className="text-gray-600 mt-1">
                  {totalCertificates} certificado{totalCertificates !== 1 ? 's' : ''} obtenido{totalCertificates !== 1 ? 's' : ''}
                </p>
                {debugInfo && (
                  <p className="text-xs text-blue-600 mt-1">Debug: {debugInfo}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Cargando certificados...</p>
                <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadCertificates}>
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {!loading && !error && (
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Módulos ({moduleCertificates.length})
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Cursos Completos ({courseCertificates.length})
              </TabsTrigger>
            </TabsList>

            {/* Certificados de Módulos */}
            <TabsContent value="modules" className="space-y-6">
              {moduleCertificates.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No tienes certificados de módulos aún
                      </h3>
                      <p className="text-gray-600">
                        Completa módulos de cursos para obtener certificados
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moduleCertificates.map((certificate) => (
                    <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{certificate.module.title}</CardTitle>
                              <p className="text-sm text-gray-600">{certificate.module.course.title}</p>
                            </div>
                          </div>
                          <Badge className={getGradeColor(certificate.grade)}>
                            {certificate.grade}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Emitido: {formatDate(certificate.issuedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completado: {formatDate(certificate.completedAt)}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleDownload(certificate)}
                          disabled={downloading === certificate.id}
                          className="w-full"
                        >
                          {downloading === certificate.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Descargando...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar Certificado
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Certificados de Cursos */}
            <TabsContent value="courses" className="space-y-6">
              {courseCertificates.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No tienes certificados de cursos completos aún
                      </h3>
                      <p className="text-gray-600">
                        Completa cursos enteros para obtener certificados de graduación
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseCertificates.map((certificate) => (
                    <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{certificate.course.title}</CardTitle>
                              <p className="text-sm text-gray-600">Curso Completo</p>
                            </div>
                          </div>
                          <Badge variant={certificate.isValid ? "default" : "destructive"}>
                            {certificate.isValid ? "Válido" : "Inválido"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Emitido: {formatDate(certificate.issuedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-4 w-4" />
                            <span>Código: {certificate.verificationCode}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>Plantilla: {certificate.template}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleDownload(certificate)}
                            disabled={downloading === certificate.id}
                            className="flex-1"
                          >
                            {downloading === certificate.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Descargando...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={() => window.open(certificate.url, '_blank')}
                            className="px-3"
                            title="Ver en navegador"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
