"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Target
} from "lucide-react";
import { QuizAttempt } from "@/types/courses";

interface QuizCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizAttempt: QuizAttempt;
  quizTitle: string;
  onRetake?: () => void;
}

export function QuizCompletionModal({
  isOpen,
  onClose,
  quizAttempt,
  quizTitle,
  onRetake
}: QuizCompletionModalProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  const percentage = quizAttempt.score ? (quizAttempt.score / (quizAttempt.answers?.length || 1)) * 100 : 0;
  const passed = quizAttempt.passed || false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resultados del Quiz: {quizTitle}
          </DialogTitle>
          <DialogDescription>
            Aquí puedes revisar tu desempeño en el quiz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resultado General */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                {passed ? (
                  <div className="text-green-600">
                    <Trophy className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800">
                      ¡Excelente trabajo!
                    </h2>
                    <p className="text-green-600">Has aprobado el quiz exitosamente</p>
                  </div>
                ) : (
                  <div className="text-orange-600">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-orange-800">
                      Quiz completado
                    </h2>
                    <p className="text-orange-600">No alcanzaste el puntaje mínimo requerido</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {percentage.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Puntuación</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {quizAttempt.answers?.filter(a => a.isCorrect).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Correctas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {quizAttempt.answers?.filter(a => !a.isCorrect).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrectas</div>
                </div>
              </div>

              <div className="mb-6">
                <Progress value={percentage} className="h-3" />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Completado: {quizAttempt.completedAt ? new Date(quizAttempt.completedAt).toLocaleDateString() : 'N/A'}</span>
                <span>Tiempo: {Math.floor((quizAttempt.timeSpent || 0) / 60)}:{(quizAttempt.timeSpent || 0) % 60}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAnswers(!showAnswers)}
                className="flex items-center gap-2"
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Ocultar Respuestas
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Ver Respuestas
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-2">
              {onRetake && (
                <Button 
                  variant="outline" 
                  onClick={onRetake}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Intentar Nuevamente
                </Button>
              )}
              <Button onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>

          {/* Detalle de Respuestas */}
          {showAnswers && quizAttempt.answers && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detalle de Respuestas</h3>
                <div className="space-y-4">
                  {quizAttempt.answers.map((answer, index) => (
                    <div 
                      key={answer.questionId || index}
                      className={`p-4 rounded-lg border ${
                        answer.isCorrect 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answer.isCorrect 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {answer.isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Pregunta {index + 1}</span>
                            <Badge 
                              variant={answer.isCorrect ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {answer.isCorrect ? "Correcta" : "Incorrecta"}
                            </Badge>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">Tu respuesta:</span> {answer.answer}
                            </div>
                            {!answer.isCorrect && answer.correctAnswer && (
                              <div>
                                <span className="font-medium text-green-600">Respuesta correcta:</span> {answer.correctAnswer}
                              </div>
                            )}
                            {answer.explanation && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                                <span className="font-medium">Explicación:</span> {answer.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
