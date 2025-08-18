"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle, 
  Play, 
  Lock, 
  Clock,
  Award,
  ChevronRight
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'INTERACTIVE' | 'DOCUMENT';
  duration: number;
  order: number;
  isRequired: boolean;
}

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
  isRequired: boolean;
}

interface ModuleProgress {
  completed: boolean;
  lessonsCompleted: number;
  totalLessons: number;
  quizPassed?: boolean;
}

interface ModuleProgressProps {
  module: CourseModule;
  progress: ModuleProgress;
  isUnlocked: boolean;
  isCurrentModule: boolean;
  onLessonClick: (lessonId: string) => void;
  onQuizClick: (quizId: string) => void;
}

export const ModuleProgress: React.FC<ModuleProgressProps> = ({
  module,
  progress,
  isUnlocked,
  isCurrentModule,
  onLessonClick,
  onQuizClick
}) => {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Play className="h-4 w-4" />;
      case 'TEXT':
        return <BookOpen className="h-4 w-4" />;
      case 'INTERACTIVE':
        return <Award className="h-4 w-4" />;
      case 'DOCUMENT':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonStatus = (lessonId: string) => {
    // This would be calculated based on actual lesson progress
    // For now, we'll use a simple calculation
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
    const completedLessons = progress.lessonsCompleted;
    
    if (lessonIndex < completedLessons) {
      return 'completed';
    } else if (lessonIndex === completedLessons && isUnlocked) {
      return 'current';
    } else {
      return 'locked';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const moduleProgressPercentage = progress.totalLessons > 0 
    ? (progress.lessonsCompleted / progress.totalLessons) * 100 
    : 0;

  return (
    <Card className={`transition-all duration-200 ${
      isCurrentModule ? 'ring-2 ring-primary' : ''
    } ${!isUnlocked ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              progress.completed 
                ? 'bg-green-100 text-green-600' 
                : isUnlocked 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {progress.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : isUnlocked ? (
                <span className="text-sm font-bold">{module.order}</span>
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                Módulo {module.order}: {module.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {module.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {progress.completed && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completado
              </Badge>
            )}
            {isCurrentModule && !progress.completed && (
              <Badge variant="outline" className="border-primary text-primary">
                En progreso
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progreso del módulo
            </span>
            <span className="font-medium">
              {progress.lessonsCompleted} de {progress.totalLessons} lecciones
            </span>
          </div>
          <Progress value={moduleProgressPercentage} className="h-2" />
        </div>

        {/* Lessons List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Lecciones:</h4>
          {module.lessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            const isLocked = status === 'locked';

            return (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : isLocked
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (!isLocked) {
                    onLessonClick(lesson.id);
                  }
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-100 text-green-600'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    getLessonIcon(lesson.type)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      isCompleted ? 'text-green-700' : 
                      isCurrent ? 'text-blue-700' : 
                      'text-gray-500'
                    }`}>
                      {lesson.title}
                    </span>
                    {lesson.isRequired && (
                      <Badge variant="outline" className="text-xs">
                        Requerida
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      {getLessonIcon(lesson.type)}
                      {lesson.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                )}
              </div>
            );
          })}
        </div>

        {/* Quiz Section */}
        {module.quiz && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Evaluación:</h4>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                progress.quizPassed
                  ? 'bg-green-50 border-green-200'
                  : isUnlocked && progress.lessonsCompleted === progress.totalLessons
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  : 'bg-gray-50 border-gray-200 cursor-not-allowed'
              }`}
              onClick={() => {
                if (isUnlocked && progress.lessonsCompleted === progress.totalLessons) {
                  onQuizClick(module.quiz!.id);
                }
              }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progress.quizPassed
                  ? 'bg-green-100 text-green-600'
                  : isUnlocked && progress.lessonsCompleted === progress.totalLessons
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {progress.quizPassed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    progress.quizPassed ? 'text-green-700' : 
                    isUnlocked && progress.lessonsCompleted === progress.totalLessons
                    ? 'text-blue-700' : 
                    'text-gray-500'
                  }`}>
                    {module.quiz.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Puntaje mínimo: {module.quiz.passingScore}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Evaluación del módulo
                </p>
              </div>

              {isUnlocked && progress.lessonsCompleted === progress.totalLessons && !progress.quizPassed && (
                <ChevronRight className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
