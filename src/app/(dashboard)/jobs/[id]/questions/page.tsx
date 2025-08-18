"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { JobQuestion } from "@/types/jobs";

interface QuestionFormData {
  question: string;
  type: 'text' | 'multiple_choice' | 'boolean';
  required: boolean;
  options: string[];
}

export default function JobQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params.id as string;

  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<JobQuestion | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    type: "text",
    required: false,
    options: []
  });
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, [jobId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobquestion?jobOfferId=${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las preguntas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const questionData = {
        jobOfferId: jobId,
        question: formData.question,
        type: formData.type,
        required: formData.required,
        options: formData.type === "text" ? [] : formData.options,
        orderIndex: questions.length + 1
      };

      const response = await fetch("/api/jobquestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Pregunta creada correctamente",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la pregunta",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingQuestion) return;

    try {
      const questionData = {
        question: formData.question,
        type: formData.type,
        required: formData.required,
        options: formData.type === "text" ? [] : formData.options,
      };

      const response = await fetch(`/api/jobquestion/${editingQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Pregunta actualizada correctamente",
        });
        setIsDialogOpen(false);
        setEditingQuestion(null);
        resetForm();
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la pregunta",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) return;

    try {
      const response = await fetch(`/api/jobquestion/${questionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Pregunta eliminada correctamente",
        });
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la pregunta",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (question: JobQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      type: question.type,
      required: question.required,
      options: question.options || []
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingQuestion(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      type: "text",
      required: false,
      options: []
    });
    setNewOption("");
  };

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption("");
    }
  };

  const removeOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(o => o !== option)
    }));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "text": return "Texto libre";
      case "multiple_choice": return "Opción múltiple";
      case "boolean": return "Sí/No";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Cargando preguntas...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Preguntas del Empleo</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona las preguntas que se harán a los candidatos
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Editar Pregunta" : "Nueva Pregunta"}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion 
                  ? "Modifica los detalles de la pregunta"
                  : "Crea una nueva pregunta para los candidatos"
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={editingQuestion ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question">Pregunta *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ej: ¿Cuántos años de experiencia tienes con React?"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de pregunta *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'text' | 'multiple_choice' | 'boolean') => 
                      setFormData({ ...formData, type: value, options: value === 'text' ? [] : formData.options })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto libre</SelectItem>
                      <SelectItem value="multiple_choice">Opción múltiple</SelectItem>
                      <SelectItem value="boolean">Sí/No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="required"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="required">Pregunta obligatoria</Label>
                </div>
              </div>

              {(formData.type === "multiple_choice" || formData.type === "boolean") && (
                <div>
                  <Label>Opciones</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Agregar opción..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOption();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addOption}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.options.map((option, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            type="button"
                            onClick={() => removeOption(option)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingQuestion ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">
                No hay preguntas configuradas para este empleo
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Los candidatos podrán aplicar sin responder preguntas específicas
              </p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{question.question}</h3>
                          {question.required && (
                            <Badge variant="destructive" className="text-xs">
                              Obligatoria
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">
                            {getTypeLabel(question.type)}
                          </Badge>
                        </div>

                        {question.options && question.options.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Opciones:</p>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option, optionIndex) => (
                                <Badge key={optionIndex} variant="secondary" className="text-xs">
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
