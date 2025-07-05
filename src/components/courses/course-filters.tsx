"use client";

import { useState } from "react";
import {
  CourseFilters as CourseFiltersType,
  CourseCategory,
  CourseLevel,
} from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";

interface CourseFiltersProps {
  filters: CourseFiltersType;
  onFiltersChange: (filters: CourseFiltersType) => void;
}

export const CourseFilters = ({
  filters,
  onFiltersChange,
}: CourseFiltersProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    level: true,
    duration: false,
    price: false,
    features: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (key: keyof CourseFiltersType, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleCategory = (category: CourseCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updateFilters(
      "category",
      newCategories.length > 0 ? newCategories : undefined
    );
  };

  const toggleLevel = (level: CourseLevel) => {
    const currentLevels = filters.level || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level];

    updateFilters("level", newLevels.length > 0 ? newLevels : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const categoryLabels: Record<CourseCategory, string> = {
    [CourseCategory.SOFT_SKILLS]: "Habilidades Blandas",
    [CourseCategory.BASIC_COMPETENCIES]: "Competencias Básicas",
    [CourseCategory.JOB_PLACEMENT]: "Inserción Laboral",
    [CourseCategory.ENTREPRENEURSHIP]: "Emprendimiento",
    [CourseCategory.TECHNICAL_SKILLS]: "Habilidades Técnicas",
    [CourseCategory.DIGITAL_LITERACY]: "Alfabetización Digital",
    [CourseCategory.COMMUNICATION]: "Comunicación",
    [CourseCategory.LEADERSHIP]: "Liderazgo",
  };

  const levelLabels: Record<CourseLevel, string> = {
    [CourseLevel.BEGINNER]: "Principiante",
    [CourseLevel.INTERMEDIATE]: "Intermedio",
    [CourseLevel.ADVANCED]: "Avanzado",
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.level?.length) count += filters.level.length;
    if (filters.duration) count += 1;
    if (filters.price) count += 1;
    if (filters.isFree !== undefined) count += 1;
    if (filters.isMandatory !== undefined) count += 1;
    return count;
  };

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{getActiveFilterCount()}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories */}
        <Collapsible
          open={openSections.category}
          onOpenChange={() => toggleSection("category")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
            <span className="font-medium">Categorías</span>
            <div className="flex items-center gap-2">
              {filters.category?.length && (
                <Badge variant="secondary" className="text-xs">
                  {filters.category.length}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.category ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              {Object.entries(categoryLabels).map(([category, label]) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category?.includes(
                      category as CourseCategory
                    )}
                    onCheckedChange={() =>
                      toggleCategory(category as CourseCategory)
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Levels */}
        <Collapsible
          open={openSections.level}
          onOpenChange={() => toggleSection("level")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
            <span className="font-medium">Nivel</span>
            <div className="flex items-center gap-2">
              {filters.level?.length && (
                <Badge variant="secondary" className="text-xs">
                  {filters.level.length}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.level ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              {Object.entries(levelLabels).map(([level, label]) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={filters.level?.includes(level as CourseLevel)}
                    onCheckedChange={() => toggleLevel(level as CourseLevel)}
                  />
                  <label
                    htmlFor={`level-${level}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Duration */}
        <Collapsible
          open={openSections.duration}
          onOpenChange={() => toggleSection("duration")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
            <span className="font-medium">Duración</span>
            <div className="flex items-center gap-2">
              {filters.duration && (
                <Badge variant="secondary" className="text-xs">
                  {filters.duration.min}h - {filters.duration.max}h
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.duration ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{filters.duration?.min || 1} horas</span>
                  <span>{filters.duration?.max || 50} horas</span>
                </div>
                <Slider
                  value={[
                    filters.duration?.min || 1,
                    filters.duration?.max || 50,
                  ]}
                  onValueChange={([min, max]) =>
                    updateFilters("duration", { min, max })
                  }
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters("duration", { min: 1, max: 5 })}
                  className="text-xs"
                >
                  1-5h
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters("duration", { min: 5, max: 15 })}
                  className="text-xs"
                >
                  5-15h
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateFilters("duration", { min: 15, max: 30 })
                  }
                  className="text-xs"
                >
                  15-30h
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price */}
        <Collapsible
          open={openSections.price}
          onOpenChange={() => toggleSection("price")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
            <span className="font-medium">Precio</span>
            <div className="flex items-center gap-2">
              {(filters.price || filters.isFree !== undefined) && (
                <Badge variant="secondary" className="text-xs">
                  {filters.isFree
                    ? "Gratis"
                    : `$${filters.price?.min || 0} - $${filters.price?.max || 1000}`}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.price ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free-courses"
                  checked={filters.isFree === true}
                  onCheckedChange={(checked) =>
                    updateFilters("isFree", checked ? true : undefined)
                  }
                />
                <label
                  htmlFor="free-courses"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Solo cursos gratuitos
                </label>
              </div>

              {!filters.isFree && (
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>${filters.price?.min || 0} BOB</span>
                    <span>${filters.price?.max || 1000} BOB</span>
                  </div>
                  <Slider
                    value={[
                      filters.price?.min || 0,
                      filters.price?.max || 1000,
                    ]}
                    onValueChange={([min, max]) =>
                      updateFilters("price", { min, max })
                    }
                    max={1000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Features */}
        <Collapsible
          open={openSections.features}
          onOpenChange={() => toggleSection("features")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
            <span className="font-medium">Características</span>
            <div className="flex items-center gap-2">
              {filters.isMandatory !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  1
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.features ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mandatory-courses"
                  checked={filters.isMandatory === true}
                  onCheckedChange={(checked) =>
                    updateFilters("isMandatory", checked ? true : undefined)
                  }
                />
                <label
                  htmlFor="mandatory-courses"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Cursos obligatorios
                </label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Clear All Button */}
        {getActiveFilterCount() > 0 && (
          <>
            <Separator />
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
            >
              Limpiar todos los filtros
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
