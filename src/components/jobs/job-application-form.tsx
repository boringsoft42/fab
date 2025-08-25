"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  Download
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { JobQuestion, JobOffer } from "@/types/jobs";
import { useCVStatus } from "@/hooks/use-cv-status";
import CVCheckModal from "./cv-check-modal";
import { extractFilePath, buildFileUrl } from "@/lib/utils";
import { API_BASE, apiCall } from "@/lib/api";

interface JobApplicationFormProps {
  jobOffer: JobOffer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface QuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export default function JobApplicationForm({ jobOffer, onSuccess, onCancel }: JobApplicationFormProps) {
  const { toast } = useToast();
  const { hasCV, hasCoverLetter, cvUrl, coverLetterUrl, cvData, checkCVStatus } = useCVStatus();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [showCVCheck, setShowCVCheck] = useState(false);
  const [formData, setFormData] = useState({
    notes: "",
    questionAnswers: [] as QuestionAnswer[],
    cvFile: "",
    coverLetterFile: ""
  });

  useEffect(() => {
    fetchQuestions();
  }, [jobOffer.id]);

  const fetchQuestions = async () => {
    try {
      const data = await apiCall(`/jobquestion?jobOfferId=${jobOffer.id}`);
      setQuestions(data);
      // Initialize question answers
      setFormData(prev => ({
        ...prev,
        questionAnswers: data.map((q: JobQuestion) => ({
          questionId: q.id,
          question: q.question,
          answer: ""
        }))
      }));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      questionAnswers: prev.questionAnswers.map(qa => 
        qa.questionId === questionId ? { ...qa, answer } : qa
      )
    }));
  };

  const validateForm = () => {
    // Check if user has at least one document (CV or cover letter PDF)
    if (!hasCV && !hasCoverLetter) {
      toast({
        title: "Error",
        description: "Necesitas al menos un CV o carta de presentación PDF para aplicar",
        variant: "destructive",
      });
      return false;
    }



    // Check required questions
    const requiredQuestions = questions.filter(q => q.required);
    for (const question of requiredQuestions) {
      const answer = formData.questionAnswers.find(qa => qa.questionId === question.id);
      if (!answer || !answer.answer.trim()) {
        toast({
          title: "Error",
          description: `Debes responder la pregunta: "${question.question}"`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const canSubmit = () => {
    // Must have at least one document (CV or cover letter PDF)
    if (!hasCV && !hasCoverLetter) {
      return false;
    }
    
    // Must answer all required questions
    const requiredQuestions = questions.filter(q => q.required);
    for (const question of requiredQuestions) {
      const answer = formData.questionAnswers.find(qa => qa.questionId === question.id);
      if (!answer || !answer.answer.trim()) {
        return false;
      }
    }
    
    return true;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has at least one document before proceeding
    if (!hasCV && !hasCoverLetter) {
      setShowCVCheck(true);
      return;
    }
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Error de autenticación",
          description: "No se encontró token de autorización. Por favor, inicia sesión nuevamente.",
          variant: "destructive",
        });
        return;
      }
      
      // Usar directamente las URLs que ya están en el estado del hook
      // Estas URLs ya fueron obtenidas al subir los archivos previamente
      
      // Step 2: Create job application with file URLs
      const applicationData = {
        jobOfferId: jobOffer.id,
        cvUrl: hasCV ? cvUrl : null,
        coverLetterUrl: hasCoverLetter ? coverLetterUrl : null,
        status: 'PENDING',
        message: formData.notes.trim() || '',
        questionAnswers: formData.questionAnswers.filter(qa => qa.answer.trim())
      };



      const response = await fetch(`${API_BASE}/jobapplication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(applicationData)
      });

             if (response.ok) {
         const result = await response.json();
         
         toast({
           title: "¡Aplicación enviada!",
           description: "Tu aplicación ha sido enviada correctamente",
         });
         onSuccess?.();
       } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la aplicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const renderQuestionInput = (question: JobQuestion) => {
    const answer = formData.questionAnswers.find(qa => qa.questionId === question.id);
    
    switch (question.type) {
      case "text":
        return (
          <Textarea
            value={answer?.answer || ""}
            onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            rows={3}
            required={question.required}
          />
        );
      
      case "multiple_choice":
        return (
          <Select
            value={answer?.answer || ""}
            onValueChange={(value) => handleQuestionAnswer(question.id, value)}
            required={question.required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "boolean":
        return (
          <Select
            value={answer?.answer || ""}
            onValueChange={(value) => handleQuestionAnswer(question.id, value)}
            required={question.required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona Sí o No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sí">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Aplicar a: {jobOffer.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Documents Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Documentos</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCVCheck(true)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Gestionar Documentos
                </Button>
              </div>
              
              {/* CV Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {hasCV ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                  <span className={hasCV ? "text-green-800" : "text-orange-800"}>
                    CV / Currículum Vitae
                  </span>
                </div>
                <div className="flex gap-2">
                                     {hasCV && cvUrl && (
                                           <Button variant="outline" size="sm" onClick={() => {
                        const fullCVUrl = buildFileUrl(cvUrl);
                        window.open(fullCVUrl, '_blank');
                      }}>
                       <Download className="h-4 w-4 mr-1" />
                       Ver CV
                     </Button>
                   )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCVCheck(true)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Gestionar
                  </Button>
                </div>
              </div>

              {/* Cover Letter Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {hasCoverLetter ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                  <span className={hasCoverLetter ? "text-green-800" : "text-orange-800"}>
                    Carta de Presentación (PDF)
                  </span>
                </div>
                <div className="flex gap-2">
                                     {hasCoverLetter && coverLetterUrl && (
                                           <Button variant="outline" size="sm" onClick={() => {
                        const fullCoverLetterUrl = buildFileUrl(coverLetterUrl);
                        window.open(fullCoverLetterUrl, '_blank');
                      }}>
                       <Download className="h-4 w-4 mr-1" />
                       Ver Carta
                     </Button>
                   )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCVCheck(true)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Gestionar
                  </Button>
                </div>
              </div>

                             {(!hasCV && !hasCoverLetter) && (
                 <div className="p-3 bg-orange-50 rounded-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertCircle className="h-4 w-4 text-orange-600" />
                     <span className="text-orange-800 font-medium">Documentos requeridos</span>
                   </div>
                   <p className="text-orange-700 text-sm mb-3">
                     Necesitas al menos un CV o carta de presentación PDF para aplicar a este empleo.
                   </p>
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => setShowCVCheck(true)}
                     >
                       <Upload className="h-4 w-4 mr-1" />
                       Gestionar Documentos
                     </Button>
                   </div>
                 </div>
               )}
            </div>



            {/* Notes Section */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Notas Adicionales
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional, disponibilidad para entrevistas, comentarios especiales..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Información adicional que consideres relevante para tu aplicación
              </p>
            </div>

            {/* Job Questions */}
            {questions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Preguntas del Empleo</h3>
                  <Badge variant="outline">{questions.length} pregunta{questions.length !== 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Label className="text-base font-medium">
                                  {question.question}
                                </Label>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Obligatoria
                                  </Badge>
                                )}
                              </div>
                              
                              {renderQuestionInput(question)}
                              
                              {question.type === "multiple_choice" && question.options && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Opciones: {question.options.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

                         {/* Submit Button */}
             <div className="flex gap-3 pt-4">
               {onCancel && (
                 <Button type="button" variant="outline" onClick={onCancel}>
                   Cancelar
                 </Button>
               )}
               <Button 
                 type="submit" 
                 disabled={loading || !canSubmit()} 
                 className="flex-1"
               >
                 {loading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Enviando aplicación...
                   </>
                 ) : (
                   <>
                     <Send className="mr-2 h-4 w-4" />
                     Enviar Aplicación
                   </>
                 )}
               </Button>
               {(!hasCV && !hasCoverLetter) && (
                 <Button 
                   type="button" 
                   variant="outline"
                   onClick={() => setShowCVCheck(true)}
                 >
                   <Upload className="mr-2 h-4 w-4" />
                   Subir Documentos
                 </Button>
               )}
             </div>
            
            {/* Validation Message */}
            {!canSubmit() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 text-sm font-medium">
                    Para enviar la aplicación necesitas:
                  </span>
                </div>
                                 <ul className="mt-2 text-yellow-700 text-sm space-y-1">
                   {!hasCV && !hasCoverLetter && (
                     <li>• Al menos un CV o carta de presentación PDF</li>
                   )}
                  {questions.filter(q => q.required).map(question => {
                    const answer = formData.questionAnswers.find(qa => qa.questionId === question.id);
                    if (!answer || !answer.answer.trim()) {
                      return (
                        <li key={question.id}>• Responder: "{question.question}"</li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* CV Check Modal */}
      <CVCheckModal
        isOpen={showCVCheck}
        onClose={() => {
          setShowCVCheck(false);
          // Forzar actualización del estado después de cerrar el modal
          setTimeout(() => {
            checkCVStatus();
          }, 100);
        }}
        onContinue={() => {
          setShowCVCheck(false);
          // Forzar actualización del estado después de continuar
          setTimeout(() => {
            checkCVStatus();
          }, 100);
        }}
        jobOfferId={jobOffer.id}
      />
    </div>
  );
}
