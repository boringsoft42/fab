"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  FileText,
  Video,
  Clock,
  CheckCircle,
  Target,
  Users,
  BookOpen,
  Eye,
  FileVideo,
  FileImage,
  File,
  ExternalLink,
} from "lucide-react";
import { useModuleLessons } from "@/hooks/useLessonApi";
import { useLessonResources } from "@/hooks/useLessonResourceApi";
import { VideoPlayer } from "@/components/video/VideoPlayer";

export default function LessonPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Fetch lesson data
  const { data: lessonsData, isLoading: lessonsLoading } = useModuleLessons(moduleId);
  const { data: resourcesData, isLoading: resourcesLoading } = useLessonResources(lessonId);

  const lesson = lessonsData?.lessons?.find(l => l.id === lessonId);
  const resources = resourcesData?.resources || [];

  if (lessonsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Lección no encontrada</h3>
          <p className="text-muted-foreground mb-4">
            La lección que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons`}>
              Volver a Lecciones
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'TEXT':
        return <FileText className="h-4 w-4" />;
      case 'QUIZ':
        return <Target className="h-4 w-4" />;
      case 'ASSIGNMENT':
        return <CheckCircle className="h-4 w-4" />;
      case 'LIVE':
        return <Play className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'Video';
      case 'TEXT':
        return 'Texto';
      case 'QUIZ':
        return 'Quiz';
      case 'ASSIGNMENT':
        return 'Asignación';
      case 'LIVE':
        return 'En Vivo';
      default:
        return 'Texto';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'image':
        return <FileImage className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Lecciones
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">👁️ Vista Previa de Lección</h1>
            <p className="text-muted-foreground">
              Visualiza cómo verá el estudiante esta lección
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Modo Vista Previa
        </Badge>
      </div>

      {/* Lesson Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {getContentTypeIcon(lesson.contentType)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{lesson.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {getContentTypeLabel(lesson.contentType)}
                      </Badge>
                      {lesson.isPreview && (
                        <Badge variant="secondary">
                          Vista previa
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {lesson.duration || 0} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {lesson.description && (
                <p className="text-muted-foreground mb-4">
                  {lesson.description}
                </p>
              )}
              
              {/* Video Content */}
              {lesson.contentType === 'VIDEO' && lesson.videoUrl && (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <VideoPlayer
                      videoUrl={lesson.videoUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                      title={lesson.title}
                    />
                  </div>
                  
                  {/* Video Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Progreso del video</span>
                      <span>{Math.round((currentTime / duration) * 100)}%</span>
                    </div>
                    <Progress value={(currentTime / duration) * 100} className="h-2" />
                  </div>
                </div>
              )}

              {/* Text Content */}
              {lesson.content && (
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              )}

              {/* Attachments */}
              {lesson.attachments && lesson.attachments.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Archivos Adjuntos
                    </h3>
                    <div className="grid gap-2">
                      {lesson.attachments.map((attachment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {getFileIcon(attachment.type || 'document')}
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(attachment.size || 0)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información de la Lección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">{getContentTypeLabel(lesson.contentType)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duración</p>
                  <p className="font-medium">{lesson.duration || 0} min</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Orden</p>
                  <p className="font-medium">{lesson.orderIndex}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className="font-medium">
                    {lesson.isRequired ? 'Obligatoria' : 'Opcional'}
                  </p>
                </div>
              </div>
              
              {lesson.isPreview && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Esta lección está marcada como vista previa y será visible para todos los estudiantes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos ({resources.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : resources.length > 0 ? (
                <div className="space-y-2">
                  {resources.map((resource: any) => (
                    <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.type || 'document')}
                        <div>
                          <p className="text-sm font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(resource.size || 0)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay recursos disponibles para esta lección.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navegación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Lecciones
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/resources`}>
                  <Download className="h-4 w-4 mr-2" />
                  Gestionar Recursos
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress`}>
                  <Target className="h-4 w-4 mr-2" />
                  Ver Progreso
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
