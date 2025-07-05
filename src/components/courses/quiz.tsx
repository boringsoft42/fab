"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ChevronRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Quiz as QuizType, QuizQuestion } from "@/types/courses";

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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isCompleted) {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= quiz.passingScore;

    return (
      <div className="space-y-6">
        <Alert variant={passed ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {passed ? "¡Felicitaciones!" : "Sigue intentando"}
          </AlertTitle>
          <AlertDescription>
            {passed
              ? "Has aprobado el quiz exitosamente."
              : "No alcanzaste el puntaje mínimo requerido."}
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <div className="text-4xl font-bold">{score.toFixed(0)}%</div>
          <p className="text-gray-600">
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
    <div className="space-y-6">
      {/* Progress and Timer */}
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-1">
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </p>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center text-sm text-gray-500">
            <Timer className="w-4 h-4 mr-1" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuestionData.question}</h3>
        <div className="space-y-2">
          {currentQuestionData.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="outline"
                className={`w-full justify-start p-4 h-auto ${
                  selectedOption === index
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-400"
                } ${
                  showExplanation &&
                  index === currentQuestionData.correctOption &&
                  "border-green-500 bg-green-50"
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showExplanation &&
                  index === currentQuestionData.correctOption && (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Alert className="mt-4">
          <AlertTitle>Explicación</AlertTitle>
          <AlertDescription>{currentQuestionData.explanation}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!showExplanation && selectedOption !== null && (
          <Button onClick={() => setShowExplanation(true)}>
            Verificar respuesta
          </Button>
        )}
        {showExplanation && (
          <Button onClick={handleNext}>
            {currentQuestion + 1 === totalQuestions ? "Finalizar" : "Siguiente"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
