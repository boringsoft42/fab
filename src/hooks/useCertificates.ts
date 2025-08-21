"use client";

import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';

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

export const useCertificates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Cargar certificados de módulos
  const loadModuleCertificates = useCallback(async (): Promise<ModuleCertificate[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/modulecertificate');
      return response || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar certificados de módulos';
      setError(errorMessage);
      console.error('Error loading module certificates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar certificados de cursos
  const loadCourseCertificates = useCallback(async (): Promise<CourseCertificate[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/certificates');
      return response || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar certificados de cursos';
      setError(errorMessage);
      console.error('Error loading course certificates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Descargar certificado
  const downloadCertificate = useCallback(async (
    certificate: ModuleCertificate | CourseCertificate
  ): Promise<boolean> => {
    try {
      setDownloading(certificate.id);
      
      // Determinar la URL del certificado
      const certificateUrl = 'certificateUrl' in certificate 
        ? certificate.certificateUrl 
        : certificate.url;

      // Descargar el PDF
      const response = await fetch(certificateUrl);
      
      if (!response.ok) {
        throw new Error('No se pudo descargar el certificado');
      }

      const blob = await response.blob();
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo
      let fileName = '';
      if ('module' in certificate) {
        // Certificado de módulo
        fileName = `certificado-modulo-${certificate.module.title}.pdf`;
      } else {
        // Certificado de curso
        fileName = `certificado-curso-${certificate.course.title}.pdf`;
      }
      
      link.download = fileName;
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error descargando certificado:', error);
      setError('Error al descargar el certificado. Inténtalo de nuevo.');
      return false;
    } finally {
      setDownloading(null);
    }
  }, []);

  // Obtener certificado específico de módulo
  const getModuleCertificate = useCallback(async (certificateId: string): Promise<ModuleCertificate | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/modulecertificate/${certificateId}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener certificado de módulo';
      setError(errorMessage);
      console.error('Error getting module certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener certificado específico de curso
  const getCourseCertificate = useCallback(async (certificateId: string): Promise<CourseCertificate | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/certificates/${certificateId}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener certificado de curso';
      setError(errorMessage);
      console.error('Error getting course certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar certificado
  const verifyCertificate = useCallback(async (verificationCode: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(`/certificates/verify/${verificationCode}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar certificado';
      setError(errorMessage);
      console.error('Error verifying certificate:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    downloading,
    loadModuleCertificates,
    loadCourseCertificates,
    downloadCertificate,
    getModuleCertificate,
    getCourseCertificate,
    verifyCertificate,
    setError
  };
};
