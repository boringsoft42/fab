&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Quiz, Question, QuestionType, QuizAnswer } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { RadioGroup, RadioGroupItem } from &ldquo;@/components/ui/radio-group&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
} from &ldquo;lucide-react&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;

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
    &ldquo;taking&rdquo; | &ldquo;completed&rdquo; | &ldquo;reviewing&rdquo;
  >(&ldquo;taking&rdquo;);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptStartTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || quizState !== &ldquo;taking&rdquo;) return;

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
    return `${mins}:${secs.toString().padStart(2, &ldquo;0&rdquo;)}`;
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
          typeof answer !== &ldquo;string&rdquo; ||
          typeof question.correctAnswer !== &ldquo;string&rdquo;
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
    setQuizState(&ldquo;completed&rdquo;);

    if (finalScore >= quiz.passingScore) {
      toast({
        title: &ldquo;¡Felicitaciones!&rdquo;,
        description: `Has aprobado el quiz con ${finalScore}%`,
        duration: 5000,
      });
      onComplete(finalScore);
    } else {
      toast({
        title: &ldquo;Quiz completado&rdquo;,
        description: `Puntuación: ${finalScore}%. Necesitas ${quiz.passingScore}% para aprobar.`,
        variant: &ldquo;destructive&rdquo;,
        duration: 5000,
      });
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : null);
    setQuizState(&ldquo;taking&rdquo;);
    setScore(0);
    setCorrectAnswers(0);
  };

  const getCurrentAnswer = () => {
    if (!currentQuestion?.id) return &ldquo;&rdquo;;
    return (
      answers[currentQuestion.id]?.answer ||
      (currentQuestion.type === QuestionType.MULTIPLE_SELECT ? [] : &ldquo;&rdquo;)
    );
  };

  // Early return if no questions or current question is not available
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className=&ldquo;max-w-2xl mx-auto&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-8 text-center&rdquo;>
            <AlertCircle className=&ldquo;h-16 w-16 text-orange-600 mx-auto mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>Quiz no disponible</h3>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Este quiz no tiene preguntas configuradas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className=&ldquo;max-w-2xl mx-auto&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-8 text-center&rdquo;>
            <AlertCircle className=&ldquo;h-16 w-16 text-orange-600 mx-auto mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>Error en el quiz</h3>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              No se pudo cargar la pregunta actual.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === &ldquo;completed&rdquo;) {
    return (
      <div className=&ldquo;max-w-2xl mx-auto&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-8 text-center&rdquo;>
            <div className=&ldquo;mb-6&rdquo;>
              {score >= quiz.passingScore ? (
                <div className=&ldquo;text-green-600&rdquo;>
                  <Trophy className=&ldquo;h-16 w-16 mx-auto mb-4&rdquo; />
                  <h2 className=&ldquo;text-2xl font-bold text-green-800&rdquo;>
                    ¡Excelente trabajo!
                  </h2>
                </div>
              ) : (
                <div className=&ldquo;text-orange-600&rdquo;>
                  <AlertCircle className=&ldquo;h-16 w-16 mx-auto mb-4&rdquo; />
                  <h2 className=&ldquo;text-2xl font-bold text-orange-800&rdquo;>
                    Quiz completado
                  </h2>
                </div>
              )}
            </div>

            <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4 mb-6&rdquo;>
              <div className=&ldquo;text-center&rdquo;>
                <div className=&ldquo;text-3xl font-bold text-blue-600&rdquo;>{score}%</div>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>Puntuación</div>
              </div>
              <div className=&ldquo;text-center&rdquo;>
                <div className=&ldquo;text-3xl font-bold text-green-600&rdquo;>
                  {correctAnswers}
                </div>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>Correctas</div>
              </div>
              <div className=&ldquo;text-center&rdquo;>
                <div className=&ldquo;text-3xl font-bold text-red-600&rdquo;>
                  {quiz.questions.length - correctAnswers}
                </div>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>Incorrectas</div>
              </div>
            </div>

            <div className=&ldquo;mb-6&rdquo;>
              <Progress value={score} className=&ldquo;h-3&rdquo; />
              <div className=&ldquo;flex justify-between text-sm text-muted-foreground mt-2&rdquo;>
                <span>0%</span>
                <span className=&ldquo;font-medium&rdquo;>
                  Puntuación necesaria: {quiz.passingScore}%
                </span>
                <span>100%</span>
              </div>
            </div>

            <div className=&ldquo;flex gap-3 justify-center&rdquo;>
              {score < quiz.passingScore && (
                <Button
                  onClick={retakeQuiz}
                  className=&ldquo;flex items-center gap-2&rdquo;
                >
                  <RotateCcw className=&ldquo;h-4 w-4&rdquo; />
                  Intentar de nuevo
                </Button>
              )}

              {quiz.showCorrectAnswers && (
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={() => setQuizState(&ldquo;reviewing&rdquo;)}
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

  if (quizState === &ldquo;reviewing&rdquo;) {
    return (
      <div className=&ldquo;max-w-3xl mx-auto space-y-6&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <h2 className=&ldquo;text-2xl font-bold&rdquo;>Revisión del Quiz</h2>
          <Button variant=&ldquo;outline&rdquo; onClick={() => setQuizState(&ldquo;completed&rdquo;)}>
            Volver a resultados
          </Button>
        </div>

        {quiz.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          return (
            <Card key={question.id}>
              <CardHeader>
                <div className=&ldquo;flex items-start justify-between&rdquo;>
                  <CardTitle className=&ldquo;text-lg&rdquo;>
                    {index + 1}. {question.question}
                  </CardTitle>
                  {userAnswer?.isCorrect ? (
                    <CheckCircle2 className=&ldquo;h-6 w-6 text-green-600&rdquo; />
                  ) : (
                    <XCircle className=&ldquo;h-6 w-6 text-red-600&rdquo; />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className=&ldquo;space-y-4&rdquo;>
                  <div>
                    <p className=&ldquo;font-medium text-sm text-muted-foreground mb-2&rdquo;>
                      Tu respuesta:
                    </p>
                    <p
                      className={`p-2 rounded ${userAnswer?.isCorrect ? &ldquo;bg-green-50 text-green-800&rdquo; : &ldquo;bg-red-50 text-red-800&rdquo;}`}
                    >
                      {Array.isArray(userAnswer?.answer)
                        ? userAnswer.answer.join(&ldquo;, &rdquo;)
                        : userAnswer?.answer || &ldquo;Sin respuesta&rdquo;}
                    </p>
                  </div>

                  <div>
                    <p className=&ldquo;font-medium text-sm text-muted-foreground mb-2&rdquo;>
                      Respuesta correcta:
                    </p>
                    <p className=&ldquo;p-2 rounded bg-green-50 text-green-800&rdquo;>
                      {Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.join(&ldquo;, &rdquo;)
                        : question.correctAnswer}
                    </p>
                  </div>

                  {question.explanation && (
                    <div>
                      <p className=&ldquo;font-medium text-sm text-muted-foreground mb-2&rdquo;>
                        Explicación:
                      </p>
                      <p className=&ldquo;p-2 rounded bg-blue-50 text-blue-800&rdquo;>
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
    <div className=&ldquo;max-w-3xl mx-auto&rdquo;>
      {/* Quiz Header */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardHeader>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div>
              <CardTitle className=&ldquo;text-xl&rdquo;>{quiz.title}</CardTitle>
              <p className=&ldquo;text-muted-foreground&rdquo;>{quiz.description}</p>
            </div>
            {timeLeft !== null && (
              <div className=&ldquo;text-right&rdquo;>
                <div className=&ldquo;flex items-center gap-2 text-lg font-bold&rdquo;>
                  <Clock className=&ldquo;h-5 w-5&rdquo; />
                  <span
                    className={
                      timeLeft < 300 ? &ldquo;text-red-600&rdquo; : &ldquo;text-blue-600&rdquo;
                    }
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Tiempo restante</p>
              </div>
            )}
          </div>

          <div className=&ldquo;mt-4&rdquo;>
            <div className=&ldquo;flex justify-between text-sm mb-2&rdquo;>
              <span>
                Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
              </span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className=&ldquo;h-2&rdquo; />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardHeader>
          <CardTitle className=&ldquo;text-lg&rdquo;>
            {currentQuestionIndex + 1}.{&ldquo; &rdquo;}
            {currentQuestion?.question || &ldquo;Pregunta no disponible&rdquo;}
          </CardTitle>
          <div className=&ldquo;flex items-center gap-2&rdquo;>
            <Badge variant=&ldquo;outline&rdquo;>
              {currentQuestion?.type?.replace(&ldquo;_&rdquo;, &ldquo; &rdquo;) || &ldquo;Pregunta&rdquo;}
            </Badge>
            <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
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
      <div className=&ldquo;flex justify-between&rdquo;>
        <Button
          variant=&ldquo;outline&rdquo;
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>

        <div className=&ldquo;flex gap-2&rdquo;>
          <Button
            onClick={isLastQuestion ? submitQuiz : goToNextQuestion}
            disabled={!currentQuestion?.id || !answers[currentQuestion.id]}
          >
            {isLastQuestion ? &ldquo;Finalizar Quiz&rdquo; : &ldquo;Siguiente&rdquo;}
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
          {question.options?.map((option) => (
            <div key={option} className=&ldquo;flex items-center space-x-2&rdquo;>
              <RadioGroupItem value={option} id={option} />
              <label htmlFor={option} className=&ldquo;cursor-pointer flex-1 py-2&rdquo;>
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      );

    case QuestionType.MULTIPLE_SELECT:
      return (
        <div className=&ldquo;space-y-3&rdquo;>
          {question.options?.map((option) => (
            <div key={option} className=&ldquo;flex items-center space-x-2&rdquo;>
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
              <label htmlFor={option} className=&ldquo;cursor-pointer flex-1 py-2&rdquo;>
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
          placeholder=&ldquo;Escribe tu respuesta aquí...&rdquo;
          className=&ldquo;w-full&rdquo;
        />
      );

    default:
      return (
        <Textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder=&ldquo;Escribe tu respuesta aquí...&rdquo;
          className=&ldquo;w-full&rdquo;
          rows={4}
        />
      );
  }
};
