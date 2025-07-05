"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  TrendingUp,
  Users,
  Rocket,
  BookOpen,
  Calculator,
  Network,
  Store,
  Search,
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  Play,
  FileText,
  Headphones,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "template" | "guide" | "video" | "podcast" | "tool";
  thumbnail: string;
  category: string;
  downloads: number;
  rating: number;
}

interface Program {
  id: string;
  name: string;
  description: string;
  organizer: string;
  type: "incubator" | "accelerator" | "grant" | "mentorship";
  duration: string;
  deadline: Date;
  location: string;
}

interface SuccessStory {
  id: string;
  entrepreneur: string;
  businessName: string;
  description: string;
  industry: string;
  location: string;
  image: string;
  revenue: string;
  employees: number;
}

export default function EntrepreneurshipPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEntrepreneurshipData();
  }, []);

  const fetchEntrepreneurshipData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockResources: Resource[] = [
        {
          id: "resource-1",
          title: "Plantilla de Plan de Negocios",
          description: "Plantilla completa en Word para crear tu plan de negocios paso a paso",
          type: "template",
          thumbnail: "/api/placeholder/300/200",
          category: "Planificación",
          downloads: 2847,
          rating: 4.8,
        },
        {
          id: "resource-2",
          title: "Cómo Validar tu Idea de Negocio",
          description: "Guía práctica para validar tu idea antes de invertir tiempo y dinero",
          type: "guide",
          thumbnail: "/api/placeholder/300/200",
          category: "Validación",
          downloads: 1923,
          rating: 4.6,
        },
        {
          id: "resource-3",
          title: "Finanzas para Emprendedores",
          description: "Video curso sobre gestión financiera básica para startups",
          type: "video",
          thumbnail: "/api/placeholder/300/200",
          category: "Finanzas",
          downloads: 3456,
          rating: 4.9,
        },
      ];

      const mockPrograms: Program[] = [
        {
          id: "program-1",
          name: "Aceleradora Municipal 2024",
          description: "Programa de aceleración para startups locales con mentoría y financiamiento",
          organizer: "Alcaldía de Cochabamba",
          type: "accelerator",
          duration: "6 meses",
          deadline: new Date("2024-04-15"),
          location: "Cochabamba",
        },
        {
          id: "program-2",
          name: "Fondo Jóvenes Emprendedores",
          description: "Grants de hasta $5000 USD para jóvenes emprendedores bolivianos",
          organizer: "Fundación Pro-Joven",
          type: "grant",
          duration: "12 meses",
          deadline: new Date("2024-03-30"),
          location: "Nacional",
        },
      ];

      const mockStories: SuccessStory[] = [
        {
          id: "story-1",
          entrepreneur: "María Gonzáles",
          businessName: "EcoTech Bolivia",
          description: "Startup de tecnología verde que desarrolla soluciones sostenibles para el agro",
          industry: "AgTech",
          location: "Santa Cruz",
          image: "/api/placeholder/300/300",
          revenue: "$50K USD/año",
          employees: 8,
        },
        {
          id: "story-2",
          entrepreneur: "Carlos Mamani",
          businessName: "Artesanías Digitales",
          description: "Plataforma que conecta artesanos locales con mercados internacionales",
          industry: "E-commerce",
          location: "La Paz",
          image: "/api/placeholder/300/300",
          revenue: "$30K USD/año",
          employees: 5,
        },
      ];

      setResources(mockResources);
      setPrograms(mockPrograms);
      setStories(mockStories);
    } catch (error) {
      console.error("Error fetching entrepreneurship data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "template":
        return <FileText className="h-5 w-5" />;
      case "guide":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <Play className="h-5 w-5" />;
      case "podcast":
        return <Headphones className="h-5 w-5" />;
      case "tool":
        return <Calculator className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type) {
      case "incubator":
        return "bg-blue-100 text-blue-800";
      case "accelerator":
        return "bg-green-100 text-green-800";
      case "grant":
        return "bg-purple-100 text-purple-800";
      case "mentorship":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Convierte tu Idea en Realidad
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Accede a herramientas, recursos y mentorías para lanzar tu
              emprendimiento exitoso en Bolivia
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Link href="/business-plan-simulator">
                  <Calculator className="h-5 w-5 mr-2" />
                  Crear Plan de Negocios
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
          <Rocket className="h-64 w-64 transform rotate-12" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/business-plan-simulator">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Simulador de Plan</h3>
              <p className="text-sm text-muted-foreground">
                Crea tu plan de negocios paso a paso
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/entrepreneurship/resources">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Centro de Recursos</h3>
              <p className="text-sm text-muted-foreground">
                Plantillas, guías y herramientas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/entrepreneurship/network">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Red de Contactos</h3>
              <p className="text-sm text-muted-foreground">
                Conecta con otros emprendedores
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mentorship">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Mentorías</h3>
              <p className="text-sm text-muted-foreground">
                Encuentra mentores expertos
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Recursos Destacados</TabsTrigger>
          <TabsTrigger value="programs">Programas Disponibles</TabsTrigger>
          <TabsTrigger value="stories">Historias de Éxito</TabsTrigger>
        </TabsList>

        {/* Featured Resources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recursos Más Populares</h2>
            <Button asChild variant="outline">
              <Link href="/entrepreneurship/resources">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="bg-white rounded-full p-2">
                      {getResourceIcon(resource.type)}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {resource.category}
                  </Badge>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </div>
                    <span>{resource.downloads.toLocaleString()} descargas</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Available Programs */}
        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Programas de Apoyo</h2>
            <Button asChild variant="outline">
              <Link href="/entrepreneurship/directory">
                Ver Directorio Completo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {program.name}
                        </h3>
                        <Badge className={getProgramTypeColor(program.type)}>
                          {program.type === "accelerator"
                            ? "Aceleradora"
                            : program.type === "incubator"
                              ? "Incubadora"
                              : program.type === "grant"
                                ? "Fondo"
                                : "Mentoría"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Duración: {program.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {program.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Cierra:</p>
                      <p className="font-semibold">
                        {program.deadline.toLocaleDateString()}
                      </p>
                      <Button className="mt-3" size="sm">
                        Aplicar Ahora
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Organizado por:{" "}
                    <span className="font-medium">{program.organizer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Success Stories */}
        <TabsContent value="stories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Historias de Éxito Locales</h2>
            <Button asChild variant="outline">
              <Link href="/entrepreneurship/network">
                Conectar con Emprendedores
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                    <Store className="h-16 w-16 text-green-600" />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{story.industry}</Badge>
                      <Badge variant="secondary">{story.location}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">
                      {story.businessName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      por {story.entrepreneur}
                    </p>
                    <p className="text-sm mb-3">{story.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Ingresos: {story.revenue}</span>
                      <span>{story.employees} empleados</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para Emprender?</h2>
          <p className="text-lg mb-6 opacity-90">
            Accede a recursos exclusivos y conecta con la comunidad emprendedora
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <Link href="/entrepreneurship/resources">
              <BookOpen className="h-5 w-5 mr-2" />
              Explorar Recursos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
