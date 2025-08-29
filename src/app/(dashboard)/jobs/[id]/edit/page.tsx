"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, ImageIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { JobOffer, ContractType, WorkModality, ExperienceLevel, JobStatus } from "@/types/jobs";
import { useUpdateJobOffer } from "@/hooks/use-job-offers";
import { useAuthContext } from "@/hooks/use-auth";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/dashboard/MapPicker"), {
  ssr: false,
});

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

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const jobId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<JobOffer | null>(null);
     const [images, setImages] = useState<File[]>([]);
   const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  
  const updateJobOfferMutation = useUpdateJobOffer();

  // Form data
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "Cochabamba, Bolivia",
    contractType: "" as ContractType,
    workSchedule: "",
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

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/joboffer/${jobId}`, {
        headers,
      });
      
      if (response.ok) {
        const jobData = await response.json();
                 setJob(jobData);
         
         // Load existing images if available
         if (jobData.images && jobData.images.length > 0) {
           // Convert backend URLs to full URLs
           const fullImageUrls = jobData.images.map((img: string) => 
             img.startsWith('http') ? img : `${API_BASE.replace('/api', '')}${img}`
           );
           setImageUrls(fullImageUrls);
           console.log('🔍 Loaded existing images:', fullImageUrls);
         } else {
           console.log('🔍 No existing images found');
         }
        
                           // Populate form with existing data
          setFormData({
            title: jobData.title || "",
            description: jobData.description || "",
            location: jobData.location || "Cochabamba, Bolivia",
            contractType: jobData.contractType || "" as ContractType,
            workSchedule: jobData.workSchedule || "",
            workModality: jobData.workModality || "" as WorkModality,
            experienceLevel: jobData.experienceLevel || "" as ExperienceLevel,
            salaryMin: jobData.salaryMin?.toString() || "",
            salaryMax: jobData.salaryMax?.toString() || "",
            salaryCurrency: jobData.salaryCurrency || "BOB",
            requiredSkills: jobData.skillsRequired || [],
            desiredSkills: jobData.desiredSkills || [],
            benefits: jobData.benefits ? jobData.benefits.split(', ') : [],
            requirements: jobData.requirements ? jobData.requirements.split(', ') : [],
            responsibilities: [],
            closingDate: jobData.applicationDeadline || "",
            coordinates: jobData.latitude && jobData.longitude ? [jobData.latitude, jobData.longitude] : null,
            department: jobData.department || "Cochabamba",
            educationRequired: jobData.educationRequired || "",
          });
         
         console.log('🔍 Job data received from backend:', jobData);
                   console.log('🔍 Backend data check:', {
            department: jobData.department || "NOT PROVIDED",
            educationRequired: jobData.educationRequired || "NOT PROVIDED",
            desiredSkills: jobData.desiredSkills || "NOT PROVIDED",
            images: jobData.images || "NOT PROVIDED",
            coordinates: jobData.latitude && jobData.longitude ? [jobData.latitude, jobData.longitude] : "NOT PROVIDED",
          });
      } else {
        const errorText = await response.text();
        console.error('Error fetching job:', response.status, errorText);
        toast({
          title: "Error",
          description: "No se pudo cargar el empleo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: "Error",
        description: "Error al cargar el empleo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToArray = (
    field: keyof typeof formData,
    value: string,
    setInput: (value: string) => void
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setInput("");
    }
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
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

  const validateForm = () => {
    const required = [
      "title",
      "description",
      "contractType",
      "workModality",
      "experienceLevel",
      "location",
    ];

    for (const field of required) {
      const value = formData[field as keyof typeof formData];
      if (!value) {
        toast({
          title: "Campos requeridos",
          description: `Por favor completa el campo: ${field}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (!formData.workSchedule || formData.workSchedule.trim() === '') {
      toast({
        title: "Horario requerido",
        description: "Por favor especifica el horario de trabajo",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (status: JobStatus) => {
    if (!validateForm()) {
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar autenticado como empresa para editar empleos",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Check if we have images to upload
      const hasImages = images.length > 0;
      
      if (hasImages) {
        // Use FormData for image uploads - only send changed fields
        const formDataToSend = new FormData();
        
        // Only add fields that have changed or are required
        if (formData.title !== job?.title) {
          formDataToSend.append('title', formData.title);
        }
        if (formData.description !== job?.description) {
          formDataToSend.append('description', formData.description);
        }
        if (formData.requirements.join(', ') !== (job?.requirements || '')) {
          formDataToSend.append('requirements', formData.requirements.length > 0 ? formData.requirements.join(', ') : "Sin requisitos específicos");
        }
        if (formData.location !== job?.location) {
          formDataToSend.append('location', formData.location);
        }
        if (formData.contractType !== job?.contractType) {
          formDataToSend.append('contractType', formData.contractType);
        }
        if (formData.workSchedule !== job?.workSchedule) {
          formDataToSend.append('workSchedule', formData.workSchedule || "Horario a definir");
        }
        if (formData.workModality !== job?.workModality) {
          formDataToSend.append('workModality', formData.workModality);
        }
        if (formData.experienceLevel !== job?.experienceLevel) {
          formDataToSend.append('experienceLevel', formData.experienceLevel);
        }
        
        // Add optional data only if changed
        if (formData.salaryMin !== (job?.salaryMin?.toString() || '')) {
          formDataToSend.append('salaryMin', formData.salaryMin);
        }
        if (formData.salaryMax !== (job?.salaryMax?.toString() || '')) {
          formDataToSend.append('salaryMax', formData.salaryMax);
        }
        if (formData.benefits.join(', ') !== (job?.benefits || '')) {
          formDataToSend.append('benefits', formData.benefits.join(', '));
        }
        if (formData.closingDate !== (job?.applicationDeadline || '')) {
          formDataToSend.append('applicationDeadline', formData.closingDate);
        }
                 if (formData.department !== (job?.department || '')) {
           formDataToSend.append('department', formData.department);
         }
         if (formData.educationRequired !== (job?.educationRequired || '')) {
           formDataToSend.append('educationRequired', formData.educationRequired);
         }
        
        // Check if coordinates changed
        const currentCoords = job?.latitude && job?.longitude ? [job.latitude, job.longitude] : null;
        if (JSON.stringify(formData.coordinates) !== JSON.stringify(currentCoords)) {
          if (formData.coordinates) {
            formDataToSend.append('latitude', formData.coordinates[0].toString());
            formDataToSend.append('longitude', formData.coordinates[1].toString());
          }
        }
        
                          // Check if arrays changed
         const currentSkills = job?.skillsRequired || [];
         if (JSON.stringify(formData.requiredSkills) !== JSON.stringify(currentSkills)) {
           formDataToSend.append('skillsRequired', JSON.stringify(formData.requiredSkills.length > 0 ? formData.requiredSkills : ["Sin especificar"]));
         }
         
         const currentDesiredSkills = job?.desiredSkills || [];
         if (JSON.stringify(formData.desiredSkills) !== JSON.stringify(currentDesiredSkills)) {
           formDataToSend.append('desiredSkills', JSON.stringify(formData.desiredSkills));
         }
        
                 // Add images directly as files
         for (let index = 0; index < images.length; index++) {
           const file = images[index];
           formDataToSend.append('images', file);
           console.log(`🔍 Added image ${index + 1}/${images.length}: ${file.name}`);
         }
        
                 console.log('🔍 Using FormData for image upload with partial update');
         console.log('🔍 Making request to /api/joboffer with FormData');
         console.log('🔍 FormData entries count:', Array.from(formDataToSend.entries()).length);
        
        const token = localStorage.getItem('token') || '';
        console.log('🔍 Authorization token:', token ? 'Present' : 'Missing');

        const response = await fetch(`/api/joboffer/${jobId}`, {
          method: "PUT",
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
            title: "Éxito",
            description: "Empleo actualizado correctamente",
          });
          router.push(`/jobs/${jobId}`);
        } else {
          throw new Error("Error updating job");
        }
      } else {
        // Use JSON for requests without images - only send changed fields
        const updateData: any = {};
        
        // Only add fields that have changed
        if (formData.title !== job?.title) {
          updateData.title = formData.title;
        }
        if (formData.description !== job?.description) {
          updateData.description = formData.description;
        }
        if (formData.requirements.join(', ') !== (job?.requirements || '')) {
          updateData.requirements = formData.requirements.length > 0 ? formData.requirements.join(', ') : "Sin requisitos específicos";
        }
        if (formData.location !== job?.location) {
          updateData.location = formData.location;
        }
        if (formData.contractType !== job?.contractType) {
          updateData.contractType = formData.contractType;
        }
        if (formData.workSchedule !== job?.workSchedule) {
          updateData.workSchedule = formData.workSchedule || "Horario a definir";
        }
        if (formData.workModality !== job?.workModality) {
          updateData.workModality = formData.workModality;
        }
        if (formData.experienceLevel !== job?.experienceLevel) {
          updateData.experienceLevel = formData.experienceLevel;
        }
        
        // Optional fields
        if (formData.salaryMin !== (job?.salaryMin?.toString() || '')) {
          updateData.salaryMin = formData.salaryMin ? parseInt(formData.salaryMin) : undefined;
        }
        if (formData.salaryMax !== (job?.salaryMax?.toString() || '')) {
          updateData.salaryMax = formData.salaryMax ? parseInt(formData.salaryMax) : undefined;
        }
        if (formData.benefits.join(', ') !== (job?.benefits || '')) {
          updateData.benefits = formData.benefits.length > 0 ? formData.benefits.join(', ') : undefined;
        }
        if (formData.closingDate !== (job?.applicationDeadline || '')) {
          updateData.applicationDeadline = formData.closingDate || undefined;
        }
                 if (formData.department !== (job?.department || '')) {
           updateData.department = formData.department || undefined;
         }
         if (formData.educationRequired !== (job?.educationRequired || '')) {
           updateData.educationRequired = formData.educationRequired || undefined;
         }
        
        // Check coordinates
        const currentCoords = job?.latitude && job?.longitude ? [job.latitude, job.longitude] : null;
        if (JSON.stringify(formData.coordinates) !== JSON.stringify(currentCoords)) {
          if (formData.coordinates) {
            updateData.latitude = formData.coordinates[0];
            updateData.longitude = formData.coordinates[1];
          }
        }
        
                          // Check arrays
         const currentSkills = job?.skillsRequired || [];
         if (JSON.stringify(formData.requiredSkills) !== JSON.stringify(currentSkills)) {
           updateData.skillsRequired = formData.requiredSkills.length > 0 ? formData.requiredSkills : ["Sin especificar"];
         }
         
         const currentDesiredSkills = job?.desiredSkills || [];
         if (JSON.stringify(formData.desiredSkills) !== JSON.stringify(currentDesiredSkills)) {
           updateData.desiredSkills = formData.desiredSkills;
         }

        console.log('🔍 Prepared partial update data:', updateData);
        console.log('🔍 Making request to /api/joboffer with JSON (partial update)');
        
        const token = localStorage.getItem('token') || '';
        console.log('🔍 Authorization token:', token ? 'Present' : 'Missing');

        const response = await fetch(`/api/joboffer/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        console.log('🔍 Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Response error text:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Empleo actualizado correctamente",
          });
          router.push(`/jobs/${jobId}`);
        } else {
          throw new Error("Error updating job");
        }
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Empleo no encontrado</h1>
        <Button onClick={() => router.push("/jobs")}>
          Volver a mis empleos
        </Button>
      </div>
    );
  }

  if (preview) {
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
              disabled={saving}
            >
              Guardar borrador
            </Button>
            <Button onClick={() => handleSubmit("ACTIVE")} disabled={saving}>
              Actualizar empleo
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
                <h1 className="text-2xl font-bold">{formData.title}</h1>
                <p className="text-gray-600">TechCorp Bolivia</p>
                <p className="text-sm text-gray-500">{formData.location}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {contractTypeOptions.find((o) => o.value === formData.contractType)?.label}
                </Badge>
                <Badge variant="outline">
                  {workModalityOptions.find((o) => o.value === formData.workModality)?.label}
                </Badge>
                <Badge variant="outline">
                  {experienceLevelOptions.find((o) => o.value === formData.experienceLevel)?.label}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
              </div>

              {formData.responsibilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Responsabilidades</h3>
                  <ul className="space-y-1">
                    {formData.responsibilities.map((resp, i) => (
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
                  {formData.requiredSkills.map((skill, i) => (
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
            <h1 className="text-2xl font-bold text-gray-900">Editar Empleo</h1>
            <p className="text-gray-600">
              Actualiza la información de tu oferta de trabajo
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
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción del empleo *</Label>
              <Textarea
                id="description"
                placeholder="Describe el puesto, responsabilidades principales y qué buscan en el candidato ideal..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
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
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contractType">Tipo de contrato *</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
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
                  value={formData.workModality}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
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
                  value={formData.experienceLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
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
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salaryMax: e.target.value,
                    }))
                  }
                />
              </div>

                             <div>
                 <Label htmlFor="department">Departamento</Label>
                 <Input
                   id="department"
                   value={formData.department}
                   onChange={(e) =>
                     setFormData((prev) => ({
                       ...prev,
                       department: e.target.value,
                     }))
                   }
                 />
               </div>
               <div>
                 <Label htmlFor="educationRequired">Educación requerida</Label>
                 <Select
                   value={formData.educationRequired}
                   onValueChange={(value) =>
                     setFormData((prev) => ({
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
                  value={formData.workSchedule || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                 {formData.requiredSkills.map((skill, i) => (
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
                 {formData.desiredSkills.map((skill, i) => (
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
                      addToArray("requirements", requirementInput, setRequirementInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray("requirements", requirementInput, setRequirementInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.requirements.map((req, i) => (
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
                      addToArray("responsibilities", responsibilityInput, setResponsibilityInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray("responsibilities", responsibilityInput, setResponsibilityInput)
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.responsibilities.map((resp, i) => (
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
                {formData.benefits.map((benefit, i) => (
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

                 

        {/* Geographic Location */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación Geográfica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Selecciona en el mapa la ubicación del empleo</Label>
                         <MapPicker
               initialCoordinates={formData.coordinates}
               onChange={(coords) =>
                 setFormData((prev) => ({ ...prev, coordinates: coords }))
               }
             />
            {formData.coordinates && (
              <p className="text-sm text-muted-foreground mt-2">
                Latitud: {formData.coordinates[0]}, Longitud: {formData.coordinates[1]}
              </p>
            )}
          </CardContent>
        </Card>

                 {/* Job Images */}
         <Card>
           <CardHeader>
             <CardTitle>Imágenes del Empleo</CardTitle>
             <p className="text-sm text-muted-foreground">
               Nota: Las imágenes no estaban disponibles en empleos creados anteriormente. 
               Puedes agregar imágenes ahora y se guardarán en futuras actualizaciones.
             </p>
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
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar borrador
          </Button>
          <Button onClick={() => handleSubmit("ACTIVE")} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Actualizar empleo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
