"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  FileText,
  Video,
  Download,
  Play,
  CheckCircle,
  Target,
  Clock,
  Users,
  ArrowLeft,
  GripVertical,
  BookOpen,
  Search,
  ExternalLink,
  FileVideo,
  FileImage,
  Link as LinkIcon,
  Settings,
  Eye as Preview,
  Upload,
  HelpCircle,
} from "lucide-react";
import { useModuleLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from "@/hooks/useLessonApi";
import { useQueryClient } from "@tanstack/react-query";
import { useLessonResources } from "@/hooks/useLessonResourceApi";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";

export default function ModuleLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    contentType: "VIDEO" as "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE",
    videoUrl: "",
    videoFile: null as File | null,
    videoType: "youtube" as "youtube" | "upload",
    duration: 15,
    orderIndex: 1,
    isRequired: true,
    isPreview: false,
    attachments: [] as any[],
  });

  // Hooks
  const queryClient = useQueryClient();
  const { data: lessonsData, isLoading: lessonsLoading } = useModuleLessons(moduleId);
  const lessons = lessonsData?.lessons || [];
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLesson = async () => {
    try {
      // Check if we have a video file to upload
      if (formData.contentType === "VIDEO" && formData.videoType === "upload" && formData.videoFile) {
        // Use MinIO route for video upload
        setIsUploadingVideo(true);
        
        const formDataToSend = new FormData();
        
        // Add text fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('content', formData.content);
        formDataToSend.append('moduleId', moduleId);
        formDataToSend.append('contentType', formData.contentType);
        formDataToSend.append('duration', formData.duration.toString());
        formDataToSend.append('orderIndex', formData.orderIndex.toString());
        formDataToSend.append('isRequired', formData.isRequired.toString());
        formDataToSend.append('isPreview', formData.isPreview.toString());
        
        // Add video file
        formDataToSend.append('video', formData.videoFile);
        
        const response = await fetch('http://localhost:3001/api/lesson/with-video', {
          method: 'POST',
          headers: getAuthHeaders(true), // excludeContentType = true for FormData
          body: formDataToSend,
        });
        
        if (!response.ok) {
          throw new Error('Failed to create lesson with video');
        }
        
        const result = await response.json();
        console.log('Lección creada con video:', result);
        
        // Manually invalidate queries to refresh the lessons list
        queryClient.invalidateQueries({ queryKey: ['lessons', moduleId] });
        queryClient.invalidateQueries({ queryKey: ['moduleLessons', moduleId] });
      } else {
        // Use regular JSON route for text-only or YouTube videos
        await createLesson.mutateAsync({
          moduleId,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          contentType: formData.contentType,
          videoUrl: formData.videoUrl,
          duration: formData.duration,
          orderIndex: formData.orderIndex,
          isRequired: formData.isRequired,
          isPreview: formData.isPreview,
          attachments: formData.attachments,
        });
      }
      
      setIsCreateDialogOpen(false);
      setIsUploadingVideo(false);
      setFormData({
        title: "",
        description: "",
        content: "",
        contentType: "VIDEO",
        videoUrl: "",
        videoFile: null,
        videoType: "youtube",
        duration: 15,
        orderIndex: 1,
        isRequired: true,
        isPreview: false,
        attachments: [],
      });
      toast.success("Lección creada exitosamente");
    } catch (error) {
      console.error('Error creating lesson:', error);
      setIsUploadingVideo(false);
      toast.error("Error al crear la lección");
    }
  };

  const handleEditLesson = async () => {
    if (!editingLesson) return;
    
    try {
      await updateLesson.mutateAsync({
        id: editingLesson.id,
        ...formData,
      });
      
      setIsEditDialogOpen(false);
      setEditingLesson(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        contentType: "VIDEO",
        videoUrl: "",
        videoFile: null,
        videoType: "youtube",
        duration: 15,
        orderIndex: 1,
        isRequired: true,
        isPreview: false,
        attachments: [],
      });
      toast.success("Lección actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar la lección");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta lección?")) {
      try {
        await deleteLesson.mutateAsync(lessonId);
        toast.success("Lección eliminada exitosamente");
      } catch (error) {
        toast.error("Error al eliminar la lección");
      }
    }
  };

  const openEditDialog = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      content: lesson.content,
      contentType: lesson.contentType,
      videoUrl: lesson.videoUrl || "",
      videoFile: null,
      videoType: lesson.videoUrl ? "youtube" : "upload",
      duration: lesson.duration || 15,
      orderIndex: lesson.orderIndex,
      isRequired: lesson.isRequired,
      isPreview: lesson.isPreview,
      attachments: lesson.attachments || [],
    });
    setIsEditDialogOpen(true);
  };

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

  const getLessonStats = (lessonId: string) => {
    // Mock stats - in real implementation, fetch from API
    return {
      resources: 3,
      students: 25,
      completionRate: 85,
      averageTime: 12,
    };
  };

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/admin/courses/${courseId}/modules`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Módulos
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">📝 Gestión de Lecciones</h1>
            <p className="text-muted-foreground">
              Administra el contenido de lecciones del módulo
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Lección
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Lección</DialogTitle>
              <DialogDescription>
                Agrega una nueva lección al módulo con su contenido y configuración.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Título de la Lección</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Introducción a HTML"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Descripción</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el contenido de la lección..."
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="contentType">Tipo de Contenido</label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value: any) => setFormData({ ...formData, contentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="ASSIGNMENT">Asignación</SelectItem>
                    <SelectItem value="LIVE">En Vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.contentType === "VIDEO" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label>Tipo de Video</label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="youtube"
                          name="videoType"
                          value="youtube"
                          checked={formData.videoType === "youtube"}
                          onChange={(e) => setFormData({ ...formData, videoType: e.target.value as "youtube" | "upload" })}
                        />
                        <label htmlFor="youtube" className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          YouTube
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="upload"
                          name="videoType"
                          value="upload"
                          checked={formData.videoType === "upload"}
                          onChange={(e) => setFormData({ ...formData, videoType: e.target.value as "youtube" | "upload" })}
                        />
                        <label htmlFor="upload" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Subir Archivo
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.videoType === "youtube" && (
                    <div className="grid gap-2">
                      <label htmlFor="videoUrl">URL de YouTube</label>
                      <Input
                        id="videoUrl"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Pega la URL completa del video de YouTube
                      </p>
                    </div>
                  )}
                  
                  {formData.videoType === "upload" && (
                    <div className="grid gap-2">
                      <label>Subir Video</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {formData.videoFile ? formData.videoFile.name : "Arrastra un video aquí o haz clic para seleccionar"}
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, videoFile: file });
                            }
                          }}
                          className="hidden"
                          id="videoFile"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById('videoFile')?.click()}
                        >
                          Seleccionar Video
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Formatos: MP4, AVI, MOV. Máximo 500MB
                        </p>
                      </div>
                      {formData.videoFile && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="grid gap-2">
                <label htmlFor="content">Contenido</label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenido de la lección..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="orderIndex">Orden</label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="duration">Duración (minutos)</label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  />
                  <label htmlFor="isRequired">Obligatoria</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPreview"
                    checked={formData.isPreview}
                    onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                  />
                  <label htmlFor="isPreview">Vista previa</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
                             <Button 
                 onClick={handleCreateLesson} 
                 disabled={createLesson.isPending || isUploadingVideo}
               >
                 {createLesson.isPending || isUploadingVideo ? "Creando..." : "Crear Lección"}
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar lecciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Lección</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.map((lesson) => {
                  const stats = getLessonStats(lesson.id);
                  return (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            {getContentTypeIcon(lesson.contentType)}
                          </div>
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Lección {lesson.orderIndex}
                            </div>
                            {lesson.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {lesson.description}
                              </div>
                            )}
                            <div className="flex gap-1 mt-1">
                              {lesson.isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Obligatoria
                                </Badge>
                              )}
                              {lesson.isPreview && (
                                <Badge variant="secondary" className="text-xs">
                                  <Preview className="h-3 w-3 mr-1" />
                                  Vista previa
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getContentTypeIcon(lesson.contentType)}
                          <span className="ml-1">{getContentTypeLabel(lesson.contentType)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Download className="h-3 w-3 text-muted-foreground" />
                            <span>{stats.resources} recursos</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{stats.students} estudiantes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                            <span>{stats.completionRate}% completan</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          Activa
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/resources`}>
                                <Download className="h-4 w-4 mr-2" />
                                Gestionar recursos
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/quizzes`}>
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Gestionar quizzes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/preview`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Vista previa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/progress`}>
                                <Target className="h-4 w-4 mr-2" />
                                Progreso
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(lesson)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron lecciones
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza creando tu primera lección para el módulo"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Lección
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Lección</DialogTitle>
            <DialogDescription>
              Modifica la información de la lección seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title">Título de la Lección</label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Introducción a HTML"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description">Descripción</label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el contenido de la lección..."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-contentType">Tipo de Contenido</label>
              <Select
                value={formData.contentType}
                onValueChange={(value: any) => setFormData({ ...formData, contentType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="TEXT">Texto</SelectItem>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                  <SelectItem value="ASSIGNMENT">Asignación</SelectItem>
                  <SelectItem value="LIVE">En Vivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.contentType === "VIDEO" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>Tipo de Video</label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-youtube"
                        name="edit-videoType"
                        value="youtube"
                        checked={formData.videoType === "youtube"}
                        onChange={(e) => setFormData({ ...formData, videoType: e.target.value as "youtube" | "upload" })}
                      />
                      <label htmlFor="edit-youtube" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        YouTube
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-upload"
                        name="edit-videoType"
                        value="upload"
                        checked={formData.videoType === "upload"}
                        onChange={(e) => setFormData({ ...formData, videoType: e.target.value as "youtube" | "upload" })}
                      />
                      <label htmlFor="edit-upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Subir Archivo
                      </label>
                    </div>
                  </div>
                </div>
                
                {formData.videoType === "youtube" && (
                  <div className="grid gap-2">
                    <label htmlFor="edit-videoUrl">URL de YouTube</label>
                    <Input
                      id="edit-videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Pega la URL completa del video de YouTube
                    </p>
                  </div>
                )}
                
                {formData.videoType === "upload" && (
                  <div className="grid gap-2">
                    <label>Subir Video</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.videoFile ? formData.videoFile.name : "Arrastra un video aquí o haz clic para seleccionar"}
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, videoFile: file });
                          }
                        }}
                        className="hidden"
                        id="edit-videoFile"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        type="button"
                        onClick={() => document.getElementById('edit-videoFile')?.click()}
                      >
                        Seleccionar Video
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Formatos: MP4, AVI, MOV. Máximo 500MB
                      </p>
                    </div>
                    {formData.videoFile && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="grid gap-2">
              <label htmlFor="edit-content">Contenido</label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenido de la lección..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-orderIndex">Orden</label>
                <Input
                  id="edit-orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-duration">Duración (minutos)</label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isRequired"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                />
                <label htmlFor="edit-isRequired">Obligatoria</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPreview"
                  checked={formData.isPreview}
                  onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                />
                <label htmlFor="edit-isPreview">Vista previa</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditLesson} disabled={updateLesson.isPending}>
              {updateLesson.isPending ? "Actualizando..." : "Actualizar Lección"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
