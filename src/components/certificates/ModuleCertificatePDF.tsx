import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getMainFont } from "@/lib/pdf-fonts";

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
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
  },
  certificateContainer: {
    border: "2px solid #3b82f6",
    borderRadius: 10,
    padding: 30,
    marginBottom: 30,
    backgroundColor: "#f8fafc",
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  certificateText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 1.5,
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
    textAlign: "center",
    marginBottom: 20,
  },
  courseInfo: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 15,
  },
  gradeInfo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
    marginBottom: 20,
  },
  dateInfo: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 30,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLine: {
    borderBottom: "1px solid #000",
    marginBottom: 10,
    height: 40,
  },
  signatureText: {
    fontSize: 12,
    color: "#6b7280",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  verificationCode: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
  },
});

interface ModuleCertificatePDFProps {
  certificate: {
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
  };
}

const ModuleCertificatePDF: React.FC<ModuleCertificatePDFProps> = ({
  certificate,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "#059669"; // Verde
    if (grade >= 80) return "#3b82f6"; // Azul
    if (grade >= 70) return "#f59e0b"; // Amarillo
    return "#dc2626"; // Rojo
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICADO DE MÓDULO</Text>
          <Text style={styles.subtitle}>Sistema de Certificaciones CEMSE</Text>
        </View>

        {/* Certificate Content */}
        <View style={styles.certificateContainer}>
          <Text style={styles.certificateTitle}>
            Certificado de Completación
          </Text>

          <Text style={styles.certificateText}>
            Se certifica que el estudiante ha completado exitosamente el módulo
            del curso correspondiente, demostrando competencia en los
            conocimientos y habilidades requeridas.
          </Text>

          <Text style={styles.studentName}>
            {certificate.student.firstName} {certificate.student.lastName}
          </Text>

          <Text style={styles.courseInfo}>
            Módulo: {certificate.module.title}
          </Text>

          <Text style={styles.courseInfo}>
            Curso: {certificate.module.course.title}
          </Text>

          <Text
            style={[
              styles.gradeInfo,
              { color: getGradeColor(certificate.grade) },
            ]}
          >
            Calificación: {certificate.grade}%
          </Text>

          <Text style={styles.dateInfo}>
            Completado el: {formatDate(certificate.completedAt)}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Instructor del Curso</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Director Académico</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este certificado es emitido electrónicamente y es válido sin firma
            física.
          </Text>
          <Text style={styles.verificationCode}>
            ID de Certificado: {certificate.id}
          </Text>
          <Text style={styles.verificationCode}>
            Emitido el: {formatDate(certificate.issuedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ModuleCertificatePDF;
