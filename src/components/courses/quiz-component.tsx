"use client";

import { useState, useEffect } from "react";
import {
  Quiz,
  QuizQuestion as Question,
  QuestionType,
  QuizAnswer,
} from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export const QuizComponent = ({ quiz, onComplete }: QuizComponentProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const [quizState, setQuizState] = useState<
    "taking" | "completed" | "reviewing"
  >("taking");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptStartTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || quizState !== "taking") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateAnswer = (questionId: string, answer: string | string[]) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = checkAnswer(question, answer);

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        isCorrect,
        timeSpent: 0, // Would track actual time spent on question
      },
    }));
  };

  const checkAnswer = (
    question: Question,
    answer: string | string[]
  ): boolean => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        return answer === question.correctAnswer;

      case QuestionType.MULTIPLE_SELECT:
        if (!Array.isArray(answer) || !Array.isArray(question.correctAnswer))
          return false;
        return (
          answer.length === question.correctAnswer.length &&
          answer.every((a) => question.correctAnswer.includes(a))
        );

      case QuestionType.FILL_BLANK:
      case QuestionType.SHORT_ANSWER:
        if (
          typeof answer !== "string" ||
          typeof question.correctAnswer !== "string"
        )
          return false;
        return (
          answer.toLowerCase().trim() ===
          question.correctAnswer.toLowerCase().trim()
        );

      default:
        return false;
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    const totalQuestions = quiz.questions.length;
    const correctCount = Object.values(answers).filter(
      (answer) => answer.isCorrect
    ).length;
    const finalScore = Math.round((correctCount / totalQuestions) * 100);

    setCorrectAnswers(correctCount);
    setScore(finalScore);
    setQuizState("completed");

    if (finalScore >= quiz.passingScore) {
      toast({
        title: "¡Felicitaciones!",
        description: `Has aprobado el quiz con ${finalScore}%`,
        duration: 5000,
      });
      onComplete(finalScore);
    } else {
      toast({
        title: "Quiz completado",
        description: `Puntuación: ${finalScore}%. Necesitas ${quiz.passingScore}% para aprobar.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : null);
    setQuizState("taking");
    setScore(0);
    setCorrectAnswers(0);
  };

  const getCurrentAnswer = () => {
    if (!currentQuestion?.id) return "";
    return (
      answers[currentQuestion.id]?.answer ||
      (currentQuestion.type === QuestionType.MULTIPLE_SELECT ? [] : "")
    );
  };

  // Early return if no questions or current question is not available
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quiz no disponible</h3>
            <p className="text-muted-foreground">
              Este quiz no tiene preguntas configuradas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error en el quiz</h3>
            <p className="text-muted-foreground">
              No se pudo cargar la pregunta actual.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "completed") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {score >= quiz.passingScore ? (
                <div className="text-green-600">
                  <Trophy className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800">
                    ¡Excelente trabajo!
                  </h2>
                </div>
              ) : (
                <div className="text-orange-600">
                  <AlertCircle className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-orange-800">
                    Quiz completado
                  </h2>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-muted-foreground">Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correctas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {quiz.questions.length - correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Incorrectas</div>
              </div>
            </div>

            <div className="mb-6">
              <Progress value={score} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0%</span>
                <span className="font-medium">
                  Puntuación necesaria: {quiz.passingScore}%
                </span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              {score < quiz.passingScore && (
                <Button
                  onClick={retakeQuiz}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Intentar de nuevo
                </Button>
              )}

              {quiz.showCorrectAnswers && (
                <Button
                  variant="outline"
                  onClick={() => setQuizState("reviewing")}
                >
                  Revisar respuestas
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "reviewing") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Revisión del Quiz</h2>
          <Button variant="outline" onClick={() => setQuizState("completed")}>
            Volver a resultados
          </Button>
        </div>

        {quiz.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          return (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {index + 1}. {question.question}
                  </CardTitle>
                  {userAnswer?.isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-2">
                      Tu respuesta:
                    </p>
                    <p
                      className={`p-2 rounded ${userAnswer?.isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                    >
                      {Array.isArray(userAnswer?.answer)
                        ? userAnswer.answer.join(", ")
                        : userAnswer?.answer || "Sin respuesta"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm text-muted-foreground mb-2">
                      Respuesta correcta:
                    </p>
                    <p className="p-2 rounded bg-green-50 text-green-800">
                      {Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.join(", ")
                        : question.correctAnswer}
                    </p>
                  </div>

                  {question.explanation && (
                    <div>
                      <p className="font-medium text-sm text-muted-foreground mb-2">
                        Explicación:
                      </p>
                      <p className="p-2 rounded bg-blue-50 text-blue-800">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <p className="text-muted-foreground">{quiz.description}</p>
            </div>
            {timeLeft !== null && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Clock className="h-5 w-5" />
                  <span
                    className={
                      timeLeft < 300 ? "text-red-600" : "text-blue-600"
                    }
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Tiempo restante</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
              </span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestionIndex + 1}.{" "}
            {currentQuestion?.question || "Pregunta no disponible"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentQuestion?.type?.replace("_", " ") || "Pregunta"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion?.points || 0} puntos
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {currentQuestion && (
            <QuestionInput
              question={currentQuestion}
              value={getCurrentAnswer()}
              onChange={(answer) => updateAnswer(currentQuestion.id, answer)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={isLastQuestion ? submitQuiz : goToNextQuestion}
            disabled={!currentQuestion?.id || !answers[currentQuestion.id]}
          >
            {isLastQuestion ? "Finalizar Quiz" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Question Input Component
const QuestionInput = ({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[];
  onChange: (answer: string | string[]) => void;
}) => {
  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.TRUE_FALSE:
      return (
        <RadioGroup value={value as string} onValueChange={onChange}>
          {question.options?.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <label htmlFor={option} className="cursor-pointer flex-1 py-2">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      );

    case QuestionType.MULTIPLE_SELECT:
      return (
        <div className="space-y-3">
          {question.options?.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={(value as string[]).includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = value as string[];
                  if (checked) {
                    onChange([...currentValues, option]);
                  } else {
                    onChange(currentValues.filter((v) => v !== option));
                  }
                }}
              />
              <label htmlFor={option} className="cursor-pointer flex-1 py-2">
                {option}
              </label>
            </div>
          ))}
        </div>
      );

    case QuestionType.FILL_BLANK:
    case QuestionType.SHORT_ANSWER:
      return (
        <Input
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full"
        />
      );

    default:
      return (
        <Textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full"
          rows={4}
        />
      );
  }
};
