"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";

export function CoverLetterTemplate() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, you would use a library like jsPDF or html2pdf
    // For now, we'll just trigger the print dialog which can save as PDF
    window.print();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Carta de Presentación</DialogTitle>
      </DialogHeader>
      <div className="max-h-[80vh] overflow-y-auto py-4">
        <Card className="w-full max-w-4xl mx-auto print:shadow-none">
          <CardContent className="space-y-6">
            {/* Header Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tu Información</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input id="fullName" placeholder="Ej: Juan Pérez Gómez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: juan@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="Ej: +591 ..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Ej: La Paz, Bolivia" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Información del Destinatario
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Nombre del Destinatario</Label>
                  <Input
                    id="recipientName"
                    placeholder="Ej: María García / Recursos Humanos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input id="companyName" placeholder="Ej: TechCorp Bolivia" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Opening */}
            <div className="space-y-2">
              <Label htmlFor="opening">Saludo</Label>
              <Input
                id="opening"
                placeholder="Ej: Estimada Sra. García / Estimado Equipo de Recursos Humanos"
              />
              <p className="text-sm text-muted-foreground">
                Tip: Si no conoces el nombre del destinatario, usa "Estimado
                Equipo de Recursos Humanos"
              </p>
            </div>

            {/* First Paragraph - Introduction */}
            <div className="space-y-2">
              <Label htmlFor="introduction">
                Primer Párrafo - Introducción{" "}
                <span className="text-muted-foreground">
                  (150-200 palabras)
                </span>
              </Label>
              <Textarea
                id="introduction"
                className="h-32"
                placeholder="Me dirijo a ustedes para expresar mi interés en la posición de [Nombre del Puesto] en [Nombre de la Empresa]. Como estudiante de último año de secundaria con un fuerte interés en [área/industria], me entusiasma la posibilidad de contribuir a su equipo mientras desarrollo mis habilidades profesionales."
              />
              <p className="text-sm text-muted-foreground">
                Tip: Menciona cómo te enteraste de la posición y por qué te
                interesa específicamente esta empresa
              </p>
            </div>

            {/* Second Paragraph - Skills & Experience */}
            <div className="space-y-2">
              <Label htmlFor="skills">
                Segundo Párrafo - Habilidades y Experiencia{" "}
                <span className="text-muted-foreground">
                  (200-250 palabras)
                </span>
              </Label>
              <Textarea
                id="skills"
                className="h-40"
                placeholder="Durante mi formación académica, he desarrollado habilidades en [menciona 2-3 habilidades relevantes] a través de [menciona proyectos escolares, actividades extracurriculares o experiencias de voluntariado]. Por ejemplo, [describe brevemente un logro o proyecto específico y su impacto]."
              />
              <p className="text-sm text-muted-foreground">
                Tip: Conecta tus experiencias y habilidades con los requisitos
                del puesto
              </p>
            </div>

            {/* Closing Paragraph */}
            <div className="space-y-2">
              <Label htmlFor="closing">
                Párrafo de Cierre{" "}
                <span className="text-muted-foreground">
                  (100-150 palabras)
                </span>
              </Label>
              <Textarea
                id="closing"
                className="h-32"
                placeholder="Estoy entusiasmado por la posibilidad de formar parte de [Nombre de la Empresa] y contribuir a [menciona un objetivo o proyecto específico de la empresa]. Agradezco su tiempo y consideración, y espero tener la oportunidad de discutir en detalle cómo puedo aportar valor a su equipo."
              />
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <Label htmlFor="signature">Despedida</Label>
              <Input
                id="signature"
                placeholder="Ej: Atentamente, / Cordialmente,"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button>Guardar Carta</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 2cm;
          }
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print:hidden {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
