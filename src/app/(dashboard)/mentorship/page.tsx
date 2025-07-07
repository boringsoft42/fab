"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Users,
  MessageCircle,
  Calendar,
  Star,
  Clock,
  Video,
  Trophy,
  BookOpen,
  Target,
  CheckCircle,
  Plus,
  Filter,
  Award,
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  mentees: number;
  responseTime: string;
  languages: string[];
  price: {
    type: "free" | "paid";
    amount?: number;
  };
  availability: {
    timezone: string;
    schedule: string;
  };
  achievements: string[];
  isVerified: boolean;
  isOnline: boolean;
}

interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  date: Date;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  topic: string;
  type: "video" | "chat" | "presencial";
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface MentorshipProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  participants: number;
  maxParticipants: number;
  price: number;
  startDate: Date;
  topics: string[];
  objectives: string[];
}

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpertise, setFilterExpertise] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [activeTab, setActiveTab] = useState("mentors");

  useEffect(() => {
    fetchMentorshipData();
  }, []);

  const fetchMentorshipData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockMentors: Mentor[] = [
        {
          id: "mentor-1",
          name: "Dr. Roberto Silva",
          avatar: "/api/placeholder/100/100",
          title: "CEO & Fundador",
          company: "TechBolivia",
          location: "La Paz, Bolivia",
          bio: "Emprendedor serial con más de 15 años de experiencia en tecnología. He fundado 3 startups exitosas y actualmente mentor jóvenes emprendedores.",
          expertise: [
            "Tecnología",
            "Startups",
            "Liderazgo",
            "Estrategia de Negocio",
          ],
          experience: "15+ años",
          rating: 4.9,
          reviewCount: 89,
          mentees: 156,
          responseTime: "2 horas",
          languages: ["Español", "Inglés"],
          price: { type: "free" },
          availability: {
            timezone: "GMT-4",
            schedule: "Lunes a Viernes 14:00-18:00",
          },
          achievements: [
            "Fundador Exitoso",
            "Mentor del Año 2023",
            "Experto en AI",
          ],
          isVerified: true,
          isOnline: true,
        },
        {
          id: "mentor-2",
          name: "Lic. Carmen Rodriguez",
          avatar: "/api/placeholder/100/100",
          title: "Directora de Marketing",
          company: "Grupo Boliviano",
          location: "Santa Cruz, Bolivia",
          bio: "Especialista en marketing digital y desarrollo de marcas. He ayudado a más de 100 emprendimientos a posicionarse en el mercado.",
          expertise: [
            "Marketing Digital",
            "Branding",
            "Redes Sociales",
            "Ventas",
          ],
          experience: "12+ años",
          rating: 4.8,
          reviewCount: 67,
          mentees: 98,
          responseTime: "4 horas",
          languages: ["Español", "Portugués"],
          price: { type: "paid", amount: 150 },
          availability: {
            timezone: "GMT-4",
            schedule: "Martes y Jueves 16:00-20:00",
          },
          achievements: [
            "Top Marketer 2022",
            "Certificación Google",
            "Especialista en Growth",
          ],
          isVerified: true,
          isOnline: false,
        },
        {
          id: "mentor-3",
          name: "Ing. Luis Mamani",
          avatar: "/api/placeholder/100/100",
          title: "Consultor Financiero",
          company: "FinanzasPro",
          location: "Cochabamba, Bolivia",
          bio: "Contador público y consultor financiero especializado en startups. Ayudo a emprendedores a estructurar sus finanzas y conseguir inversión.",
          expertise: [
            "Finanzas",
            "Contabilidad",
            "Inversión",
            "Planificación Financiera",
          ],
          experience: "10+ años",
          rating: 4.7,
          reviewCount: 43,
          mentees: 72,
          responseTime: "6 horas",
          languages: ["Español", "Inglés"],
          price: { type: "paid", amount: 100 },
          availability: {
            timezone: "GMT-4",
            schedule: "Miércoles a Viernes 10:00-14:00",
          },
          achievements: [
            "CPA Certificado",
            "Especialista en Startups",
            "Mentor Fundación Emprende",
          ],
          isVerified: true,
          isOnline: true,
        },
      ];

      const mockSessions: MentorshipSession[] = [
        {
          id: "session-1",
          mentorId: "mentor-1",
          mentorName: "Dr. Roberto Silva",
          mentorAvatar: "/api/placeholder/50/50",
          date: new Date("2024-03-15T15:00:00"),
          duration: 60,
          status: "scheduled",
          topic: "Estrategia de Crecimiento para Startup",
          type: "video",
        },
        {
          id: "session-2",
          mentorId: "mentor-2",
          mentorName: "Lic. Carmen Rodriguez",
          mentorAvatar: "/api/placeholder/50/50",
          date: new Date("2024-02-28T16:30:00"),
          duration: 45,
          status: "completed",
          topic: "Plan de Marketing Digital",
          type: "video",
          feedback: {
            rating: 5,
            comment:
              "Excelente sesión, muy práctica y útil para mi emprendimiento.",
          },
        },
      ];

      const mockPrograms: MentorshipProgram[] = [
        {
          id: "program-1",
          title: "Acelerador de Startups Tecnológicas",
          description:
            "Programa intensivo de 8 semanas para acelerar el crecimiento de startups tecnológicas. Incluye mentoría personalizada, workshops y networking.",
          duration: "8 semanas",
          level: "intermediate",
          mentorId: "mentor-1",
          mentorName: "Dr. Roberto Silva",
          mentorAvatar: "/api/placeholder/50/50",
          participants: 12,
          maxParticipants: 15,
          price: 0,
          startDate: new Date("2024-04-01"),
          topics: [
            "Modelo de Negocio",
            "Tecnología",
            "Fundraising",
            "Escalabilidad",
          ],
          objectives: [
            "Definir propuesta de valor única",
            "Desarrollar MVP funcional",
            "Preparar pitch para inversionistas",
            "Establecer métricas clave",
          ],
        },
        {
          id: "program-2",
          title: "Marketing Digital para Emprendedores",
          description:
            "Aprende a crear y ejecutar estrategias de marketing digital efectivas para hacer crecer tu emprendimiento.",
          duration: "6 semanas",
          level: "beginner",
          mentorId: "mentor-2",
          mentorName: "Lic. Carmen Rodriguez",
          mentorAvatar: "/api/placeholder/50/50",
          participants: 8,
          maxParticipants: 20,
          price: 0,
          startDate: new Date("2024-03-20"),
          topics: [
            "Estrategia Digital",
            "Redes Sociales",
            "Content Marketing",
            "Analytics",
          ],
          objectives: [
            "Crear plan de marketing digital",
            "Dominar redes sociales principales",
            "Medir ROI de campañas",
            "Automatizar procesos de marketing",
          ],
        },
      ];

      setMentors(mockMentors);
      setSessions(mockSessions);
      setPrograms(mockPrograms);
    } catch (error) {
      console.error("Error fetching mentorship data:", error);
    } finally {
      setLoading(false);
    }
  };

  const expertiseAreas = [
    "Tecnología",
    "Marketing Digital",
    "Finanzas",
    "Liderazgo",
    "Ventas",
    "Operaciones",
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpertise =
      filterExpertise === "all" || mentor.expertise.includes(filterExpertise);
    const matchesPrice =
      filterPrice === "all" ||
      (filterPrice === "free" && mentor.price.type === "free") ||
      (filterPrice === "paid" && mentor.price.type === "paid");

    return matchesSearch && matchesExpertise && matchesPrice;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plataforma de Mentorías</h1>
        <p className="text-muted-foreground">
          Conecta con mentores expertos y acelera el crecimiento de tu
          emprendimiento
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mentors">Mentores</TabsTrigger>
          <TabsTrigger value="programs">Programas</TabsTrigger>
          <TabsTrigger value="become-mentor">Ser Mentor</TabsTrigger>
        </TabsList>

        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mentores por nombre, expertise o empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterExpertise} onValueChange={setFilterExpertise}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Área de expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {expertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="paid">De pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {mentor.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                      {mentor.isVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mentor.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mentor.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {mentor.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({mentor.reviewCount})
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {mentor.mentees} mentees
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <Badge
                            key={exp}
                            variant="secondary"
                            className="text-xs"
                          >
                            {exp}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Responde en:{" "}
                        </span>
                        <span className="font-medium">
                          {mentor.responseTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Tiempo de respuesta:{" "}
                        </span>
                        <span className="font-medium">
                          {mentor.responseTime}
                        </span>
                      </div>

                      {/* <div className="font-semibold">
                        {mentor.price.type === "free" ? (
                          <span className="text-green-600">Gratuito</span>
                        ) : (
                          <span>Bs. {mentor.price.amount}/hora</span>
                        )}
                      </div> */}
                    </div>

                    {mentor.achievements.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Logros
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.achievements
                            .slice(0, 2)
                            .map((achievement) => (
                              <Badge
                                key={achievement}
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700"
                              >
                                <Award className="h-2 w-2 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Mensaje
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Agendar
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mis Sesiones de Mentoría</h2>
            <Button asChild>
              <Link href="#mentors" onClick={() => setActiveTab("mentors")}>
                <Plus className="h-4 w-4 mr-2" />
                Agendar Nueva Sesión
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={session.mentorAvatar}
                          alt={session.mentorName}
                        />
                        <AvatarFallback>
                          {session.mentorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{session.topic}</h3>
                        <p className="text-sm text-muted-foreground">
                          Mentor: {session.mentorName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {session.date.toLocaleDateString()} -{" "}
                          {session.date.toLocaleTimeString()}
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          {session.duration} minutos
                          <span>•</span>
                          <Video className="h-3 w-3" />
                          {session.type === "video"
                            ? "Video llamada"
                            : session.type === "chat"
                              ? "Chat"
                              : "Presencial"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          session.status === "scheduled"
                            ? "default"
                            : session.status === "completed"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {session.status === "scheduled"
                          ? "Programada"
                          : session.status === "completed"
                            ? "Completada"
                            : "Cancelada"}
                      </Badge>

                      {session.status === "scheduled" && (
                        <Button size="sm">
                          <Video className="h-3 w-3 mr-1" />
                          Unirse
                        </Button>
                      )}

                      {session.status === "completed" && session.feedback && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {session.feedback.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {session.feedback && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Mi feedback:</strong> {session.feedback.comment}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Programas de Mentoría Grupal
            </h2>
          </div>

          <div className="space-y-6">
            {programs.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {program.title}
                        </h3>
                        <Badge variant="outline">
                          {program.level === "beginner"
                            ? "Principiante"
                            : program.level === "intermediate"
                              ? "Intermedio"
                              : "Avanzado"}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {program.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={program.mentorAvatar}
                            alt={program.mentorName}
                          />
                          <AvatarFallback>
                            {program.mentorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {program.mentorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mentor principal
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">
                        Bs. {program.price}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {program.duration}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Inicia: {program.startDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Temas que se cubren:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Objetivos del programa:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {program.objectives
                          .slice(0, 3)
                          .map((objective, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {program.participants}/{program.maxParticipants}{" "}
                        participantes
                      </div>
                      <Progress
                        value={
                          (program.participants / program.maxParticipants) * 100
                        }
                        className="w-24 h-2"
                      />
                    </div>

                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Inscribirse al Programa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Become Mentor Tab */}
        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Conviértete en Mentor</CardTitle>
              <p className="text-muted-foreground">
                Comparte tu experiencia y ayuda a la próxima generación de
                emprendedores
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Impacto Real</h3>
                    <p className="text-sm text-muted-foreground">
                      Ayuda a emprendedores jóvenes a superar desafíos y
                      alcanzar sus metas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Reconocimiento</h3>
                    <p className="text-sm text-muted-foreground">
                      Gana reconocimiento como líder en tu industria y expande
                      tu red
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Flexibilidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Define tu horario, tarifas y el tipo de mentoría que
                      quieres ofrecer
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Requisitos para ser mentor:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Mínimo 3 años de experiencia en tu área
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Experiencia como emprendedor o en liderazgo
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Pasión por ayudar a otros emprendedores
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Compromiso de al menos 2 horas por semana
                    </span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button size="lg" className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Aplicar para ser Mentor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
