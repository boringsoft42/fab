&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import {
  Calendar,
  Clock,
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
} from &ldquo;lucide-react&rdquo;;

interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: &ldquo;virtual&rdquo; | &ldquo;presencial&rdquo; | &ldquo;hybrid&rdquo;;
  category: string;
  organizer: string;
  organizerId: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  tags: string[];
  status: &ldquo;published&rdquo; | &ldquo;draft&rdquo; | &ldquo;cancelled&rdquo;;
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
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [selectedType, setSelectedType] = useState(&ldquo;all&rdquo;);
  const [selectedCategory, setSelectedCategory] = useState(&ldquo;all&rdquo;);
  const [selectedStatus, setSelectedStatus] = useState(&ldquo;all&rdquo;);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for creating/editing events
  const [formData, setFormData] = useState({
    title: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    date: &ldquo;&rdquo;,
    time: &ldquo;&rdquo;,
    location: &ldquo;&rdquo;,
    type: &ldquo;presencial&rdquo; as const,
    category: &ldquo;Networking&rdquo;,
    organizer: &ldquo;&rdquo;,
    maxAttendees: 50,
    price: 0,
    image: &ldquo;&rdquo;,
    tags: &ldquo;&rdquo;,
    featured: false,
    status: &ldquo;draft&rdquo; as const,
    registrationDeadline: &ldquo;&rdquo;,
    requirements: &ldquo;&rdquo;,
    agenda: &ldquo;&rdquo;,
    speakers: &ldquo;&rdquo;,
  });

  useEffect(() => {
    fetchEvents();
  }, [
    searchQuery,
    selectedType,
    selectedCategory,
    selectedStatus,
    fetchEvents,
  ]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (searchQuery) params.append(&ldquo;search&rdquo;, searchQuery);
      if (selectedType !== &ldquo;all&rdquo;) params.append(&ldquo;type&rdquo;, selectedType);
      if (selectedCategory !== &ldquo;all&rdquo;)
        params.append(&ldquo;category&rdquo;, selectedCategory);
      if (selectedStatus !== &ldquo;all&rdquo;) params.append(&ldquo;status&rdquo;, selectedStatus);

      const response = await fetch(
        `/api/admin/entrepreneurship/events?${params}`
      );
      const data = await response.json();

      setEvents(data.events);
      setStats(data.stats);
    } catch (error) {
      console.error(&ldquo;Error fetching events:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch(&ldquo;/api/admin/entrepreneurship/events&rdquo;, {
        method: &ldquo;POST&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(&ldquo;,&rdquo;).map((tag) => tag.trim()),
          requirements: formData.requirements
            .split(&ldquo;\n&rdquo;)
            .filter((req) => req.trim()),
          agenda: formData.agenda
            .split(&ldquo;\n&rdquo;)
            .map((line) => {
              const [time, activity] = line.split(&ldquo; - &rdquo;);
              return { time: time?.trim(), activity: activity?.trim() };
            })
            .filter((item) => item.time && item.activity),
          speakers: formData.speakers
            .split(&ldquo;\n&rdquo;)
            .map((line) => {
              const [name, role] = line.split(&ldquo; - &rdquo;);
              return { name: name?.trim(), role: role?.trim() };
            })
            .filter((speaker) => speaker.name && speaker.role),
        }),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setFormData({
          title: &ldquo;&rdquo;,
          description: &ldquo;&rdquo;,
          date: &ldquo;&rdquo;,
          time: &ldquo;&rdquo;,
          location: &ldquo;&rdquo;,
          type: &ldquo;presencial&rdquo;,
          category: &ldquo;Networking&rdquo;,
          organizer: &ldquo;&rdquo;,
          maxAttendees: 50,
          price: 0,
          image: &ldquo;&rdquo;,
          tags: &ldquo;&rdquo;,
          featured: false,
          status: &ldquo;draft&rdquo;,
          registrationDeadline: &ldquo;&rdquo;,
          requirements: &ldquo;&rdquo;,
          agenda: &ldquo;&rdquo;,
          speakers: &ldquo;&rdquo;,
        });
        fetchEvents();
      }
    } catch (error) {
      console.error(&ldquo;Error creating event:&rdquo;, error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case &ldquo;virtual&rdquo;:
        return <Monitor className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;presencial&rdquo;:
        return <Building className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;hybrid&rdquo;:
        return <Video className=&ldquo;h-4 w-4&rdquo; />;
      default:
        return <Calendar className=&ldquo;h-4 w-4&rdquo; />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case &ldquo;virtual&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;presencial&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;hybrid&rdquo;:
        return &ldquo;bg-purple-100 text-purple-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;published&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;draft&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;cancelled&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const categories = [
    &ldquo;Networking&rdquo;,
    &ldquo;Pitch&rdquo;,
    &ldquo;Workshop&rdquo;,
    &ldquo;Feria&rdquo;,
    &ldquo;Conferencia&rdquo;,
    &ldquo;Panel&rdquo;,
  ];

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-32 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(4)].map((_, i) => (
              <div key={i} className=&ldquo;h-24 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Gestión de Eventos</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Administra eventos de networking y capacitación
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
            </DialogHeader>
            <div className=&ldquo;space-y-4 p-1&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;title&rdquo;>Título *</Label>
                  <Input
                    id=&ldquo;title&rdquo;
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder=&ldquo;Título del evento&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;organizer&rdquo;>Organizador *</Label>
                  <Input
                    id=&ldquo;organizer&rdquo;
                    value={formData.organizer}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organizer: e.target.value,
                      }))
                    }
                    placeholder=&ldquo;Nombre del organizador&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;description&rdquo;>Descripción *</Label>
                <Textarea
                  id=&ldquo;description&rdquo;
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;Descripción detallada del evento&rdquo;
                  rows={3}
                />
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;date&rdquo;>Fecha *</Label>
                  <Input
                    id=&ldquo;date&rdquo;
                    type=&ldquo;date&rdquo;
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;time&rdquo;>Horario *</Label>
                  <Input
                    id=&ldquo;time&rdquo;
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                    placeholder=&ldquo;ej: 14:00 - 17:00&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;registrationDeadline&rdquo;>
                    Fecha límite registro
                  </Label>
                  <Input
                    id=&ldquo;registrationDeadline&rdquo;
                    type=&ldquo;date&rdquo;
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

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;type&rdquo;>Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: &ldquo;virtual&rdquo; | &ldquo;presencial&rdquo; | &ldquo;hybrid&rdquo;
                    ) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;presencial&rdquo;>Presencial</SelectItem>
                      <SelectItem value=&ldquo;virtual&rdquo;>Virtual</SelectItem>
                      <SelectItem value=&ldquo;hybrid&rdquo;>Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;category&rdquo;>Categoría *</Label>
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

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;location&rdquo;>Ubicación *</Label>
                <Input
                  id=&ldquo;location&rdquo;
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;Dirección física o link de videoconferencia&rdquo;
                />
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;maxAttendees&rdquo;>Capacidad máxima</Label>
                  <Input
                    id=&ldquo;maxAttendees&rdquo;
                    type=&ldquo;number&rdquo;
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxAttendees: parseInt(e.target.value) || 0,
                      }))
                    }
                    min=&ldquo;1&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;price&rdquo;>Precio (Bs.)</Label>
                  <Input
                    id=&ldquo;price&rdquo;
                    type=&ldquo;number&rdquo;
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    min=&ldquo;0&rdquo;
                    step=&ldquo;0.01&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;status&rdquo;>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: &ldquo;published&rdquo; | &ldquo;draft&rdquo; | &ldquo;cancelled&rdquo;
                    ) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;draft&rdquo;>Borrador</SelectItem>
                      <SelectItem value=&ldquo;published&rdquo;>Publicado</SelectItem>
                      <SelectItem value=&ldquo;cancelled&rdquo;>Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;image&rdquo;>URL de Imagen</Label>
                <Input
                  id=&ldquo;image&rdquo;
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder=&ldquo;URL de la imagen del evento&rdquo;
                />
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;tags&rdquo;>Etiquetas</Label>
                <Input
                  id=&ldquo;tags&rdquo;
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder=&ldquo;etiqueta1, etiqueta2, etiqueta3&rdquo;
                />
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  Separar con comas
                </p>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;requirements&rdquo;>Requisitos</Label>
                <Textarea
                  id=&ldquo;requirements&rdquo;
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requirements: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;Un requisito por línea&rdquo;
                  rows={3}
                />
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;agenda&rdquo;>Agenda</Label>
                <Textarea
                  id=&ldquo;agenda&rdquo;
                  value={formData.agenda}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, agenda: e.target.value }))
                  }
                  placeholder=&ldquo;09:00 - Registro y bienvenida&#10;10:00 - Presentación principal&#10;11:30 - Coffee break&rdquo;
                  rows={4}
                />
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  Formato: HH:MM - Actividad (una por línea)
                </p>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;speakers&rdquo;>Ponentes/Facilitadores</Label>
                <Textarea
                  id=&ldquo;speakers&rdquo;
                  value={formData.speakers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      speakers: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;Dr. Roberto Silva - Inversionista Ángel&#10;María González - Mentora Startup&rdquo;
                  rows={3}
                />
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  Formato: Nombre - Cargo (uno por línea)
                </p>
              </div>

              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <Checkbox
                  id=&ldquo;featured&rdquo;
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: !!checked }))
                  }
                />
                <Label htmlFor=&ldquo;featured&rdquo;>Evento destacado</Label>
              </div>

              <div className=&ldquo;flex justify-end space-x-2 pt-4&rdquo;>
                <Button
                  variant=&ldquo;outline&rdquo;
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
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-6 gap-4&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Total Eventos
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</p>
              </div>
              <Calendar className=&ldquo;h-8 w-8 text-blue-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Próximos
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.upcoming}</p>
              </div>
              <CalendarDays className=&ldquo;h-8 w-8 text-green-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Total Asistentes
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalAttendees}</p>
              </div>
              <Users className=&ldquo;h-8 w-8 text-purple-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  % Asistencia
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>
                  {(stats.averageAttendance * 100).toFixed(0)}%
                </p>
              </div>
              <UserCheck className=&ldquo;h-8 w-8 text-orange-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Publicados
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.byStatus.published}</p>
              </div>
              <TrendingUp className=&ldquo;h-8 w-8 text-teal-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Destacados
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.featured}</p>
              </div>
              <Award className=&ldquo;h-8 w-8 text-yellow-600&rdquo; />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className=&ldquo;p-6&rdquo;>
          <div className=&ldquo;flex flex-col md:flex-row gap-4&rdquo;>
            <div className=&ldquo;relative flex-1&rdquo;>
              <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
              <Input
                placeholder=&ldquo;Buscar eventos por título, organizador o etiquetas...&rdquo;
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=&ldquo;pl-10&rdquo;
              />
            </div>
            <div className=&ldquo;flex gap-2&rdquo;>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className=&ldquo;w-[130px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Tipo&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                  <SelectItem value=&ldquo;virtual&rdquo;>Virtual</SelectItem>
                  <SelectItem value=&ldquo;presencial&rdquo;>Presencial</SelectItem>
                  <SelectItem value=&ldquo;hybrid&rdquo;>Híbrido</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className=&ldquo;w-[130px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Categoría&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className=&ldquo;w-[120px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Estado&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                  <SelectItem value=&ldquo;published&rdquo;>Publicados</SelectItem>
                  <SelectItem value=&ldquo;draft&rdquo;>Borradores</SelectItem>
                  <SelectItem value=&ldquo;cancelled&rdquo;>Cancelados</SelectItem>
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
                    <div className=&ldquo;flex items-center gap-3&rdquo;>
                      <div className=&ldquo;w-12 h-12 bg-gray-100 rounded flex items-center justify-center&rdquo;>
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <p className=&ldquo;font-medium&rdquo;>{event.title}</p>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
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
                      <p className=&ldquo;font-medium&rdquo;>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        {event.time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Users className=&ldquo;h-3 w-3&rdquo; />
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
                      <Award className=&ldquo;h-4 w-4 text-orange-600&rdquo; />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                          <MoreVertical className=&ldquo;h-4 w-4&rdquo; />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align=&ldquo;end&rdquo;>
                        <DropdownMenuItem>
                          <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Ver Asistentes
                        </DropdownMenuItem>
                        <DropdownMenuItem className=&ldquo;text-red-600&rdquo;>
                          <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
            <div className=&ldquo;text-center py-8&rdquo;>
              <Calendar className=&ldquo;h-12 w-12 mx-auto text-muted-foreground mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                No se encontraron eventos
              </h3>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Intenta ajustar los filtros o crear nuevos eventos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
