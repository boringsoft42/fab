"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/components/dashboard/MapPicker"), {
  ssr: false,
});
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

} from "@/types/jobs";
import { useAuthContext } from "@/hooks/use-auth";

import { ImageIcon, Trash } from "lucide-react";
import { useRef } from "react";

interface JobFormData {
  title: string;
  description: string;
  location: string;
  contractType: ContractType;
  workModality: WorkModality;
  experienceLevel: ExperienceLevel;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  requiredSkills: string[];
  desiredSkills: string[];
  benefits: string[];
  requirements: string[];
  responsibilities: string[];
  closingDate: string;
  coordinates: [number, number] | null;
  workSchedule: string;
  department: string;
  educationRequired: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
     const [images, setImages] = useState<File[]>([]);
   const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePublishClick = () => {
    setShowTermsModal(true);
  };

     const handleFiles = (files: FileList | null) => {
     if (!files) return;
     const newFiles = Array.from(files);
     setImages((prev) => [...prev, ...newFiles]);
     
     // Create preview URLs for display
     newFiles.forEach((file) => {
       const reader = new FileReader();
       reader.onloadend = () => {
         if (reader.result) {
           setImageUrls((prev) => [...prev, reader.result as string]);
         }
       };
       reader.readAsDataURL(file);
     });
   };

     const removeImage = (index: number) => {
     setImages((prev) => prev.filter((_, i) => i !== index));
     setImageUrls((prev) => prev.filter((_, i) => i !== index));
   };

  // Form state
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "Cochabamba, Bolivia",
    contractType: "" as ContractType,
    workModality: "" as WorkModality,
    experienceLevel: "" as ExperienceLevel,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "BOB",
    requiredSkills: [],
    desiredSkills: [],
    benefits: [],
    requirements: [],
    responsibilities: [],
    closingDate: "",
    coordinates: null,
    workSchedule: "",
    department: "Cochabamba",
    educationRequired: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");


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



           const validateForm = () => {
      console.log('🔍 validateForm called');
      console.log('🔍 jobData for validation:', jobData);
      
      const required = [
        "title",
        "description",
        "contractType",
        "workModality",
        "experienceLevel",
        "location",
      ];

      for (const field of required) {
        const value = jobData[field as keyof typeof jobData];
        console.log(`🔍 Checking field ${field}:`, value);
        if (!value) {
          console.log(`❌ Field ${field} is empty`);
          toast({
            title: "Campos requeridos",
            description: `Por favor completa el campo: ${field}`,
            variant: "destructive",
          });
          return false;
        }
      }

      // Ensure workSchedule has a value (it's required by backend)
      if (!jobData.workSchedule || jobData.workSchedule.trim() === '') {
        console.log('❌ workSchedule is empty');
        toast({
          title: "Horario requerido",
          description: "Por favor especifica el horario de trabajo",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Form validation passed');
      return true;
    };

    const handleSubmit = async (status: JobStatus) => {
    console.log('🔍 handleSubmit called with status:', status);
    console.log('🔍 Current jobData:', jobData);
    console.log('🔍 Current user:', user);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    // Check if user is authenticated and has company info
    if (!user || !user.id) {
      console.log('❌ User authentication check failed:', { user: !!user, userId: user?.id });
      toast({
        title: "Error de autenticación",
        description: "Debes estar autenticado como empresa para crear empleos",
        variant: "destructive",
      });
      return;
    }

        setLoading(true);
    console.log('🔍 Starting API request...');
          try {
      // Check if we have images to upload
      const hasImages = images.length > 0;
      
      if (hasImages) {
        // Use FormData for image uploads
        const formDataToSend = new FormData();
        
        // Add basic data
        formDataToSend.append('title', jobData.title);
        formDataToSend.append('description', jobData.description);
        formDataToSend.append('requirements', jobData.requirements.length > 0 ? jobData.requirements.join(', ') : "Sin requisitos específicos");
        formDataToSend.append('location', jobData.location);
        formDataToSend.append('contractType', jobData.contractType);
        formDataToSend.append('workSchedule', jobData.workSchedule || "Horario a definir");
        formDataToSend.append('workModality', jobData.workModality);
        formDataToSend.append('experienceLevel', jobData.experienceLevel);
        formDataToSend.append('municipality', "Cochabamba");
        formDataToSend.append('companyId', user.id);
        
        // Add optional data
        if (jobData.salaryMin) formDataToSend.append('salaryMin', jobData.salaryMin);
        if (jobData.salaryMax) formDataToSend.append('salaryMax', jobData.salaryMax);
        if (jobData.benefits.length > 0) formDataToSend.append('benefits', jobData.benefits.join(', '));
        if (jobData.closingDate) formDataToSend.append('applicationDeadline', jobData.closingDate);
                 if (jobData.coordinates) {
           formDataToSend.append('latitude', jobData.coordinates[0].toString());
           formDataToSend.append('longitude', jobData.coordinates[1].toString());
         }
         if (jobData.department) formDataToSend.append('department', jobData.department);
         if (jobData.educationRequired) formDataToSend.append('educationRequired', jobData.educationRequired);
        
        // Add arrays as JSON strings
        if (jobData.requiredSkills.length > 0) {
          formDataToSend.append('skillsRequired', JSON.stringify(jobData.requiredSkills));
        } else {
          formDataToSend.append('skillsRequired', JSON.stringify(["Sin especificar"]));
        }
        
        if (jobData.desiredSkills.length > 0) {
          formDataToSend.append('desiredSkills', JSON.stringify(jobData.desiredSkills));
        }
        
                 // Add images directly as files
         for (let index = 0; index < images.length; index++) {
           const file = images[index];
           formDataToSend.append('images', file);
           console.log(`🔍 Added image ${index + 1}/${images.length}: ${file.name}`);
         }
        
        console.log('🔍 Using FormData for image upload');
        console.log('🔍 Making request to /api/joboffer with FormData');
        console.log('🔍 FormData entries count:', Array.from(formDataToSend.entries()).length);
        
        const token = localStorage.getItem('token') || '';
        console.log('🔍 Authorization token:', token ? 'Present' : 'Missing');

        const response = await fetch("/api/joboffer", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        console.log('🔍 Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Response error text:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        if (response.ok) {
          toast({
            title: "Empleo creado",
            description: `El empleo ha sido ${status === "ACTIVE" ? "publicado" : "guardado como borrador"}`,
          });
          router.push("/company/jobs");
        } else {
          throw new Error("Error creating job");
        }
      } else {
        // Use JSON for requests without images
        const newJob = {
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements.length > 0 ? jobData.requirements.join(', ') : "Sin requisitos específicos",
          location: jobData.location,
          contractType: jobData.contractType,
          workSchedule: jobData.workSchedule || "Horario a definir",
          workModality: jobData.workModality,
          experienceLevel: jobData.experienceLevel,
          municipality: "Cochabamba",
          companyId: user.id,
          salaryMin: jobData.salaryMin ? parseInt(jobData.salaryMin) : undefined,
          salaryMax: jobData.salaryMax ? parseInt(jobData.salaryMax) : undefined,
          benefits: jobData.benefits.length > 0 ? jobData.benefits.join(', ') : undefined,
          skillsRequired: jobData.requiredSkills.length > 0 ? jobData.requiredSkills : ["Sin especificar"],
          desiredSkills: jobData.desiredSkills,
          applicationDeadline: jobData.closingDate || undefined,
                     latitude: jobData.coordinates ? jobData.coordinates[0] : undefined,
           longitude: jobData.coordinates ? jobData.coordinates[1] : undefined,
           department: jobData.department || undefined,
           educationRequired: jobData.educationRequired || undefined,
        };

        console.log('🔍 Prepared job data:', newJob);
        console.log('🔍 Making request to /api/joboffer with JSON');
        
        const token = localStorage.getItem('token') || '';
        console.log('🔍 Authorization token:', token ? 'Present' : 'Missing');

        const response = await fetch("/api/joboffer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newJob),
        });

        console.log('🔍 Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Response error text:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        if (response.ok) {
          toast({
            title: "Empleo creado",
            description: `El empleo ha sido ${status === "ACTIVE" ? "publicado" : "guardado como borrador"}`,
          });
          router.push("/company/jobs");
        } else {
          throw new Error("Error creating job");
        }
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

  // Check if user is authenticated and is a company
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Debes estar autenticado para crear empleos.
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== 'EMPRESAS') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Solo las empresas pueden crear empleos.
          </p>
        </div>
      </div>
    );
  }

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


      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="z-[9999] max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirmación de publicación</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-700 text-sm">
              Al publicar esta oferta confirmas que los datos proporcionados son
              verídicos y que aceptas nuestros Términos y Condiciones.
            </p>
            <p className="text-gray-500 text-xs">
              El contenido ofensivo, falso o que incumpla las reglas de la
              plataforma puede ser eliminado.
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

                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                 <Label htmlFor="closingDate">Fecha límite de aplicación</Label>
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
                 <Label htmlFor="department">Departamento</Label>
                 <Input
                   id="department"
                   value={jobData.department}
                   onChange={(e) =>
                     setJobData((prev) => ({
                       ...prev,
                       department: e.target.value,
                     }))
                   }
                 />
               </div>
               <div>
                 <Label htmlFor="educationRequired">Educación requerida</Label>
                 <Select
                   value={jobData.educationRequired}
                   onValueChange={(value) =>
                     setJobData((prev) => ({
                       ...prev,
                       educationRequired: value,
                     }))
                   }
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Selecciona nivel educativo" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="PRIMARY">Primaria</SelectItem>
                     <SelectItem value="SECONDARY">Secundaria</SelectItem>
                     <SelectItem value="TECHNICAL">Técnico</SelectItem>
                     <SelectItem value="UNIVERSITY">Universidad</SelectItem>
                     <SelectItem value="POSTGRADUATE">Postgrado</SelectItem>
                     <SelectItem value="OTHER">Otro</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

                             <div className="md:col-span-4">
                 <Label htmlFor="workSchedule">Horario de trabajo *</Label>
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

            {/* Desired Skills */}
            <div>
              <Label>Habilidades deseadas</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Ej: TypeScript, Docker, etc."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("desiredSkills", skillInput, setSkillInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray("desiredSkills", skillInput, setSkillInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobData.desiredSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeFromArray("desiredSkills", i)}
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
                  Latitud: {jobData.coordinates[0]}, Longitud:{" "}
                  {jobData.coordinates[1]}
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

                         {imageUrls.length > 0 && (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {imageUrls.map((src, index) => (
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
          <Button onClick={handlePublishClick} disabled={loading}>
            Publicar empleo
          </Button>
        </div>
      </div>
    </div>
  );
}
