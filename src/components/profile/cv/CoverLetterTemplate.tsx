"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Eye, Edit, Save, Mail, Phone, MapPin } from "lucide-react";
import { getAuthHeaders } from "@/lib/api";
import { useCV } from "@/hooks/useCV";

// Estilos para el PDF de la carta de presentación
const coverLetterStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
  },
  senderInfo: {
    marginBottom: 20,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  senderDetails: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "right",
  },
  recipientInfo: {
    marginBottom: 20,
  },
  recipientTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 5,
  },
  recipientDetails: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 3,
  },
  greeting: {
    fontSize: 12,
    marginBottom: 15,
  },
  content: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 15,
    textAlign: "justify",
  },
  paragraph: {
    marginBottom: 12,
  },
  closing: {
    marginTop: 20,
    marginBottom: 10,
  },
  signature: {
    marginTop: 30,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  signatureDetails: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 2,
  },
});

// Componente PDF de la carta de presentación
const CoverLetterPDF = ({ coverLetterData, cvData }: { coverLetterData: any; cvData: any }) => (
  <Document>
    <Page size="A4" style={coverLetterStyles.page}>
      {/* Información del remitente */}
      <View style={coverLetterStyles.senderInfo}>
        <Text style={coverLetterStyles.senderName}>
          {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
        </Text>
        <Text style={coverLetterStyles.senderDetails}>
          {cvData?.personalInfo?.email}
        </Text>
        <Text style={coverLetterStyles.senderDetails}>
          {cvData?.personalInfo?.phone}
        </Text>
        <Text style={coverLetterStyles.senderDetails}>
          {cvData?.personalInfo?.address}
        </Text>
        <Text style={coverLetterStyles.senderDetails}>
          {cvData?.personalInfo?.municipality}, {cvData?.personalInfo?.department}
        </Text>
      </View>

      {/* Fecha */}
      <Text style={coverLetterStyles.date}>
        {new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>

      {/* Información del destinatario */}
      <View style={coverLetterStyles.recipientInfo}>
        <Text style={coverLetterStyles.recipientTitle}>
          Departamento de Recursos Humanos
        </Text>
        <Text style={coverLetterStyles.recipientDetails}>
          Nombre de la Empresa
        </Text>
        <Text style={coverLetterStyles.recipientDetails}>
          Dirección de la Empresa
        </Text>
        <Text style={coverLetterStyles.recipientDetails}>
          Ciudad, País
        </Text>
      </View>

      {/* Saludo */}
      <Text style={coverLetterStyles.greeting}>
        Estimado/a Reclutador/a,
      </Text>

      {/* Contenido */}
      <View style={coverLetterStyles.content}>
        <Text style={coverLetterStyles.paragraph}>
          {coverLetterData?.content || `Me dirijo a usted con gran interés para postularme a la posición disponible en su empresa. Soy ${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${cvData?.skills?.map(skill => skill.name).join(", ") || "diversas áreas"}.`}
        </Text>
        <Text style={coverLetterStyles.paragraph}>
          {`Mi formación académica en ${cvData?.education?.institution || "mi institución educativa"} me ha proporcionado una base sólida en ${cvData?.education?.level || "mi campo de estudio"}, y estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional.`}
        </Text>
        <Text style={coverLetterStyles.paragraph}>
          Estoy entusiasmado/a por la oportunidad de contribuir con mis habilidades y conocimientos a su organización, y estoy disponible para una entrevista en el momento que considere conveniente.
          </Text>
      </View>

      {/* Cierre */}
      <Text style={coverLetterStyles.closing}>
        Agradezco su consideración y quedo atento/a a su respuesta.
      </Text>

      {/* Firma */}
      <View style={coverLetterStyles.signature}>
        <Text style={coverLetterStyles.signatureName}>
          Atentamente,
        </Text>
        <Text style={coverLetterStyles.signatureName}>
          {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
        </Text>
        <Text style={coverLetterStyles.signatureDetails}>
          {cvData?.targetPosition || "Desarrollador Frontend"}
        </Text>
      </View>
    </Page>
  </Document>
);

// Template 1: Professional Business
function ProfessionalBusinessTemplate({ 
  coverLetterData, 
  cvData, 
  isEditing = false,
  onContentChange 
}: { 
  coverLetterData: any; 
  cvData: any; 
  isEditing?: boolean;
  onContentChange?: (content: string) => void;
}) {
  const [content, setContent] = useState(coverLetterData?.content || "");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{cvData?.personalInfo?.address}</div>
              <div>{cvData?.personalInfo?.municipality}, {cvData?.personalInfo?.department}</div>
              <div>{cvData?.personalInfo?.country}</div>
              <div>{cvData?.personalInfo?.email}</div>
              <div>{cvData?.personalInfo?.phone}</div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>{new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Para:</div>
        <div className="font-medium">
          <div>Departamento de Recursos Humanos</div>
          <div>Nombre de la Empresa</div>
          <div>Dirección de la Empresa</div>
          <div>Ciudad, País</div>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Asunto:</div>
        <div className="font-medium">
          Postulación para el puesto de {cvData?.targetPosition || "Desarrollador Frontend"}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Escriba su carta de presentación aquí..."
            className="min-h-[400px] text-sm leading-relaxed"
          />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content || `Estimado/a ${cvData?.personalInfo?.firstName || "Reclutador"},

Me dirijo a usted con gran interés para postularme a la posición de ${cvData?.targetPosition || "Desarrollador Frontend"} en su empresa. Soy ${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${cvData?.skills?.map(skill => skill.name).join(", ") || "diversas áreas"}.

Mi formación académica en ${cvData?.education?.institution || "mi institución educativa"} me ha proporcionado una base sólida en ${cvData?.education?.level || "mi campo de estudio"}, y estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional.

Mis principales fortalezas incluyen:
${cvData?.skills?.map(skill => `• ${skill.name}`).join("\n") || "• Capacidad de aprendizaje rápido\n• Trabajo en equipo\n• Comunicación efectiva"}

Estoy entusiasmado/a por la oportunidad de contribuir con mis habilidades y conocimientos a su organización, y estoy disponible para una entrevista en el momento que considere conveniente.

Agradezco su consideración y quedo atento/a a su respuesta.

Atentamente,
${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}`}
          </div>
        )}
      </div>
    </div>
  );
}

// Template 2: Modern Creative
function ModernCreativeTemplate({ 
  coverLetterData, 
  cvData, 
  isEditing = false,
  onContentChange 
}: { 
  coverLetterData: any; 
  cvData: any; 
  isEditing?: boolean;
  onContentChange?: (content: string) => void;
}) {
  const [content, setContent] = useState(coverLetterData?.content || "");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
            </h1>
            <p className="text-lg text-blue-600 mb-4">
              {cvData?.targetPosition || "Desarrollador Frontend"}
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {cvData?.personalInfo?.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {cvData?.personalInfo?.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {cvData?.personalInfo?.municipality}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="text-right text-sm text-gray-500 mb-6">
            {new Date().toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
            })}
          </div>

          {/* Content */}
          <div className="mb-8">
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Escriba su carta de presentación aquí..."
                className="min-h-[400px] text-sm leading-relaxed border-0 focus:ring-0 resize-none"
              />
            ) : (
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                {content || `Estimado/a ${cvData?.personalInfo?.firstName || "Reclutador"},

Me dirijo a usted con gran interés para postularme a la posición de ${cvData?.targetPosition || "Desarrollador Frontend"} en su empresa. Soy ${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${cvData?.skills?.map(skill => skill.name).join(", ") || "diversas áreas"}.

Mi formación académica en ${cvData?.education?.institution || "mi institución educativa"} me ha proporcionado una base sólida en ${cvData?.education?.level || "mi campo de estudio"}, y estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional.

Mis principales fortalezas incluyen:
${cvData?.skills?.map(skill => `• ${skill.name}`).join("\n") || "• Capacidad de aprendizaje rápido\n• Trabajo en equipo\n• Comunicación efectiva"}

Estoy entusiasmado/a por la oportunidad de contribuir con mis habilidades y conocimientos a su organización, y estoy disponible para una entrevista en el momento que considere conveniente.

Agradezco su consideración y quedo atento/a a su respuesta.

Atentamente,
${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}`}
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="border-t-2 border-blue-200 pt-6">
            <div className="text-center">
              <div className="font-semibold text-gray-800">
                {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
              </div>
              <div className="text-sm text-gray-600">
                {cvData?.targetPosition || "Desarrollador Frontend"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template 3: Minimalist Clean
function MinimalistCleanTemplate({ 
  coverLetterData, 
  cvData, 
  isEditing = false,
  onContentChange 
}: { 
  coverLetterData: any; 
  cvData: any; 
  isEditing?: boolean;
  onContentChange?: (content: string) => void;
}) {
  const [content, setContent] = useState(coverLetterData?.content || "");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  return (
    <div className="bg-white max-w-3xl mx-auto p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {cvData?.targetPosition || "Desarrollador Frontend"}
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <div>{cvData?.personalInfo?.email}</div>
          <div>{cvData?.personalInfo?.phone}</div>
          <div>{cvData?.personalInfo?.municipality}, {cvData?.personalInfo?.department}</div>
        </div>
      </div>

      {/* Date */}
      <div className="text-sm text-gray-500 mb-8">
        {new Date().toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
        })}
      </div>

      {/* Content */}
      <div className="mb-8">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Escriba su carta de presentación aquí..."
            className="min-h-[400px] text-sm leading-relaxed border-0 focus:ring-0 resize-none"
          />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
            {content || `Estimado/a ${cvData?.personalInfo?.firstName || "Reclutador"},

Me dirijo a usted con gran interés para postularme a la posición de ${cvData?.targetPosition || "Desarrollador Frontend"} en su empresa. Soy ${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${cvData?.skills?.map(skill => skill.name).join(", ") || "diversas áreas"}.

Mi formación académica en ${cvData?.education?.institution || "mi institución educativa"} me ha proporcionado una base sólida en ${cvData?.education?.level || "mi campo de estudio"}, y estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional.

Mis principales fortalezas incluyen:
${cvData?.skills?.map(skill => `• ${skill.name}`).join("\n") || "• Capacidad de aprendizaje rápido\n• Trabajo en equipo\n• Comunicación efectiva"}

Estoy entusiasmado/a por la oportunidad de contribuir con mis habilidades y conocimientos a su organización, y estoy disponible para una entrevista en el momento que considere conveniente.

Agradezco su consideración y quedo atento/a a su respuesta.

Atentamente,
${cvData?.personalInfo?.firstName || ""} ${cvData?.personalInfo?.lastName || ""}`}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Cover Letter Template Selector
export function CoverLetterTemplateSelector() {
  const { cvData, coverLetterData, loading, error, saveCoverLetterData } = useCV();
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(coverLetterData?.content || "");

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  const handleSave = async () => {
    try {
      await saveCoverLetterData(currentContent);
        setIsEditing(false);
    } catch (error) {
      console.error("Error saving cover letter:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!coverLetterData || !cvData) return;
    
    try {
      const blob = await pdf(<CoverLetterPDF coverLetterData={coverLetterData} cvData={cvData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Carta_Presentacion_${cvData.personalInfo?.firstName}_${cvData.personalInfo?.lastName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carta de presentación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar la carta de presentación</p>
      </div>
    );
  }

  const renderTemplate = () => {
    const templateProps = {
      coverLetterData,
      cvData,
      isEditing,
      onContentChange: handleContentChange
    };

    switch (selectedTemplate) {
      case "professional":
        return <ProfessionalBusinessTemplate {...templateProps} />;
      case "creative":
        return <ModernCreativeTemplate {...templateProps} />;
      case "minimalist":
        return <MinimalistCleanTemplate {...templateProps} />;
      default:
        return <ProfessionalBusinessTemplate {...templateProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Seleccionar Plantilla de Carta de Presentación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={selectedTemplate === "professional" ? "default" : "outline"}
              onClick={() => setSelectedTemplate("professional")}
              className="h-20 flex flex-col gap-2"
            >
              <span className="text-sm">Profesional</span>
              <span className="text-xs text-muted-foreground">Formato empresarial</span>
            </Button>
            <Button
              variant={selectedTemplate === "creative" ? "default" : "outline"}
              onClick={() => setSelectedTemplate("creative")}
              className="h-20 flex flex-col gap-2"
            >
              <span className="text-sm">Creativa</span>
              <span className="text-xs text-muted-foreground">Diseño moderno</span>
            </Button>
            <Button
              variant={selectedTemplate === "minimalist" ? "default" : "outline"}
              onClick={() => setSelectedTemplate("minimalist")}
              className="h-20 flex flex-col gap-2"
            >
              <span className="text-sm">Minimalista</span>
              <span className="text-xs text-muted-foreground">Estilo limpio</span>
            </Button>
        </div>
        </CardContent>
      </Card>

      {/* Cover Letter Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Carta de Presentación
            </CardTitle>
        <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Cancelar
          </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Download className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                                     <Button onClick={handleDownloadPDF} data-cover-letter-download>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {renderTemplate()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
