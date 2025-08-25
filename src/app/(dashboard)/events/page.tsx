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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEvents, Event } from "@/hooks/use-events";
import { getImageUrl } from "@/lib/video-utils";
import { apiCall } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const { events: allEvents, fetchEvents } = useEvents();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

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

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const attendEvent = async (eventId: string) => {
    try {
      await apiCall(`/events/${eventId}/attend`, {
        method: "POST",
      });
      await fetchEvents(); // Refresh events to update registration status
      toast({
        title: "Éxito",
        description: "Te has registrado al evento correctamente",
      });
    } catch (error) {
      console.error("Error attending event:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al registrarse al evento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const unattendEvent = async (eventId: string) => {
    try {
      await apiCall(`/events/${eventId}/unattend`, {
        method: "DELETE",
      });
      await fetchEvents(); // Refresh events to update registration status
      toast({
        title: "Éxito",
        description: "Has cancelado tu asistencia al evento",
      });
    } catch (error) {
      console.error("Error unattending event:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al cancelar asistencia",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAttendEvent = async (eventId: string) => {
    try {
      await attendEvent(eventId);
    } catch {
      // Error handling is done in the function
    }
  };

  const handleUnattendEvent = async (eventId: string) => {
    try {
      await unattendEvent(eventId);
    } catch {
      // Error handling is done in the function
    }
  };

  const openEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const filteredAllEvents = (Array.isArray(allEvents) ? allEvents : []).filter(
    (event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || event.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || event.category === categoryFilter;
      const matchesFeatured =
        featuredFilter === null ||
        (event.isFeatured || event.featured) === featuredFilter;
      const isPublished = event.status === "PUBLISHED";

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesFeatured &&
        isPublished
      );
    }
  );

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      IN_PERSON: { label: "Presencial", variant: "default" as const },
      VIRTUAL: { label: "Virtual", variant: "secondary" as const },
      HYBRID: { label: "Híbrido", variant: "outline" as const },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isRegistrationOpen = (event: Event) => {
    if (!event.registrationDeadline) return true;
    const deadline = new Date(event.registrationDeadline);
    const now = new Date();
    return now <= deadline;
  };

  const isEventFull = (event: Event) => {
    if (!event.maxCapacity) return false;
    const attendees = event.currentAttendees || event.attendeesCount || 0;
    return attendees >= event.maxCapacity;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Eventos</h1>
        <p className="text-muted-foreground">
          Descubre y participa en eventos increíbles
        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
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
              <label className="text-sm font-medium">Tipo</label>
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
              <label className="text-sm font-medium">Categoría</label>
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
              <label className="text-sm font-medium">Destacados</label>
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

      {/* Events List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAllEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.imageUrl && (
                <div className="aspect-video bg-muted">
                  <img
                    src={getImageUrl(event.imageUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {event.organizer}
                    </p>
                  </div>
                  {event.isFeatured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(event.date), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(event.type)}
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.currentAttendees || event.attendeesCount || 0}
                  </span>
                  {event.maxCapacity && <span>/ {event.maxCapacity}</span>}
                </div>
                {event.price && event.price > 0 && (
                  <div className="text-sm font-medium">
                    Precio: ${event.price}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEventDetail(event)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                  {event.isRegistered ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnattendEvent(event.id)}
                      disabled={!isRegistrationOpen(event)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAttendEvent(event.id)}
                      disabled={
                        !isRegistrationOpen(event) || isEventFull(event)
                      }
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isEventFull(event) ? "Lleno" : "Asistir"}
                    </Button>
                  )}
                </div>
                {!isRegistrationOpen(event) && (
                  <div className="text-xs text-red-500">Registro cerrado</div>
                )}
                {isEventFull(event) && !event.isRegistered && (
                  <div className="text-xs text-red-500">Evento lleno</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent?.title}
              {(selectedEvent?.isFeatured || selectedEvent?.featured) && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              {selectedEvent.imageUrl && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(selectedEvent.imageUrl)}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Fecha:</span>
                    <span>
                      {format(new Date(selectedEvent.date), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Horario:</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Ubicación:</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedEvent.type)}
                    <Badge variant="outline">{selectedEvent.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Asistentes:</span>
                    <span>
                      {selectedEvent.currentAttendees ||
                        selectedEvent.attendeesCount ||
                        0}
                    </span>
                    {selectedEvent.maxCapacity && (
                      <span>/ {selectedEvent.maxCapacity}</span>
                    )}
                  </div>
                  {selectedEvent.price && selectedEvent.price > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Precio:</span> $
                      {selectedEvent.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.requirements && (
                <div className="space-y-2">
                  <h4 className="font-medium">Requisitos</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.requirements}
                  </p>
                </div>
              )}

              {selectedEvent.agenda && (
                <div className="space-y-2">
                  <h4 className="font-medium">Agenda</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.agenda}
                  </p>
                </div>
              )}

              {selectedEvent.speakers && (
                <div className="space-y-2">
                  <h4 className="font-medium">Ponentes/Facilitadores</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.speakers}
                  </p>
                </div>
              )}

              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4">
                {selectedEvent.isRegistered ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleUnattendEvent(selectedEvent.id)}
                    disabled={!isRegistrationOpen(selectedEvent)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar Asistencia
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAttendEvent(selectedEvent.id)}
                    disabled={
                      !isRegistrationOpen(selectedEvent) ||
                      isEventFull(selectedEvent)
                    }
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isEventFull(selectedEvent)
                      ? "Evento Lleno"
                      : "Asistir al Evento"}
                  </Button>
                )}
              </div>

              {!isRegistrationOpen(selectedEvent) && (
                <div className="text-sm text-red-500 text-center">
                  El registro para este evento está cerrado
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
