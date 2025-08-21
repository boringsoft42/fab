"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  GraduationCap, 
  Calendar,
  Star,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";

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

interface CertificateCardProps {
  certificate: ModuleCertificate | CourseCertificate;
  downloading?: string | null;
  onDownload: (certificate: ModuleCertificate | CourseCertificate) => void;
  onView?: (url: string) => void;
}

export function CertificateCard({ 
  certificate, 
  downloading, 
  onDownload,
  onView 
}: CertificateCardProps) {
  const isModuleCertificate = 'module' in certificate;
  const isDownloading = downloading === certificate.id;

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

  if (isModuleCertificate) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
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
            onClick={() => onDownload(certificate)}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
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
    );
  }

  // Course Certificate
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            onClick={() => onDownload(certificate)}
            disabled={isDownloading}
            className="flex-1"
          >
            {isDownloading ? (
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
          
          {onView && (
            <Button 
              variant="outline"
              onClick={() => onView(certificate.url)}
              className="px-3"
              title="Ver en navegador"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
