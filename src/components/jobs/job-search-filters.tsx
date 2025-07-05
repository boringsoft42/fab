&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { X, ChevronDown, ChevronUp } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Slider } from &ldquo;@/components/ui/slider&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  JobSearchFilters as JobFilters,
  ContractType,
  WorkModality,
  ExperienceLevel,
} from &ldquo;@/types/jobs&rdquo;;

interface JobSearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

export const JobSearchFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: JobSearchFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    contractType: true,
    workModality: true,
    experienceLevel: true,
    salary: false,
    datePosted: false,
    sector: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleContractTypeChange = (
    contractType: ContractType,
    checked: boolean
  ) => {
    const current = filters.contractType || [];
    const updated = checked
      ? [...current, contractType]
      : current.filter((type) => type !== contractType);

    onFiltersChange({ ...filters, contractType: updated });
  };

  const handleWorkModalityChange = (
    modality: WorkModality,
    checked: boolean
  ) => {
    const current = filters.workModality || [];
    const updated = checked
      ? [...current, modality]
      : current.filter((mod) => mod !== modality);

    onFiltersChange({ ...filters, workModality: updated });
  };

  const handleExperienceLevelChange = (
    level: ExperienceLevel,
    checked: boolean
  ) => {
    const current = filters.experienceLevel || [];
    const updated = checked
      ? [...current, level]
      : current.filter((exp) => exp !== level);

    onFiltersChange({ ...filters, experienceLevel: updated });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const current = filters.location || [];
    const updated = checked
      ? [...current, location]
      : current.filter((loc) => loc !== location);

    onFiltersChange({ ...filters, location: updated });
  };

  const handleSectorChange = (sector: string, checked: boolean) => {
    const current = filters.sector || [];
    const updated = checked
      ? [...current, sector]
      : current.filter((s) => s !== sector);

    onFiltersChange({ ...filters, sector: updated });
  };

  const handleSalaryChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      salaryMin: value[0],
      salaryMax: value[1],
    });
  };

  const handleDatePostedChange = (days: number) => {
    onFiltersChange({ ...filters, publishedInDays: days });
  };

  const contractTypeOptions = [
    { value: &ldquo;FULL_TIME&rdquo; as ContractType, label: &ldquo;Tiempo completo&rdquo; },
    { value: &ldquo;PART_TIME&rdquo; as ContractType, label: &ldquo;Medio tiempo&rdquo; },
    { value: &ldquo;INTERNSHIP&rdquo; as ContractType, label: &ldquo;Prácticas&rdquo; },
    { value: &ldquo;VOLUNTEER&rdquo; as ContractType, label: &ldquo;Voluntariado&rdquo; },
    { value: &ldquo;FREELANCE&rdquo; as ContractType, label: &ldquo;Freelance&rdquo; },
  ];

  const workModalityOptions = [
    { value: &ldquo;ON_SITE&rdquo; as WorkModality, label: &ldquo;Presencial&rdquo; },
    { value: &ldquo;REMOTE&rdquo; as WorkModality, label: &ldquo;Remoto&rdquo; },
    { value: &ldquo;HYBRID&rdquo; as WorkModality, label: &ldquo;Híbrido&rdquo; },
  ];

  const experienceLevelOptions = [
    { value: &ldquo;NO_EXPERIENCE&rdquo; as ExperienceLevel, label: &ldquo;Sin experiencia&rdquo; },
    { value: &ldquo;ENTRY_LEVEL&rdquo; as ExperienceLevel, label: &ldquo;Principiante&rdquo; },
    { value: &ldquo;MID_LEVEL&rdquo; as ExperienceLevel, label: &ldquo;Intermedio&rdquo; },
    { value: &ldquo;SENIOR_LEVEL&rdquo; as ExperienceLevel, label: &ldquo;Senior&rdquo; },
  ];

  const locationOptions = [
    &ldquo;Cochabamba&rdquo;,
    &ldquo;La Paz&rdquo;,
    &ldquo;Santa Cruz&rdquo;,
    &ldquo;Sucre&rdquo;,
    &ldquo;Potosí&rdquo;,
    &ldquo;Oruro&rdquo;,
    &ldquo;Tarija&rdquo;,
    &ldquo;Beni&rdquo;,
    &ldquo;Pando&rdquo;,
  ];

  const sectorOptions = [
    &ldquo;Tecnología&rdquo;,
    &ldquo;Marketing&rdquo;,
    &ldquo;Salud&rdquo;,
    &ldquo;Educación&rdquo;,
    &ldquo;Finanzas&rdquo;,
    &ldquo;Retail&rdquo;,
    &ldquo;Turismo&rdquo;,
    &ldquo;Construcción&rdquo;,
    &ldquo;Agricultura&rdquo;,
    &ldquo;Otros&rdquo;,
  ];

  const datePostedOptions = [
    { value: 1, label: &ldquo;Último día&rdquo; },
    { value: 7, label: &ldquo;Última semana&rdquo; },
    { value: 30, label: &ldquo;Último mes&rdquo; },
    { value: 90, label: &ldquo;Últimos 3 meses&rdquo; },
  ];

  const FilterSection = ({
    title,
    isExpanded,
    onToggle,
    children,
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <Card className=&ldquo;mb-4&rdquo;>
      <CardHeader className=&ldquo;cursor-pointer pb-3&rdquo; onClick={onToggle}>
        <CardTitle className=&ldquo;flex items-center justify-between text-sm font-medium&rdquo;>
          {title}
          {isExpanded ? (
            <ChevronUp className=&ldquo;w-4 h-4&rdquo; />
          ) : (
            <ChevronDown className=&ldquo;w-4 h-4&rdquo; />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && <CardContent className=&ldquo;pt-0&rdquo;>{children}</CardContent>}
    </Card>
  );

  const activeFiltersCount = [
    filters.contractType?.length || 0,
    filters.workModality?.length || 0,
    filters.experienceLevel?.length || 0,
    filters.location?.length || 0,
    filters.sector?.length || 0,
    filters.salaryMin ? 1 : 0,
    filters.publishedInDays ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className=&ldquo;space-y-4&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <h3 className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>Filtros</h3>
        {activeFiltersCount > 0 && (
          <div className=&ldquo;flex items-center space-x-2&rdquo;>
            <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
              {activeFiltersCount} filtros
            </Badge>
            <Button
              variant=&ldquo;ghost&rdquo;
              size=&ldquo;sm&rdquo;
              onClick={onClearFilters}
              className=&ldquo;text-xs&rdquo;
            >
              <X className=&ldquo;w-3 h-3 mr-1&rdquo; />
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {/* Location */}
      <FilterSection
        title=&ldquo;Ubicación&rdquo;
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection(&ldquo;location&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {locationOptions.map((location) => (
            <div key={location} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`location-${location}`}
                checked={filters.location?.includes(location) || false}
                onCheckedChange={(checked) =>
                  handleLocationChange(location, checked as boolean)
                }
              />
              <Label htmlFor={`location-${location}`} className=&ldquo;text-sm&rdquo;>
                {location}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Contract Type */}
      <FilterSection
        title=&ldquo;Tipo de contrato&rdquo;
        isExpanded={expandedSections.contractType}
        onToggle={() => toggleSection(&ldquo;contractType&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {contractTypeOptions.map((option) => (
            <div key={option.value} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`contract-${option.value}`}
                checked={filters.contractType?.includes(option.value) || false}
                onCheckedChange={(checked) =>
                  handleContractTypeChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`contract-${option.value}`} className=&ldquo;text-sm&rdquo;>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Work Modality */}
      <FilterSection
        title=&ldquo;Modalidad de trabajo&rdquo;
        isExpanded={expandedSections.workModality}
        onToggle={() => toggleSection(&ldquo;workModality&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {workModalityOptions.map((option) => (
            <div key={option.value} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`modality-${option.value}`}
                checked={filters.workModality?.includes(option.value) || false}
                onCheckedChange={(checked) =>
                  handleWorkModalityChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`modality-${option.value}`} className=&ldquo;text-sm&rdquo;>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Experience Level */}
      <FilterSection
        title=&ldquo;Nivel de experiencia&rdquo;
        isExpanded={expandedSections.experienceLevel}
        onToggle={() => toggleSection(&ldquo;experienceLevel&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {experienceLevelOptions.map((option) => (
            <div key={option.value} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`experience-${option.value}`}
                checked={
                  filters.experienceLevel?.includes(option.value) || false
                }
                onCheckedChange={(checked) =>
                  handleExperienceLevelChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`experience-${option.value}`} className=&ldquo;text-sm&rdquo;>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range */}
      <FilterSection
        title=&ldquo;Rango salarial&rdquo;
        isExpanded={expandedSections.salary}
        onToggle={() => toggleSection(&ldquo;salary&rdquo;)}
      >
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;px-2&rdquo;>
            <Slider
              value={[filters.salaryMin || 1000, filters.salaryMax || 10000]}
              onValueChange={handleSalaryChange}
              min={1000}
              max={20000}
              step={500}
              className=&ldquo;w-full&rdquo;
            />
          </div>
          <div className=&ldquo;flex justify-between text-sm text-gray-600&rdquo;>
            <span>Bs. {filters.salaryMin || 1000}</span>
            <span>Bs. {filters.salaryMax || 10000}</span>
          </div>
        </div>
      </FilterSection>

      {/* Date Posted */}
      <FilterSection
        title=&ldquo;Fecha de publicación&rdquo;
        isExpanded={expandedSections.datePosted}
        onToggle={() => toggleSection(&ldquo;datePosted&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {datePostedOptions.map((option) => (
            <div key={option.value} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`date-${option.value}`}
                checked={filters.publishedInDays === option.value}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleDatePostedChange(option.value);
                  } else {
                    onFiltersChange({ ...filters, publishedInDays: undefined });
                  }
                }}
              />
              <Label htmlFor={`date-${option.value}`} className=&ldquo;text-sm&rdquo;>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Sector */}
      <FilterSection
        title=&ldquo;Sector&rdquo;
        isExpanded={expandedSections.sector}
        onToggle={() => toggleSection(&ldquo;sector&rdquo;)}
      >
        <div className=&ldquo;space-y-2&rdquo;>
          {sectorOptions.map((sector) => (
            <div key={sector} className=&ldquo;flex items-center space-x-2&rdquo;>
              <Checkbox
                id={`sector-${sector}`}
                checked={filters.sector?.includes(sector) || false}
                onCheckedChange={(checked) =>
                  handleSectorChange(sector, checked as boolean)
                }
              />
              <Label htmlFor={`sector-${sector}`} className=&ldquo;text-sm&rdquo;>
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};
