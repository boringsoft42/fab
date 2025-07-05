&ldquo;use client&rdquo;;

import React, { useState } from &ldquo;react&rdquo;;
import SpeechRecognition, {
  useSpeechRecognition,
} from &ldquo;react-speech-recognition&rdquo;;
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from &ldquo;@/components/ui/card&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from &ldquo;@/components/ui/carousel&rdquo;;
import { Mic, MicOff, ArrowRight } from &ldquo;lucide-react&rdquo;;

const interviewQuestions = [
  &ldquo;Cuéntame sobre ti.&rdquo;,
  &ldquo;¿Por qué estás interesado en esta posición?&rdquo;,
  &ldquo;¿Qué sabes sobre nuestra empresa?&rdquo;,
  &ldquo;¿Cuál ha sido tu mayor reto y cómo lo superaste?&rdquo;,
  &ldquo;¿Dónde te ves en 5 años?&rdquo;,
  &ldquo;¿Cuál es tu mayor fortaleza?&rdquo;,
  &ldquo;¿Cuál es tu mayor debilidad?&rdquo;,
  &ldquo;¿Cómo manejas el trabajo bajo presión?&rdquo;,
  &ldquo;Háblame de un conflicto laboral y cómo lo resolviste.&rdquo;,
  &ldquo;¿Qué te motiva a trabajar cada día?&rdquo;,
  &ldquo;¿Prefieres trabajar solo o en equipo?&rdquo;,
  &ldquo;¿Cómo te mantienes organizado?&rdquo;,
  &ldquo;¿Qué harías si no estás de acuerdo con tu jefe?&rdquo;,
  &ldquo;¿Cómo manejas los errores?&rdquo;,
  &ldquo;¿Qué logros laborales te enorgullecen más?&rdquo;,
  &ldquo;¿Tienes experiencia liderando equipos?&rdquo;,
  &ldquo;¿Qué esperas de tu próximo trabajo?&rdquo;,
  &ldquo;¿Estás dispuesto/a a aprender nuevas habilidades?&rdquo;,
  &ldquo;¿Tienes alguna pregunta para nosotros?&rdquo;,
  &ldquo;¿Por qué deberíamos contratarte?&rdquo;,
];

const tips = [
  &ldquo;Habla con claridad y confianza.&rdquo;,
  &ldquo;Toma una pausa antes de responder.&rdquo;,
  &ldquo;Sé honesto, pero enfocado.&rdquo;,
  &ldquo;No hables demasiado, sé conciso.&rdquo;,
  &ldquo;Practica con anticipación.&rdquo;,
  &ldquo;Escucha bien la pregunta antes de responder.&rdquo;,
  &ldquo;Haz contacto visual (si aplica).&rdquo;,
  &ldquo;Evita palabras de relleno como 'eh', 'este'.&rdquo;,
  &ldquo;Sonríe naturalmente.&rdquo;,
  &ldquo;No memorices, comprende.&rdquo;,
];

export default function InterviewSimulation() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState(&ldquo;&rdquo;);

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
    setCurrentText(&ldquo;&rdquo;);
    setStep((prev) => prev + 1);
  };

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: &ldquo;es-ES&rdquo; });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setCurrentText(transcript);
  };

  const finished = step >= interviewQuestions.length;

  return (
    <div className=&ldquo;min-h-screen flex flex-col items-center justify-center px-4 py-12&rdquo;>
      <div className=&ldquo;w-full max-w-4xl space-y-8&rdquo;>
        <Card className=&ldquo;shadow-xl&rdquo;>
          <CardHeader>
            <CardTitle className=&ldquo;text-xl md:text-2xl font-bold&rdquo;>
              {finished
                ? &ldquo;🎉 Entrevista completada&rdquo;
                : `Paso ${step + 1} de ${interviewQuestions.length}: ${interviewQuestions[step]}`}
            </CardTitle>
          </CardHeader>
          <CardContent className=&ldquo;space-y-4&rdquo;>
            {finished ? (
              <div className=&ldquo;space-y-4&rdquo;>
                <p className=&ldquo;text-muted-foreground text-sm&rdquo;>
                  Aquí tienes un resumen de tus respuestas:
                </p>
                <ul className=&ldquo;space-y-2&rdquo;>
                  {interviewQuestions.map((q, i) => (
                    <li key={i}>
                      <strong>{i + 1}. {q}</strong>
                      <p className=&ldquo;text-muted-foreground&rdquo;>
                        {responses[i] || &ldquo;Sin respuesta&rdquo;}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder=&ldquo;Tu respuesta aparecerá aquí...&rdquo;
                  value={listening ? transcript : currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  rows={6}
                  className=&ldquo;text-base&rdquo;
                />
                <div className=&ldquo;flex gap-3 justify-between flex-wrap&rdquo;>
                  {listening ? (
                    <Button
                      variant=&ldquo;destructive&rdquo;
                      onClick={handleStop}
                      className=&ldquo;flex gap-2&rdquo;
                    >
                      <MicOff size={16} />
                      Detener
                    </Button>
                  ) : (
                    <Button onClick={handleStart} className=&ldquo;flex gap-2&rdquo;>
                      <Mic size={16} />
                      Empezar a hablar
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={step >= interviewQuestions.length}
                    className=&ldquo;flex gap-2 ml-auto&rdquo;
                  >
                    Siguiente <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Carrusel de tips */}
        <div className=&ldquo;space-y-2&rdquo;>
          <h2 className=&ldquo;text-lg font-semibold text-center&rdquo;>
            Tips para la entrevista
          </h2>
          <Carousel className=&ldquo;w-full&rdquo;>
            <CarouselContent>
              {tips.map((tip, index) => (
                <CarouselItem
                  key={index}
                  className=&ldquo;basis-full md:basis-1/3 p-2&rdquo;
                >
                  <Card className=&ldquo;h-full flex items-center justify-center p-6 text-sm text-center shadow-sm&rdquo;>
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
