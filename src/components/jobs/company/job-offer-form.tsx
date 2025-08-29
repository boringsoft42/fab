'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { JobOffer } from '@/types/jobs';
import { JobOfferService } from '@/services/job-offer.service';

interface JobOfferFormProps {
  jobOffer?: JobOffer | null;
  onSuccess: (jobOffer: JobOffer) => void;
  onCancel: () => void;
}

const contractTypes = [
  { value: 'FULL_TIME', label: 'Tiempo completo' },
  { value: 'PART_TIME', label: 'Tiempo parcial' },
  { value: 'CONTRACT', label: 'Contrato' },
  { value: 'INTERNSHIP', label: 'Pasantía' },
  { value: 'FREELANCE', label: 'Freelance' }
];

const workModalities = [
  { value: 'ON_SITE', label: 'Presencial' },
  { value: 'REMOTE', label: 'Remoto' },
  { value: 'HYBRID', label: 'Híbrido' }
];

const experienceLevels = [
  { value: 'ENTRY_LEVEL', label: 'Nivel inicial' },
  { value: 'JUNIOR_LEVEL', label: 'Junior' },
  { value: 'MID_LEVEL', label: 'Mid-level' },
  { value: 'SENIOR_LEVEL', label: 'Senior' },
  { value: 'LEAD_LEVEL', label: 'Lead' },
  { value: 'MANAGER_LEVEL', label: 'Manager' }
];

export default function JobOfferForm({ jobOffer, onSuccess, onCancel }: JobOfferFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    latitude: '',
    longitude: '',
    contractType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE',
    workSchedule: '',
    workModality: 'ON_SITE' as 'ON_SITE' | 'REMOTE' | 'HYBRID',
    experienceLevel: 'ENTRY_LEVEL' as 'ENTRY_LEVEL' | 'JUNIOR_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'LEAD_LEVEL' | 'MANAGER_LEVEL',
    municipality: '',
    department: 'Cochabamba',
    educationRequired: 'UNIVERSITY' as 'PRIMARY' | 'SECONDARY' | 'TECHNICAL' | 'UNIVERSITY' | 'POSTGRADUATE' | 'OTHER',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'BOB',
    benefits: '',
    skillsRequired: [] as string[],
    desiredSkills: [] as string[],
    applicationDeadline: '',
    isActive: true
  });

  useEffect(() => {
    if (jobOffer) {
      setFormData({
        title: jobOffer.title || '',
        description: jobOffer.description || '',
        requirements: jobOffer.requirements || '',
        location: jobOffer.location || '',
        latitude: jobOffer.latitude?.toString() || '',
        longitude: jobOffer.longitude?.toString() || '',
        contractType: jobOffer.contractType || 'FULL_TIME',
        workSchedule: jobOffer.workSchedule || '',
        workModality: jobOffer.workModality || 'ON_SITE',
        experienceLevel: jobOffer.experienceLevel || 'ENTRY_LEVEL',
        municipality: jobOffer.municipality || '',
        department: jobOffer.department || 'Cochabamba',
        educationRequired: jobOffer.educationRequired || 'UNIVERSITY',
        salaryMin: jobOffer.salaryMin?.toString() || '',
        salaryMax: jobOffer.salaryMax?.toString() || '',
        salaryCurrency: jobOffer.salaryCurrency || 'BOB',
        benefits: jobOffer.benefits || '',
        skillsRequired: jobOffer.skillsRequired || [],
        desiredSkills: jobOffer.desiredSkills || [],
        applicationDeadline: jobOffer.applicationDeadline || '',
        isActive: jobOffer.isActive ?? true
      });
    }
  }, [jobOffer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título es obligatorio',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'La descripción es obligatoria',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: 'Error',
        description: 'La ubicación es obligatoria',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      const jobOfferData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        skillsRequired: formData.skillsRequired.filter(skill => skill.trim()),
        desiredSkills: formData.desiredSkills.filter(skill => skill.trim())
      };

      let result: JobOffer;
      
      if (jobOffer) {
        result = await JobOfferService.updateJobOffer(jobOffer.id, jobOfferData);
      } else {
        result = await JobOfferService.createJobOffer(jobOfferData);
      }
      
      onSuccess(result);
    } catch (error) {
      console.error('Error saving job offer:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el puesto de trabajo',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (type: 'required' | 'desired') => {
    const skill = prompt(`Agregar habilidad ${type === 'required' ? 'requerida' : 'deseada'}:`);
    if (skill && skill.trim()) {
      setFormData(prev => ({
        ...prev,
        [type === 'required' ? 'skillsRequired' : 'desiredSkills']: [
          ...prev[type === 'required' ? 'skillsRequired' : 'desiredSkills'],
          skill.trim()
        ]
      }));
    }
  };

  const removeSkill = (type: 'required' | 'desired', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type === 'required' ? 'skillsRequired' : 'desiredSkills']: 
        prev[type === 'required' ? 'skillsRequired' : 'desiredSkills'].filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título del puesto *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ej: Desarrollador Frontend Senior"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Ej: Cochabamba, Bolivia"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitud (opcional)</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
            placeholder="Ej: -17.3895"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitud (opcional)</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
            placeholder="Ej: -66.1568"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción del puesto *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe las responsabilidades y funciones del puesto..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requisitos</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
          placeholder="Especifica los requisitos mínimos para el puesto..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contractType">Tipo de contrato</Label>
          <Select
            value={formData.contractType}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, contractType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workModality">Modalidad de trabajo</Label>
          <Select
            value={formData.workModality}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, workModality: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workModalities.map((modality) => (
                <SelectItem key={modality.value} value={modality.value}>
                  {modality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Nivel de experiencia</Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workSchedule">Horario de trabajo</Label>
        <Input
          id="workSchedule"
          value={formData.workSchedule}
          onChange={(e) => setFormData(prev => ({ ...prev, workSchedule: e.target.value }))}
          placeholder="Ej: Lunes a Viernes, 9:00 AM - 6:00 PM"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="municipality">Municipio *</Label>
          <Input
            id="municipality"
            value={formData.municipality}
            onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
            placeholder="Ej: Cochabamba"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            placeholder="Ej: Cochabamba"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salario mínimo (Bs.)</Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
            placeholder="8000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryMax">Salario máximo (Bs.)</Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
            placeholder="12000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationRequired">Educación requerida</Label>
          <Select
            value={formData.educationRequired}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, educationRequired: value }))}
          >
            <SelectTrigger>
              <SelectValue />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Beneficios</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
          placeholder="Describe los beneficios del puesto (seguro médico, bonos, etc.)"
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Habilidades requeridas</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skillsRequired.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill('required', index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSkill('required')}
            className="mt-2"
          >
            + Agregar habilidad requerida
          </Button>
        </div>

        <div>
          <Label>Habilidades deseadas</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.desiredSkills.map((skill, index) => (
              <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill('desired', index)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSkill('desired')}
            className="mt-2"
          >
            + Agregar habilidad deseada
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="applicationDeadline">Fecha límite de aplicación</Label>
        <Input
          id="applicationDeadline"
          type="datetime-local"
          value={formData.applicationDeadline}
          onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Puesto activo</Label>
      </div>

             <div className="flex justify-end gap-2">
         <Button type="button" variant="outline" onClick={onCancel}>
           Cancelar
         </Button>
         <Button type="submit" disabled={loading} className="w-full md:w-auto">
           {loading ? (
             <>
               <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
               Publicando...
             </>
           ) : (
             <>
               <Save className="mr-2 h-4 w-4" />
               {jobOffer ? 'Actualizar Empleo' : 'Publicar Empleo'}
             </>
           )}
         </Button>
       </div>
    </form>
  );
}
