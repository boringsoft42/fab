"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Edit, 
  Save, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Languages,
  Globe,
  Printer,
  Edit3,
  ChevronRight,
  ChevronDown,
  Plus,
  Code
} from "lucide-react";
import { BACKEND_ENDPOINTS } from "@/lib/backend-config";
import { useCV } from "@/hooks/useCV";
import { CVTemplateSelector } from "./templates/cv-templates";
import { CoverLetterTemplateSelector } from "./templates/cover-letter-templates";
import { ImageUpload } from "./image-upload";

export function CVManager() {
  const { 
    cvData, 
    coverLetterData, 
    loading, 
    error, 
    updateCVData, 
    saveCoverLetterData 
  } = useCV();
  
  const [activeTab, setActiveTab] = useState("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(cvData?.personalInfo?.profileImage || "");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  // Estado para secciones colapsables
  const [collapsedSections, setCollapsedSections] = useState({
    education: false,
    languages: false,
    socialLinks: false,
    workExperience: false,
    projects: false,
    skills: false,
    interests: false
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const uploadProfileImage = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(BACKEND_ENDPOINTS.FILES_UPLOAD_PROFILE_IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      setProfileImage(data.imageUrl);
      setShowImageUpload(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const updateProfileAvatar = async (imageUrl: string | null) => {
    try {
      const response = await fetch(BACKEND_ENDPOINTS.PROFILE_AVATAR, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ avatarUrl: imageUrl })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el avatar');
      }

      const data = await response.json();
      console.log('Avatar updated:', data);
    } catch (error) {
      console.error('Error updating avatar:', error);
      setUploadError('Error al actualizar el avatar');
    }
  };

  const handlePersonalInfoChange = async (field: string, value: string) => {
    try {
      await updateCVData({
        personalInfo: {
          firstName: cvData?.personalInfo?.firstName || "",
          lastName: cvData?.personalInfo?.lastName || "",
          email: cvData?.personalInfo?.email || "",
          phone: cvData?.personalInfo?.phone || "",
          address: cvData?.personalInfo?.address || "",
          municipality: cvData?.personalInfo?.municipality || "",
          department: cvData?.personalInfo?.department || "",
          country: cvData?.personalInfo?.country || "",
          [field]: value
        }
      });
    } catch (error) {
      console.error('Error updating personal info:', error);
    }
  };

  const handleEducationChange = async (field: string, value: any) => {
    try {
      const currentEducation = cvData?.education || {
        level: "",
        currentInstitution: "",
        graduationYear: 0,
        isStudying: false,
        educationHistory: [],
        currentDegree: "",
        universityName: "",
        universityStartDate: "",
        universityEndDate: null,
        universityStatus: "",
        gpa: 0,
        academicAchievements: []
      };

      await updateCVData({
        education: {
          ...currentEducation,
          [field]: value
        }
      });
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  const handleSkillsChange = async (skills: { name: string; experienceLevel?: string }[]) => {
    try {
      await updateCVData({
        skills
      });
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  };

  const handleInterestsChange = async (interests: string[]) => {
    try {
      await updateCVData({
        interests
      });
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !cvData?.skills?.some(skill => skill.name === newSkill.trim())) {
      handleSkillsChange([...(cvData?.skills || []), { name: newSkill.trim(), experienceLevel: "Skillful" }]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleSkillsChange(cvData?.skills?.filter(skill => skill.name !== skillToRemove) || []);
  };

  const addInterest = () => {
    if (newInterest.trim() && !cvData?.interests?.includes(newInterest.trim())) {
      handleInterestsChange([...(cvData?.interests || []), newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    handleInterestsChange(cvData?.interests?.filter(interest => interest !== interestToRemove) || []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar los datos del CV</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestor de CV y Carta de Presentación</h1>
          <p className="text-gray-600 mt-2">
            Crea y personaliza tu CV y carta de presentación con múltiples plantillas profesionales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Vista Previa
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar CV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar Carta
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Descargar Todo
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Editar Datos
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Curriculum Vitae
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Carta de Presentación
          </TabsTrigger>
        </TabsList>

        {/* Edit Data Tab */}
        <TabsContent value="edit" className="space-y-6">
          {/* Información Básica - Siempre visible */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Puesto Objetivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Título del Puesto</Label>
                  <Input
                    id="jobTitle"
                    value={cvData?.jobTitle || ""}
                    onChange={(e) => updateCVData({ jobTitle: e.target.value })}
                    placeholder="Desarrollador Frontend"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    El rol que quieres obtener
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Foto de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImage={cvData?.personalInfo?.profileImage}
                  onImageUpload={uploadProfileImage}
                  onImageRemove={() => updateProfileAvatar(null)}
                />
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={cvData?.personalInfo?.firstName || ""}
                      onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={cvData?.personalInfo?.lastName || ""}
                      onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData?.personalInfo?.email || ""}
                    onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={cvData?.personalInfo?.phone || ""}
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                    placeholder="+591 70012345"
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine">Dirección</Label>
                  <Input
                    id="addressLine"
                    value={cvData?.personalInfo?.addressLine || ""}
                    onChange={(e) => handlePersonalInfoChange("addressLine", e.target.value)}
                    placeholder="Av. Principal 123"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={cvData?.personalInfo?.city || ""}
                      onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                      placeholder="La Paz"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={cvData?.personalInfo?.state || ""}
                      onChange={(e) => handlePersonalInfoChange("state", e.target.value)}
                      placeholder="La Paz"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={cvData?.personalInfo?.country || ""}
                      onChange={(e) => handlePersonalInfoChange("country", e.target.value)}
                      placeholder="Bolivia"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen Profesional - Siempre visible */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Resumen Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="professionalSummary">Descripción Profesional</Label>
                <Textarea
                  id="professionalSummary"
                  value={cvData?.professionalSummary || ""}
                  onChange={(e) => updateCVData({ professionalSummary: e.target.value })}
                  placeholder="Joven profesional con sólidos conocimientos en desarrollo web y tecnologías modernas. Comprometido con el aprendizaje continuo y el desarrollo de soluciones innovadoras."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Escribe 2-4 oraciones cortas y enérgicas sobre lo genial que eres. Menciona el rol y lo que hiciste.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Secciones Colapsables */}
          {/* Educación */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('education')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Educación
                </CardTitle>
                {collapsedSections.education ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.education && (
              <CardContent className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Nivel Educativo</Label>
                    <Select
                      value={cvData?.education?.level || ""}
                      onValueChange={(value) => handleEducationChange("level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el nivel" />
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

                  <div>
                    <Label htmlFor="currentInstitution">Institución Actual</Label>
                    <Input
                      id="currentInstitution"
                      value={cvData?.education?.currentInstitution || ""}
                      onChange={(e) => handleEducationChange("currentInstitution", e.target.value)}
                      placeholder="Colegio San José"
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduationYear">Año de Graduación</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={cvData?.education?.graduationYear || ""}
                      onChange={(e) => handleEducationChange("graduationYear", e.target.value)}
                      placeholder="2023"
                      min="1950"
                      max="2030"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isStudying">Estado de Estudio</Label>
                    <Select
                      value={cvData?.education?.isStudying ? "true" : "false"}
                      onValueChange={(value) => handleEducationChange("isStudying", value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado de estudio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Estudiando actualmente</SelectItem>
                        <SelectItem value="false">Graduado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Información Universitaria */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Información Universitaria</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentDegree">Grado Actual</Label>
                      <Input
                        id="currentDegree"
                        value={cvData?.education?.currentDegree || ""}
                        onChange={(e) => handleEducationChange("currentDegree", e.target.value)}
                        placeholder="Ingeniería en Sistemas"
                      />
                    </div>

                    <div>
                      <Label htmlFor="universityName">Nombre de la Universidad</Label>
                      <Input
                        id="universityName"
                        value={cvData?.education?.universityName || ""}
                        onChange={(e) => handleEducationChange("universityName", e.target.value)}
                        placeholder="Universidad de La Paz"
                      />
                    </div>

                    <div>
                      <Label htmlFor="universityStartDate">Fecha de Inicio</Label>
                      <Input
                        id="universityStartDate"
                        type="month"
                        value={cvData?.education?.universityStartDate || ""}
                        onChange={(e) => handleEducationChange("universityStartDate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="universityEndDate">Fecha de Fin (opcional)</Label>
                      <Input
                        id="universityEndDate"
                        type="month"
                        value={cvData?.education?.universityEndDate || ""}
                        onChange={(e) => handleEducationChange("universityEndDate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="universityStatus">Estado Universitario</Label>
                      <Select
                        value={cvData?.education?.universityStatus || ""}
                        onValueChange={(value) => handleEducationChange("universityStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado universitario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estudiante">Estudiante</SelectItem>
                          <SelectItem value="Graduado">Graduado</SelectItem>
                          <SelectItem value="Egresado">Egresado</SelectItem>
                          <SelectItem value="Truncado">Truncado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="gpa">Promedio Académico (GPA)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={cvData?.education?.gpa || ""}
                        onChange={(e) => handleEducationChange("gpa", parseFloat(e.target.value))}
                        placeholder="3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Historial Educativo */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Historial Educativo</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newHistory = [...(cvData?.education?.educationHistory || []), {
                          institution: "",
                          degree: "",
                          startDate: "",
                          endDate: null,
                          status: "",
                          gpa: undefined
                        }];
                        handleEducationChange("educationHistory", newHistory);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Educación
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {cvData?.education?.educationHistory?.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">Educación {index + 1}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newHistory = cvData.education.educationHistory?.filter((_, i) => i !== index) || [];
                              handleEducationChange("educationHistory", newHistory);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`institution-${index}`}>Institución</Label>
                            <Input
                              id={`institution-${index}`}
                              value={item.institution || ""}
                              onChange={(e) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, institution: e.target.value };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                              placeholder="Nombre de la institución"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`degree-${index}`}>Grado/Título</Label>
                            <Input
                              id={`degree-${index}`}
                              value={item.degree || ""}
                              onChange={(e) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, degree: e.target.value };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                              placeholder="Bachillerato, Licenciatura, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor={`startDate-${index}`}>Fecha de Inicio</Label>
                            <Input
                              id={`startDate-${index}`}
                              type="month"
                              value={item.startDate || ""}
                              onChange={(e) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, startDate: e.target.value };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`endDate-${index}`}>Fecha de Fin</Label>
                            <Input
                              id={`endDate-${index}`}
                              type="month"
                              value={item.endDate || ""}
                              onChange={(e) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, endDate: e.target.value };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`status-${index}`}>Estado</Label>
                            <Select
                              value={item.status || ""}
                              onValueChange={(value) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, status: value };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Graduado">Graduado</SelectItem>
                                <SelectItem value="Estudiante">Estudiante</SelectItem>
                                <SelectItem value="Egresado">Egresado</SelectItem>
                                <SelectItem value="Truncado">Truncado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`gpa-${index}`}>GPA (opcional)</Label>
                            <Input
                              id={`gpa-${index}`}
                              type="number"
                              step="0.1"
                              min="0"
                              max="4"
                              value={item.gpa || ""}
                              onChange={(e) => {
                                const newHistory = [...(cvData.education.educationHistory || [])];
                                newHistory[index] = { ...item, gpa: parseFloat(e.target.value) };
                                handleEducationChange("educationHistory", newHistory);
                              }}
                              placeholder="3.5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logros Académicos */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Logros Académicos</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAchievements = [...(cvData?.education?.academicAchievements || []), {
                          title: "",
                          date: "",
                          description: "",
                          type: "honor"
                        }];
                        handleEducationChange("academicAchievements", newAchievements);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Logro
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {cvData?.education?.academicAchievements?.map((achievement, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">Logro {index + 1}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newAchievements = cvData.education.academicAchievements?.filter((_, i) => i !== index) || [];
                              handleEducationChange("academicAchievements", newAchievements);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`achievementTitle-${index}`}>Título del Logro</Label>
                            <Input
                              id={`achievementTitle-${index}`}
                              value={achievement.title || ""}
                              onChange={(e) => {
                                const newAchievements = [...(cvData.education.academicAchievements || [])];
                                newAchievements[index] = { ...achievement, title: e.target.value };
                                handleEducationChange("academicAchievements", newAchievements);
                              }}
                              placeholder="Primer lugar en Hackathon"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`achievementDate-${index}`}>Fecha</Label>
                            <Input
                              id={`achievementDate-${index}`}
                              type="month"
                              value={achievement.date || ""}
                              onChange={(e) => {
                                const newAchievements = [...(cvData.education.academicAchievements || [])];
                                newAchievements[index] = { ...achievement, date: e.target.value };
                                handleEducationChange("academicAchievements", newAchievements);
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`achievementType-${index}`}>Tipo</Label>
                            <Select
                              value={achievement.type || ""}
                              onValueChange={(value) => {
                                const newAchievements = [...(cvData.education.academicAchievements || [])];
                                newAchievements[index] = { ...achievement, type: value };
                                handleEducationChange("academicAchievements", newAchievements);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de logro" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="honor">Honor</SelectItem>
                                <SelectItem value="award">Premio</SelectItem>
                                <SelectItem value="certification">Certificación</SelectItem>
                                <SelectItem value="scholarship">Beca</SelectItem>
                                <SelectItem value="publication">Publicación</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`achievementDescription-${index}`}>Descripción</Label>
                          <Textarea
                            id={`achievementDescription-${index}`}
                            value={achievement.description || ""}
                            onChange={(e) => {
                              const newAchievements = [...(cvData.education.academicAchievements || [])];
                              newAchievements[index] = { ...achievement, description: e.target.value };
                              handleEducationChange("academicAchievements", newAchievements);
                            }}
                            placeholder="Descripción detallada del logro académico"
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Idiomas */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('languages')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Idiomas
                </CardTitle>
                {collapsedSections.languages ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.languages && (
              <CardContent className="space-y-4">
                {cvData?.languages?.map((language, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Idioma {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLanguages = cvData.languages?.filter((_, i) => i !== index) || [];
                          updateCVData({ languages: newLanguages });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`languageName-${index}`}>Idioma</Label>
                        <Input
                          id={`languageName-${index}`}
                          value={language.name || ""}
                          onChange={(e) => {
                            const newLanguages = [...(cvData.languages || [])];
                            newLanguages[index] = { ...language, name: e.target.value };
                            updateCVData({ languages: newLanguages });
                          }}
                          placeholder="Español"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`languageProficiency-${index}`}>Nivel</Label>
                        <Select
                          value={language.proficiency || ""}
                          onValueChange={(value) => {
                            const newLanguages = [...(cvData.languages || [])];
                            newLanguages[index] = { ...language, proficiency: value };
                            updateCVData({ languages: newLanguages });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Native speaker">Hablante nativo</SelectItem>
                            <SelectItem value="Highly proficient">Altamente competente</SelectItem>
                            <SelectItem value="Proficient">Competente</SelectItem>
                            <SelectItem value="Intermediate">Intermedio</SelectItem>
                            <SelectItem value="Basic">Básico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newLanguages = [...(cvData?.languages || []), {
                      name: "",
                      proficiency: ""
                    }];
                    updateCVData({ languages: newLanguages });
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Idioma
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Enlaces Sociales */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('socialLinks')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Enlaces Web y Redes Sociales
                </CardTitle>
                {collapsedSections.socialLinks ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.socialLinks && (
              <CardContent className="space-y-4">
                {cvData?.socialLinks?.map((link, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Enlace {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLinks = cvData.socialLinks?.filter((_, i) => i !== index) || [];
                          updateCVData({ socialLinks: newLinks });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`platform-${index}`}>Plataforma</Label>
                        <Select
                          value={link.platform || ""}
                          onValueChange={(value) => {
                            const newLinks = [...(cvData.socialLinks || [])];
                            newLinks[index] = { ...link, platform: value };
                            updateCVData({ socialLinks: newLinks });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="GitHub">GitHub</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Website">Sitio Web</SelectItem>
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`url-${index}`}>URL</Label>
                        <Input
                          id={`url-${index}`}
                          value={link.url || ""}
                          onChange={(e) => {
                            const newLinks = [...(cvData.socialLinks || [])];
                            newLinks[index] = { ...link, url: e.target.value };
                            updateCVData({ socialLinks: newLinks });
                          }}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newLinks = [...(cvData?.socialLinks || []), {
                      platform: "",
                      url: ""
                    }];
                    updateCVData({ socialLinks: newLinks });
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Enlace
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Experiencia Laboral */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('workExperience')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experiencia Laboral
                </CardTitle>
                {collapsedSections.workExperience ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.workExperience && (
              <CardContent className="space-y-4">
                {cvData?.workExperience?.map((experience, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experiencia {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExperience = cvData.workExperience?.filter((_, i) => i !== index) || [];
                          updateCVData({ workExperience: newExperience });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`jobTitle-${index}`}>Puesto</Label>
                        <Input
                          id={`jobTitle-${index}`}
                          value={experience.jobTitle || ""}
                          onChange={(e) => {
                            const newExperience = [...(cvData.workExperience || [])];
                            newExperience[index] = { ...experience, jobTitle: e.target.value };
                            updateCVData({ workExperience: newExperience });
                          }}
                          placeholder="Desarrollador Frontend"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`company-${index}`}>Empresa</Label>
                        <Input
                          id={`company-${index}`}
                          value={experience.company || ""}
                          onChange={(e) => {
                            const newExperience = [...(cvData.workExperience || [])];
                            newExperience[index] = { ...experience, company: e.target.value };
                            updateCVData({ workExperience: newExperience });
                          }}
                          placeholder="TechCorp Bolivia"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`startDate-${index}`}>Fecha de Inicio</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="month"
                          value={experience.startDate || ""}
                          onChange={(e) => {
                            const newExperience = [...(cvData.workExperience || [])];
                            newExperience[index] = { ...experience, startDate: e.target.value };
                            updateCVData({ workExperience: newExperience });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`endDate-${index}`}>Fecha de Fin</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="month"
                          value={experience.endDate || ""}
                          onChange={(e) => {
                            const newExperience = [...(cvData.workExperience || [])];
                            newExperience[index] = { ...experience, endDate: e.target.value };
                            updateCVData({ workExperience: newExperience });
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${index}`}>Descripción</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={experience.description || ""}
                        onChange={(e) => {
                          const newExperience = [...(cvData.workExperience || [])];
                          newExperience[index] = { ...experience, description: e.target.value };
                          updateCVData({ workExperience: newExperience });
                        }}
                        placeholder="Desarrollo de interfaces de usuario con React y JavaScript."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newExperience = [...(cvData?.workExperience || []), {
                      jobTitle: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      description: ""
                    }];
                    updateCVData({ workExperience: newExperience });
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Experiencia Laboral
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Proyectos */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('projects')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Proyectos
                </CardTitle>
                {collapsedSections.projects ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.projects && (
              <CardContent className="space-y-4">
                {cvData?.projects?.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Proyecto {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newProjects = cvData.projects?.filter((_, i) => i !== index) || [];
                          updateCVData({ projects: newProjects });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`projectTitle-${index}`}>Título del Proyecto</Label>
                        <Input
                          id={`projectTitle-${index}`}
                          value={project.title || ""}
                          onChange={(e) => {
                            const newProjects = [...(cvData.projects || [])];
                            newProjects[index] = { ...project, title: e.target.value };
                            updateCVData({ projects: newProjects });
                          }}
                          placeholder="ACTUARIUS Mobile Application"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`projectLocation-${index}`}>Ubicación</Label>
                        <Input
                          id={`projectLocation-${index}`}
                          value={project.location || ""}
                          onChange={(e) => {
                            const newProjects = [...(cvData.projects || [])];
                            newProjects[index] = { ...project, location: e.target.value };
                            updateCVData({ projects: newProjects });
                          }}
                          placeholder="Querétaro"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`projectStartDate-${index}`}>Fecha de Inicio</Label>
                        <Input
                          id={`projectStartDate-${index}`}
                          type="month"
                          value={project.startDate || ""}
                          onChange={(e) => {
                            const newProjects = [...(cvData.projects || [])];
                            newProjects[index] = { ...project, startDate: e.target.value };
                            updateCVData({ projects: newProjects });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`projectEndDate-${index}`}>Fecha de Fin</Label>
                        <Input
                          id={`projectEndDate-${index}`}
                          type="month"
                          value={project.endDate || ""}
                          onChange={(e) => {
                            const newProjects = [...(cvData.projects || [])];
                            newProjects[index] = { ...project, endDate: e.target.value };
                            updateCVData({ projects: newProjects });
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`projectDescription-${index}`}>Descripción</Label>
                      <Textarea
                        id={`projectDescription-${index}`}
                        value={project.description || ""}
                        onChange={(e) => {
                          const newProjects = [...(cvData.projects || [])];
                          newProjects[index] = { ...project, description: e.target.value };
                          updateCVData({ projects: newProjects });
                        }}
                        placeholder="Desarrollo de aplicación móvil para gestión de seguros."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newProjects = [...(cvData?.projects || []), {
                      title: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      description: ""
                    }];
                    updateCVData({ projects: newProjects });
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Proyecto
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Habilidades */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('skills')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Habilidades
                </CardTitle>
                {collapsedSections.skills ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.skills && (
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Nueva habilidad"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {cvData?.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill.name}
                      {skill.experienceLevel && (
                        <span className="text-xs">({skill.experienceLevel})</span>
                      )}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSkill(skill.name)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Intereses */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('interests')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Intereses
                </CardTitle>
                {collapsedSections.interests ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </CardHeader>
            {!collapsedSections.interests && (
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Nuevo interés"
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {cvData?.interests?.map((interest, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {interest}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="cv" className="space-y-6">
          <CVTemplateSelector />
        </TabsContent>

        <TabsContent value="cover-letter" className="space-y-6">
          <CoverLetterTemplateSelector />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                const cvTab = document.querySelector('[data-value="cv"]') as HTMLElement;
                if (cvTab) cvTab.click();
              }}
            >
              <Printer className="h-4 w-4" />
              Imprimir CV
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                const coverLetterTab = document.querySelector('[data-value="cover-letter"]') as HTMLElement;
                if (coverLetterTab) coverLetterTab.click();
              }}
            >
              <Printer className="h-4 w-4" />
              Imprimir Carta
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                const cvTab = document.querySelector('[data-value="cv"]') as HTMLElement;
                if (cvTab) cvTab.click();
                // Trigger download after a short delay to allow tab switch
                setTimeout(() => {
                  const downloadBtn = document.querySelector('[data-cv-download]') as HTMLElement;
                  if (downloadBtn) downloadBtn.click();
                }, 100);
              }}
            >
              <Download className="h-4 w-4" />
              Descargar CV PDF
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                const coverLetterTab = document.querySelector('[data-value="cover-letter"]') as HTMLElement;
                if (coverLetterTab) coverLetterTab.click();
                // Trigger download after a short delay to allow tab switch
                setTimeout(() => {
                  const downloadBtn = document.querySelector('[data-cover-letter-download]') as HTMLElement;
                  if (downloadBtn) downloadBtn.click();
                }, 100);
              }}
            >
              <Download className="h-4 w-4" />
              Descargar Carta PDF
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Todo (ZIP)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
