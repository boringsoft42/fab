"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Clock, 
  Award,
  Play,
  BookOpen
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  questions: any[];
  showCorrectAnswers?: boolean;
  isActive?: boolean;
}

interface QuizSelectorProps {
  quizzes: Quiz[];
  enrollmentId: string;
  onSelectQuiz: (quiz: Quiz) => void;
  onCancel?: () => void;
}

export const QuizSelector: React.FC<QuizSelectorProps> = ({
  quizzes,
  enrollmentId,
  onSelectQuiz,
  onCancel
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                ← Volver a la Lección
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold">Seleccionar Quiz</h1>
              <p className="text-sm text-muted-foreground">
                Elige el quiz que deseas tomar
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz, index) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline">Quiz {index + 1}</Badge>
                    {quiz.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground">
                      {quiz.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.questions?.length || 0} preguntas</span>
                    </div>
                    
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Límite: {formatTime(quiz.timeLimit)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>Puntaje mínimo: {quiz.passingScore}%</span>
                    </div>

                    {quiz.showCorrectAnswers && (
                      <div className="text-sm text-green-600">
                        ✓ Respuestas correctas disponibles
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    onClick={() => onSelectQuiz(quiz)}
                    disabled={!quiz.isActive}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {quiz.isActive ? 'Comenzar Quiz' : 'Quiz No Disponible'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {quizzes.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No hay quizzes disponibles</h3>
                  <p className="text-muted-foreground">
                    Esta lección no tiene quizzes asignados.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
