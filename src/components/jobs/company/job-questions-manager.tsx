'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { JobQuestion } from '@/types/jobs';
import { JobQuestionService } from '@/services/job-question.service';
import { Plus, Edit, Trash2, GripVertical, HelpCircle } from 'lucide-react';

interface JobQuestionsManagerProps {
  jobOfferId: string;
}

const questionTypes = [
  { value: 'text', label: 'Texto libre' },
  { value: 'multiple_choice', label: 'Opción múltiple' },
  { value: 'boolean', label: 'Sí/No' }
];

export default function JobQuestionsManager({ jobOfferId }: JobQuestionsManagerProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<JobQuestion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    type: 'text' as 'text' | 'multiple_choice' | 'boolean',
    required: false,
    options: [] as string[],
    orderIndex: 1
  });

  useEffect(() => {
    fetchQuestions();
  }, [jobOfferId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await JobQuestionService.getJobQuestions(jobOfferId);
      setQuestions(data.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las preguntas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      type: 'text',
      required: false,
      options: [],
      orderIndex: questions.length + 1
    });
    setEditingQuestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      toast({
        title: 'Error',
        description: 'La pregunta es obligatoria',
        variant: 'destructive'
      });
      return;
    }

    if (formData.type === 'multiple_choice' && formData.options.length < 2) {
      toast({
        title: 'Error',
        description: 'Las preguntas de opción múltiple deben tener al menos 2 opciones',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingQuestion) {
        await JobQuestionService.updateJobQuestion(editingQuestion.id, {
          question: formData.question,
          type: formData.type,
          required: formData.required,
          options: formData.options,
          orderIndex: formData.orderIndex
        });
        toast({
          title: 'Éxito',
          description: 'Pregunta actualizada correctamente'
        });
      } else {
        await JobQuestionService.createJobQuestions([{
          jobOfferId,
          question: formData.question,
          type: formData.type,
          required: formData.required,
          options: formData.options,
          orderIndex: formData.orderIndex
        }]);
        toast({
          title: 'Éxito',
          description: 'Pregunta creada correctamente'
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la pregunta',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (question: JobQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      type: question.type,
      required: question.required,
      options: question.options || [],
      orderIndex: question.orderIndex
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      return;
    }

    try {
      await JobQuestionService.deleteJobQuestion(questionId);
      toast({
        title: 'Éxito',
        description: 'Pregunta eliminada correctamente'
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la pregunta',
        variant: 'destructive'
      });
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const getTypeLabel = (type: string) => {
    return questionTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preguntas Personalizadas ({questions.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Pregunta *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Escribe tu pregunta aquí..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de pregunta</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'text' | 'multiple_choice' | 'boolean') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderIndex">Orden</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="required">Pregunta obligatoria</Label>
              </div>

              {(formData.type === 'multiple_choice' || formData.type === 'boolean') && (
                <div className="space-y-4">
                  <Label>Opciones</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opción ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Opción
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No hay preguntas personalizadas</p>
            <p className="text-sm text-gray-400">
              Agrega preguntas para obtener información específica de los candidatos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mt-1">
                      <span className="text-sm font-medium text-gray-600">
                        {question.orderIndex}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{question.question}</h3>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">
                            Obligatoria
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(question.type)}
                        </Badge>
                      </div>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Opciones:</p>
                          <div className="flex flex-wrap gap-1">
                            {question.options.map((option, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
