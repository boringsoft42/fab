"use client";

import { useState, useCallback } from 'react';
import { apiCall } from '@/lib/api';
import CertificateGeneratorService from '@/services/certificate-generator.service';

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
    description?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
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
      console.log('Module certificates response:', response);
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
      
      const response = await apiCall('/certificate');
      console.log('Course certificates response:', response);
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
      setError(null);
      
      console.log('🔍 Downloading certificate:', certificate.id);
      console.log('🔍 Certificate type:', 'module' in certificate ? 'module' : 'course');
      
      // Primero intentar generar el PDF
      let success = await CertificateGeneratorService.generateCertificate(certificate);
      
      // Si falla la generación, intentar descargar desde la URL
      if (!success) {
        console.log('⚠️ PDF generation failed, trying URL download...');
        success = await CertificateGeneratorService.downloadFromUrl(certificate);
      }
      
      if (!success) {
        const errorMsg = 'No se pudo descargar el certificado. Verifica que todos los datos estén completos.';
        console.error('❌ Download failed:', errorMsg);
        setError(errorMsg);
        return false;
      }
      
      console.log('✅ Certificate downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error descargando certificado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al descargar';
      setError(`Error al descargar el certificado: ${errorMessage}`);
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
      
      const response = await apiCall(`/certificate/${certificateId}`);
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
      
      const response = await apiCall(`/certificate/verify/${verificationCode}`);
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

  // Previsualizar certificado
  const previewCertificate = useCallback(async (
    certificate: ModuleCertificate | CourseCertificate
  ): Promise<boolean> => {
    try {
      setDownloading(certificate.id);
      
      console.log('🔍 Previewing certificate:', certificate.id);
      
      // Usar el servicio de previsualización
      const success = await CertificateGeneratorService.previewCertificate(certificate);
      
      if (!success) {
        throw new Error('No se pudo previsualizar el certificado');
      }
      
      console.log('✅ Certificate preview opened successfully');
      return true;
    } catch (error) {
      console.error('Error previsualizando certificado:', error);
      setError('Error al previsualizar el certificado. Inténtalo de nuevo.');
      return false;
    } finally {
      setDownloading(null);
    }
  }, []);

  // Generar certificados faltantes para cursos completados
  const generateMissingCertificates = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Generating missing certificates...');
      
      const response = await apiCall('/certificates/generate-missing', {
        method: 'POST'
      });
      
      if (response && response.success) {
        console.log('✅ Missing certificates generated:', response.message);
        return true;
      } else {
        throw new Error('No se pudieron generar los certificados faltantes');
      }
    } catch (error) {
      console.error('Error generating missing certificates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al generar certificados faltantes';
      setError(errorMessage);
      return false;
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
    previewCertificate,
    getModuleCertificate,
    getCourseCertificate,
    verifyCertificate,
    generateMissingCertificates,
    setError
  };
};
