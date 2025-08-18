"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Plus, Trash2, Download, Printer, Trophy } from "lucide-react";
import { useState } from "react";

interface Section {
  id: string;
  items: { id: string; content: string }[];
}

// Helper functions for managing sections
const addItem = (section: Section, setSection: (section: Section) => void) => {
  const newId = `${section.id}-${section.items.length + 1}`;
  setSection({
    ...section,
    items: [...section.items, { id: newId, content: "" }],
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
    id: "education",
    items: [{ id: "edu-1", content: "" }],
  });

  const [experience, setExperience] = useState<Section>({
    id: "experience",
    items: [{ id: "exp-1", content: "" }],
  });

  const [skills, setSkills] = useState<Section>({
    id: "skills",
    items: [{ id: "skill-1", content: "" }],
  });

  const [achievements, setAchievements] = useState<Section>({
    id: "achievements",
    items: [{ id: "achievement-1", content: "" }],
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="print-content">
      <DialogHeader>
        <DialogTitle>Curriculum Vitae</DialogTitle>
      </DialogHeader>

      <div className="max-h-[80vh] overflow-y-auto py-4">
        <Card className="w-full max-w-4xl mx-auto print:shadow-none">
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
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

            {/* Professional Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Resumen Profesional</Label>
              <Textarea
                id="summary"
                placeholder="Breve descripción de tus objetivos profesionales y habilidades principales (2-3 oraciones)"
                className="h-24"
              />
            </div>

            <Separator />

            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Educación</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(education, setEducation)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {education.items.map((item) => (
                <div key={item.id} className="flex gap-2">
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
                    placeholder="Ej: Bachiller en Humanidades - Colegio San Calixto (2020-2023)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(education, setEducation, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Experiencia</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(experience, setExperience)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {experience.items.map((item) => (
                <div key={item.id} className="flex gap-2">
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
                    placeholder="Ej: Pasante de Marketing Digital - Empresa XYZ (Ene 2023 - Jun 2023)&#10;• Principales responsabilidades y logros&#10;• Impacto y resultados obtenidos"
                    className="flex-1 h-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeItem(experience, setExperience, item.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Habilidades</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(skills, setSkills)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {skills.items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <Input
                    value={item.content}
                    onChange={(e) =>
                      updateItem(skills, setSkills, item.id, e.target.value)
                    }
                    placeholder="Ej: Microsoft Office, Diseño Gráfico, Trabajo en Equipo"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(skills, setSkills, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Achievements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Logros
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(achievements, setAchievements)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {achievements.items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <Textarea
                    value={item.content}
                    onChange={(e) =>
                      updateItem(achievements, setAchievements, item.id, e.target.value)
                    }
                    placeholder="Ej: Primer lugar en Hackathon 2023 - Gané el primer lugar en el hackathon de desarrollo web organizado por la universidad"
                    className="flex-1 h-24"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(achievements, setAchievements, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
