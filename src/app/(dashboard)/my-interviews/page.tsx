&ldquo;use client&rdquo;;

import React, { useState } from &ldquo;react&rdquo;;
import SpeechRecognition, {
  useSpeechRecognition,
} from &ldquo;react-speech-recognition&rdquo;;
import { Card, CardHeader, CardTitle, CardContent } from &ldquo;@/components/ui/card&rdquo;;
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
    if (currentText.trim()) {
      setResponses([...responses, currentText]);
      setCurrentText(&ldquo;&rdquo;);
      resetTranscript();
      setStep(step + 1);
    }
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: &ldquo;es-ES&rdquo; });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setCurrentText(transcript);
  };

  const handleReset = () => {
    setStep(0);
    setResponses([]);
    setCurrentText(&ldquo;&rdquo;);
    resetTranscript();
  };

  const currentQuestion = interviewQuestions[step];
  const currentTip = tips[step % tips.length];

  return (
    <div className=&ldquo;container mx-auto p-6 max-w-4xl&rdquo;>
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Simulador de Entrevista</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Practica tus habilidades de entrevista con reconocimiento de voz
        </p>
      </div>

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-6&rdquo;>
        {/* Question Section */}
        <div className=&ldquo;lg:col-span-2&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center justify-between&rdquo;>
                <span>
                  Pregunta {step + 1} de {interviewQuestions.length}
                </span>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  {listening ? (
                    <div className=&ldquo;flex items-center gap-2 text-red-600&rdquo;>
                      <div className=&ldquo;w-2 h-2 bg-red-600 rounded-full animate-pulse&rdquo;></div>
                      Grabando...
                    </div>
                  ) : null}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;p-4 bg-muted rounded-lg&rdquo;>
                <p className=&ldquo;text-lg font-medium&rdquo;>{currentQuestion}</p>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <label className=&ldquo;text-sm font-medium&rdquo;>Tu respuesta:</label>
                <Textarea
                  value={currentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCurrentText(e.target.value)
                  }
                  placeholder=&ldquo;Escribe tu respuesta o usa el micrófono...&rdquo;
                  rows={4}
                />
              </div>

              <div className=&ldquo;flex gap-2&rdquo;>
                <Button
                  onClick={
                    listening ? handleStopListening : handleStartListening
                  }
                  variant={listening ? &ldquo;destructive&rdquo; : &ldquo;default&rdquo;}
                >
                  {listening ? (
                    <>
                      <MicOff className=&ldquo;w-4 h-4 mr-2&rdquo; />
                      Detener Grabación
                    </>
                  ) : (
                    <>
                      <Mic className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
                  <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
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
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{currentTip}</p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className=&ldquo;mt-4&rdquo;>
            <CardHeader>
              <CardTitle>Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-2&rdquo;>
                <div className=&ldquo;flex justify-between text-sm&rdquo;>
                  <span>Preguntas respondidas</span>
                  <span>
                    {responses.length} / {interviewQuestions.length}
                  </span>
                </div>
                <div className=&ldquo;w-full bg-muted rounded-full h-2&rdquo;>
                  <div
                    className=&ldquo;bg-primary h-2 rounded-full transition-all duration-300&rdquo;
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
            variant=&ldquo;outline&rdquo;
            className=&ldquo;w-full mt-4&rdquo;
          >
            Reiniciar Simulación
          </Button>
        </div>
      </div>

      {/* Previous Responses */}
      {responses.length > 0 && (
        <div className=&ldquo;mt-8&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Respuestas Anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                {responses.map((response, index) => (
                  <div key={index} className=&ldquo;border-l-4 border-primary pl-4&rdquo;>
                    <p className=&ldquo;font-medium text-sm mb-1&rdquo;>
                      Pregunta {index + 1}: {interviewQuestions[index]}
                    </p>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{response}</p>
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
