&ldquo;use client&rdquo;;

import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { DialogHeader, DialogTitle } from &ldquo;@/components/ui/dialog&rdquo;;
import { Download, Printer } from &ldquo;lucide-react&rdquo;;

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
      <div className=&ldquo;max-h-[80vh] overflow-y-auto py-4&rdquo;>
        <Card className=&ldquo;w-full max-w-4xl mx-auto print:shadow-none&rdquo;>
          <CardContent className=&ldquo;space-y-6&rdquo;>
            {/* Header Information */}
            <div className=&ldquo;space-y-4&rdquo;>
              <h3 className=&ldquo;text-lg font-semibold&rdquo;>Tu Información</h3>
              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;fullName&rdquo;>Nombre Completo</Label>
                  <Input id=&ldquo;fullName&rdquo; placeholder=&ldquo;Ej: Juan Pérez Gómez&rdquo; />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;email&rdquo;>Correo Electrónico</Label>
                  <Input
                    id=&ldquo;email&rdquo;
                    type=&ldquo;email&rdquo;
                    placeholder=&ldquo;Ej: juan@email.com&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;phone&rdquo;>Teléfono</Label>
                  <Input id=&ldquo;phone&rdquo; placeholder=&ldquo;Ej: +591 ...&rdquo; />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;location&rdquo;>Ubicación</Label>
                  <Input id=&ldquo;location&rdquo; placeholder=&ldquo;Ej: La Paz, Bolivia&rdquo; />
                </div>
              </div>
            </div>

            <Separator />

            {/* Recipient Information */}
            <div className=&ldquo;space-y-4&rdquo;>
              <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                Información del Destinatario
              </h3>
              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;recipientName&rdquo;>Nombre del Destinatario</Label>
                  <Input
                    id=&ldquo;recipientName&rdquo;
                    placeholder=&ldquo;Ej: María García / Recursos Humanos&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;companyName&rdquo;>Nombre de la Empresa</Label>
                  <Input id=&ldquo;companyName&rdquo; placeholder=&ldquo;Ej: TechCorp Bolivia&rdquo; />
                </div>
              </div>
            </div>

            <Separator />

            {/* Opening */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;opening&rdquo;>Saludo</Label>
              <Input
                id=&ldquo;opening&rdquo;
                placeholder=&ldquo;Ej: Estimada Sra. García / Estimado Equipo de Recursos Humanos&rdquo;
              />
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Tip: Si no conoces el nombre del destinatario, usa &ldquo;Estimado
                Equipo de Recursos Humanos&rdquo;
              </p>
            </div>

            {/* First Paragraph - Introduction */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;introduction&rdquo;>
                Primer Párrafo - Introducción{&ldquo; &rdquo;}
                <span className=&ldquo;text-muted-foreground&rdquo;>
                  (150-200 palabras)
                </span>
              </Label>
              <Textarea
                id=&ldquo;introduction&rdquo;
                className=&ldquo;h-32&rdquo;
                placeholder=&ldquo;Me dirijo a ustedes para expresar mi interés en la posición de [Nombre del Puesto] en [Nombre de la Empresa]. Como estudiante de último año de secundaria con un fuerte interés en [área/industria], me entusiasma la posibilidad de contribuir a su equipo mientras desarrollo mis habilidades profesionales.&rdquo;
              />
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Tip: Menciona cómo te enteraste de la posición y por qué te
                interesa específicamente esta empresa
              </p>
            </div>

            {/* Second Paragraph - Skills & Experience */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;skills&rdquo;>
                Segundo Párrafo - Habilidades y Experiencia{&ldquo; &rdquo;}
                <span className=&ldquo;text-muted-foreground&rdquo;>
                  (200-250 palabras)
                </span>
              </Label>
              <Textarea
                id=&ldquo;skills&rdquo;
                className=&ldquo;h-40&rdquo;
                placeholder=&ldquo;Durante mi formación académica, he desarrollado habilidades en [menciona 2-3 habilidades relevantes] a través de [menciona proyectos escolares, actividades extracurriculares o experiencias de voluntariado]. Por ejemplo, [describe brevemente un logro o proyecto específico y su impacto].&rdquo;
              />
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Tip: Conecta tus experiencias y habilidades con los requisitos
                del puesto
              </p>
            </div>

            {/* Closing Paragraph */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;closing&rdquo;>
                Párrafo de Cierre{&ldquo; &rdquo;}
                <span className=&ldquo;text-muted-foreground&rdquo;>
                  (100-150 palabras)
                </span>
              </Label>
              <Textarea
                id=&ldquo;closing&rdquo;
                className=&ldquo;h-32&rdquo;
                placeholder=&ldquo;Estoy entusiasmado por la posibilidad de formar parte de [Nombre de la Empresa] y contribuir a [menciona un objetivo o proyecto específico de la empresa]. Agradezco su tiempo y consideración, y espero tener la oportunidad de discutir en detalle cómo puedo aportar valor a su equipo.&rdquo;
              />
            </div>

            {/* Signature */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;signature&rdquo;>Despedida</Label>
              <Input
                id=&ldquo;signature&rdquo;
                placeholder=&ldquo;Ej: Atentamente, / Cordialmente,&rdquo;
              />
            </div>

            <div className=&ldquo;flex justify-end space-x-2 pt-4 print:hidden&rdquo;>
              <Button variant=&ldquo;outline&rdquo; onClick={handlePrint}>
                <Printer className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Imprimir
              </Button>
              <Button variant=&ldquo;outline&rdquo; onClick={handleDownloadPDF}>
                <Download className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
