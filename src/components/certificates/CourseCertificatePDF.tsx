import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getMainFont, getMonospaceFont } from "@/lib/pdf-fonts";

// Estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: getMainFont(),
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
  },
  certificateContainer: {
    border: "3px solid #8b5cf6",
    borderRadius: 15,
    padding: 40,
    marginBottom: 30,
    backgroundColor: "#faf5ff",
  },
  certificateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 25,
  },
  certificateText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 1.6,
  },
  studentName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8b5cf6",
    textAlign: "center",
    marginBottom: 25,
  },
  courseInfo: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  courseDescription: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 25,
    fontStyle: "italic",
  },
  templateInfo: {
    fontSize: 16,
    color: "#059669",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },
  dateInfo: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 30,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLine: {
    borderBottom: "2px solid #000",
    marginBottom: 15,
    height: 50,
  },
  signatureText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  verificationSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 10,
  },
  verificationCode: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 5,
  },
  digitalSignature: {
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
    fontFamily: getMonospaceFont(),
  },
  badge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
});

interface CourseCertificatePDFProps {
  certificate: {
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
  };
}

const CourseCertificatePDF: React.FC<CourseCertificatePDFProps> = ({
  certificate,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTemplateLabel = (template: string) => {
    const templates: Record<string, string> = {
      default: "Certificado Estándar",
      premium: "Certificado Premium",
      gold: "Certificado de Oro",
      platinum: "Certificado de Platino",
    };
    return templates[template] || "Certificado Personalizado";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Badge de Validación */}
        <View style={styles.badge}>
          {certificate.isValid ? "VÁLIDO" : "INVÁLIDO"}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICADO DE GRADUACIÓN</Text>
          <Text style={styles.subtitle}>Sistema de Certificaciones CEMSE</Text>
        </View>

        {/* Certificate Content */}
        <View style={styles.certificateContainer}>
          <Text style={styles.certificateTitle}>
            Certificado de Finalización
          </Text>

          <Text style={styles.certificateText}>
            Se certifica que el estudiante ha completado exitosamente todo el
            programa de formación, demostrando dominio completo de los
            conocimientos, habilidades y competencias requeridas para la
            obtención de este certificado de graduación.
          </Text>

          <Text style={styles.studentName}>
            {certificate.user.firstName} {certificate.user.lastName}
          </Text>

          <Text style={styles.courseInfo}>
            Curso: {certificate.course.title}
          </Text>

          {certificate.course.description && (
            <Text style={styles.courseDescription}>
              &ldquo;{certificate.course.description}&rdquo;
            </Text>
          )}

          <Text style={styles.templateInfo}>
            Tipo: {getTemplateLabel(certificate.template)}
          </Text>

          <Text style={styles.dateInfo}>
            Graduado el: {formatDate(certificate.issuedAt)}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Director del Programa</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Rector Académico</Text>
          </View>
        </View>

        {/* Verification Section */}
        <View style={styles.verificationSection}>
          <Text style={styles.verificationTitle}>
            Información de Verificación
          </Text>
          <Text style={styles.verificationCode}>
            Código de Verificación: {certificate.verificationCode}
          </Text>
          <Text style={styles.verificationCode}>
            ID de Certificado: {certificate.id}
          </Text>
          <Text style={styles.digitalSignature}>
            Firma Digital: {certificate.digitalSignature}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este certificado es emitido electrónicamente y es válido sin firma
            física.
          </Text>
          <Text style={styles.footerText}>
            Para verificar la autenticidad de este certificado, visite nuestro
            portal de verificación.
          </Text>
          <Text style={styles.verificationCode}>
            Emitido el: {formatDate(certificate.issuedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CourseCertificatePDF;
