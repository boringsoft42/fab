import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ListInput } from "@/components/ui/list-input";
import { CreateEventData } from "@/hooks/use-events";
import { useState } from "react";

interface EventFormProps {
  formData: CreateEventData;
  setFormData: (data: CreateEventData) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

const eventTypes = [
  { value: "IN_PERSON", label: "Presencial" },
  { value: "VIRTUAL", label: "Virtual" },
  { value: "HYBRID", label: "Híbrido" },
];

const eventCategories = [
  { value: "NETWORKING", label: "Networking" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "CONFERENCE", label: "Conferencia" },
  { value: "SEMINAR", label: "Seminario" },
  { value: "TRAINING", label: "Capacitación" },
  { value: "FAIR", label: "Feria" },
  { value: "COMPETITION", label: "Competencia" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "MEETUP", label: "Meetup" },
  { value: "OTHER", label: "Otro" },
];

const eventStatuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "COMPLETED", label: "Completado" },
];

export function EventForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel = "Guardar Evento",
}: EventFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del evento *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Título del evento"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizer">Organizador *</Label>
          <Input
            id="organizer"
            value={formData.organizer}
            onChange={(e) =>
              setFormData({ ...formData, organizer: e.target.value })
            }
            placeholder="Nombre del organizador"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Descripción del evento"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Horario *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationDeadline">Fecha límite de registro</Label>
          <Input
            id="registrationDeadline"
            type="date"
            value={formData.registrationDeadline || ""}
            onChange={(e) =>
              setFormData({ ...formData, registrationDeadline: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                type: value as "IN_PERSON" | "VIRTUAL" | "HYBRID",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as
                  | "DRAFT"
                  | "PUBLISHED"
                  | "CANCELLED"
                  | "COMPLETED",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Ubicación del evento"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Imagen del evento</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            placeholder="Seleccionar imagen"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de imagen (alternativa)</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Capacidad máxima</Label>
          <Input
            id="maxCapacity"
            type="number"
            value={formData.maxCapacity?.toString() || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxCapacity: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            placeholder="Número máximo de asistentes"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price?.toString() || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="0.00"
          />
        </div>
        <ListInput
          label="Etiquetas"
          placeholder="Ej: tecnología, innovación, startup"
          value={formData.tags || []}
          onChange={(value) => setFormData({ ...formData, tags: value })}
        />
      </div>

      <ListInput
        label="Requisitos"
        placeholder="Ej: Conocimientos básicos de programación"
        value={formData.requirements || []}
        onChange={(value) => setFormData({ ...formData, requirements: value })}
      />

      <ListInput
        label="Agenda"
        placeholder="Ej: 09:00 - Registro y bienvenida"
        value={formData.agenda || []}
        onChange={(value) => setFormData({ ...formData, agenda: value })}
      />

      <ListInput
        label="Ponentes/Facilitadores"
        placeholder="Ej: Dr. Juan Pérez - Inversionista Ángel"
        value={formData.speakers || []}
        onChange={(value) => setFormData({ ...formData, speakers: value })}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, featured: checked })
          }
        />
        <Label htmlFor="featured">Evento destacado</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
