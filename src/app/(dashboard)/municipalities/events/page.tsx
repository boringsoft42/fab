"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ListInput } from "@/components/ui/list-input";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useEvents,
  useMyEvents,
  useMyEventStats,
  useEventAttendees,
  Event,
  CreateEventData,
} from "@/hooks/use-events";
import { useCurrentMunicipality } from "@/hooks/useMunicipalityApi";

export default function MunicipalityEventsPage() {
  // Get current municipality (for organizer name and other info)
  const { data: currentMunicipality } = useCurrentMunicipality();
  const municipalityId = currentMunicipality?.id;

  console.log("🔍 MunicipalityEventsPage - Debug:", {
    currentMunicipality,
    municipalityId,
    municipalityName: currentMunicipality?.name,
  });

  const { myEvents: events, loading, fetchMyEvents } = useMyEvents();
  const { stats, fetchMyStats } = useMyEventStats();
  const { attendees, fetchEventAttendees, updateAttendeeStatus } =
    useEventAttendees();
  const { createEvent, updateEvent, deleteEvent } = useEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateEventData>({
    title: "",
    organizer: "",
    description: "",
    date: "",
    time: "",
    type: "IN_PERSON",
    category: "NETWORKING",
    location: "",
    maxCapacity: undefined,
    price: undefined,
    status: "DRAFT",
    featured: false,
    registrationDeadline: undefined,
    imageUrl: undefined,
    image: undefined,
    tags: undefined,
    requirements: undefined,
    agenda: undefined,
    speakers: undefined,
  });

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

  const attendeeStatuses = [
    { value: "REGISTERED", label: "Registrado" },
    { value: "CONFIRMED", label: "Confirmado" },
    { value: "ATTENDED", label: "Asistió" },
    { value: "NO_SHOW", label: "No asistió" },
    { value: "CANCELLED", label: "Cancelado" },
  ];

  useEffect(() => {
    fetchMyEvents();
    fetchMyStats();
  }, [fetchMyEvents, fetchMyStats]); // Ejecutar al montar el componente

  const handleCreateEvent = async () => {
    try {
      console.log(
        "🔍 handleCreateEvent - Creating event with municipalityId:",
        municipalityId
      );

      // Add municipalityId to the form data
      const eventDataWithMunicipality = {
        ...formData,
        municipalityId: municipalityId,
        organizer: currentMunicipality?.name || formData.organizer, // Use municipality name as organizer if not provided
      };

      console.log(
        "🔍 handleCreateEvent - Event data:",
        eventDataWithMunicipality
      );

      await createEvent(eventDataWithMunicipality);
      setIsCreateDialogOpen(false);
      resetForm();
      fetchMyEvents(); // Refresh the events list
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      await updateEvent(selectedEvent.id, formData);
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      resetForm();
      fetchMyEvents(); // Refresh the events list
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;

    try {
      await deleteEvent(eventId);
      fetchMyEvents(); // Refresh the events list
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleUpdateAttendeeStatus = async (
    attendeeId: string,
    status: string
  ) => {
    if (!selectedEvent) return;

    try {
      await updateAttendeeStatus(selectedEvent.id, attendeeId, status);
    } catch {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      organizer: "",
      description: "",
      date: "",
      time: "",
      type: "IN_PERSON",
      category: "NETWORKING",
      location: "",
      maxCapacity: undefined,
      price: undefined,
      status: "DRAFT",
      featured: false,
      registrationDeadline: undefined,
      imageUrl: undefined,
      image: undefined,
      tags: undefined,
      requirements: undefined,
      agenda: undefined,
      speakers: undefined,
    });
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      organizer: event.organizer,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      category: event.category,
      location: event.location,
      maxCapacity: event.maxCapacity,
      price: event.price,
      status: event.status,
      featured: event.featured,
      registrationDeadline: event.registrationDeadline,
      imageUrl: event.imageUrl,
      image: undefined,
      tags: event.tags,
      requirements: event.requirements,
      agenda: event.agenda,
      speakers: event.speakers,
    });
    setIsEditDialogOpen(true);
  };

  const openAttendeesDialog = async (event: Event) => {
    setSelectedEvent(event);
    await fetchEventAttendees(event.id);
    setIsAttendeesDialogOpen(true);
  };

  const filteredEvents = (Array.isArray(events) ? events : []).filter(
    (event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || event.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || event.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesFeatured =
        featuredFilter === null || event.featured === featuredFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStatus &&
        matchesFeatured
      );
    }
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: "Borrador", variant: "secondary" as const },
      PUBLISHED: { label: "Publicado", variant: "default" as const },
      CANCELLED: { label: "Cancelado", variant: "destructive" as const },
      COMPLETED: { label: "Completado", variant: "outline" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      IN_PERSON: { label: "Presencial", variant: "default" as const },
      VIRTUAL: { label: "Virtual", variant: "secondary" as const },
      HYBRID: { label: "Híbrido", variant: "outline" as const },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAttendeeStatusBadge = (status: string) => {
    const statusConfig = {
      REGISTERED: { label: "Registrado", variant: "secondary" as const },
      CONFIRMED: { label: "Confirmado", variant: "default" as const },
      ATTENDED: { label: "Asistió", variant: "default" as const },
      NO_SHOW: { label: "No asistió", variant: "destructive" as const },
      CANCELLED: { label: "Cancelado", variant: "outline" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona los eventos de tu municipio
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <EventForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateEvent}
              eventTypes={eventTypes}
              eventCategories={eventCategories}
              eventStatuses={eventStatuses}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asistentes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Asistencia</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredEvents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Título u organizador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {eventCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destacados</Label>
              <Select
                value={
                  featuredFilter === null ? "all" : featuredFilter.toString()
                }
                onValueChange={(value) =>
                  setFeaturedFilter(value === "all" ? null : value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Solo destacados</SelectItem>
                  <SelectItem value="false">No destacados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Eventos ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                      {event.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {format(new Date(event.date), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </div>
                      <div className="text-muted-foreground">{event.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(event.type)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{event.currentAttendees}</div>
                      {event.maxCapacity && (
                        <div className="text-muted-foreground">
                          / {event.maxCapacity}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAttendeesDialog(event)}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateEvent}
            eventTypes={eventTypes}
            eventCategories={eventCategories}
            eventStatuses={eventStatuses}
          />
        </DialogContent>
      </Dialog>

      {/* Attendees Dialog */}
      <Dialog
        open={isAttendeesDialogOpen}
        onOpenChange={setIsAttendeesDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asistentes - {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Array.isArray(attendees) ? attendees : []).map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{attendee.user.name}</TableCell>
                    <TableCell>{attendee.user.email}</TableCell>
                    <TableCell>
                      {getAttendeeStatusBadge(attendee.status)}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(attendee.registeredAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: es }
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendee.status}
                        onValueChange={(value) =>
                          handleUpdateAttendeeStatus(attendee.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {attendeeStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EventFormProps {
  formData: CreateEventData;
  setFormData: (data: CreateEventData) => void;
  onSubmit: () => void;
  eventTypes: { value: string; label: string }[];
  eventCategories: { value: string; label: string }[];
  eventStatuses: { value: string; label: string }[];
}

function EventForm({
  formData,
  setFormData,
  onSubmit,
  eventTypes,
  eventCategories,
  eventStatuses,
}: EventFormProps) {
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, image: file });
              }
            }}
            placeholder="Seleccionar imagen"
          />
        </div>
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
          Guardar Evento
        </Button>
      </div>
    </div>
  );
}
