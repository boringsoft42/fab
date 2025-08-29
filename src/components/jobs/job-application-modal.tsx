"use client";

import { useState } from "react";
import { X, Upload, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { JobOffer, JobQuestionAnswer } from "@/types/jobs";

interface JobApplicationModalProps {
  job: JobOffer;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobApplicationModal = ({
  job,
  onClose,
  onSuccess,
}: JobApplicationModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [answers, setAnswers] = useState<JobQuestionAnswer[]>([]);
  const [useTemplate, setUseTemplate] = useState(true);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { toast } = useToast();

  const coverLetterTemplate = `Estimado equipo de ${job.company.name},

Me dirijo a ustedes con gran entusiasmo para expresar mi interés en la posición de ${job.title}. Considero que mis habilidades y experiencia se alinean perfectamente con los requisitos de este puesto.

[Describe brevemente tu experiencia relevante y por qué eres el candidato ideal]

Estoy especialmente interesado/a en trabajar en ${job.company.name} porque [menciona algo específico sobre la empresa que te atraiga].

Agradezco su tiempo y consideración. Espero tener la oportunidad de discutir cómo puedo contribuir al éxito de su equipo.

Atentamente,
[Tu nombre]`;

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast({
          title: "Formato no válido",
          description: "Por favor sube un archivo PDF o DOC",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo debe ser menor a 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedCV(file);
      // In real app, upload to server and get URL
      setCvUrl(`/cv/${file.name}`);
    }
  };

  const handleQuestionAnswer = (
    questionId: string,
    question: string,
    answer: string
  ) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, answer } : a
        );
      }
      return [...prev, { questionId, question, answer }];
    });
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!selectedCV && !cvUrl) {
          toast({
            title: "CV requerido",
            description: "Por favor sube tu CV para continuar",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!coverLetter.trim()) {
          toast({
            title: "Carta de presentación requerida",
            description: "Por favor completa tu carta de presentación",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        // Validate required questions
        const requiredQuestions =
          job.questions?.filter((q) => q.required) || [];
        const answeredRequired = requiredQuestions.every((q) =>
          answers.some((a) => a.questionId === q.id && a.answer.trim())
        );

        if (!answeredRequired) {
          toast({
            title: "Preguntas requeridas",
            description: "Por favor responde todas las preguntas obligatorias",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    if (!validateStep(step)) return;

    setLoading(true);
    try {
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company.name,
        companyLogo: job.company.logo,
        applicantId: "mock-user-id", // In real app, get from auth
        applicantName: "John Doe",
        applicantEmail: "john@example.com",
        cvUrl,
        coverLetter,
        answers,
      };

      const response = await fetch(`/api/jobs/${job.id}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        toast({
          title: "¡Aplicación enviada!",
          description: "Tu aplicación ha sido enviada exitosamente",
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error al enviar aplicación",
          description: errorData.error || "Inténtalo de nuevo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar la aplicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sube tu CV</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {selectedCV ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-600">
                        {selectedCV.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(selectedCV.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCV(null)}
                    >
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Sube tu CV
                    </p>
                    <p className="text-gray-600 mb-4">
                      Formatos soportados: PDF, DOC, DOCX (máx. 5MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <Button asChild>
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        Seleccionar archivo
                      </label>
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tu CV debe estar actualizado y ser relevante para esta posición.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Carta de presentación
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-template"
                    checked={useTemplate}
                    onCheckedChange={(checked) => {
                      setUseTemplate(checked as boolean);
                      if (checked && !coverLetter) {
                        setCoverLetter(coverLetterTemplate);
                      }
                    }}
                  />
                  <Label htmlFor="use-template" className="text-sm">
                    Usar plantilla sugerida
                  </Label>
                </div>

                <Textarea
                  placeholder="Escribe tu carta de presentación aquí..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[300px]"
                />

                <p className="text-sm text-gray-600">
                  Personaliza tu carta para destacar por qué eres el candidato
                  ideal para esta posición.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Preguntas del empleador
              </h3>
              {job.questions && job.questions.length > 0 ? (
                <div className="space-y-6">
                  {job.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-sm font-medium">
                        {index + 1}. {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>

                      {question.type === "TEXT" && (
                        <Textarea
                          placeholder="Tu respuesta..."
                          value={
                            answers.find((a) => a.questionId === question.id)
                              ?.answer || ""
                          }
                          onChange={(e) =>
                            handleQuestionAnswer(
                              question.id,
                              question.question,
                              e.target.value
                            )
                          }
                          className="min-h-[100px]"
                        />
                      )}

                      {question.type === "MULTIPLE_CHOICE" &&
                        question.options && (
                          <RadioGroup
                            value={
                              answers.find((a) => a.questionId === question.id)
                                ?.answer || ""
                            }
                            onValueChange={(value) =>
                              handleQuestionAnswer(
                                question.id,
                                question.question,
                                value
                              )
                            }
                          >
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={`${question.id}-${optionIndex}`}
                                />
                                <Label
                                  htmlFor={`${question.id}-${optionIndex}`}
                                  className="text-sm"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}

                      {question.type === "YES_NO" && (
                        <RadioGroup
                          value={
                            answers.find((a) => a.questionId === question.id)
                              ?.answer || ""
                          }
                          onValueChange={(value) =>
                            handleQuestionAnswer(
                              question.id,
                              question.question,
                              value
                            )
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Sí"
                              id={`${question.id}-yes`}
                            />
                            <Label
                              htmlFor={`${question.id}-yes`}
                              className="text-sm"
                            >
                              Sí
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="No"
                              id={`${question.id}-no`}
                            />
                            <Label
                              htmlFor={`${question.id}-no`}
                              className="text-sm"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No hay preguntas adicionales para esta posición.
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Revisa tu aplicación
              </h3>
              <p className="text-gray-600">
                Verifica que toda la información esté correcta antes de enviar
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Resumen de aplicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company.name}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CV:</span>
                    <span>{selectedCV?.name || "CV subido"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Carta de presentación:
                    </span>
                    <span>{coverLetter.length} caracteres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Preguntas respondidas:
                    </span>
                    <span>
                      {answers.length} de {job.questions?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const maxSteps = job.questions && job.questions.length > 0 ? 4 : 3;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aplicar a {job.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-6">
          {Array.from({ length: maxSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              {i < maxSteps - 1 && (
                <div
                  className={`w-8 h-1 ${
                    i + 1 < step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">{renderStepContent()}</div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            disabled={loading}
          >
            {step > 1 ? "Anterior" : "Cancelar"}
          </Button>

          {step < maxSteps ? (
            <Button onClick={handleNext} disabled={loading}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Enviando..." : "Enviar aplicación"}
            </Button>
          )}
        </div>
      </DialogContent>
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Términos y condiciones
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mb-4">
            La información que compartas es confidencial y solo será visible por
            el empleador. Al continuar, aceptas nuestros términos y condiciones
            de privacidad.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowTermsModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setTermsAccepted(true);
                setShowTermsModal(false);
                handleSubmit(); // Llama de nuevo para continuar ahora sí
              }}
            >
              Acepto y Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
