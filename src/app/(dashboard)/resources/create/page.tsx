'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save, ArrowLeft } from 'lucide-react';
import { useCreateResource } from '@/hooks/useResourceApi';
import { Resource } from '@/types/api';
import { toast } from 'sonner';

export default function CreateResourcePage() {
  const router = useRouter();
  const { mutateAsync: createResource, isLoading } = useCreateResource();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    format: '',
    url: '',
    fileUrl: '',
    thumbnailUrl: '',
    tags: [] as string[],
    isPublic: true
  });

  const [newTag, setNewTag] = useState('');

  // Opciones para los selectores
  const resourceTypes = [
    { value: 'TEMPLATE', label: 'Plantilla' },
    { value: 'GUIDE', label: 'Guía' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'TOOL', label: 'Herramienta' },
    { value: 'COURSE', label: 'Curso' }
  ];

  const categories = [
    { value: 'EMPRENDIMIENTO', label: 'Emprendimiento' },
    { value: 'TECNOLOGIA', label: 'Tecnología' },
    { value: 'EDUCACION', label: 'Educación' },
    { value: 'SALUD', label: 'Salud' },
    { value: 'FINANZAS', label: 'Finanzas' },
    { value: 'DESARROLLO_PERSONAL', label: 'Desarrollo Personal' },
    { value: 'LIDERAZGO', label: 'Liderazgo' },
    { value: 'MARKETING', label: 'Marketing' }
  ];

  const formats = [
    { value: 'PDF', label: 'PDF' },
    { value: 'DOCX', label: 'Documento Word' },
    { value: 'PPTX', label: 'Presentación PowerPoint' },
    { value: 'XLSX', label: 'Hoja de Cálculo Excel' },
    { value: 'MP4', label: 'Video MP4' },
    { value: 'MP3', label: 'Audio MP3' },
    { value: 'ZIP', label: 'Archivo ZIP' },
    { value: 'LINK', label: 'Enlace Web' }
  ];

  // Función para agregar tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Función para remover tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Función para manejar cambios en el formulario
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validaciones básicas
      if (!formData.title.trim()) {
        toast.error('El título es requerido');
        return;
      }

      if (!formData.description.trim()) {
        toast.error('La descripción es requerida');
        return;
      }

      if (!formData.type) {
        toast.error('El tipo de recurso es requerido');
        return;
      }

      if (!formData.category) {
        toast.error('La categoría es requerida');
        return;
      }

      if (!formData.format) {
        toast.error('El formato es requerido');
        return;
      }

      // Crear el recurso
      await createResource(formData);
      
      toast.success('Recurso creado exitosamente');
      router.push('/resources');
      
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Error al crear el recurso');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Recurso</h1>
        <p className="text-gray-600">
          Comparte conocimientos y herramientas valiosas con la comunidad
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Información principal del recurso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Título del recurso"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe el contenido y propósito del recurso"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Recurso *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="format">Formato *</Label>
                  <Select value={formData.format} onValueChange={(value) => handleChange('format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enlaces y Archivos</CardTitle>
                <CardDescription>
                  URLs para acceder al recurso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">URL del Recurso</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder="https://ejemplo.com/recurso"
                  />
                </div>

                <div>
                  <Label htmlFor="fileUrl">URL del Archivo</Label>
                  <Input
                    id="fileUrl"
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => handleChange('fileUrl', e.target.value)}
                    placeholder="https://ejemplo.com/archivo.pdf"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnailUrl">URL de la Miniatura</Label>
                  <Input
                    id="thumbnailUrl"
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://ejemplo.com/miniatura.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
                <CardDescription>
                  Agrega etiquetas para facilitar la búsqueda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Agregar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Opciones de visibilidad y publicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">Recurso Público</Label>
                    <p className="text-sm text-gray-500">
                      Permitir que cualquier usuario vea este recurso
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleChange('isPublic', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>
                  Cómo se verá tu recurso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium line-clamp-2">
                      {formData.title || 'Título del recurso'}
                    </h4>
                    {formData.type && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {formData.type}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData.description || 'Descripción del recurso'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {formData.category && (
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                    )}
                    {formData.format && (
                      <Badge variant="outline" className="text-xs">
                        {formData.format}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Recurso
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
