"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  JobOffer,
  ContractType,
  WorkModality,
  ExperienceLevel,
  JobStatus,
  JobQuestion,
} from "@/types/jobs";

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  // Form state
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "Cochabamba, Bolivia",
    contractType: "" as ContractType,
    workModality: "" as WorkModality,
    experienceLevel: "" as ExperienceLevel,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "BOB",
    requiredSkills: [] as string[],
    desiredSkills: [] as string[],
    benefits: [] as string[],
    requirements: [] as string[],
    responsibilities: [] as string[],
    closingDate: "",
    questions: [] as JobQuestion[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");

  const contractTypeOptions = [
    { value: "FULL_TIME", label: "Tiempo completo" },
    { value: "PART_TIME", label: "Medio tiempo" },
    { value: "INTERNSHIP", label: "Prácticas" },
    { value: "VOLUNTEER", label: "Voluntariado" },
    { value: "FREELANCE", label: "Freelance" },
  ];

  const workModalityOptions = [
    { value: "ON_SITE", label: "Presencial" },
    { value: "REMOTE", label: "Remoto" },
    { value: "HYBRID", label: "Híbrido" },
  ];

  const experienceLevelOptions = [
    { value: "NO_EXPERIENCE", label: "Sin experiencia" },
    { value: "ENTRY_LEVEL", label: "Principiante" },
    { value: "MID_LEVEL", label: "Intermedio" },
    { value: "SENIOR_LEVEL", label: "Senior" },
  ];

  const addToArray = (
    field: keyof typeof jobData,
    value: string,
    setInput: (value: string) => void
  ) => {
    if (value.trim()) {
      setJobData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setInput("");
    }
  };

  const removeFromArray = (field: keyof typeof jobData, index: number) => {
    setJobData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    if (questionInput.trim()) {
      const newQuestion: JobQuestion = {
        id: `q${Date.now()}`,
        question: questionInput.trim(),
        type: "TEXT",
        required: false,
      };

      setJobData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setQuestionInput("");
    }
  };

  const removeQuestion = (index: number) => {
    setJobData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index: number, updates: Partial<JobQuestion>) => {
    setJobData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, ...updates } : q
      ),
    }));
  };

  const validateForm = () => {
    const required = [
      "title",
      "description",
      "contractType",
      "workModality",
      "experienceLevel",
    ];

    for (const field of required) {
      if (!jobData[field as keyof typeof jobData]) {
        toast({
          title: "Campos requeridos",
          description: `Por favor completa el campo: ${field}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (jobData.requiredSkills.length === 0) {
      toast({
        title: "Habilidades requeridas",
        description: "Agrega al menos una habilidad requerida",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (status: JobStatus) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newJob: Partial<JobOffer> = {
        ...jobData,
        salaryMin: jobData.salaryMin ? parseInt(jobData.salaryMin) : undefined,
        salaryMax: jobData.salaryMax ? parseInt(jobData.salaryMax) : undefined,
        closingDate: jobData.closingDate || undefined,
        status,
        company: {
          id: "company-1", // In real app, get from auth
          name: "TechCorp Bolivia",
          logo: "/logos/techcorp.svg",
          description: "Empresa líder en desarrollo de software",
          sector: "Tecnología",
          size: "51-200 empleados",
          location: "Cochabamba, Bolivia",
          rating: 4.5,
          reviewCount: 28,
        },
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        const createdJob = await response.json();
        toast({
          title: "Empleo creado",
          description: `El empleo ha sido ${status === "ACTIVE" ? "publicado" : "guardado como borrador"}`,
        });
        router.push("/jobs/manage");
      } else {
        throw new Error("Error creating job");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el empleo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    // Show preview of the job posting
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setPreview(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a editar
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
            >
              Guardar borrador
            </Button>
            <Button onClick={() => handleSubmit("ACTIVE")} disabled={loading}>
              Publicar empleo
            </Button>
          </div>
        </div>

        {/* Job Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">TC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{jobData.title}</h1>
                <p className="text-gray-600">TechCorp Bolivia</p>
                <p className="text-sm text-gray-500">{jobData.location}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {
                    contractTypeOptions.find(
                      (o) => o.value === jobData.contractType
                    )?.label
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    workModalityOptions.find(
                      (o) => o.value === jobData.workModality
                    )?.label
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    experienceLevelOptions.find(
                      (o) => o.value === jobData.experienceLevel
                    )?.label
                  }
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {jobData.description}
                </p>
              </div>

              {jobData.responsibilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Responsabilidades</h3>
                  <ul className="space-y-1">
                    {jobData.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Habilidades requeridas</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.requiredSkills.map((skill, i) => (
                    <Badge key={i}>{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Crear Nuevo Empleo
            </h1>
            <p className="text-gray-600">
              Completa la información para publicar tu oferta laboral
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Vista previa
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título del empleo *</Label>
              <Input
                id="title"
                placeholder="Ej: Desarrollador Frontend Junior"
                value={jobData.title}
                onChange={(e) =>
                  setJobData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción del empleo *</Label>
              <Textarea
                id="description"
                placeholder="Describe el puesto, responsabilidades principales y qué buscan en el candidato ideal..."
                value={jobData.description}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={jobData.location}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contractType">Tipo de contrato *</Label>
                <Select
                  value={jobData.contractType}
                  onValueChange={(value) =>
                    setJobData((prev) => ({
                      ...prev,
                      contractType: value as ContractType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workModality">Modalidad de trabajo *</Label>
                <Select
                  value={jobData.workModality}
                  onValueChange={(value) =>
                    setJobData((prev) => ({
                      ...prev,
                      workModality: value as WorkModality,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {workModalityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experienceLevel">Nivel de experiencia *</Label>
                <Select
                  value={jobData.experienceLevel}
                  onValueChange={(value) =>
                    setJobData((prev) => ({
                      ...prev,
                      experienceLevel: value as ExperienceLevel,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin">Salario mínimo (BOB)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="3000"
                  value={jobData.salaryMin}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      salaryMin: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Salario máximo (BOB)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="5000"
                  value={jobData.salaryMax}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      salaryMax: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="closingDate">Fecha de cierre</Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={jobData.closingDate}
                  onChange={(e) =>
                    setJobData((prev) => ({
                      ...prev,
                      closingDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills and Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Habilidades y Requisitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Required Skills */}
            <div>
              <Label>Habilidades requeridas *</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Ej: React, JavaScript, etc."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("requiredSkills", skillInput, setSkillInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray("requiredSkills", skillInput, setSkillInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobData.requiredSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => removeFromArray("requiredSkills", i)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <Label>Requisitos</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Ej: Título universitario en ingeniería"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray(
                        "requirements",
                        requirementInput,
                        setRequirementInput
                      );
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray(
                      "requirements",
                      requirementInput,
                      setRequirementInput
                    )
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {jobData.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{req}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray("requirements", i)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <Label>Responsabilidades</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Ej: Desarrollar interfaces de usuario"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray(
                        "responsibilities",
                        responsibilityInput,
                        setResponsibilityInput
                      );
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray(
                      "responsibilities",
                      responsibilityInput,
                      setResponsibilityInput
                    )
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {jobData.responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{resp}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray("responsibilities", i)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <Label>Beneficios</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Ej: Seguro médico, capacitaciones"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("benefits", benefitInput, setBenefitInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray("benefits", benefitInput, setBenefitInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobData.benefits.map((benefit, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeFromArray("benefits", i)}
                  >
                    {benefit} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions for Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas para Candidatos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Escribe una pregunta para los candidatos"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addQuestion();
                    }
                  }}
                />
                <Button type="button" onClick={addQuestion}>
                  Agregar pregunta
                </Button>
              </div>
            </div>

            {jobData.questions.length > 0 && (
              <div className="space-y-3">
                {jobData.questions.map((question, i) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium">Pregunta {i + 1}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeQuestion(i)}
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {question.question}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(i, { type: value as any })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXT">Texto libre</SelectItem>
                          <SelectItem value="MULTIPLE_CHOICE">
                            Opción múltiple
                          </SelectItem>
                          <SelectItem value="YES_NO">Sí/No</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${i}`}
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            updateQuestion(i, { required: checked as boolean })
                          }
                        />
                        <Label htmlFor={`required-${i}`} className="text-sm">
                          Obligatoria
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pb-8">
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar borrador
          </Button>
          <Button onClick={() => handleSubmit("ACTIVE")} disabled={loading}>
            Publicar empleo
          </Button>
        </div>
      </div>
    </div>
  );
}
