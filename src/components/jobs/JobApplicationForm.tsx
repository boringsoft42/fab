"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Send, 
  FileText, 
  Mail, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { useCV } from "@/hooks/useCV";
import { getAuthHeaders } from "@/lib/api";
import { JobOffer } from "@/types/api";

interface JobApplicationFormProps {
  jobOffer: JobOffer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JobApplicationForm({ jobOffer, onSuccess, onCancel }: JobApplicationFormProps) {
  const { cvData, coverLetterData, loading, generateCVForApplication } = useCV();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coverLetterData) {
      setCoverLetter(coverLetterData.content);
    }
  }, [coverLetterData]);

  const handleGeneratePersonalizedCV = async () => {
    try {
      setError(null);
      const data = await generateCVForApplication(jobOffer.id);
      setApplicationData(data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating personalized CV:", error);
      setError("Error al generar el CV personalizado");
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Generar CV personalizado si no se ha hecho
      let cvDataForApplication = applicationData;
      if (!cvDataForApplication) {
        cvDataForApplication = await generateCVForApplication(jobOffer.id);
      }

      // Crear la aplicación
      const response = await fetch("/api/jobapplication", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobOfferId: jobOffer.id,
          coverLetter: coverLetter,
          cvData: cvDataForApplication.cvData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Application submitted successfully:", result);
        onSuccess?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error submitting application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(error instanceof Error ? error.message : "Error al enviar la aplicación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCV = async () => {
    try {
      const data = await generateCVForApplication(jobOffer.id);
      // Aquí podrías generar y descargar el PDF del CV
      console.log("CV data for download:", data);
    } catch (error) {
      console.error("Error downloading CV:", error);
      setError("Error al descargar el CV");
    }
  };

  const handleDownloadCoverLetter = async () => {
    try {
      // Aquí podrías generar y descargar el PDF de la carta de presentación
      console.log("Cover letter for download:", coverLetter);
    } catch (error) {
      console.error("Error downloading cover letter:", error);
      setError("Error al descargar la carta de presentación");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del trabajo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información del Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{jobOffer.title}</h3>
            <p className="text-gray-600">{jobOffer.company.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{jobOffer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{jobOffer.contractType}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>
                {jobOffer.salaryMin && jobOffer.salaryMax 
                  ? `${jobOffer.salaryMin} - ${jobOffer.salaryMax} ${jobOffer.salaryCurrency}`
                  : "Salario a convenir"
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>{jobOffer.workModality}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Habilidades Requeridas</h4>
            <div className="flex flex-wrap gap-2">
              {jobOffer.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {jobOffer.desiredSkills && jobOffer.desiredSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Habilidades Deseadas</h4>
              <div className="flex flex-wrap gap-2">
                {jobOffer.desiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Personalizado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Genera un CV personalizado para esta posición basado en tu perfil y las habilidades requeridas.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleGeneratePersonalizedCV}
              disabled={isSubmitting}
            >
              <Eye className="h-4 w-4 mr-2" />
              Generar CV Personalizado
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadCV}
              disabled={!applicationData}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar CV
            </Button>
          </div>

          {applicationData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">CV generado exitosamente</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Tu CV ha sido personalizado para esta posición con las habilidades más relevantes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carta de Presentación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Carta de Presentación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coverLetter">Personaliza tu carta de presentación</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              placeholder="Escribe tu carta de presentación personalizada..."
              className="mt-2"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadCoverLetter}
              disabled={!coverLetter.trim()}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Carta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmitApplication}
          disabled={isSubmitting || !coverLetter.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Enviando..." : "Enviar Aplicación"}
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa de la Aplicación</DialogTitle>
          </DialogHeader>
          
          {applicationData && (
            <div className="space-y-6">
              {/* CV Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">CV Personalizado</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-600">
                      {applicationData.cvData.personalInfo.firstName} {applicationData.cvData.personalInfo.lastName}
                    </h4>
                    <p className="text-gray-600">{applicationData.cvData.targetPosition}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Habilidades Relevantes</h5>
                    <div className="flex flex-wrap gap-2">
                      {applicationData.cvData.relevantSkills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Educación</h5>
                    <p className="text-sm text-gray-600">
                      {applicationData.cvData.education.level} - {applicationData.cvData.education.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Carta de Presentación</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {applicationData.coverLetter}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
