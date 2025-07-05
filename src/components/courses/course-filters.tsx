&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import {
  CourseFilters as CourseFiltersType,
  CourseCategory,
  CourseLevel,
} from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Slider } from &ldquo;@/components/ui/slider&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from &ldquo;@/components/ui/collapsible&rdquo;;
import { ChevronDown, X } from &ldquo;lucide-react&rdquo;;

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
      &ldquo;category&rdquo;,
      newCategories.length > 0 ? newCategories : undefined
    );
  };

  const toggleLevel = (level: CourseLevel) => {
    const currentLevels = filters.level || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level];

    updateFilters(&ldquo;level&rdquo;, newLevels.length > 0 ? newLevels : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const categoryLabels: Record<CourseCategory, string> = {
    [CourseCategory.SOFT_SKILLS]: &ldquo;Habilidades Blandas&rdquo;,
    [CourseCategory.BASIC_COMPETENCIES]: &ldquo;Competencias Básicas&rdquo;,
    [CourseCategory.JOB_PLACEMENT]: &ldquo;Inserción Laboral&rdquo;,
    [CourseCategory.ENTREPRENEURSHIP]: &ldquo;Emprendimiento&rdquo;,
    [CourseCategory.TECHNICAL_SKILLS]: &ldquo;Habilidades Técnicas&rdquo;,
    [CourseCategory.DIGITAL_LITERACY]: &ldquo;Alfabetización Digital&rdquo;,
    [CourseCategory.COMMUNICATION]: &ldquo;Comunicación&rdquo;,
    [CourseCategory.LEADERSHIP]: &ldquo;Liderazgo&rdquo;,
  };

  const levelLabels: Record<CourseLevel, string> = {
    [CourseLevel.BEGINNER]: &ldquo;Principiante&rdquo;,
    [CourseLevel.INTERMEDIATE]: &ldquo;Intermedio&rdquo;,
    [CourseLevel.ADVANCED]: &ldquo;Avanzado&rdquo;,
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
    <Card className=&ldquo;sticky top-6&rdquo;>
      <CardHeader className=&ldquo;pb-3&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <CardTitle className=&ldquo;text-lg&rdquo;>Filtros</CardTitle>
          {getActiveFilterCount() > 0 && (
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Badge variant=&ldquo;secondary&rdquo;>{getActiveFilterCount()}</Badge>
              <Button
                variant=&ldquo;ghost&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={clearAllFilters}
                className=&ldquo;h-8 px-2&rdquo;
              >
                <X className=&ldquo;h-4 w-4&rdquo; />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className=&ldquo;space-y-4&rdquo;>
        {/* Categories */}
        <Collapsible
          open={openSections.category}
          onOpenChange={() => toggleSection(&ldquo;category&rdquo;)}
        >
          <CollapsibleTrigger className=&ldquo;flex items-center justify-between w-full p-2 hover:bg-muted rounded-md&rdquo;>
            <span className=&ldquo;font-medium&rdquo;>Categorías</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              {filters.category?.length && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                  {filters.category.length}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.category ? &ldquo;rotate-180&rdquo; : &ldquo;&rdquo;}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=&ldquo;pt-2&rdquo;>
            <div className=&ldquo;space-y-3&rdquo;>
              {Object.entries(categoryLabels).map(([category, label]) => (
                <div key={category} className=&ldquo;flex items-center space-x-2&rdquo;>
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
                    className=&ldquo;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer&rdquo;
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
          onOpenChange={() => toggleSection(&ldquo;level&rdquo;)}
        >
          <CollapsibleTrigger className=&ldquo;flex items-center justify-between w-full p-2 hover:bg-muted rounded-md&rdquo;>
            <span className=&ldquo;font-medium&rdquo;>Nivel</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              {filters.level?.length && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                  {filters.level.length}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.level ? &ldquo;rotate-180&rdquo; : &ldquo;&rdquo;}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=&ldquo;pt-2&rdquo;>
            <div className=&ldquo;space-y-3&rdquo;>
              {Object.entries(levelLabels).map(([level, label]) => (
                <div key={level} className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id={`level-${level}`}
                    checked={filters.level?.includes(level as CourseLevel)}
                    onCheckedChange={() => toggleLevel(level as CourseLevel)}
                  />
                  <label
                    htmlFor={`level-${level}`}
                    className=&ldquo;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer&rdquo;
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
          onOpenChange={() => toggleSection(&ldquo;duration&rdquo;)}
        >
          <CollapsibleTrigger className=&ldquo;flex items-center justify-between w-full p-2 hover:bg-muted rounded-md&rdquo;>
            <span className=&ldquo;font-medium&rdquo;>Duración</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              {filters.duration && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                  {filters.duration.min}h - {filters.duration.max}h
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.duration ? &ldquo;rotate-180&rdquo; : &ldquo;&rdquo;}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=&ldquo;pt-2&rdquo;>
            <div className=&ldquo;space-y-4&rdquo;>
              <div>
                <div className=&ldquo;flex justify-between text-sm text-muted-foreground mb-2&rdquo;>
                  <span>{filters.duration?.min || 1} horas</span>
                  <span>{filters.duration?.max || 50} horas</span>
                </div>
                <Slider
                  value={[
                    filters.duration?.min || 1,
                    filters.duration?.max || 50,
                  ]}
                  onValueChange={([min, max]) =>
                    updateFilters(&ldquo;duration&rdquo;, { min, max })
                  }
                  max={50}
                  min={1}
                  step={1}
                  className=&ldquo;w-full&rdquo;
                />
              </div>
              <div className=&ldquo;flex gap-2&rdquo;>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => updateFilters(&ldquo;duration&rdquo;, { min: 1, max: 5 })}
                  className=&ldquo;text-xs&rdquo;
                >
                  1-5h
                </Button>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => updateFilters(&ldquo;duration&rdquo;, { min: 5, max: 15 })}
                  className=&ldquo;text-xs&rdquo;
                >
                  5-15h
                </Button>
                <Button
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() =>
                    updateFilters(&ldquo;duration&rdquo;, { min: 15, max: 30 })
                  }
                  className=&ldquo;text-xs&rdquo;
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
          onOpenChange={() => toggleSection(&ldquo;price&rdquo;)}
        >
          <CollapsibleTrigger className=&ldquo;flex items-center justify-between w-full p-2 hover:bg-muted rounded-md&rdquo;>
            <span className=&ldquo;font-medium&rdquo;>Precio</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              {(filters.price || filters.isFree !== undefined) && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                  {filters.isFree
                    ? &ldquo;Gratis&rdquo;
                    : `$${filters.price?.min || 0} - $${filters.price?.max || 1000}`}
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.price ? &ldquo;rotate-180&rdquo; : &ldquo;&rdquo;}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=&ldquo;pt-2&rdquo;>
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <Checkbox
                  id=&ldquo;free-courses&rdquo;
                  checked={filters.isFree === true}
                  onCheckedChange={(checked) =>
                    updateFilters(&ldquo;isFree&rdquo;, checked ? true : undefined)
                  }
                />
                <label
                  htmlFor=&ldquo;free-courses&rdquo;
                  className=&ldquo;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer&rdquo;
                >
                  Solo cursos gratuitos
                </label>
              </div>

              {!filters.isFree && (
                <div>
                  <div className=&ldquo;flex justify-between text-sm text-muted-foreground mb-2&rdquo;>
                    <span>${filters.price?.min || 0} BOB</span>
                    <span>${filters.price?.max || 1000} BOB</span>
                  </div>
                  <Slider
                    value={[
                      filters.price?.min || 0,
                      filters.price?.max || 1000,
                    ]}
                    onValueChange={([min, max]) =>
                      updateFilters(&ldquo;price&rdquo;, { min, max })
                    }
                    max={1000}
                    min={0}
                    step={50}
                    className=&ldquo;w-full&rdquo;
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
          onOpenChange={() => toggleSection(&ldquo;features&rdquo;)}
        >
          <CollapsibleTrigger className=&ldquo;flex items-center justify-between w-full p-2 hover:bg-muted rounded-md&rdquo;>
            <span className=&ldquo;font-medium&rdquo;>Características</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              {filters.isMandatory !== undefined && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                  1
                </Badge>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.features ? &ldquo;rotate-180&rdquo; : &ldquo;&rdquo;}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=&ldquo;pt-2&rdquo;>
            <div className=&ldquo;space-y-3&rdquo;>
              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <Checkbox
                  id=&ldquo;mandatory-courses&rdquo;
                  checked={filters.isMandatory === true}
                  onCheckedChange={(checked) =>
                    updateFilters(&ldquo;isMandatory&rdquo;, checked ? true : undefined)
                  }
                />
                <label
                  htmlFor=&ldquo;mandatory-courses&rdquo;
                  className=&ldquo;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer&rdquo;
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
              variant=&ldquo;outline&rdquo;
              onClick={clearAllFilters}
              className=&ldquo;w-full&rdquo;
            >
              Limpiar todos los filtros
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
