&ldquo;use client&rdquo;;

import React, { useState, useRef } from &ldquo;react&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { X, Plus, Code, Heart, Search } from &ldquo;lucide-react&rdquo;;

interface Skill {
  id: string;
  name: string;
  category: &ldquo;technical&rdquo; | &ldquo;soft&rdquo;;
  level?: &ldquo;beginner&rdquo; | &ldquo;intermediate&rdquo; | &ldquo;advanced&rdquo; | &ldquo;expert&rdquo;;
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
    &ldquo;JavaScript&rdquo;,
    &ldquo;TypeScript&rdquo;,
    &ldquo;React&rdquo;,
    &ldquo;Node.js&rdquo;,
    &ldquo;Python&rdquo;,
    &ldquo;Java&rdquo;,
    &ldquo;C++&rdquo;,
    &ldquo;C#&rdquo;,
    &ldquo;PHP&rdquo;,
    &ldquo;Ruby&rdquo;,
    &ldquo;Go&rdquo;,
    &ldquo;Rust&rdquo;,
    &ldquo;Swift&rdquo;,
    &ldquo;Kotlin&rdquo;,
    &ldquo;HTML&rdquo;,
    &ldquo;CSS&rdquo;,
    &ldquo;SASS/SCSS&rdquo;,
    &ldquo;Bootstrap&rdquo;,
    &ldquo;Tailwind CSS&rdquo;,
    &ldquo;Vue.js&rdquo;,
    &ldquo;Angular&rdquo;,
    &ldquo;Next.js&rdquo;,
    &ldquo;Express.js&rdquo;,
    &ldquo;Django&rdquo;,
    &ldquo;Flask&rdquo;,
    &ldquo;Spring Boot&rdquo;,
    &ldquo;Laravel&rdquo;,
    &ldquo;Ruby on Rails&rdquo;,
    &ldquo;MySQL&rdquo;,
    &ldquo;PostgreSQL&rdquo;,
    &ldquo;MongoDB&rdquo;,
    &ldquo;Redis&rdquo;,
    &ldquo;Docker&rdquo;,
    &ldquo;Kubernetes&rdquo;,
    &ldquo;AWS&rdquo;,
    &ldquo;Azure&rdquo;,
    &ldquo;Google Cloud&rdquo;,
    &ldquo;Git&rdquo;,
    &ldquo;GitHub&rdquo;,
    &ldquo;GitLab&rdquo;,
    &ldquo;Jenkins&rdquo;,
    &ldquo;CI/CD&rdquo;,
    &ldquo;Linux&rdquo;,
    &ldquo;Windows Server&rdquo;,
    &ldquo;Figma&rdquo;,
    &ldquo;Adobe Photoshop&rdquo;,
    &ldquo;Adobe Illustrator&rdquo;,
    &ldquo;Excel&rdquo;,
    &ldquo;Word&rdquo;,
    &ldquo;PowerPoint&rdquo;,
    &ldquo;AutoCAD&rdquo;,
    &ldquo;3D Max&rdquo;,
    &ldquo;Blender&rdquo;,
    &ldquo;Unity&rdquo;,
    &ldquo;Unreal Engine&rdquo;,
    &ldquo;Machine Learning&rdquo;,
    &ldquo;Data Analysis&rdquo;,
    &ldquo;SEO&rdquo;,
    &ldquo;Google Analytics&rdquo;,
    &ldquo;Marketing Digital&rdquo;,
    &ldquo;Redes Sociales&rdquo;,
  ],
  soft: [
    &ldquo;Comunicación&rdquo;,
    &ldquo;Liderazgo&rdquo;,
    &ldquo;Trabajo en equipo&rdquo;,
    &ldquo;Resolución de problemas&rdquo;,
    &ldquo;Pensamiento crítico&rdquo;,
    &ldquo;Creatividad&rdquo;,
    &ldquo;Adaptabilidad&rdquo;,
    &ldquo;Gestión del tiempo&rdquo;,
    &ldquo;Organización&rdquo;,
    &ldquo;Atención al detalle&rdquo;,
    &ldquo;Paciencia&rdquo;,
    &ldquo;Empatía&rdquo;,
    &ldquo;Negociación&rdquo;,
    &ldquo;Presentaciones públicas&rdquo;,
    &ldquo;Escritura&rdquo;,
    &ldquo;Idiomas&rdquo;,
    &ldquo;Servicio al cliente&rdquo;,
    &ldquo;Ventas&rdquo;,
    &ldquo;Planificación estratégica&rdquo;,
    &ldquo;Gestión de proyectos&rdquo;,
    &ldquo;Análisis&rdquo;,
    &ldquo;Investigación&rdquo;,
    &ldquo;Innovación&rdquo;,
    &ldquo;Flexibilidad&rdquo;,
    &ldquo;Responsabilidad&rdquo;,
    &ldquo;Iniciativa&rdquo;,
    &ldquo;Motivación&rdquo;,
    &ldquo;Perseverancia&rdquo;,
    &ldquo;Colaboración&rdquo;,
    &ldquo;Mentoring&rdquo;,
    &ldquo;Delegación&rdquo;,
    &ldquo;Toma de decisiones&rdquo;,
    &ldquo;Gestión de conflictos&rdquo;,
    &ldquo;Networking&rdquo;,
  ],
};

export function SkillsSelector({
  selectedSkills,
  onSkillsChange,
  maxSkills = 20,
  showLevels = false,
  placeholder = &ldquo;Buscar habilidades...&rdquo;,
}: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState(&ldquo;&rdquo;);
  const [activeTab, setActiveTab] = useState<&ldquo;technical&rdquo; | &ldquo;soft&rdquo;>(&ldquo;technical&rdquo;);
  const [customSkill, setCustomSkill] = useState(&ldquo;&rdquo;);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert string array to Skill array if needed
  const normalizedSkills: Skill[] = React.useMemo(() => {
    if (selectedSkills.length === 0) return [];

    // Check if it's already a Skill array
    if (typeof selectedSkills[0] === &ldquo;object&rdquo; && &ldquo;id&rdquo; in selectedSkills[0]) {
      return selectedSkills as Skill[];
    }

    // Convert string array to Skill array
    return (selectedSkills as string[]).map((skillName, index) => ({
      id: `skill-${index}-${skillName}`,
      name: skillName,
      category: &ldquo;technical&rdquo; as const, // Default to technical
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
    category: &ldquo;technical&rdquo; | &ldquo;soft&rdquo; = activeTab
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
      level: showLevels ? &ldquo;beginner&rdquo; : undefined,
    };

    onSkillsChange([...normalizedSkills, newSkill]);
    setSearchTerm(&ldquo;&rdquo;);
    setCustomSkill(&ldquo;&rdquo;);
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(normalizedSkills.filter((skill) => skill.id !== skillId));
  };

  const updateSkillLevel = (skillId: string, level: Skill[&ldquo;level&rdquo;]) => {
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

  const getLevelColor = (level: Skill[&ldquo;level&rdquo;]) => {
    switch (level) {
      case &ldquo;beginner&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;intermediate&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;advanced&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      case &ldquo;expert&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getLevelText = (level: Skill[&ldquo;level&rdquo;]) => {
    switch (level) {
      case &ldquo;beginner&rdquo;:
        return &ldquo;Principiante&rdquo;;
      case &ldquo;intermediate&rdquo;:
        return &ldquo;Intermedio&rdquo;;
      case &ldquo;advanced&rdquo;:
        return &ldquo;Avanzado&rdquo;;
      case &ldquo;expert&rdquo;:
        return &ldquo;Experto&rdquo;;
      default:
        return &ldquo;Sin nivel&rdquo;;
    }
  };

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Selected Skills Display */}
      {normalizedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=&ldquo;text-lg&rdquo;>Habilidades Seleccionadas</CardTitle>
            <CardDescription>
              {normalizedSkills.length} de {maxSkills} habilidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
              {normalizedSkills.map((skill) => (
                <div key={skill.id} className=&ldquo;flex items-center gap-1&rdquo;>
                  <Badge
                    variant=&ldquo;secondary&rdquo;
                    className={`flex items-center gap-1 ${
                      skill.category === &ldquo;technical&rdquo;
                        ? &ldquo;border-blue-200&rdquo;
                        : &ldquo;border-pink-200&rdquo;
                    }`}
                  >
                    {skill.category === &ldquo;technical&rdquo; ? (
                      <Code className=&ldquo;h-3 w-3&rdquo; />
                    ) : (
                      <Heart className=&ldquo;h-3 w-3&rdquo; />
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
                      variant=&ldquo;ghost&rdquo;
                      size=&ldquo;sm&rdquo;
                      className=&ldquo;h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground&rdquo;
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className=&ldquo;h-3 w-3&rdquo; />
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
          <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
            <Search className=&ldquo;h-5 w-5&rdquo; />
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
              setActiveTab(value as &ldquo;technical&rdquo; | &ldquo;soft&rdquo;)
            }
          >
            <TabsList className=&ldquo;grid w-full grid-cols-2&rdquo;>
              <TabsTrigger
                value=&ldquo;technical&rdquo;
                className=&ldquo;flex items-center gap-2&rdquo;
              >
                <Code className=&ldquo;h-4 w-4&rdquo; />
                Técnicas
              </TabsTrigger>
              <TabsTrigger value=&ldquo;soft&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
                <Heart className=&ldquo;h-4 w-4&rdquo; />
                Blandas
              </TabsTrigger>
            </TabsList>

            <TabsContent value=&ldquo;technical&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Habilidades Técnicas</Label>
                <Input
                  ref={inputRef}
                  placeholder=&ldquo;Buscar habilidades técnicas...&rdquo;
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=&ldquo;w-full&rdquo;
                />
              </div>

              {/* Suggested Skills */}
              {filteredSkills.length > 0 && (
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Sugerencias:
                  </Label>
                  <div className=&ldquo;flex flex-wrap gap-2 max-h-32 overflow-y-auto&rdquo;>
                    {filteredSkills.slice(0, 20).map((skill) => (
                      <Button
                        key={skill}
                        variant=&ldquo;outline&rdquo;
                        size=&ldquo;sm&rdquo;
                        onClick={() => addSkill(skill, &ldquo;technical&rdquo;)}
                        disabled={normalizedSkills.length >= maxSkills}
                        className=&ldquo;h-8 text-xs&rdquo;
                      >
                        <Plus className=&ldquo;h-3 w-3 mr-1&rdquo; />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value=&ldquo;soft&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Habilidades Blandas</Label>
                <Input
                  placeholder=&ldquo;Buscar habilidades blandas...&rdquo;
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=&ldquo;w-full&rdquo;
                />
              </div>

              {/* Suggested Skills */}
              {filteredSkills.length > 0 && (
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Sugerencias:
                  </Label>
                  <div className=&ldquo;flex flex-wrap gap-2 max-h-32 overflow-y-auto&rdquo;>
                    {filteredSkills.slice(0, 20).map((skill) => (
                      <Button
                        key={skill}
                        variant=&ldquo;outline&rdquo;
                        size=&ldquo;sm&rdquo;
                        onClick={() => addSkill(skill, &ldquo;soft&rdquo;)}
                        disabled={normalizedSkills.length >= maxSkills}
                        className=&ldquo;h-8 text-xs&rdquo;
                      >
                        <Plus className=&ldquo;h-3 w-3 mr-1&rdquo; />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Custom Skill Input */}
          <div className=&ldquo;flex gap-2 mt-4&rdquo;>
            <Input
              placeholder={`Agregar habilidad ${activeTab === &ldquo;technical&rdquo; ? &ldquo;técnica&rdquo; : &ldquo;blanda&rdquo;} personalizada...`}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === &ldquo;Enter&rdquo; && addCustomSkill()}
              disabled={normalizedSkills.length >= maxSkills}
            />
            <Button
              onClick={addCustomSkill}
              disabled={
                !customSkill.trim() || normalizedSkills.length >= maxSkills
              }
              size=&ldquo;sm&rdquo;
            >
              <Plus className=&ldquo;h-4 w-4&rdquo; />
            </Button>
          </div>

          {/* Level Selection for Skills */}
          {showLevels && normalizedSkills.length > 0 && (
            <div className=&ldquo;mt-6 space-y-4&rdquo;>
              <Label>Nivel de Habilidades</Label>
              <div className=&ldquo;space-y-3&rdquo;>
                {normalizedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className=&ldquo;flex items-center justify-between p-3 border rounded-lg&rdquo;
                  >
                    <div className=&ldquo;flex items-center gap-2&rdquo;>
                      {skill.category === &ldquo;technical&rdquo; ? (
                        <Code className=&ldquo;h-4 w-4 text-blue-500&rdquo; />
                      ) : (
                        <Heart className=&ldquo;h-4 w-4 text-pink-500&rdquo; />
                      )}
                      <span className=&ldquo;font-medium&rdquo;>{skill.name}</span>
                    </div>

                    <div className=&ldquo;flex gap-1&rdquo;>
                      {(
                        [
                          &ldquo;beginner&rdquo;,
                          &ldquo;intermediate&rdquo;,
                          &ldquo;advanced&rdquo;,
                          &ldquo;expert&rdquo;,
                        ] as const
                      ).map((level) => (
                        <Button
                          key={level}
                          variant={
                            skill.level === level ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;
                          }
                          size=&ldquo;sm&rdquo;
                          onClick={() => updateSkillLevel(skill.id, level)}
                          className=&ldquo;text-xs&rdquo;
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
