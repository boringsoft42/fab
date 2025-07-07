"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Video,
  Building,
  Monitor,
  TrendingUp,
  Award,
  CalendarDays,
  UserCheck,
} from "lucide-react";

interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: "virtual" | "presencial" | "hybrid";
  category: string;
  organizer: string;
  organizerId: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  tags: string[];
  status: "published" | "draft" | "cancelled";
  featured: boolean;
  registrationDeadline: Date;
  requirements: string[];
  agenda: { time: string; activity: string }[];
  speakers: { name: string; role: string }[];
  createdAt: Date;
  updatedAt: Date;
}

interface Stats {
  total: number;
  byType: {
    virtual: number;
    presencial: number;
    hybrid: number;
  };
  byCategory: {
    pitch: number;
    workshop: number;
    feria: number;
    networking: number;
  };
  byStatus: {
    published: number;
    draft: number;
    cancelled: number;
  };
  totalAttendees: number;
  averageAttendance: number;
  featured: number;
  upcoming: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byType: { virtual: 0, presencial: 0, hybrid: 0 },
    byCategory: { pitch: 0, workshop: 0, feria: 0, networking: 0 },
    byStatus: { published: 0, draft: 0, cancelled: 0 },
    totalAttendees: 0,
    averageAttendance: 0,
    featured: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for creating/editing events
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: "virtual" | "presencial" | "hybrid";
    category: string;
    organizer: string;
    maxAttendees: number;
    price: number;
    image: string;
    tags: string;
    featured: boolean;
    status: "published" | "draft" | "cancelled";
    registrationDeadline: string;
    requirements: string;
    agenda: string;
    speakers: string;
  }>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "presencial",
    category: "Networking",
    organizer: "",
    maxAttendees: 50,
    price: 0,
    image: "",
    tags: "",
    featured: false,
    status: "draft",
    registrationDeadline: "",
    requirements: "",
    agenda: "",
    speakers: "",
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(
        `/api/admin/entrepreneurship/events?${params}`
      );
      const data = await response.json();

      setEvents(data.events);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedType, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async () => {
    try {
      const response = await fetch("/api/admin/entrepreneurship/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          requirements: formData.requirements
            .split("\n")
            .filter((req) => req.trim()),
          agenda: formData.agenda
            .split("\n")
            .map((line) => {
              const [time, activity] = line.split(" - ");
              return { time: time?.trim(), activity: activity?.trim() };
            })
            .filter((item) => item.time && item.activity),
          speakers: formData.speakers
            .split("\n")
            .map((line) => {
              const [name, role] = line.split(" - ");
              return { name: name?.trim(), role: role?.trim() };
            })
            .filter((speaker) => speaker.name && speaker.role),
        }),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          type: "presencial",
          category: "Networking",
          organizer: "",
          maxAttendees: 50,
          price: 0,
          image: "",
          tags: "",
          featured: false,
          status: "draft",
          registrationDeadline: "",
          requirements: "",
          agenda: "",
          speakers: "",
        });
        fetchEvents();
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "virtual":
        return <Monitor className="h-4 w-4" />;
      case "presencial":
        return <Building className="h-4 w-4" />;
      case "hybrid":
        return <Video className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "virtual":
        return "bg-blue-100 text-blue-800";
      case "presencial":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    "Networking",
    "Pitch",
    "Workshop",
    "Feria",
    "Conferencia",
    "Panel",
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            Administra eventos de networking y capacitación
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
                      setFormData((prev) => ({
                        ...prev,
                        organizer: e.target.value,
                      }))
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
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripción detallada del evento"
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horario *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                    placeholder="ej: 14:00 - 17:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">
                    Fecha límite registro
                  </Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registrationDeadline: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: "virtual" | "presencial" | "hybrid"
                    ) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Dirección física o link de videoconferencia"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Capacidad máxima</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxAttendees: parseInt(e.target.value) || 0,
                      }))
                    }
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (Bs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "published" | "draft" | "cancelled"
                    ) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="URL de la imagen del evento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Etiquetas</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="etiqueta1, etiqueta2, etiqueta3"
                />
                <p className="text-xs text-muted-foreground">
                  Separar con comas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requisitos</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requirements: e.target.value,
                    }))
                  }
                  placeholder="Un requisito por línea"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, agenda: e.target.value }))
                  }
                  placeholder="09:00 - Registro y bienvenida&#10;10:00 - Presentación principal&#10;11:30 - Coffee break"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Formato: HH:MM - Actividad (una por línea)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="speakers">Ponentes/Facilitadores</Label>
                <Textarea
                  id="speakers"
                  value={formData.speakers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      speakers: e.target.value,
                    }))
                  }
                  placeholder="Dr. Roberto Silva - Inversionista Ángel&#10;María González - Mentora Startup"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Formato: Nombre - Cargo (uno por línea)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: !!checked }))
                  }
                />
                <Label htmlFor="featured">Evento destacado</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateEvent}>Crear Evento</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Eventos
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Próximos
                </p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Asistentes
                </p>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  % Asistencia
                </p>
                <p className="text-2xl font-bold">
                  {(stats.averageAttendance * 100).toFixed(0)}%
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Publicados
                </p>
                <p className="text-2xl font-bold">{stats.byStatus.published}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Destacados
                </p>
                <p className="text-2xl font-bold">{stats.featured}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por título, organizador o etiquetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.organizer} • {event.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.featured && (
                      <Award className="h-4 w-4 text-orange-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          Ver Asistentes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros o crear nuevos eventos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
