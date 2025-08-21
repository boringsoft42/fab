"use client";

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
import { 
  CheckCircle, 
  Award,
  Clock,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface LessonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lessonTitle: string;
  nextLesson?: {
    id: string;
    title: string;
    moduleTitle: string;
  } | null;
  loading?: boolean;
}

export function LessonCompletionModal({
  isOpen,
  onClose,
  onConfirm,
  lessonTitle,
  nextLesson,
  loading = false
}: LessonCompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completar Lección
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres marcar esta lección como completada?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información de la lección actual */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">{lessonTitle}</h4>
                  <p className="text-sm text-green-700">Lección actual</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Completada
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Siguiente lección si existe */}
          {nextLesson && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">{nextLesson.title}</h4>
                    <p className="text-sm text-blue-700">{nextLesson.moduleTitle}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    Siguiente
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensaje de confirmación */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Al completar esta lección, tu progreso se guardará y podrás continuar con el curso.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar Lección
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
