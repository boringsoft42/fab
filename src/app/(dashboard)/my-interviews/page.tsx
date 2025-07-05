"use client";

import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Mic, MicOff, ArrowRight } from "lucide-react";

const interviewQuestions = [
  "Cuéntame sobre ti.",
  "¿Por qué estás interesado en esta posición?",
  "¿Qué sabes sobre nuestra empresa?",
  "¿Cuál ha sido tu mayor reto y cómo lo superaste?",
  "¿Dónde te ves en 5 años?",
  "¿Cuál es tu mayor fortaleza?",
  "¿Cuál es tu mayor debilidad?",
  "¿Cómo manejas el trabajo bajo presión?",
  "Háblame de un conflicto laboral y cómo lo resolviste.",
  "¿Qué te motiva a trabajar cada día?",
  "¿Prefieres trabajar solo o en equipo?",
  "¿Cómo te mantienes organizado?",
  "¿Qué harías si no estás de acuerdo con tu jefe?",
  "¿Cómo manejas los errores?",
  "¿Qué logros laborales te enorgullecen más?",
  "¿Tienes experiencia liderando equipos?",
  "¿Qué esperas de tu próximo trabajo?",
  "¿Estás dispuesto/a a aprender nuevas habilidades?",
  "¿Tienes alguna pregunta para nosotros?",
  "¿Por qué deberíamos contratarte?",
];

const tips = [
  "Habla con claridad y confianza.",
  "Toma una pausa antes de responder.",
  "Sé honesto, pero enfocado.",
  "No hables demasiado, sé conciso.",
  "Practica con anticipación.",
  "Escucha bien la pregunta antes de responder.",
  "Haz contacto visual (si aplica).",
  "Evita palabras de relleno como 'eh', 'este'.",
  "Sonríe naturalmente.",
  "No memorices, comprende.",
];

export default function InterviewSimulation() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Tu navegador no soporta reconocimiento de voz.</div>;
  }

  const handleNext = () => {
    if (currentText.trim()) {
      setResponses([...responses, currentText]);
      setCurrentText("");
      resetTranscript();
      setStep(step + 1);
    }
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setCurrentText(transcript);
  };

  const handleReset = () => {
    setStep(0);
    setResponses([]);
    setCurrentText("");
    resetTranscript();
  };

  const currentQuestion = interviewQuestions[step];
  const currentTip = tips[step % tips.length];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simulador de Entrevista</h1>
        <p className="text-muted-foreground">
          Practica tus habilidades de entrevista con reconocimiento de voz
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Pregunta {step + 1} de {interviewQuestions.length}
                </span>
                <div className="flex items-center gap-2">
                  {listening ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      Grabando...
                    </div>
                  ) : null}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg font-medium">{currentQuestion}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu respuesta:</label>
                <Textarea
                  value={currentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCurrentText(e.target.value)
                  }
                  placeholder="Escribe tu respuesta o usa el micrófono..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={
                    listening ? handleStopListening : handleStartListening
                  }
                  variant={listening ? "destructive" : "default"}
                >
                  {listening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Detener Grabación
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Grabar Respuesta
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    !currentText.trim() || step >= interviewQuestions.length - 1
                  }
                >
                  Siguiente Pregunta
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Consejo del Día</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{currentTip}</p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preguntas respondidas</span>
                  <span>
                    {responses.length} / {interviewQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(responses.length / interviewQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full mt-4"
          >
            Reiniciar Simulación
          </Button>
        </div>
      </div>

      {/* Previous Responses */}
      {responses.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Respuestas Anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-sm mb-1">
                      Pregunta {index + 1}: {interviewQuestions[index]}
                    </p>
                    <p className="text-sm text-muted-foreground">{response}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
