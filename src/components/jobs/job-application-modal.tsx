&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { X, Upload, FileText, Check } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from &ldquo;@/components/ui/dialog&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { RadioGroup, RadioGroupItem } from &ldquo;@/components/ui/radio-group&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { JobOffer, JobQuestionAnswer } from &ldquo;@/types/jobs&rdquo;;

interface JobApplicationModalProps {
  job: JobOffer;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobApplicationModal = ({ job, onClose, onSuccess }: JobApplicationModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState(&ldquo;&rdquo;);
  const [coverLetter, setCoverLetter] = useState(&ldquo;&rdquo;);
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
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast({
          title: &ldquo;Formato no válido&rdquo;,
          description: &ldquo;Por favor sube un archivo PDF o DOC&rdquo;,
          variant: &ldquo;destructive&rdquo;
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: &ldquo;Archivo muy grande&rdquo;,
          description: &ldquo;El archivo debe ser menor a 5MB&rdquo;,
          variant: &ldquo;destructive&rdquo;
        });
        return;
      }
      
      setSelectedCV(file);
      // In real app, upload to server and get URL
      setCvUrl(`/cv/${file.name}`);
    }
  };

  const handleQuestionAnswer = (questionId: string, question: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, answer }
            : a
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
            title: &ldquo;CV requerido&rdquo;,
            description: &ldquo;Por favor sube tu CV para continuar&rdquo;,
            variant: &ldquo;destructive&rdquo;
          });
          return false;
        }
        break;
      case 2:
        if (!coverLetter.trim()) {
          toast({
            title: &ldquo;Carta de presentación requerida&rdquo;,
            description: &ldquo;Por favor completa tu carta de presentación&rdquo;,
            variant: &ldquo;destructive&rdquo;
          });
          return false;
        }
        break;
      case 3:
        // Validate required questions
        const requiredQuestions = job.questions?.filter(q => q.required) || [];
        const answeredRequired = requiredQuestions.every(q => 
          answers.some(a => a.questionId === q.id && a.answer.trim())
        );
        
        if (!answeredRequired) {
          toast({
            title: &ldquo;Preguntas requeridas&rdquo;,
            description: &ldquo;Por favor responde todas las preguntas obligatorias&rdquo;,
            variant: &ldquo;destructive&rdquo;
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
        applicantId: &ldquo;mock-user-id&rdquo;, // In real app, get from auth
        applicantName: &ldquo;John Doe&rdquo;,
        applicantEmail: &ldquo;john@example.com&rdquo;,
        cvUrl,
        coverLetter,
        answers
      };
  
      const response = await fetch(`/api/jobs/${job.id}/applications`, {
        method: &ldquo;POST&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify(applicationData),
      });
  
      if (response.ok) {
        toast({
          title: &ldquo;¡Aplicación enviada!&rdquo;,
          description: &ldquo;Tu aplicación ha sido enviada exitosamente&rdquo;,
        });
        onSuccess();
      } else {
        toast({
          title: &ldquo;Error al enviar aplicación&rdquo;,
          description: error.error || &ldquo;Inténtalo de nuevo&rdquo;,
          variant: &ldquo;destructive&rdquo;
        });
      }
    } catch (error) {
      toast({
        title: &ldquo;Error de conexión&rdquo;,
        description: &ldquo;No se pudo enviar la aplicación. Inténtalo de nuevo.&rdquo;,
        variant: &ldquo;destructive&rdquo;
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className=&ldquo;space-y-6&rdquo;>
            <div>
              <h3 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Sube tu CV</h3>
              <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-8 text-center&rdquo;>
                {selectedCV ? (
                  <div className=&ldquo;flex items-center justify-center space-x-2&rdquo;>
                    <FileText className=&ldquo;w-8 h-8 text-green-600&rdquo; />
                    <div>
                      <p className=&ldquo;font-medium text-green-600&rdquo;>{selectedCV.name}</p>
                      <p className=&ldquo;text-sm text-gray-500&rdquo;>
                        {(selectedCV.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant=&ldquo;outline&rdquo;
                      size=&ldquo;sm&rdquo;
                      onClick={() => setSelectedCV(null)}
                    >
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-4&rdquo; />
                    <p className=&ldquo;text-lg font-medium text-gray-900 mb-2&rdquo;>
                      Sube tu CV
                    </p>
                    <p className=&ldquo;text-gray-600 mb-4&rdquo;>
                      Formatos soportados: PDF, DOC, DOCX (máx. 5MB)
                    </p>
                    <input
                      type=&ldquo;file&rdquo;
                      accept=&ldquo;.pdf,.doc,.docx&rdquo;
                      onChange={handleCVUpload}
                      className=&ldquo;hidden&rdquo;
                      id=&ldquo;cv-upload&rdquo;
                    />
                    <Button asChild>
                      <label htmlFor=&ldquo;cv-upload&rdquo; className=&ldquo;cursor-pointer&rdquo;>
                        Seleccionar archivo
                      </label>
                    </Button>
                  </div>
                )}
              </div>
              <p className=&ldquo;text-sm text-gray-600 mt-2&rdquo;>
                Tu CV debe estar actualizado y ser relevante para esta posición.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className=&ldquo;space-y-6&rdquo;>
            <div>
              <h3 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Carta de presentación</h3>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;use-template&rdquo;
                    checked={useTemplate}
                    onCheckedChange={(checked) => {
                      setUseTemplate(checked as boolean);
                      if (checked && !coverLetter) {
                        setCoverLetter(coverLetterTemplate);
                      }
                    }}
                  />
                  <Label htmlFor=&ldquo;use-template&rdquo; className=&ldquo;text-sm&rdquo;>
                    Usar plantilla sugerida
                  </Label>
                </div>
                
                <Textarea
                  placeholder=&ldquo;Escribe tu carta de presentación aquí...&rdquo;
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className=&ldquo;min-h-[300px]&rdquo;
                />
                
                <p className=&ldquo;text-sm text-gray-600&rdquo;>
                  Personaliza tu carta para destacar por qué eres el candidato ideal para esta posición.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className=&ldquo;space-y-6&rdquo;>
            <div>
              <h3 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Preguntas del empleador</h3>
              {job.questions && job.questions.length > 0 ? (
                <div className=&ldquo;space-y-6&rdquo;>
                  {job.questions.map((question, index) => (
                    <div key={question.id} className=&ldquo;space-y-3&rdquo;>
                      <Label className=&ldquo;text-sm font-medium&rdquo;>
                        {index + 1}. {question.question}
                        {question.required && <span className=&ldquo;text-red-500 ml-1&rdquo;>*</span>}
                      </Label>
                      
                      {question.type === &ldquo;TEXT&rdquo; && (
                        <Textarea
                          placeholder=&ldquo;Tu respuesta...&rdquo;
                          value={answers.find(a => a.questionId === question.id)?.answer || &ldquo;&rdquo;}
                          onChange={(e) => handleQuestionAnswer(question.id, question.question, e.target.value)}
                          className=&ldquo;min-h-[100px]&rdquo;
                        />
                      )}
                      
                      {question.type === &ldquo;MULTIPLE_CHOICE&rdquo; && question.options && (
                        <RadioGroup
                          value={answers.find(a => a.questionId === question.id)?.answer || &ldquo;&rdquo;}
                          onValueChange={(value) => handleQuestionAnswer(question.id, question.question, value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className=&ldquo;flex items-center space-x-2&rdquo;>
                              <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                              <Label htmlFor={`${question.id}-${optionIndex}`} className=&ldquo;text-sm&rdquo;>
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      {question.type === &ldquo;YES_NO&rdquo; && (
                        <RadioGroup
                          value={answers.find(a => a.questionId === question.id)?.answer || &ldquo;&rdquo;}
                          onValueChange={(value) => handleQuestionAnswer(question.id, question.question, value)}
                        >
                          <div className=&ldquo;flex items-center space-x-2&rdquo;>
                            <RadioGroupItem value=&ldquo;Sí&rdquo; id={`${question.id}-yes`} />
                            <Label htmlFor={`${question.id}-yes`} className=&ldquo;text-sm&rdquo;>Sí</Label>
                          </div>
                          <div className=&ldquo;flex items-center space-x-2&rdquo;>
                            <RadioGroupItem value=&ldquo;No&rdquo; id={`${question.id}-no`} />
                            <Label htmlFor={`${question.id}-no`} className=&ldquo;text-sm&rdquo;>No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className=&ldquo;text-gray-600 text-center py-8&rdquo;>
                  No hay preguntas adicionales para esta posición.
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className=&ldquo;space-y-6&rdquo;>
            <div className=&ldquo;text-center&rdquo;>
              <div className=&ldquo;w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4&rdquo;>
                <Check className=&ldquo;w-8 h-8 text-green-600&rdquo; />
              </div>
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>Revisa tu aplicación</h3>
              <p className=&ldquo;text-gray-600&rdquo;>
                Verifica que toda la información esté correcta antes de enviar
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className=&ldquo;text-base&rdquo;>Resumen de aplicación</CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center space-x-3&rdquo;>
                  <Avatar className=&ldquo;w-10 h-10&rdquo;>
                    <AvatarImage src={job.company.logo} alt={job.company.name} />
                    <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className=&ldquo;font-medium&rdquo;>{job.title}</p>
                    <p className=&ldquo;text-sm text-gray-600&rdquo;>{job.company.name}</p>
                  </div>
                </div>
                
                <div className=&ldquo;space-y-2 text-sm&rdquo;>
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span className=&ldquo;text-gray-600&rdquo;>CV:</span>
                    <span>{selectedCV?.name || &ldquo;CV subido&rdquo;}</span>
                  </div>
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span className=&ldquo;text-gray-600&rdquo;>Carta de presentación:</span>
                    <span>{coverLetter.length} caracteres</span>
                  </div>
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span className=&ldquo;text-gray-600&rdquo;>Preguntas respondidas:</span>
                    <span>{answers.length} de {job.questions?.length || 0}</span>
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
      <DialogContent className=&ldquo;max-w-2xl max-h-[90vh] overflow-y-auto&rdquo;>
        <DialogHeader>
          <DialogTitle className=&ldquo;flex items-center justify-between&rdquo;>
            <span>Aplicar a {job.title}</span>
            <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo; onClick={onClose}>
              <X className=&ldquo;w-4 h-4&rdquo; />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className=&ldquo;flex items-center space-x-2 mb-6&rdquo;>
          {Array.from({ length: maxSteps }, (_, i) => (
            <div key={i} className=&ldquo;flex items-center&rdquo;>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= step
                    ? &ldquo;bg-blue-600 text-white&rdquo;
                    : &ldquo;bg-gray-200 text-gray-600&rdquo;
                }`}
              >
                {i + 1}
              </div>
              {i < maxSteps - 1 && (
                <div
                  className={`w-8 h-1 ${
                    i + 1 < step ? &ldquo;bg-blue-600&rdquo; : &ldquo;bg-gray-200&rdquo;
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className=&ldquo;min-h-[400px]&rdquo;>
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className=&ldquo;flex justify-between pt-6 border-t&rdquo;>
          <Button
            variant=&ldquo;outline&rdquo;
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            disabled={loading}
          >
            {step > 1 ? &ldquo;Anterior&rdquo; : &ldquo;Cancelar&rdquo;}
          </Button>
          
          {step < maxSteps ? (
            <Button onClick={handleNext} disabled={loading}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? &ldquo;Enviando...&rdquo; : &ldquo;Enviar aplicación&rdquo;}
            </Button>
          )}
        </div>
      </DialogContent>
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
  <DialogContent className=&ldquo;max-w-md text-center&rdquo;>
    <DialogHeader>
      <DialogTitle className=&ldquo;text-lg&rdquo;>Términos y condiciones</DialogTitle>
    </DialogHeader>

    <p className=&ldquo;text-sm text-gray-600 mb-4&rdquo;>
      La información que compartas es confidencial y solo será visible por el empleador. 
      Al continuar, aceptas nuestros términos y condiciones de privacidad.
    </p>

    <div className=&ldquo;flex justify-center gap-4 mt-6&rdquo;>
      <Button variant=&ldquo;outline&rdquo; onClick={() => setShowTermsModal(false)}>
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