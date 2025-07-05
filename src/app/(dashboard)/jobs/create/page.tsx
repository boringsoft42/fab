&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { ArrowLeft, Save, Eye } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from &ldquo;@/components/ui/dialog&rdquo;;
import dynamic from &ldquo;next/dynamic&rdquo;;
const MapPicker = dynamic(() => import(&ldquo;@/components/dashboard/MapPicker&rdquo;), { ssr: false });
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import {
  JobOffer,
  ContractType,
  WorkModality,
  ExperienceLevel,
  JobStatus,
  JobQuestion,
} from &ldquo;@/types/jobs&rdquo;;

import { ImageIcon, Trash } from &ldquo;lucide-react&rdquo;;
import { useRef } from &ldquo;react&rdquo;;




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
    title: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;&rdquo; as ContractType,
    workModality: &ldquo;&rdquo; as WorkModality,
    experienceLevel: &ldquo;&rdquo; as ExperienceLevel,
    salaryMin: &ldquo;&rdquo;,
    salaryMax: &ldquo;&rdquo;,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [] as string[],
    desiredSkills: [] as string[],
    benefits: [] as string[],
    requirements: [] as string[],
    responsibilities: [] as string[],
    closingDate: &ldquo;&rdquo;,
    questions: [] as JobQuestion[],
    coordinates: null as [number, number] | null,
    workSchedule: &ldquo;&rdquo;,
  });

  const [skillInput, setSkillInput] = useState(&ldquo;&rdquo;);
  const [benefitInput, setBenefitInput] = useState(&ldquo;&rdquo;);
  const [requirementInput, setRequirementInput] = useState(&ldquo;&rdquo;);
  const [responsibilityInput, setResponsibilityInput] = useState(&ldquo;&rdquo;);
  const [questionInput, setQuestionInput] = useState(&ldquo;&rdquo;);

  const contractTypeOptions = [
    { value: &ldquo;FULL_TIME&rdquo;, label: &ldquo;Tiempo completo&rdquo; },
    { value: &ldquo;PART_TIME&rdquo;, label: &ldquo;Medio tiempo&rdquo; },
    { value: &ldquo;INTERNSHIP&rdquo;, label: &ldquo;Prácticas&rdquo; },
    { value: &ldquo;VOLUNTEER&rdquo;, label: &ldquo;Voluntariado&rdquo; },
    { value: &ldquo;FREELANCE&rdquo;, label: &ldquo;Freelance&rdquo; },
  ];

  const workModalityOptions = [
    { value: &ldquo;ON_SITE&rdquo;, label: &ldquo;Presencial&rdquo; },
    { value: &ldquo;REMOTE&rdquo;, label: &ldquo;Remoto&rdquo; },
    { value: &ldquo;HYBRID&rdquo;, label: &ldquo;Híbrido&rdquo; },
  ];

  const experienceLevelOptions = [
    { value: &ldquo;NO_EXPERIENCE&rdquo;, label: &ldquo;Sin experiencia&rdquo; },
    { value: &ldquo;ENTRY_LEVEL&rdquo;, label: &ldquo;Principiante&rdquo; },
    { value: &ldquo;MID_LEVEL&rdquo;, label: &ldquo;Intermedio&rdquo; },
    { value: &ldquo;SENIOR_LEVEL&rdquo;, label: &ldquo;Senior&rdquo; },
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
      setInput(&ldquo;&rdquo;);
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
        type: &ldquo;TEXT&rdquo;,
        required: false,
      };

      setJobData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setQuestionInput(&ldquo;&rdquo;);
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
      &ldquo;title&rdquo;,
      &ldquo;description&rdquo;,
      &ldquo;contractType&rdquo;,
      &ldquo;workModality&rdquo;,
      &ldquo;experienceLevel&rdquo;,
    ];

    for (const field of required) {
      if (!jobData[field as keyof typeof jobData]) {
        toast({
          title: &ldquo;Campos requeridos&rdquo;,
          description: `Por favor completa el campo: ${field}`,
          variant: &ldquo;destructive&rdquo;,
        });
        return false;
      }
    }

    if (jobData.requiredSkills.length === 0) {
      toast({
        title: &ldquo;Habilidades requeridas&rdquo;,
        description: &ldquo;Agrega al menos una habilidad requerida&rdquo;,
        variant: &ldquo;destructive&rdquo;,
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
          id: &ldquo;company-1&rdquo;, // In real app, get from auth
          name: &ldquo;TechCorp Bolivia&rdquo;,
          logo: &ldquo;/logos/techcorp.svg&rdquo;,
          description: &ldquo;Empresa líder en desarrollo de software&rdquo;,
          sector: &ldquo;Tecnología&rdquo;,
          size: &ldquo;51-200 empleados&rdquo;,
          location: &ldquo;Cochabamba, Bolivia&rdquo;,
          rating: 4.5,
          reviewCount: 28,
        },
      };

      const response = await fetch(&ldquo;/api/jobs&rdquo;, {
        method: &ldquo;POST&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        toast({
          title: &ldquo;Empleo creado&rdquo;,
          description: `El empleo ha sido ${status === &ldquo;ACTIVE&rdquo; ? &ldquo;publicado&rdquo; : &ldquo;guardado como borrador&rdquo;}`,
        });
        router.push(&ldquo;/jobs/manage&rdquo;);
      } else {
        throw new Error(&ldquo;Error creating job&rdquo;);
      }
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo crear el empleo. Inténtalo de nuevo.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    // Show preview of the job posting
    return (
      <div className=&ldquo;max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
        <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; onClick={() => setPreview(false)}>
            <ArrowLeft className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Volver a editar
          </Button>
          <div className=&ldquo;space-x-2&rdquo;>
            <Button
              variant=&ldquo;outline&rdquo;
              onClick={() => handleSubmit(&ldquo;DRAFT&rdquo;)}
              disabled={loading}
            >
              Guardar borrador
            </Button>
            <Button onClick={() => handleSubmit(&ldquo;ACTIVE&rdquo;)} disabled={loading}>
              Publicar empleo
            </Button>
          </div>
        </div>

        {/* Job Preview */}
        <Card>
          <CardHeader>
            <div className=&ldquo;flex items-center space-x-4&rdquo;>
              <div className=&ldquo;w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center&rdquo;>
                <span className=&ldquo;text-xl font-bold text-gray-600&rdquo;>TC</span>
              </div>
              <div>
                <h1 className=&ldquo;text-2xl font-bold&rdquo;>{jobData.title}</h1>
                <p className=&ldquo;text-gray-600&rdquo;>TechCorp Bolivia</p>
                <p className=&ldquo;text-sm text-gray-500&rdquo;>{jobData.location}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                <Badge variant=&ldquo;secondary&rdquo;>
                  {
                    contractTypeOptions.find(
                      (o) => o.value === jobData.contractType
                    )?.label
                  }
                </Badge>
                <Badge variant=&ldquo;outline&rdquo;>
                  {
                    workModalityOptions.find(
                      (o) => o.value === jobData.workModality
                    )?.label
                  }
                </Badge>
                <Badge variant=&ldquo;outline&rdquo;>
                  {
                    experienceLevelOptions.find(
                      (o) => o.value === jobData.experienceLevel
                    )?.label
                  }
                </Badge>
              </div>

              <div>
                <h3 className=&ldquo;font-semibold mb-2&rdquo;>Descripción</h3>
                <p className=&ldquo;text-gray-700 whitespace-pre-wrap&rdquo;>
                  {jobData.description}
                </p>
              </div>

              {jobData.responsibilities.length > 0 && (
                <div>
                  <h3 className=&ldquo;font-semibold mb-2&rdquo;>Responsabilidades</h3>
                  <ul className=&ldquo;space-y-1&rdquo;>
                    {jobData.responsibilities.map((resp, i) => (
                      <li key={i} className=&ldquo;flex items-start space-x-2&rdquo;>
                        <span className=&ldquo;w-2 h-2 bg-blue-600 rounded-full mt-2&rdquo; />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className=&ldquo;font-semibold mb-2&rdquo;>Habilidades requeridas</h3>
                <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
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

    
    
    <div className=&ldquo;max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
      <Dialog open={showIncompleteProfileModal} onOpenChange={setShowIncompleteProfileModal}>
  <DialogContent className=&ldquo;z-[9999] max-w-md&rdquo;>
    <DialogHeader>
      <DialogTitle>Perfil Incompleto</DialogTitle>
    </DialogHeader>
    <div className=&ldquo;space-y-4&rdquo;>
      <p className=&ldquo;text-gray-700 text-sm&rdquo;>
        Para publicar una oferta de empleo, debes completar primero tu perfil de empresa.
      </p>
      <p className=&ldquo;text-gray-500 text-xs&rdquo;>
        Asegúrate de agregar información como descripción, logo, redes sociales y más.
      </p>
    </div>
    <div className=&ldquo;flex justify-end gap-2 mt-6&rdquo;>
      <Button variant=&ldquo;outline&rdquo; onClick={() => setShowIncompleteProfileModal(false)}>
        Cerrar
      </Button>
      <Button
        onClick={() => {
          setShowIncompleteProfileModal(false);
          router.push(&ldquo;/profile&rdquo;); // Redirige a completar perfil
        }}
      >
        Completar Perfil
      </Button>
    </div>
  </DialogContent>
</Dialog>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
      <DialogContent className=&ldquo;z-[9999] max-w-lg&rdquo;>
    <DialogHeader>
      <DialogTitle>Confirmación de publicación</DialogTitle>
    </DialogHeader>

    <div className=&ldquo;space-y-4&rdquo;>
      <p className=&ldquo;text-gray-700 text-sm&rdquo;>
        Al publicar esta oferta confirmas que los datos proporcionados son verídicos y que aceptas nuestros Términos y Condiciones.
      </p>
      <p className=&ldquo;text-gray-500 text-xs&rdquo;>
        El contenido ofensivo, falso o que incumpla las reglas de la plataforma puede ser eliminado.
      </p>
    </div>

    <div className=&ldquo;flex justify-end gap-2 mt-6&rdquo;>
      <Button variant=&ldquo;outline&rdquo; onClick={() => setShowTermsModal(false)}>
        Cancelar
      </Button>
      <Button
        onClick={() => {
          setShowTermsModal(false);
          handleSubmit(&ldquo;ACTIVE&rdquo;);
        }}
      >
        Aceptar y Publicar
      </Button>
    </div>
  </DialogContent>
</Dialog>

      {/* Header */}
      <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
        <div className=&ldquo;flex items-center space-x-4&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; onClick={() => router.back()}>
            <ArrowLeft className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Volver
          </Button>
          <div>
            <h1 className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>
              Crear Nuevo Empleo
            </h1>
            <p className=&ldquo;text-gray-600&rdquo;>
              Completa la información para publicar tu oferta laboral
            </p>
          </div>
        </div>
        <div className=&ldquo;space-x-2&rdquo;>
          <Button variant=&ldquo;outline&rdquo; onClick={() => setPreview(true)}>
            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Vista previa
          </Button>
        </div>
      </div>

      <div className=&ldquo;space-y-6&rdquo;>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className=&ldquo;space-y-4&rdquo;>
            <div>
              <Label htmlFor=&ldquo;title&rdquo;>Título del empleo *</Label>
              <Input
                id=&ldquo;title&rdquo;
                placeholder=&ldquo;Ej: Desarrollador Frontend Junior&rdquo;
                value={jobData.title}
                onChange={(e) =>
                  setJobData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor=&ldquo;description&rdquo;>Descripción del empleo *</Label>
              <Textarea
                id=&ldquo;description&rdquo;
                placeholder=&ldquo;Describe el puesto, responsabilidades principales y qué buscan en el candidato ideal...&rdquo;
                value={jobData.description}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className=&ldquo;min-h-[120px]&rdquo;
              />
            </div>

            <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
              <div>
                <Label htmlFor=&ldquo;location&rdquo;>Ubicación</Label>
                <Input
                  id=&ldquo;location&rdquo;
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
                <Label htmlFor=&ldquo;contractType&rdquo;>Tipo de contrato *</Label>
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
                    <SelectValue placeholder=&ldquo;Selecciona tipo&rdquo; />
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

            <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
              <div>
                <Label htmlFor=&ldquo;workModality&rdquo;>Modalidad de trabajo *</Label>
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
                    <SelectValue placeholder=&ldquo;Selecciona modalidad&rdquo; />
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
                <Label htmlFor=&ldquo;experienceLevel&rdquo;>Nivel de experiencia *</Label>
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
                    <SelectValue placeholder=&ldquo;Selecciona nivel&rdquo; />
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

            <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
  <div>
    <Label htmlFor=&ldquo;salaryMin&rdquo;>Salario mínimo (BOB)</Label>
    <Input
      id=&ldquo;salaryMin&rdquo;
      type=&ldquo;number&rdquo;
      placeholder=&ldquo;3000&rdquo;
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
    <Label htmlFor=&ldquo;salaryMax&rdquo;>Salario máximo (BOB)</Label>
    <Input
      id=&ldquo;salaryMax&rdquo;
      type=&ldquo;number&rdquo;
      placeholder=&ldquo;5000&rdquo;
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
    <Label htmlFor=&ldquo;closingDate&rdquo;>Fecha de inicial</Label>
    <Input
      id=&ldquo;closingDate&rdquo;
      type=&ldquo;date&rdquo;
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
    <Label htmlFor=&ldquo;closingDate&rdquo;>Fecha termino</Label>
    <Input
      id=&ldquo;closingDate&rdquo;
      type=&ldquo;date&rdquo;
      value={jobData.closingDate}
      onChange={(e) =>
        setJobData((prev) => ({
          ...prev,
          closingDate: e.target.value,
        }))
      }
    />
  </div>

  <div className=&ldquo;md:col-span-3&rdquo;>
    <Label htmlFor=&ldquo;workSchedule&rdquo;>Horario de trabajo</Label>
    <Input
      id=&ldquo;workSchedule&rdquo;
      placeholder=&ldquo;Ej: Lunes a viernes, 8:00 a 17:00&rdquo;
      value={jobData.workSchedule || &ldquo;&rdquo;}
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
          <CardContent className=&ldquo;space-y-6&rdquo;>
            {/* Required Skills */}
            <div>
              <Label>Habilidades requeridas *</Label>
              <div className=&ldquo;flex space-x-2 mt-2&rdquo;>
                <Input
                  placeholder=&ldquo;Ej: React, JavaScript, etc.&rdquo;
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      addToArray(&ldquo;requiredSkills&rdquo;, skillInput, setSkillInput);
                    }
                  }}
                />
                <Button
                  type=&ldquo;button&rdquo;
                  onClick={() =>
                    addToArray(&ldquo;requiredSkills&rdquo;, skillInput, setSkillInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className=&ldquo;flex flex-wrap gap-2 mt-2&rdquo;>
                {jobData.requiredSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant=&ldquo;default&rdquo;
                    className=&ldquo;cursor-pointer&rdquo;
                    onClick={() => removeFromArray(&ldquo;requiredSkills&rdquo;, i)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <Label>Requisitos</Label>
              <div className=&ldquo;flex space-x-2 mt-2&rdquo;>
                <Input
                  placeholder=&ldquo;Ej: Título universitario en ingeniería&rdquo;
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      addToArray(
                        &ldquo;requirements&rdquo;,
                        requirementInput,
                        setRequirementInput
                      );
                    }
                  }}
                />
                <Button
                  type=&ldquo;button&rdquo;
                  onClick={() =>
                    addToArray(
                      &ldquo;requirements&rdquo;,
                      requirementInput,
                      setRequirementInput
                    )
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className=&ldquo;space-y-1 mt-2&rdquo;>
                {jobData.requirements.map((req, i) => (
                  <div
                    key={i}
                    className=&ldquo;flex items-center justify-between p-2 bg-gray-50 rounded&rdquo;
                  >
                    <span className=&ldquo;text-sm&rdquo;>{req}</span>
                    <Button
                      size=&ldquo;sm&rdquo;
                      variant=&ldquo;ghost&rdquo;
                      onClick={() => removeFromArray(&ldquo;requirements&rdquo;, i)}
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
              <div className=&ldquo;flex space-x-2 mt-2&rdquo;>
                <Input
                  placeholder=&ldquo;Ej: Desarrollar interfaces de usuario&rdquo;
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      addToArray(
                        &ldquo;responsibilities&rdquo;,
                        responsibilityInput,
                        setResponsibilityInput
                      );
                    }
                  }}
                />
                <Button
                  type=&ldquo;button&rdquo;
                  onClick={() =>
                    addToArray(
                      &ldquo;responsibilities&rdquo;,
                      responsibilityInput,
                      setResponsibilityInput
                    )
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className=&ldquo;space-y-1 mt-2&rdquo;>
                {jobData.responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className=&ldquo;flex items-center justify-between p-2 bg-gray-50 rounded&rdquo;
                  >
                    <span className=&ldquo;text-sm&rdquo;>{resp}</span>
                    <Button
                      size=&ldquo;sm&rdquo;
                      variant=&ldquo;ghost&rdquo;
                      onClick={() => removeFromArray(&ldquo;responsibilities&rdquo;, i)}
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
              <div className=&ldquo;flex space-x-2 mt-2&rdquo;>
                <Input
                  placeholder=&ldquo;Ej: Seguro médico, capacitaciones&rdquo;
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      addToArray(&ldquo;benefits&rdquo;, benefitInput, setBenefitInput);
                    }
                  }}
                />
                <Button
                  type=&ldquo;button&rdquo;
                  onClick={() =>
                    addToArray(&ldquo;benefits&rdquo;, benefitInput, setBenefitInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className=&ldquo;flex flex-wrap gap-2 mt-2&rdquo;>
                {jobData.benefits.map((benefit, i) => (
                  <Badge
                    key={i}
                    variant=&ldquo;outline&rdquo;
                    className=&ldquo;cursor-pointer&rdquo;
                    onClick={() => removeFromArray(&ldquo;benefits&rdquo;, i)}
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
          <CardContent className=&ldquo;space-y-4&rdquo;>
            <div>
              <div className=&ldquo;flex space-x-2&rdquo;>
                <Input
                  placeholder=&ldquo;Escribe una pregunta para los candidatos&rdquo;
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      addQuestion();
                    }
                  }}
                />
                <Button type=&ldquo;button&rdquo; onClick={addQuestion}>
                  Agregar pregunta
                </Button>
              </div>
            </div>

            {jobData.questions.length > 0 && (
              <div className=&ldquo;space-y-3&rdquo;>
                {jobData.questions.map((question, i) => (
                  <div key={question.id} className=&ldquo;p-4 border rounded-lg&rdquo;>
                    <div className=&ldquo;flex items-start justify-between mb-2&rdquo;>
                      <span className=&ldquo;font-medium&rdquo;>Pregunta {i + 1}</span>
                      <Button
                        size=&ldquo;sm&rdquo;
                        variant=&ldquo;ghost&rdquo;
                        onClick={() => removeQuestion(i)}
                      >
                        ×
                      </Button>
                    </div>
                    <p className=&ldquo;text-sm text-gray-700 mb-2&rdquo;>
                      {question.question}
                    </p>
                    <div className=&ldquo;flex items-center space-x-4&rdquo;>
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(i, { type: value as any })
                        }
                      >
                        <SelectTrigger className=&ldquo;w-40&rdquo;>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&ldquo;TEXT&rdquo;>Texto libre</SelectItem>
                          <SelectItem value=&ldquo;MULTIPLE_CHOICE&rdquo;>
                            Opción múltiple
                          </SelectItem>
                          <SelectItem value=&ldquo;YES_NO&rdquo;>Sí/No</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className=&ldquo;flex items-center space-x-2&rdquo;>
                        <Checkbox
                          id={`required-${i}`}
                          checked={question.required}
                          onCheckedChange={(checked) =>
                            updateQuestion(i, { required: checked as boolean })
                          }
                        />
                        <Label htmlFor={`required-${i}`} className=&ldquo;text-sm&rdquo;>
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
  <CardContent className=&ldquo;space-y-4&rdquo;>
    <div>
      <Label htmlFor=&ldquo;website&rdquo;>Sitio web</Label>
      <Input
        id=&ldquo;website&rdquo;
        placeholder=&ldquo;https://www.tuempresa.com&rdquo;
        value={jobData.website || &ldquo;&rdquo;}
        onChange={(e) =>
          setJobData((prev) => ({ ...prev, website: e.target.value }))
        }
      />
    </div>

    <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
      <div>
        <Label htmlFor=&ldquo;linkedin&rdquo;>LinkedIn</Label>
        <Input
          id=&ldquo;linkedin&rdquo;
          placeholder=&ldquo;https://linkedin.com/company/tuempresa&rdquo;
          value={jobData.linkedin || &ldquo;&rdquo;}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, linkedin: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor=&ldquo;facebook&rdquo;>Facebook</Label>
        <Input
          id=&ldquo;facebook&rdquo;
          placeholder=&ldquo;https://facebook.com/tuempresa&rdquo;
          value={jobData.facebook || &ldquo;&rdquo;}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, facebook: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor=&ldquo;instagram&rdquo;>Instagram</Label>
        <Input
          id=&ldquo;instagram&rdquo;
          placeholder=&ldquo;https://instagram.com/tuempresa&rdquo;
          value={jobData.instagram || &ldquo;&rdquo;}
          onChange={(e) =>
            setJobData((prev) => ({ ...prev, instagram: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor=&ldquo;twitter&rdquo;>Twitter</Label>
        <Input
          id=&ldquo;twitter&rdquo;
          placeholder=&ldquo;https://twitter.com/tuempresa&rdquo;
          value={jobData.twitter || &ldquo;&rdquo;}
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
    <CardContent className=&ldquo;space-y-2&rdquo;>
      <Label>Selecciona en el mapa la ubicación del empleo</Label>
      <MapPicker
        onChange={(coords) =>
          setJobData((prev) => ({ ...prev, coordinates: coords }))
        }
      />
      {jobData.coordinates && (
        <p className=&ldquo;text-sm text-muted-foreground mt-2&rdquo;>
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
  <CardContent className=&ldquo;space-y-4&rdquo;>
    <div>
      <Label>Selecciona una o varias imágenes</Label>
      <div className=&ldquo;flex items-center space-x-2 mt-2&rdquo;>
        <Input
          ref={fileInputRef}
          type=&ldquo;file&rdquo;
          accept=&ldquo;image/*&rdquo;
          multiple
          className=&ldquo;hidden&rdquo;
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          variant=&ldquo;outline&rdquo;
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className=&ldquo;w-4 h-4 mr-2&rdquo; />
          Subir imágenes
        </Button>
      </div>
    </div>

    {images.length > 0 && (
      <div className=&ldquo;grid grid-cols-2 md:grid-cols-3 gap-4&rdquo;>
        {images.map((src, index) => (
          <div
            key={index}
            className=&ldquo;relative group rounded-lg overflow-hidden border&rdquo;
          >
            <img
              src={src}
              alt={`imagen-${index}`}
              className=&ldquo;object-cover w-full h-32&rdquo;
            />
            <Button
              size=&ldquo;icon&rdquo;
              variant=&ldquo;destructive&rdquo;
              className=&ldquo;absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity&rdquo;
              onClick={() => removeImage(index)}
            >
              <Trash className=&ldquo;w-4 h-4&rdquo; />
            </Button>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>



        {/* Actions */}
        <div className=&ldquo;flex justify-end space-x-4 pb-8&rdquo;>
          <Button
            variant=&ldquo;outline&rdquo;
            onClick={() => handleSubmit(&ldquo;DRAFT&rdquo;)}
            disabled={loading}
          >
            <Save className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
