"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  Plus,
  UserPlus,
  Filter,
  Heart,
  Share2,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Entrepreneur {
  id: string;
  name: string;
  avatar: string;
  businessName: string;
  category: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  connections: number;
  isOnline: boolean;
  lastActive: Date;
  lookingFor: string[];
  offering: string[];
}

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
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  tags: string[];
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    businessName: string;
  };
  category: string;
  replies: number;
  views: number;
  likes: number;
  createdAt: Date;
  tags: string[];
  isSticky: boolean;
}

export default function NetworkingPage() {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("entrepreneurs");

  useEffect(() => {
    fetchNetworkingData();
  }, []);

  const fetchNetworkingData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockEntrepreneurs: Entrepreneur[] = [
        {
          id: "ent-1",
          name: "María González",
          avatar: "/api/placeholder/100/100",
          businessName: "EcoTech Bolivia",
          category: "AgTech",
          location: "Santa Cruz",
          bio: "Ingeniera en sistemas especializada en soluciones tecnológicas para el agro. Busco colaboraciones en proyectos de sostenibilidad.",
          skills: ["Desarrollo de Software", "IoT", "Agricultura Digital"],
          interests: ["Sostenibilidad", "Tecnología Verde", "Innovación Rural"],
          experience: "5 años",
          rating: 4.9,
          reviewCount: 47,
          connections: 234,
          isOnline: true,
          lastActive: new Date(),
          lookingFor: ["Inversionistas", "Socios Técnicos", "Mentores"],
          offering: [
            "Consultoría AgTech",
            "Desarrollo de Prototipos",
            "Capacitación",
          ],
        },
        {
          id: "ent-2",
          name: "Carlos Mamani",
          avatar: "/api/placeholder/100/100",
          businessName: "Artesanías Digitales",
          category: "E-commerce",
          location: "La Paz",
          bio: "Emprendedor social enfocado en digitalizar el comercio de artesanías bolivianas y conectar artesanos con mercados globales.",
          skills: ["Marketing Digital", "E-commerce", "Fotografía"],
          interests: [
            "Comercio Justo",
            "Cultura Boliviana",
            "Emprendimiento Social",
          ],
          experience: "3 años",
          rating: 4.7,
          reviewCount: 31,
          connections: 189,
          isOnline: false,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          lookingFor: [
            "Artesanos",
            "Mercados Internacionales",
            "Financiamiento",
          ],
          offering: [
            "Marketing Digital",
            "Fotografía de Producto",
            "Asesoría E-commerce",
          ],
        },
        {
          id: "ent-3",
          name: "Ana Gutiérrez",
          avatar: "/api/placeholder/100/100",
          businessName: "FoodTech Express",
          category: "FoodTech",
          location: "Cochabamba",
          bio: "CEO y fundadora de startup de delivery de comida casera. Experta en logística y operaciones de delivery urbano.",
          skills: ["Operaciones", "Logística", "Desarrollo de Apps"],
          interests: [
            "Gastronomía Local",
            "Logística Urbana",
            "Tecnología Móvil",
          ],
          experience: "4 años",
          rating: 4.8,
          reviewCount: 56,
          connections: 312,
          isOnline: true,
          lastActive: new Date(),
          lookingFor: ["Inversionistas Serie A", "CTO", "Expansión Regional"],
          offering: [
            "Mentoría en Operaciones",
            "Consultoría Logística",
            "Networking",
          ],
        },
      ];

      const mockEvents: NetworkingEvent[] = [
        {
          id: "event-1",
          title: "Startup Pitch Night Cochabamba",
          description:
            "Noche de pitches para startups emergentes. Oportunidad de presentar tu idea ante inversionistas y mentores.",
          date: new Date("2024-03-15"),
          time: "19:00 - 22:00",
          location: "Centro de Convenciones Cochabamba",
          type: "presencial",
          category: "Pitch",
          organizer: "Startup Hub Bolivia",
          attendees: 67,
          maxAttendees: 100,
          price: 0,
          image: "/api/placeholder/400/200",
          tags: ["Pitch", "Inversión", "Networking"],
        },
        {
          id: "event-2",
          title: "Workshop: Marketing Digital para Emprendedores",
          description:
            "Aprende estrategias efectivas de marketing digital para hacer crecer tu emprendimiento.",
          date: new Date("2024-03-20"),
          time: "14:00 - 17:00",
          location: "Online - Zoom",
          type: "virtual",
          category: "Workshop",
          organizer: "Digital Entrepreneurs BO",
          attendees: 134,
          maxAttendees: 200,
          price: 50,
          image: "/api/placeholder/400/200",
          tags: ["Marketing", "Digital", "Capacitación"],
        },
        {
          id: "event-3",
          title: "Feria de Emprendimientos Sostenibles",
          description:
            "Exposición de emprendimientos con enfoque en sostenibilidad y responsabilidad social.",
          date: new Date("2024-03-25"),
          time: "09:00 - 18:00",
          location: "Plaza Murillo, La Paz",
          type: "presencial",
          category: "Feria",
          organizer: "EcoEmprende Bolivia",
          attendees: 89,
          maxAttendees: 150,
          price: 0,
          image: "/api/placeholder/400/200",
          tags: ["Sostenibilidad", "Expo", "Verde"],
        },
      ];

      const mockDiscussions: Discussion[] = [
        {
          id: "disc-1",
          title: "¿Cómo conseguir financiamiento para startups en Bolivia?",
          content:
            "Hola emprendedores! Estoy buscando consejos sobre las mejores formas de conseguir financiamiento para mi startup de AgTech...",
          author: {
            name: "María González",
            avatar: "/api/placeholder/50/50",
            businessName: "EcoTech Bolivia",
          },
          category: "Financiamiento",
          replies: 23,
          views: 456,
          likes: 78,
          createdAt: new Date("2024-02-20"),
          tags: ["Financiamiento", "Startups", "Inversión"],
          isSticky: true,
        },
        {
          id: "disc-2",
          title: "Experiencias con marketplaces internacionales",
          content:
            "¿Alguien ha tenido experiencia vendiendo en Amazon, eBay o Etsy desde Bolivia? Me gustaría conocer sus experiencias...",
          author: {
            name: "Carlos Mamani",
            avatar: "/api/placeholder/50/50",
            businessName: "Artesanías Digitales",
          },
          category: "E-commerce",
          replies: 15,
          views: 289,
          likes: 34,
          createdAt: new Date("2024-02-18"),
          tags: ["E-commerce", "Internacional", "Marketplaces"],
          isSticky: false,
        },
        {
          id: "disc-3",
          title: "Herramientas gratuitas para gestionar emprendimientos",
          content:
            "Comparto una lista de herramientas gratuitas que uso para gestionar mi startup de delivery...",
          author: {
            name: "Ana Gutiérrez",
            avatar: "/api/placeholder/50/50",
            businessName: "FoodTech Express",
          },
          category: "Herramientas",
          replies: 42,
          views: 678,
          likes: 156,
          createdAt: new Date("2024-02-15"),
          tags: ["Herramientas", "Productividad", "Gestión"],
          isSticky: false,
        },
      ];

      setEntrepreneurs(mockEntrepreneurs);
      setEvents(mockEvents);
      setDiscussions(mockDiscussions);
    } catch (error) {
      console.error("Error fetching networking data:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Red de Emprendedores</h1>
        <p className="text-muted-foreground">
          Conecta, colabora y crece junto a otros emprendedores bolivianos
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entrepreneurs">Emprendedores</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="discussions">Discusiones</TabsTrigger>
        </TabsList>

        {/* Entrepreneurs Tab */}
        <TabsContent value="entrepreneurs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar emprendedores por nombre, negocio o habilidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button asChild>
                <Link href="/profile">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Completar mi Perfil
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrepreneurs.map((entrepreneur) => (
              <Card
                key={entrepreneur.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={entrepreneur.avatar}
                          alt={entrepreneur.name}
                        />
                        <AvatarFallback>
                          {entrepreneur.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {entrepreneur.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{entrepreneur.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {entrepreneur.businessName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {entrepreneur.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{entrepreneur.category}</Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {entrepreneur.rating}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {entrepreneur.bio}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Habilidades
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entrepreneur.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Busca
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entrepreneur.lookingFor.slice(0, 2).map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      {entrepreneur.connections} conexiones
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Disponible para networking
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Próximos Eventos</h2>
            <Button asChild>
              <Link href="/entrepreneurship/create-event">
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-16 w-16 text-blue-600" />
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {event.title}
                          </h3>
                          <Badge
                            variant={
                              event.type === "virtual"
                                ? "secondary"
                                : event.type === "presencial"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {event.type === "virtual"
                              ? "Virtual"
                              : event.type === "presencial"
                                ? "Presencial"
                                : "Híbrido"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-2">
                          {event.price === 0
                            ? "Gratuito"
                            : `Bs. ${event.price}`}
                        </div>
                        <Button>Registrarse</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Organizado por: {event.organizer}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Discusiones de la Comunidad
            </h2>
            <Button asChild>
              <Link href="/entrepreneurship/create-discussion">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Discusión
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={
                  discussion.isSticky ? "border-blue-200 bg-blue-50/50" : ""
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={discussion.author.avatar}
                        alt={discussion.author.name}
                      />
                      <AvatarFallback>
                        {discussion.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.isSticky && (
                          <Badge variant="secondary" className="text-xs">
                            Fijado
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg">
                          {discussion.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{discussion.author.name}</span>
                        <span>•</span>
                        <span>{discussion.author.businessName}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                        <span>•</span>
                        <span>{discussion.createdAt.toLocaleDateString()}</span>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {discussion.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {discussion.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {discussion.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {discussion.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {discussion.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
