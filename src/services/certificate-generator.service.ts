import { pdf } from '@react-pdf/renderer';
import React from 'react';
import ModuleCertificatePDF from '@/components/certificates/ModuleCertificatePDF';
import CourseCertificatePDF from '@/components/certificates/CourseCertificatePDF';

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

export class CertificateGeneratorService {
  /**
   * Genera y descarga un certificado de módulo
   */
  static async generateModuleCertificate(certificate: ModuleCertificate): Promise<boolean> {
    try {
      console.log('🔍 Generating module certificate for:', certificate.module.title);
      
      // Verificar que el certificado tenga los datos necesarios
      if (!certificate.module?.title || !certificate.student?.firstName) {
        throw new Error('Datos del certificado incompletos');
      }
      
      // Generar el PDF con mejor manejo de errores
      const pdfDoc = await pdf(
        React.createElement(ModuleCertificatePDF, { certificate })
      ).toBlob();
      
      if (!pdfDoc) {
        throw new Error('No se pudo generar el PDF');
      }
      
      // Crear URL del blob
      const url = URL.createObjectURL(pdfDoc);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado-modulo-${certificate.module.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      
      // Descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('✅ Module certificate generated and downloaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error generating module certificate:', error);
      console.error('Certificate data:', certificate);
      return false;
    }
  }

  /**
   * Genera y descarga un certificado de curso completo
   */
  static async generateCourseCertificate(certificate: CourseCertificate): Promise<boolean> {
    try {
      console.log('🔍 Generating course certificate for:', certificate.course.title);
      console.log('🔍 Certificate data:', JSON.stringify(certificate, null, 2));
      
      // Verificar que el certificado tenga los datos necesarios
      if (!certificate.course?.title) {
        throw new Error('Título del curso no encontrado');
      }
      
      if (!certificate.user?.firstName) {
        throw new Error('Nombre del usuario no encontrado');
      }
      
      if (!certificate.user?.lastName) {
        throw new Error('Apellido del usuario no encontrado');
      }
      
      console.log('🔍 All required data present, generating PDF...');
      
      // Generar el PDF con mejor manejo de errores
      const pdfDoc = await pdf(
        React.createElement(CourseCertificatePDF, { certificate })
      ).toBlob();
      
      if (!pdfDoc) {
        throw new Error('No se pudo generar el PDF');
      }
      
      console.log('🔍 PDF generated successfully, size:', pdfDoc.size);
      
      // Crear URL del blob
      const url = URL.createObjectURL(pdfDoc);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado-curso-${certificate.course.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      
      // Descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('✅ Course certificate generated and downloaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error generating course certificate:', error);
      console.error('Certificate data:', certificate);
      
      // Mostrar error más específico
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      
      return false;
    }
  }

  /**
   * Genera un certificado y retorna el blob (para previsualización)
   */
  static async generateCertificateBlob(
    certificate: ModuleCertificate | CourseCertificate
  ): Promise<Blob | null> {
    try {
      console.log('🔍 Generating certificate blob');
      
      let pdfDoc: Blob;
      
      if ('module' in certificate) {
        // Verificar datos del certificado de módulo
        if (!certificate.module?.title || !certificate.student?.firstName) {
          throw new Error('Datos del certificado de módulo incompletos');
        }
        
        // Es un certificado de módulo
        pdfDoc = await pdf(
          React.createElement(ModuleCertificatePDF, { certificate: certificate as ModuleCertificate })
        ).toBlob();
      } else {
        // Verificar datos del certificado de curso
        if (!certificate.course?.title || !certificate.user?.firstName) {
          throw new Error('Datos del certificado de curso incompletos');
        }
        
        // Es un certificado de curso
        pdfDoc = await pdf(
          React.createElement(CourseCertificatePDF, { certificate: certificate as CourseCertificate })
        ).toBlob();
      }
      
      if (!pdfDoc) {
        throw new Error('No se pudo generar el blob del PDF');
      }
      
      console.log('✅ Certificate blob generated successfully');
      return pdfDoc;
    } catch (error) {
      console.error('❌ Error generating certificate blob:', error);
      console.error('Certificate data:', certificate);
      return null;
    }
  }

  /**
   * Previsualiza un certificado en una nueva ventana
   */
  static async previewCertificate(
    certificate: ModuleCertificate | CourseCertificate
  ): Promise<boolean> {
    try {
      console.log('🔍 Previewing certificate');
      
      const blob = await this.generateCertificateBlob(certificate);
      if (!blob) {
        throw new Error('Failed to generate certificate blob');
      }
      
      // Crear URL del blob
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva ventana
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        throw new Error('Failed to open preview window');
      }
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
      console.log('✅ Certificate preview opened successfully');
      return true;
    } catch (error) {
      console.error('❌ Error previewing certificate:', error);
      console.error('Certificate data:', certificate);
      return false;
    }
  }

  /**
   * Determina el tipo de certificado y genera el PDF correspondiente
   */
  static async generateCertificate(
    certificate: ModuleCertificate | CourseCertificate
  ): Promise<boolean> {
    try {
      console.log('🔍 Generating certificate, type:', 'module' in certificate ? 'module' : 'course');
      
      if ('module' in certificate) {
        return await this.generateModuleCertificate(certificate);
      } else {
        return await this.generateCourseCertificate(certificate);
      }
    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      console.error('Certificate data:', certificate);
      return false;
    }
  }

  /**
   * Función de fallback: descarga el certificado desde la URL si está disponible
   */
  static async downloadFromUrl(certificate: ModuleCertificate | CourseCertificate): Promise<boolean> {
    try {
      console.log('🔍 Attempting to download from URL');
      
      const certificateUrl = 'certificateUrl' in certificate 
        ? certificate.certificateUrl 
        : certificate.url;

      if (!certificateUrl) {
        throw new Error('No URL disponible para descargar');
      }

      // Descargar el PDF desde la URL
      const response = await fetch(certificateUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo
      let fileName = '';
      if ('module' in certificate) {
        fileName = `certificado-modulo-${certificate.module.title}.pdf`;
      } else {
        fileName = `certificado-curso-${certificate.course.title}.pdf`;
      }
      
      link.download = fileName;
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Certificate downloaded from URL successfully');
      return true;
    } catch (error) {
      console.error('❌ Error downloading from URL:', error);
      return false;
    }
  }
}

export default CertificateGeneratorService;
