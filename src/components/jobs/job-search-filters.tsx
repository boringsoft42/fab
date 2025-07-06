"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  JobSearchFilters as JobFilters,
  ContractType,
  WorkModality,
  ExperienceLevel,
} from "@/types/jobs";

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
    { value: "FULL_TIME" as ContractType, label: "Tiempo completo" },
    { value: "PART_TIME" as ContractType, label: "Medio tiempo" },
    { value: "INTERNSHIP" as ContractType, label: "Prácticas" },
    { value: "VOLUNTEER" as ContractType, label: "Voluntariado" },
    { value: "FREELANCE" as ContractType, label: "Freelance" },
  ];

  const workModalityOptions = [
    { value: "ON_SITE" as WorkModality, label: "Presencial" },
    { value: "REMOTE" as WorkModality, label: "Remoto" },
    { value: "HYBRID" as WorkModality, label: "Híbrido" },
  ];

  const experienceLevelOptions = [
    { value: "NO_EXPERIENCE" as ExperienceLevel, label: "Sin experiencia" },
    { value: "ENTRY_LEVEL" as ExperienceLevel, label: "Principiante" },
    { value: "MID_LEVEL" as ExperienceLevel, label: "Intermedio" },
    { value: "SENIOR_LEVEL" as ExperienceLevel, label: "Senior" },
  ];

  const locationOptions = [
    "Cochabamba",
    "La Paz",
    "Santa Cruz",
    "Sucre",
    "Potosí",
    "Oruro",
    "Tarija",
    "Beni",
    "Pando",
  ];

  const sectorOptions = [
    "Tecnología",
    "Marketing",
    "Salud",
    "Educación",
    "Finanzas",
    "Retail",
    "Turismo",
    "Construcción",
    "Agricultura",
    "Otros",
  ];

  const datePostedOptions = [
    { value: 1, label: "Último día" },
    { value: 7, label: "Última semana" },
    { value: 30, label: "Último mes" },
    { value: 90, label: "Últimos 3 meses" },
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
    <Card className="mb-4">
      <CardHeader className="cursor-pointer pb-3" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {title}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} filtros
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {/* Location */}
      <FilterSection
        title="Ubicación"
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection("location")}
      >
        <div className="space-y-2">
          {locationOptions.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={filters.location?.includes(location) || false}
                onCheckedChange={(checked) =>
                  handleLocationChange(location, checked as boolean)
                }
              />
              <Label htmlFor={`location-${location}`} className="text-sm">
                {location}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Contract Type */}
      <FilterSection
        title="Tipo de contrato"
        isExpanded={expandedSections.contractType}
        onToggle={() => toggleSection("contractType")}
      >
        <div className="space-y-2">
          {contractTypeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`contract-${option.value}`}
                checked={filters.contractType?.includes(option.value) || false}
                onCheckedChange={(checked) =>
                  handleContractTypeChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`contract-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Work Modality */}
      <FilterSection
        title="Modalidad de trabajo"
        isExpanded={expandedSections.workModality}
        onToggle={() => toggleSection("workModality")}
      >
        <div className="space-y-2">
          {workModalityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`modality-${option.value}`}
                checked={filters.workModality?.includes(option.value) || false}
                onCheckedChange={(checked) =>
                  handleWorkModalityChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`modality-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Experience Level */}
      <FilterSection
        title="Nivel de experiencia"
        isExpanded={expandedSections.experienceLevel}
        onToggle={() => toggleSection("experienceLevel")}
      >
        <div className="space-y-2">
          {experienceLevelOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`experience-${option.value}`}
                checked={
                  filters.experienceLevel?.includes(option.value) || false
                }
                onCheckedChange={(checked) =>
                  handleExperienceLevelChange(option.value, checked as boolean)
                }
              />
              <Label htmlFor={`experience-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range */}
      <FilterSection
        title="Rango salarial"
        isExpanded={expandedSections.salary}
        onToggle={() => toggleSection("salary")}
      >
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={[filters.salaryMin || 1000, filters.salaryMax || 10000]}
              onValueChange={handleSalaryChange}
              min={1000}
              max={20000}
              step={500}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Bs. {filters.salaryMin || 1000}</span>
            <span>Bs. {filters.salaryMax || 10000}</span>
          </div>
        </div>
      </FilterSection>

      {/* Date Posted */}
      <FilterSection
        title="Fecha de publicación"
        isExpanded={expandedSections.datePosted}
        onToggle={() => toggleSection("datePosted")}
      >
        <div className="space-y-2">
          {datePostedOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
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
              <Label htmlFor={`date-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Sector */}
      <FilterSection
        title="Sector"
        isExpanded={expandedSections.sector}
        onToggle={() => toggleSection("sector")}
      >
        <div className="space-y-2">
          {sectorOptions.map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox
                id={`sector-${sector}`}
                checked={filters.sector?.includes(sector) || false}
                onCheckedChange={(checked) =>
                  handleSectorChange(sector, checked as boolean)
                }
              />
              <Label htmlFor={`sector-${sector}`} className="text-sm">
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};
