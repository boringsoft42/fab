&ldquo;use client&rdquo;;

import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Plus, Trash2, Download, Printer } from &ldquo;lucide-react&rdquo;;
import { useState } from &ldquo;react&rdquo;;

interface Section {
  id: string;
  items: { id: string; content: string }[];
}

// Helper functions for managing sections
const addItem = (section: Section, setSection: (section: Section) => void) => {
  const newId = `${section.id}-${section.items.length + 1}`;
  setSection({
    ...section,
    items: [...section.items, { id: newId, content: &ldquo;&rdquo; }],
  });
};

const removeItem = (
  section: Section,
  setSection: (section: Section) => void,
  itemId: string
) => {
  if (section.items.length <= 1) return; // Keep at least one item
  setSection({
    ...section,
    items: section.items.filter((item) => item.id !== itemId),
  });
};

const updateItem = (
  section: Section,
  setSection: (section: Section) => void,
  itemId: string,
  content: string
) => {
  setSection({
    ...section,
    items: section.items.map((item) =>
      item.id === itemId ? { ...item, content } : item
    ),
  });
};

export function CVTemplate() {
  const [education, setEducation] = useState<Section>({
    id: &ldquo;education&rdquo;,
    items: [{ id: &ldquo;edu-1&rdquo;, content: &ldquo;&rdquo; }],
  });

  const [experience, setExperience] = useState<Section>({
    id: &ldquo;experience&rdquo;,
    items: [{ id: &ldquo;exp-1&rdquo;, content: &ldquo;&rdquo; }],
  });

  const [skills, setSkills] = useState<Section>({
    id: &ldquo;skills&rdquo;,
    items: [{ id: &ldquo;skill-1&rdquo;, content: &ldquo;&rdquo; }],
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className=&ldquo;print-content&rdquo;>
      <DialogHeader>
        <DialogTitle>Curriculum Vitae</DialogTitle>
      </DialogHeader>

      <div className=&ldquo;max-h-[80vh] overflow-y-auto py-4&rdquo;>
        <Card className=&ldquo;w-full max-w-4xl mx-auto print:shadow-none&rdquo;>
          <CardContent className=&ldquo;space-y-6&rdquo;>
            {/* Personal Information */}
            <div className=&ldquo;space-y-4&rdquo;>
              <h3 className=&ldquo;text-lg font-semibold&rdquo;>Información Personal</h3>
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

            {/* Professional Summary */}
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;summary&rdquo;>Resumen Profesional</Label>
              <Textarea
                id=&ldquo;summary&rdquo;
                placeholder=&ldquo;Breve descripción de tus objetivos profesionales y habilidades principales (2-3 oraciones)&rdquo;
                className=&ldquo;h-24&rdquo;
              />
            </div>

            <Separator />

            {/* Education */}
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Educación</h3>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => addItem(education, setEducation)}
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Agregar
                </Button>
              </div>
              {education.items.map((item) => (
                <div key={item.id} className=&ldquo;flex gap-2&rdquo;>
                  <Textarea
                    value={item.content}
                    onChange={(e) =>
                      updateItem(
                        education,
                        setEducation,
                        item.id,
                        e.target.value
                      )
                    }
                    placeholder=&ldquo;Ej: Bachiller en Humanidades - Colegio San Calixto (2020-2023)&rdquo;
                    className=&ldquo;flex-1&rdquo;
                  />
                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;icon&rdquo;
                    onClick={() => removeItem(education, setEducation, item.id)}
                  >
                    <Trash2 className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Experience */}
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Experiencia</h3>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => addItem(experience, setExperience)}
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Agregar
                </Button>
              </div>
              {experience.items.map((item) => (
                <div key={item.id} className=&ldquo;flex gap-2&rdquo;>
                  <Textarea
                    value={item.content}
                    onChange={(e) =>
                      updateItem(
                        experience,
                        setExperience,
                        item.id,
                        e.target.value
                      )
                    }
                    placeholder=&ldquo;Ej: Pasante de Marketing Digital - Empresa XYZ (Ene 2023 - Jun 2023)&#10;• Principales responsabilidades y logros&#10;• Impacto y resultados obtenidos&rdquo;
                    className=&ldquo;flex-1 h-32&rdquo;
                  />
                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;icon&rdquo;
                    onClick={() =>
                      removeItem(experience, setExperience, item.id)
                    }
                  >
                    <Trash2 className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Skills */}
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Habilidades</h3>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => addItem(skills, setSkills)}
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Agregar
                </Button>
              </div>
              {skills.items.map((item) => (
                <div key={item.id} className=&ldquo;flex gap-2&rdquo;>
                  <Input
                    value={item.content}
                    onChange={(e) =>
                      updateItem(skills, setSkills, item.id, e.target.value)
                    }
                    placeholder=&ldquo;Ej: Microsoft Office, Diseño Gráfico, Trabajo en Equipo&rdquo;
                  />
                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;icon&rdquo;
                    onClick={() => removeItem(skills, setSkills, item.id)}
                  >
                    <Trash2 className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
              ))}
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
              <Button>Guardar CV</Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
