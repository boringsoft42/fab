"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Code, Heart, Search } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft";
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

interface SkillsSelectorProps {
  selectedSkills: Skill[] | string[];
  onSkillsChange: (skills: Skill[]) => void;
  maxSkills?: number;
  showLevels?: boolean;
  placeholder?: string;
}

// Predefined skills database
const PREDEFINED_SKILLS = {
  technical: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "HTML",
    "CSS",
    "SASS/SCSS",
    "Bootstrap",
    "Tailwind CSS",
    "Vue.js",
    "Angular",
    "Next.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "Ruby on Rails",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Git",
    "GitHub",
    "GitLab",
    "Jenkins",
    "CI/CD",
    "Linux",
    "Windows Server",
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Excel",
    "Word",
    "PowerPoint",
    "AutoCAD",
    "3D Max",
    "Blender",
    "Unity",
    "Unreal Engine",
    "Machine Learning",
    "Data Analysis",
    "SEO",
    "Google Analytics",
    "Marketing Digital",
    "Redes Sociales",
  ],
  soft: [
    "Comunicación",
    "Liderazgo",
    "Trabajo en equipo",
    "Resolución de problemas",
    "Pensamiento crítico",
    "Creatividad",
    "Adaptabilidad",
    "Gestión del tiempo",
    "Organización",
    "Atención al detalle",
    "Paciencia",
    "Empatía",
    "Negociación",
    "Presentaciones públicas",
    "Escritura",
    "Idiomas",
    "Servicio al cliente",
    "Ventas",
    "Planificación estratégica",
    "Gestión de proyectos",
    "Análisis",
    "Investigación",
    "Innovación",
    "Flexibilidad",
    "Responsabilidad",
    "Iniciativa",
    "Motivación",
    "Perseverancia",
    "Colaboración",
    "Mentoring",
    "Delegación",
    "Toma de decisiones",
    "Gestión de conflictos",
    "Networking",
  ],
};

export function SkillsSelector({
  selectedSkills,
  onSkillsChange,
  maxSkills = 20,
  showLevels = false,
  placeholder = "Buscar habilidades...",
}: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"technical" | "soft">("technical");
  const [customSkill, setCustomSkill] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert string array to Skill array if needed
  const normalizedSkills: Skill[] = React.useMemo(() => {
    if (selectedSkills.length === 0) return [];

    // Check if it's already a Skill array
    if (typeof selectedSkills[0] === "object" && "id" in selectedSkills[0]) {
      return selectedSkills as Skill[];
    }

    // Convert string array to Skill array
    return (selectedSkills as string[]).map((skillName, index) => ({
      id: `skill-${index}-${skillName}`,
      name: skillName,
      category: "technical" as const, // Default to technical
      level: undefined,
    }));
  }, [selectedSkills]);

  const filteredSkills = PREDEFINED_SKILLS[activeTab].filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !normalizedSkills.some(
        (selected) => selected.name.toLowerCase() === skill.toLowerCase()
      )
  );

  const addSkill = (
    skillName: string,
    category: "technical" | "soft" = activeTab
  ) => {
    if (normalizedSkills.length >= maxSkills) return;

    const existingSkill = normalizedSkills.find(
      (skill) => skill.name.toLowerCase() === skillName.toLowerCase()
    );

    if (existingSkill) return;

    const newSkill: Skill = {
      id: `${category}-${Date.now()}-${Math.random()}`,
      name: skillName,
      category,
      level: showLevels ? "beginner" : undefined,
    };

    onSkillsChange([...normalizedSkills, newSkill]);
    setSearchTerm("");
    setCustomSkill("");
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(normalizedSkills.filter((skill) => skill.id !== skillId));
  };

  const updateSkillLevel = (skillId: string, level: Skill["level"]) => {
    onSkillsChange(
      normalizedSkills.map((skill) =>
        skill.id === skillId ? { ...skill, level } : skill
      )
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim(), activeTab);
    }
  };

  const getLevelColor = (level: Skill["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-green-100 text-green-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level: Skill["level"]) => {
    switch (level) {
      case "beginner":
        return "Principiante";
      case "intermediate":
        return "Intermedio";
      case "advanced":
        return "Avanzado";
      case "expert":
        return "Experto";
      default:
        return "Sin nivel";
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Skills Display */}
      {normalizedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Habilidades Seleccionadas</CardTitle>
            <CardDescription>
              {normalizedSkills.length} de {maxSkills} habilidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {normalizedSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className={`flex items-center gap-1 ${
                      skill.category === "technical"
                        ? "border-blue-200"
                        : "border-pink-200"
                    }`}
                  >
                    {skill.category === "technical" ? (
                      <Code className="h-3 w-3" />
                    ) : (
                      <Heart className="h-3 w-3" />
                    )}
                    {skill.name}
                    {showLevels && skill.level && (
                      <span
                        className={`text-xs px-1 py-0.5 rounded ml-1 ${getLevelColor(skill.level)}`}
                      >
                        {getLevelText(skill.level)}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Agregar Habilidades
          </CardTitle>
          <CardDescription>
            Selecciona tus habilidades técnicas y blandas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "technical" | "soft")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="technical"
                className="flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                Técnicas
              </TabsTrigger>
              <TabsTrigger value="soft" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Blandas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-4">
              <div className="space-y-2">
                <Label>Habilidades Técnicas</Label>
                <Input
                  ref={inputRef}
                  placeholder="Buscar habilidades técnicas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Suggested Skills */}
              {filteredSkills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Sugerencias:
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {filteredSkills.slice(0, 20).map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill, "technical")}
                        disabled={normalizedSkills.length >= maxSkills}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="soft" className="space-y-4">
              <div className="space-y-2">
                <Label>Habilidades Blandas</Label>
                <Input
                  placeholder="Buscar habilidades blandas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Suggested Skills */}
              {filteredSkills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Sugerencias:
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {filteredSkills.slice(0, 20).map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill, "soft")}
                        disabled={normalizedSkills.length >= maxSkills}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Custom Skill Input */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder={`Agregar habilidad ${activeTab === "technical" ? "técnica" : "blanda"} personalizada...`}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
              disabled={normalizedSkills.length >= maxSkills}
            />
            <Button
              onClick={addCustomSkill}
              disabled={
                !customSkill.trim() || normalizedSkills.length >= maxSkills
              }
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Level Selection for Skills */}
          {showLevels && normalizedSkills.length > 0 && (
            <div className="mt-6 space-y-4">
              <Label>Nivel de Habilidades</Label>
              <div className="space-y-3">
                {normalizedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {skill.category === "technical" ? (
                        <Code className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Heart className="h-4 w-4 text-pink-500" />
                      )}
                      <span className="font-medium">{skill.name}</span>
                    </div>

                    <div className="flex gap-1">
                      {(
                        [
                          "beginner",
                          "intermediate",
                          "advanced",
                          "expert",
                        ] as const
                      ).map((level) => (
                        <Button
                          key={level}
                          variant={
                            skill.level === level ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => updateSkillLevel(skill.id, level)}
                          className="text-xs"
                        >
                          {getLevelText(level)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
