"use client";

import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
    const answer = transcript || currentText;
    if (!answer.trim()) return;

    const updated = [...responses];
    updated[step] = answer;
    setResponses(updated);

    resetTranscript();
    setCurrentText("");
    setStep((prev) => prev + 1);
  };

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setCurrentText(transcript);
  };

  const finished = step >= interviewQuestions.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold">
              {finished
                ? "🎉 Entrevista completada"
                : `Paso ${step + 1} de ${interviewQuestions.length}: ${interviewQuestions[step]}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {finished ? (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Aquí tienes un resumen de tus respuestas:
                </p>
                <ul className="space-y-2">
                  {interviewQuestions.map((q, i) => (
                    <li key={i}>
                      <strong>{i + 1}. {q}</strong>
                      <p className="text-muted-foreground">
                        {responses[i] || "Sin respuesta"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Tu respuesta aparecerá aquí..."
                  value={listening ? transcript : currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  rows={6}
                  className="text-base"
                />
                <div className="flex gap-3 justify-between flex-wrap">
                  {listening ? (
                    <Button
                      variant="destructive"
                      onClick={handleStop}
                      className="flex gap-2"
                    >
                      <MicOff size={16} />
                      Detener
                    </Button>
                  ) : (
                    <Button onClick={handleStart} className="flex gap-2">
                      <Mic size={16} />
                      Empezar a hablar
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={step >= interviewQuestions.length}
                    className="flex gap-2 ml-auto"
                  >
                    Siguiente <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Carrusel de tips */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-center">
            Tips para la entrevista
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {tips.map((tip, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full md:basis-1/3 p-2"
                >
                  <Card className="h-full flex items-center justify-center p-6 text-sm text-center shadow-sm">
                    {tip}
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
