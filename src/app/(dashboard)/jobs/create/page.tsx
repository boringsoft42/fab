"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/components/dashboard/MapPicker"), { ssr: false });
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

import { ImageIcon, Trash } from "lucide-react";
import { useRef } from "react";




export default function CreateJobPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);

  const checkProfileCompletion = (): boolean => {
    return Math.random() > 0.5; // 50% de probabilidad
  };
  
  const handlePublishClick = () => {
    if (!checkProfileCompletion()) {
      setShowIncompleteProfileModal(true);
    } else {
      setShowTermsModal(true);
    }
  };
  

  const [showTermsModal, setShowTermsModal] = useState(false);


  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
    coordinates: null as [number, number] | null,
    workSchedule: "",
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
      <Dialog open={showIncompleteProfileModal} onOpenChange={setShowIncompleteProfileModal}>
  <DialogContent className="z-[9999] max-w-md">
    <DialogHeader>
      <DialogTitle>Perfil Incompleto</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <p className="text-gray-700 text-sm">
        Para publicar una oferta de empleo, debes completar primero tu perfil de empresa.
      </p>
      <p className="text-gray-500 text-xs">
        Asegúrate de agregar información como descripción, logo, redes sociales y más.
      </p>
    </div>
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={() => setShowIncompleteProfileModal(false)}>
        Cerrar
      </Button>
      <Button
        onClick={() => {
          setShowIncompleteProfileModal(false);
          router.push("/profile"); // Redirige a completar perfil
        }}
      >
        Completar Perfil
      </Button>
    </div>
  </DialogContent>
</Dialog>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
      <DialogContent className="z-[9999] max-w-lg">
    <DialogHeader>
      <DialogTitle>Confirmación de publicación</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <p className="text-gray-700 text-sm">
        Al publicar esta oferta confirmas que los datos proporcionados son verídicos y que aceptas nuestros Términos y Condiciones.
      </p>
      <p className="text-gray-500 text-xs">
        El contenido ofensivo, falso o que incumpla las reglas de la plataforma puede ser eliminado.
      </p>
    </div>

    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={() => setShowTermsModal(false)}>
        Cancelar
      </Button>
      <Button
        onClick={() => {
          setShowTermsModal(false);
          handleSubmit("ACTIVE");
        }}
      >
        Aceptar y Publicar
      </Button>
    </div>
  </DialogContent>
</Dialog>

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
    <Label htmlFor="closingDate">Fecha de inicial</Label>
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
  <div>
    <Label htmlFor="closingDate">Fecha termino</Label>
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

  <div className="md:col-span-3">
    <Label htmlFor="workSchedule">Horario de trabajo</Label>
    <Input
      id="workSchedule"
      placeholder="Ej: Lunes a viernes, 8:00 a 17:00"
      value={jobData.workSchedule || ""}
      onChange={(e) =>
        setJobData((prev) => ({
          ...prev,
          workSchedule: e.target.value,
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

        <Card>
  <CardHeader>
    <CardTitle>Redes Sociales y Sitio Web</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="website">Sitio web</Label>
      <Input
        id="website"
        placeholder="https://www.tuempresa.com"
        value={jobData.website || ""}
        onChange={(e) =>
          setJobData((prev) => ({ ...prev, website: e.target.value }))
        }
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          placeholder="https://linkedin.com/company/tuempresa"
          value={jobData.linkedin || ""}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, linkedin: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          id="facebook"
          placeholder="https://facebook.com/tuempresa"
          value={jobData.facebook || ""}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, facebook: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          placeholder="https://instagram.com/tuempresa"
          value={jobData.instagram || ""}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, instagram: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          placeholder="https://twitter.com/tuempresa"
          value={jobData.twitter || ""}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, twitter: e.target.value }))
          }
        />
      </div>
    </div>
  </CardContent>
</Card>

{!showTermsModal && (
  <Card>
    <CardHeader>
      <CardTitle>Ubicación Geográfica</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Label>Selecciona en el mapa la ubicación del empleo</Label>
      <MapPicker
        onChange={(coords) =>
          setJobData((prev) => ({ ...prev, coordinates: coords }))
        }
      />
      {jobData.coordinates && (
        <p className="text-sm text-muted-foreground mt-2">
          Latitud: {jobData.coordinates[0]}, Longitud: {jobData.coordinates[1]}
        </p>
      )}
    </CardContent>
  </Card>
)}

<Card>
  <CardHeader>
    <CardTitle>Imágenes del Empleo</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Selecciona una o varias imágenes</Label>
      <div className="flex items-center space-x-2 mt-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Subir imágenes
        </Button>
      </div>
    </div>

    {images.length > 0 && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden border"
          >
            <img
              src={src}
              alt={`imagen-${index}`}
              className="object-cover w-full h-32"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <Trash className="w-4 h-4" />
            </Button>
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
          <Button
  onClick={handlePublishClick}
  disabled={loading}
>
  Publicar empleo
</Button>

        </div>
      </div>
    </div>
  );
}
