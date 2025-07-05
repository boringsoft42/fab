&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { RadioGroup, RadioGroupItem } from &ldquo;@/components/ui/radio-group&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from &ldquo;@/components/ui/dialog&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Save,
  Eye,
  HelpCircle,
  CheckCircle,
  X,
  Move,
  Timer,
  Settings,
} from &ldquo;lucide-react&rdquo;;

interface Question {
  id: string;
  type: &ldquo;multiple_choice&rdquo; | &ldquo;true_false&rdquo; | &ldquo;short_answer&rdquo; | &ldquo;multiple_select&rdquo;;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  allowedAttempts: number;
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

interface QuizBuilderProps {
  initialQuiz?: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

export function QuizBuilder({
  initialQuiz,
  onSave,
  onCancel,
}: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<Quiz>(
    initialQuiz || {
      id: `quiz-${Date.now()}`,
      title: &ldquo;&rdquo;,
      description: &ldquo;&rdquo;,
      instructions:
        &ldquo;Lee cada pregunta cuidadosamente y selecciona la mejor respuesta.&rdquo;,
      questions: [],
      timeLimit: undefined,
      passingScore: 70,
      allowedAttempts: 3,
      showCorrectAnswers: true,
      shuffleQuestions: false,
      shuffleOptions: false,
    }
  );

  const [activeTab, setActiveTab] = useState<
    &ldquo;setup&rdquo; | &ldquo;questions&rdquo; | &ldquo;settings&rdquo;
  >(&ldquo;setup&rdquo;);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);

  const updateQuiz = (updates: Partial<Quiz>) => {
    setQuiz((prev) => ({ ...prev, ...updates }));
  };

  const addQuestion = (questionData: Omit<Question, &ldquo;id&rdquo; | &ldquo;order&rdquo;>) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      order: quiz.questions.length + 1,
      ...questionData,
    };
    updateQuiz({
      questions: [...quiz.questions, newQuestion],
    });
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    updateQuiz({
      questions: quiz.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (questionId: string) => {
    if (window.confirm(&ldquo;¿Estás seguro de eliminar esta pregunta?&rdquo;)) {
      updateQuiz({
        questions: quiz.questions.filter((q) => q.id !== questionId),
      });
    }
  };

  const moveQuestion = (questionId: string, direction: &ldquo;up&rdquo; | &ldquo;down&rdquo;) => {
    const questions = [...quiz.questions];
    if (direction === &ldquo;up&rdquo; && index > 0) {
      [questions[index], questions[index - 1]] = [
        questions[index - 1],
        questions[index],
      ];
    } else if (direction === &ldquo;down&rdquo; && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [
        questions[index + 1],
        questions[index],
      ];
    }

    // Update order numbers
    questions.forEach((q, i) => (q.order = i + 1));
    updateQuiz({ questions });
  };

  const getTotalPoints = () => {
    return quiz.questions.reduce((total, q) => total + q.points, 0);
  };

  const getQuestionTypeLabel = (type: Question[&ldquo;type&rdquo;]) => {
    const labels = {
      multiple_choice: &ldquo;Opción Múltiple&rdquo;,
      true_false: &ldquo;Verdadero/Falso&rdquo;,
      short_answer: &ldquo;Respuesta Corta&rdquo;,
      multiple_select: &ldquo;Selección Múltiple&rdquo;,
    };
    return labels[type];
  };

  const handleSave = () => {
    if (quiz.title.trim() && quiz.questions.length > 0) {
      onSave(quiz);
    } else {
      alert(&ldquo;El quiz debe tener un título y al menos una pregunta.&rdquo;);
    }
  };

  return (
    <div className=&ldquo;max-w-4xl mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-2xl font-bold&rdquo;>
            {initialQuiz ? &ldquo;Editar Examen&rdquo; : &ldquo;Crear Nuevo Examen&rdquo;}
          </h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Diseña evaluaciones para medir el aprendizaje de los estudiantes
          </p>
        </div>
        <div className=&ldquo;flex gap-2&rdquo;>
          <Button variant=&ldquo;outline&rdquo; onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Guardar Examen
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{quiz.questions.length}</div>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Preguntas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{getTotalPoints()}</div>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Puntos Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {quiz.timeLimit || &ldquo;Sin límite&rdquo;}
            </div>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Tiempo (min)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{quiz.passingScore}%</div>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Nota Mínima</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className=&ldquo;border-b&rdquo;>
        <nav className=&ldquo;flex space-x-8&rdquo;>
          {[
            { id: &ldquo;setup&rdquo;, label: &ldquo;Configuración&rdquo;, icon: Settings },
            { id: &ldquo;questions&rdquo;, label: &ldquo;Preguntas&rdquo;, icon: HelpCircle },
            { id: &ldquo;settings&rdquo;, label: &ldquo;Opciones Avanzadas&rdquo;, icon: Timer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? &ldquo;border-primary text-primary&rdquo;
                  : &ldquo;border-transparent text-muted-foreground hover:text-foreground&rdquo;
              }`}
            >
              <tab.icon className=&ldquo;h-4 w-4&rdquo; />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Setup Tab */}
      {activeTab === &ldquo;setup&rdquo; && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Examen</CardTitle>
          </CardHeader>
          <CardContent className=&ldquo;space-y-4&rdquo;>
            <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;quizTitle&rdquo;>Título del Examen</Label>
                <Input
                  id=&ldquo;quizTitle&rdquo;
                  value={quiz.title}
                  onChange={(e) => updateQuiz({ title: e.target.value })}
                  placeholder=&ldquo;Ej: Evaluación Módulo 1&rdquo;
                />
              </div>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;passingScore&rdquo;>Nota Mínima (%)</Label>
                <Input
                  id=&ldquo;passingScore&rdquo;
                  type=&ldquo;number&rdquo;
                  min=&ldquo;0&rdquo;
                  max=&ldquo;100&rdquo;
                  value={quiz.passingScore}
                  onChange={(e) =>
                    updateQuiz({ passingScore: parseInt(e.target.value) || 70 })
                  }
                />
              </div>
            </div>

            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;quizDescription&rdquo;>Descripción</Label>
              <Textarea
                id=&ldquo;quizDescription&rdquo;
                value={quiz.description}
                onChange={(e) => updateQuiz({ description: e.target.value })}
                placeholder=&ldquo;Descripción del examen y su propósito&rdquo;
                rows={2}
              />
            </div>

            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;instructions&rdquo;>
                Instrucciones para el Estudiante
              </Label>
              <Textarea
                id=&ldquo;instructions&rdquo;
                value={quiz.instructions}
                onChange={(e) => updateQuiz({ instructions: e.target.value })}
                placeholder=&ldquo;Instrucciones específicas para el examen&rdquo;
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Tab */}
      {activeTab === &ldquo;questions&rdquo; && (
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h3 className=&ldquo;text-lg font-semibold&rdquo;>
              Preguntas ({quiz.questions.length})
            </h3>
            <Button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionDialog(true);
              }}
            >
              <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Agregar Pregunta
            </Button>
          </div>

          {quiz.questions.length === 0 ? (
            <Card>
              <CardContent className=&ldquo;p-8 text-center&rdquo;>
                <HelpCircle className=&ldquo;h-12 w-12 text-muted-foreground mx-auto mb-4&rdquo; />
                <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>Sin preguntas</h3>
                <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                  Comienza agregando la primera pregunta a tu examen
                </p>
                <Button
                  onClick={() => {
                    setEditingQuestion(null);
                    setShowQuestionDialog(true);
                  }}
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Agregar Primera Pregunta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className=&ldquo;space-y-3&rdquo;>
              {quiz.questions
                .sort((a, b) => a.order - b.order)
                .map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-start justify-between&rdquo;>
                        <div className=&ldquo;flex-1&rdquo;>
                          <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
                            <div className=&ldquo;w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium&rdquo;>
                              {index + 1}
                            </div>
                            <Badge variant=&ldquo;outline&rdquo;>
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant=&ldquo;secondary&rdquo;>
                              {question.points} pts
                            </Badge>
                          </div>

                          <h4 className=&ldquo;font-medium mb-2&rdquo;>
                            {question.question}
                          </h4>

                          {question.type === &ldquo;multiple_choice&rdquo; &&
                            question.options && (
                              <div className=&ldquo;space-y-1&rdquo;>
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className=&ldquo;flex items-center gap-2 text-sm&rdquo;
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        option === question.correctAnswer
                                          ? &ldquo;bg-green-500&rdquo;
                                          : &ldquo;bg-gray-300&rdquo;
                                      }`}
                                    />
                                    {option}
                                    {option === question.correctAnswer && (
                                      <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                          {question.type === &ldquo;true_false&rdquo; && (
                            <div className=&ldquo;flex gap-4 text-sm&rdquo;>
                              <div
                                className={`flex items-center gap-2 ${
                                  question.correctAnswer === &ldquo;true&rdquo;
                                    ? &ldquo;text-green-600 font-medium&rdquo;
                                    : &ldquo;&rdquo;
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    question.correctAnswer === &ldquo;true&rdquo;
                                      ? &ldquo;bg-green-500&rdquo;
                                      : &ldquo;bg-gray-300&rdquo;
                                  }`}
                                />
                                Verdadero
                              </div>
                              <div
                                className={`flex items-center gap-2 ${
                                  question.correctAnswer === &ldquo;false&rdquo;
                                    ? &ldquo;text-green-600 font-medium&rdquo;
                                    : &ldquo;&rdquo;
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    question.correctAnswer === &ldquo;false&rdquo;
                                      ? &ldquo;bg-green-500&rdquo;
                                      : &ldquo;bg-gray-300&rdquo;
                                  }`}
                                />
                                Falso
                              </div>
                            </div>
                          )}

                          {question.explanation && (
                            <p className=&ldquo;text-sm text-muted-foreground mt-2&rdquo;>
                              <strong>Explicación:</strong>{&ldquo; &rdquo;}
                              {question.explanation}
                            </p>
                          )}
                        </div>

                        <div className=&ldquo;flex items-center gap-1 ml-4&rdquo;>
                          <Button
                            variant=&ldquo;ghost&rdquo;
                            size=&ldquo;sm&rdquo;
                            onClick={() => moveQuestion(question.id, &ldquo;up&rdquo;)}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant=&ldquo;ghost&rdquo;
                            size=&ldquo;sm&rdquo;
                            onClick={() => moveQuestion(question.id, &ldquo;down&rdquo;)}
                            disabled={index === quiz.questions.length - 1}
                          >
                            ↓
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                                <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingQuestion(question);
                                  setShowQuestionDialog(true);
                                }}
                              >
                                <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteQuestion(question.id)}
                                className=&ldquo;text-red-600&rdquo;
                              >
                                <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === &ldquo;settings&rdquo; && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración Avanzada</CardTitle>
          </CardHeader>
          <CardContent className=&ldquo;space-y-6&rdquo;>
            <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;timeLimit&rdquo;>Límite de Tiempo (minutos)</Label>
                  <Input
                    id=&ldquo;timeLimit&rdquo;
                    type=&ldquo;number&rdquo;
                    min=&ldquo;1&rdquo;
                    value={quiz.timeLimit || &ldquo;&rdquo;}
                    onChange={(e) =>
                      updateQuiz({
                        timeLimit: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder=&ldquo;Sin límite&rdquo;
                  />
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                    Deja vacío para sin límite de tiempo
                  </p>
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;attempts&rdquo;>Intentos Permitidos</Label>
                  <Select
                    value={quiz.allowedAttempts.toString()}
                    onValueChange={(value) =>
                      updateQuiz({ allowedAttempts: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;1&rdquo;>1 intento</SelectItem>
                      <SelectItem value=&ldquo;2&rdquo;>2 intentos</SelectItem>
                      <SelectItem value=&ldquo;3&rdquo;>3 intentos</SelectItem>
                      <SelectItem value=&ldquo;5&rdquo;>5 intentos</SelectItem>
                      <SelectItem value=&ldquo;-1&rdquo;>Intentos ilimitados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;showCorrectAnswers&rdquo;
                    checked={quiz.showCorrectAnswers}
                    onCheckedChange={(checked) =>
                      updateQuiz({ showCorrectAnswers: !!checked })
                    }
                  />
                  <Label htmlFor=&ldquo;showCorrectAnswers&rdquo;>
                    Mostrar respuestas correctas después del examen
                  </Label>
                </div>

                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;shuffleQuestions&rdquo;
                    checked={quiz.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      updateQuiz({ shuffleQuestions: !!checked })
                    }
                  />
                  <Label htmlFor=&ldquo;shuffleQuestions&rdquo;>
                    Aleatorizar orden de preguntas
                  </Label>
                </div>

                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;shuffleOptions&rdquo;
                    checked={quiz.shuffleOptions}
                    onCheckedChange={(checked) =>
                      updateQuiz({ shuffleOptions: !!checked })
                    }
                  />
                  <Label htmlFor=&ldquo;shuffleOptions&rdquo;>
                    Aleatorizar opciones de respuesta
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Dialog */}
      <QuestionDialog
        isOpen={showQuestionDialog}
        onClose={() => {
          setShowQuestionDialog(false);
          setEditingQuestion(null);
        }}
        onSave={(questionData) => {
          if (editingQuestion) {
            updateQuestion(editingQuestion.id, questionData);
          } else {
            addQuestion(questionData);
          }
          setShowQuestionDialog(false);
          setEditingQuestion(null);
        }}
        question={editingQuestion}
      />
    </div>
  );
}

// Question Dialog Component
function QuestionDialog({
  isOpen,
  onClose,
  onSave,
  question,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Question, &ldquo;id&rdquo; | &ldquo;order&rdquo;>) => void;
  question?: Question | null;
}) {
  const [questionData, setQuestionData] = useState<
    Omit<Question, &ldquo;id&rdquo; | &ldquo;order&rdquo;>
  >({
    type: &ldquo;multiple_choice&rdquo;,
    question: &ldquo;&rdquo;,
    options: [&ldquo;&rdquo;, &ldquo;&rdquo;, &ldquo;&rdquo;, &ldquo;&rdquo;],
    correctAnswer: &ldquo;&rdquo;,
    explanation: &ldquo;&rdquo;,
    points: 10,
  });

  useState(() => {
    if (question) {
      setQuestionData({
        type: question.type,
        question: question.question,
        options: question.options || [],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || &ldquo;&rdquo;,
        points: question.points,
      });
    }
  }, [question]);

  const updateQuestion = (updates: Partial<typeof questionData>) => {
    setQuestionData((prev) => ({ ...prev, ...updates }));
  };

  const addOption = () => {
    updateQuestion({
      options: [...(questionData.options || []), &ldquo;&rdquo;],
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(questionData.options || [])];
    newOptions[index] = value;
    updateQuestion({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (questionData.options || []).filter(
      (_, i) => i !== index
    );
    updateQuestion({ options: newOptions });
  };

  const handleSave = () => {
    if (
      questionData.question.trim() &&
      (questionData.type !== &ldquo;multiple_choice&rdquo; ||
        questionData.options?.some((o) => o.trim())) &&
      questionData.correctAnswer
    ) {
      onSave(questionData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=&ldquo;max-w-2xl max-h-[90vh] overflow-y-auto&rdquo;>
        <DialogHeader>
          <DialogTitle>
            {question ? &ldquo;Editar Pregunta&rdquo; : &ldquo;Agregar Nueva Pregunta&rdquo;}
          </DialogTitle>
        </DialogHeader>

        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
            <div className=&ldquo;space-y-2&rdquo;>
              <Label>Tipo de Pregunta</Label>
              <Select
                value={questionData.type}
                onValueChange={(value: unknown) => updateQuestion({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;multiple_choice&rdquo;>
                    Opción Múltiple
                  </SelectItem>
                  <SelectItem value=&ldquo;true_false&rdquo;>Verdadero/Falso</SelectItem>
                  <SelectItem value=&ldquo;short_answer&rdquo;>Respuesta Corta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;points&rdquo;>Puntos</Label>
              <Input
                id=&ldquo;points&rdquo;
                type=&ldquo;number&rdquo;
                min=&ldquo;1&rdquo;
                value={questionData.points}
                onChange={(e) =>
                  updateQuestion({ points: parseInt(e.target.value) || 1 })
                }
              />
            </div>
          </div>

          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;questionText&rdquo;>Pregunta</Label>
            <Textarea
              id=&ldquo;questionText&rdquo;
              value={questionData.question}
              onChange={(e) => updateQuestion({ question: e.target.value })}
              placeholder=&ldquo;Escribe la pregunta...&rdquo;
              rows={3}
            />
          </div>

          {questionData.type === &ldquo;multiple_choice&rdquo; && (
            <div className=&ldquo;space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <Label>Opciones de Respuesta</Label>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={addOption}>
                  <Plus className=&ldquo;h-4 w-4 mr-1&rdquo; />
                  Agregar Opción
                </Button>
              </div>

              <RadioGroup
                value={questionData.correctAnswer as string}
                onValueChange={(value) =>
                  updateQuestion({ correctAnswer: value })
                }
              >
                {questionData.options?.map((option, index) => (
                  <div key={index} className=&ldquo;flex items-center gap-2&rdquo;>
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Opción ${index + 1}`}
                      className=&ldquo;flex-1&rdquo;
                    />
                    {(questionData.options?.length || 0) > 2 && (
                      <Button
                        variant=&ldquo;ghost&rdquo;
                        size=&ldquo;sm&rdquo;
                        onClick={() => removeOption(index)}
                      >
                        <X className=&ldquo;h-4 w-4&rdquo; />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                Selecciona la opción correcta
              </p>
            </div>
          )}

          {questionData.type === &ldquo;true_false&rdquo; && (
            <div className=&ldquo;space-y-2&rdquo;>
              <Label>Respuesta Correcta</Label>
              <RadioGroup
                value={questionData.correctAnswer as string}
                onValueChange={(value) =>
                  updateQuestion({ correctAnswer: value })
                }
              >
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <RadioGroupItem value=&ldquo;true&rdquo; id=&ldquo;true&rdquo; />
                  <Label htmlFor=&ldquo;true&rdquo;>Verdadero</Label>
                </div>
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <RadioGroupItem value=&ldquo;false&rdquo; id=&ldquo;false&rdquo; />
                  <Label htmlFor=&ldquo;false&rdquo;>Falso</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {questionData.type === &ldquo;short_answer&rdquo; && (
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;correctAnswer&rdquo;>Respuesta Correcta</Label>
              <Input
                id=&ldquo;correctAnswer&rdquo;
                value={questionData.correctAnswer as string}
                onChange={(e) =>
                  updateQuestion({ correctAnswer: e.target.value })
                }
                placeholder=&ldquo;Respuesta esperada...&rdquo;
              />
            </div>
          )}

          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;explanation&rdquo;>Explicación (Opcional)</Label>
            <Textarea
              id=&ldquo;explanation&rdquo;
              value={questionData.explanation}
              onChange={(e) => updateQuestion({ explanation: e.target.value })}
              placeholder=&ldquo;Explicación de por qué esta es la respuesta correcta...&rdquo;
              rows={2}
            />
          </div>

          <div className=&ldquo;flex justify-end gap-2 pt-4&rdquo;>
            <Button variant=&ldquo;outline&rdquo; onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {question ? &ldquo;Actualizar&rdquo; : &ldquo;Agregar&rdquo;} Pregunta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
