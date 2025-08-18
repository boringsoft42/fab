"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateMunicipality } from "@/hooks/useMunicipalityApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Municipality } from "@/types/municipality";

const updateMunicipalitySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  department: z.string().min(2, "El departamento debe tener al menos 2 caracteres"),
  region: z.string().optional(),
  population: z.string().optional(),
  mayorName: z.string().optional(),
  mayorEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  mayorPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type UpdateMunicipalityFormData = z.infer<typeof updateMunicipalitySchema>;

interface EditMunicipalityFormProps {
  municipality: Municipality;
  onSuccess: () => void;
}

export function EditMunicipalityForm({ municipality, onSuccess }: EditMunicipalityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateMunicipality = useUpdateMunicipality();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateMunicipalityFormData>({
    resolver: zodResolver(updateMunicipalitySchema),
    defaultValues: {
      name: municipality.name,
      department: municipality.department,
      region: municipality.region || "",
      population: municipality.population?.toString() || "",
      mayorName: municipality.mayorName || "",
      mayorEmail: municipality.mayorEmail || "",
      mayorPhone: municipality.mayorPhone || "",
      address: municipality.address || "",
      website: municipality.website || "",
      isActive: municipality.isActive,
    },
  });

  const onSubmit = async (data: UpdateMunicipalityFormData) => {
    setIsLoading(true);
    try {
      await updateMunicipality.mutateAsync({
        id: municipality.id,
        data: {
          ...data,
          population: data.population ? parseInt(data.population) : undefined,
        },
      });
      
      toast({
        title: "Municipio actualizado",
        description: "El municipio ha sido actualizado exitosamente.",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el municipio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Básica</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Municipio *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Cochabamba"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento *</Label>
            <Input
              id="department"
              {...register("department")}
              placeholder="Ej: Cochabamba"
            />
            {errors.department && (
              <p className="text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Input
              id="region"
              {...register("region")}
              placeholder="Ej: Valle Alto"
            />
            {errors.region && (
              <p className="text-sm text-red-600">{errors.region.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="population">Población</Label>
            <Input
              id="population"
              type="number"
              {...register("population")}
              placeholder="Ej: 100000"
            />
            {errors.population && (
              <p className="text-sm text-red-600">{errors.population.message}</p>
            )}
          </div>
        </div>

        {/* Información del Alcalde */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del Alcalde</h3>
          
          <div className="space-y-2">
            <Label htmlFor="mayorName">Nombre del Alcalde</Label>
            <Input
              id="mayorName"
              {...register("mayorName")}
              placeholder="Ej: Juan Pérez"
            />
            {errors.mayorName && (
              <p className="text-sm text-red-600">{errors.mayorName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mayorEmail">Email del Alcalde</Label>
            <Input
              id="mayorEmail"
              type="email"
              {...register("mayorEmail")}
              placeholder="alcalde@municipio.com"
            />
            {errors.mayorEmail && (
              <p className="text-sm text-red-600">{errors.mayorEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mayorPhone">Teléfono del Alcalde</Label>
            <Input
              id="mayorPhone"
              {...register("mayorPhone")}
              placeholder="Ej: +591 4 1234567"
            />
            {errors.mayorPhone && (
              <p className="text-sm text-red-600">{errors.mayorPhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Dirección completa del municipio"
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              type="url"
              {...register("website")}
              placeholder="https://www.municipio.com"
            />
            {errors.website && (
              <p className="text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Estado */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Estado</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={municipality.isActive}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
          <Label htmlFor="isActive">Municipio Activo</Label>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información del Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Usuario</Label>
            <Input
              value={municipality.username}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={municipality.email}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Actualizar Municipio
        </Button>
      </div>
    </form>
  );
} 