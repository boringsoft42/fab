&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { motion } from &ldquo;framer-motion&rdquo;;
import { AlertCircle, CheckCircle, ChevronRight, Timer } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Alert, AlertDescription, AlertTitle } from &ldquo;@/components/ui/alert&rdquo;;
import type { Quiz as QuizType, QuizQuestion } from &ldquo;@/types/courses&rdquo;;

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number) => void;
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<
    { questionId: string; isCorrect: boolean }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestionData = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    if (!showExplanation) {
      setSelectedOption(optionIndex);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestionData.correctOption;
    setAnswers([...answers, { questionId: currentQuestionData.id, isCorrect }]);

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const correctAnswers =
        answers.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0);
      const score = (correctAnswers / totalQuestions) * 100;
      setIsCompleted(true);
      onComplete(score);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, &ldquo;0&rdquo;)}`;
  };

  if (isCompleted) {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= quiz.passingScore;

    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <Alert variant={passed ? &ldquo;default&rdquo; : &ldquo;destructive&rdquo;}>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
          <AlertTitle>
            {passed ? &ldquo;¡Felicitaciones!&rdquo; : &ldquo;Sigue intentando&rdquo;}
          </AlertTitle>
          <AlertDescription>
            {passed
              ? &ldquo;Has aprobado el quiz exitosamente.&rdquo;
              : &ldquo;No alcanzaste el puntaje mínimo requerido.&rdquo;}
          </AlertDescription>
        </Alert>

        <div className=&ldquo;text-center space-y-4&rdquo;>
          <div className=&ldquo;text-4xl font-bold&rdquo;>{score.toFixed(0)}%</div>
          <p className=&ldquo;text-gray-600&rdquo;>
            {correctAnswers} de {totalQuestions} respuestas correctas
          </p>
          {!passed && (
            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedOption(null);
                setShowExplanation(false);
                setAnswers([]);
                setIsCompleted(false);
              }}
            >
              Intentar nuevamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Progress and Timer */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div className=&ldquo;flex-1 mr-4&rdquo;>
          <Progress value={progress} className=&ldquo;h-2&rdquo; />
          <p className=&ldquo;text-sm text-gray-500 mt-1&rdquo;>
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </p>
        </div>
        {timeLeft !== null && (
          <div className=&ldquo;flex items-center text-sm text-gray-500&rdquo;>
            <Timer className=&ldquo;w-4 h-4 mr-1&rdquo; />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question */}
      <div className=&ldquo;space-y-4&rdquo;>
        <h3 className=&ldquo;text-lg font-medium&rdquo;>{currentQuestionData.question}</h3>
        <div className=&ldquo;space-y-2&rdquo;>
          {currentQuestionData.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant=&ldquo;outline&rdquo;
                className={`w-full justify-start p-4 h-auto ${
                  selectedOption === index
                    ? &ldquo;border-blue-500 bg-blue-50&rdquo;
                    : &ldquo;hover:border-gray-400&rdquo;
                } ${
                  showExplanation &&
                  index === currentQuestionData.correctOption &&
                  &ldquo;border-green-500 bg-green-50&rdquo;
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <span className=&ldquo;mr-2&rdquo;>{String.fromCharCode(65 + index)}.</span>
                {option}
                {showExplanation &&
                  index === currentQuestionData.correctOption && (
                    <CheckCircle className=&ldquo;w-4 h-4 ml-2 text-green-500&rdquo; />
                  )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Alert className=&ldquo;mt-4&rdquo;>
          <AlertTitle>Explicación</AlertTitle>
          <AlertDescription>{currentQuestionData.explanation}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className=&ldquo;flex justify-end&rdquo;>
        {!showExplanation && selectedOption !== null && (
          <Button onClick={() => setShowExplanation(true)}>
            Verificar respuesta
          </Button>
        )}
        {showExplanation && (
          <Button onClick={handleNext}>
            {currentQuestion + 1 === totalQuestions ? &ldquo;Finalizar&rdquo; : &ldquo;Siguiente&rdquo;}
            <ChevronRight className=&ldquo;w-4 h-4 ml-1&rdquo; />
          </Button>
        )}
      </div>
    </div>
  );
}
