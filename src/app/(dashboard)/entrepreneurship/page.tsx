&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

interface Resource {
  id: string;
  title: string;
  description: string;
  type: &ldquo;template&rdquo; | &ldquo;guide&rdquo; | &ldquo;video&rdquo; | &ldquo;podcast&rdquo; | &ldquo;tool&rdquo;;
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
  type: &ldquo;incubator&rdquo; | &ldquo;accelerator&rdquo; | &ldquo;grant&rdquo; | &ldquo;mentorship&rdquo;;
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
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);

  useEffect(() => {
    fetchEntrepreneurshipData();
  }, []);

  const fetchEntrepreneurshipData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockResources: Resource[] = [
        {
          id: &ldquo;resource-1&rdquo;,
          title: &ldquo;Plantilla de Plan de Negocios&rdquo;,
          description:
            &ldquo;Plantilla completa en Word para crear tu plan de negocios paso a paso&rdquo;,
          type: &ldquo;template&rdquo;,
          thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
          category: &ldquo;Planificación&rdquo;,
          downloads: 2847,
          rating: 4.8,
        },
        {
          id: &ldquo;resource-2&rdquo;,
          title: &ldquo;Cómo Validar tu Idea de Negocio&rdquo;,
          description:
            &ldquo;Guía práctica para validar tu idea antes de invertir tiempo y dinero&rdquo;,
          type: &ldquo;guide&rdquo;,
          thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
          category: &ldquo;Validación&rdquo;,
          downloads: 1923,
          rating: 4.6,
        },
        {
          id: &ldquo;resource-3&rdquo;,
          title: &ldquo;Finanzas para Emprendedores&rdquo;,
          description:
            &ldquo;Video curso sobre gestión financiera básica para startups&rdquo;,
          type: &ldquo;video&rdquo;,
          thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
          category: &ldquo;Finanzas&rdquo;,
          downloads: 3456,
          rating: 4.9,
        },
      ];

      const mockPrograms: Program[] = [
        {
          id: &ldquo;program-1&rdquo;,
          name: &ldquo;Aceleradora Municipal 2024&rdquo;,
          description:
            &ldquo;Programa de aceleración para startups locales con mentoría y financiamiento&rdquo;,
          organizer: &ldquo;Alcaldía de Cochabamba&rdquo;,
          type: &ldquo;accelerator&rdquo;,
          duration: &ldquo;6 meses&rdquo;,
          deadline: new Date(&ldquo;2024-04-15&rdquo;),
          location: &ldquo;Cochabamba&rdquo;,
        },
        {
          id: &ldquo;program-2&rdquo;,
          name: &ldquo;Fondo Jóvenes Emprendedores&rdquo;,
          description:
            &ldquo;Grants de hasta $5000 USD para jóvenes emprendedores bolivianos&rdquo;,
          organizer: &ldquo;Fundación Pro-Joven&rdquo;,
          type: &ldquo;grant&rdquo;,
          duration: &ldquo;12 meses&rdquo;,
          deadline: new Date(&ldquo;2024-03-30&rdquo;),
          location: &ldquo;Nacional&rdquo;,
        },
      ];

      const mockStories: SuccessStory[] = [
        {
          id: &ldquo;story-1&rdquo;,
          entrepreneur: &ldquo;María Gonzáles&rdquo;,
          businessName: &ldquo;EcoTech Bolivia&rdquo;,
          description:
            &ldquo;Startup de tecnología verde que desarrolla soluciones sostenibles para el agro&rdquo;,
          industry: &ldquo;AgTech&rdquo;,
          location: &ldquo;Santa Cruz&rdquo;,
          image: &ldquo;/api/placeholder/300/300&rdquo;,
          revenue: &ldquo;$50K USD/año&rdquo;,
          employees: 8,
        },
        {
          id: &ldquo;story-2&rdquo;,
          entrepreneur: &ldquo;Carlos Mamani&rdquo;,
          businessName: &ldquo;Artesanías Digitales&rdquo;,
          description:
            &ldquo;Plataforma que conecta artesanos locales con mercados internacionales&rdquo;,
          industry: &ldquo;E-commerce&rdquo;,
          location: &ldquo;La Paz&rdquo;,
          image: &ldquo;/api/placeholder/300/300&rdquo;,
          revenue: &ldquo;$30K USD/año&rdquo;,
          employees: 5,
        },
      ];

      setResources(mockResources);
      setPrograms(mockPrograms);
      setStories(mockStories);
    } catch (error) {
      console.error(&ldquo;Error fetching entrepreneurship data:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case &ldquo;template&rdquo;:
        return <FileText className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;guide&rdquo;:
        return <BookOpen className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;video&rdquo;:
        return <Play className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;podcast&rdquo;:
        return <Headphones className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;tool&rdquo;:
        return <Calculator className=&ldquo;h-5 w-5&rdquo; />;
      default:
        return <FileText className=&ldquo;h-5 w-5&rdquo; />;
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type) {
      case &ldquo;incubator&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;accelerator&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;grant&rdquo;:
        return &ldquo;bg-purple-100 text-purple-800&rdquo;;
      case &ldquo;mentorship&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-64 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
            {[...Array(6)].map((_, i) => (
              <div key={i} className=&ldquo;h-32 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-8&rdquo;>
      {/* Hero Section */}
      <div className=&ldquo;relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white overflow-hidden&rdquo;>
        <div className=&ldquo;relative z-10&rdquo;>
          <div className=&ldquo;max-w-2xl&rdquo;>
            <h1 className=&ldquo;text-4xl font-bold mb-4&rdquo;>
              Convierte tu Idea en Realidad
            </h1>
            <p className=&ldquo;text-xl mb-6 opacity-90&rdquo;>
              Accede a herramientas, recursos y mentorías para lanzar tu
              emprendimiento exitoso en Bolivia
            </p>
            <div className=&ldquo;flex flex-col sm:flex-row gap-4&rdquo;>
              <Button
                asChild
                size=&ldquo;lg&rdquo;
                className=&ldquo;bg-white text-blue-600 hover:bg-gray-100&rdquo;
              >
                <Link href=&ldquo;/business-plan-simulator&rdquo;>
                  <Calculator className=&ldquo;h-5 w-5 mr-2&rdquo; />
                  Crear Plan de Negocios
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className=&ldquo;absolute top-0 right-0 h-full w-1/3 opacity-20&rdquo;>
          <Rocket className=&ldquo;h-64 w-64 transform rotate-12&rdquo; />
        </div>
      </div>

      {/* Quick Actions */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
        <Link href=&ldquo;/business-plan-simulator&rdquo;>
          <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
            <CardContent className=&ldquo;p-6 text-center&rdquo;>
              <div className=&ldquo;w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                <Calculator className=&ldquo;h-6 w-6 text-blue-600&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold mb-2&rdquo;>Simulador de Plan</h3>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Crea tu plan de negocios paso a paso
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href=&ldquo;/entrepreneurship/resources&rdquo;>
          <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
            <CardContent className=&ldquo;p-6 text-center&rdquo;>
              <div className=&ldquo;w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                <BookOpen className=&ldquo;h-6 w-6 text-green-600&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold mb-2&rdquo;>Centro de Recursos</h3>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Plantillas, guías y herramientas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href=&ldquo;/entrepreneurship/network&rdquo;>
          <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
            <CardContent className=&ldquo;p-6 text-center&rdquo;>
              <div className=&ldquo;w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                <Network className=&ldquo;h-6 w-6 text-purple-600&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold mb-2&rdquo;>Red de Contactos</h3>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Conecta con otros emprendedores
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href=&ldquo;/mentorship&rdquo;>
          <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
            <CardContent className=&ldquo;p-6 text-center&rdquo;>
              <div className=&ldquo;w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                <Users className=&ldquo;h-6 w-6 text-orange-600&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold mb-2&rdquo;>Mentorías</h3>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Encuentra mentores expertos
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue=&ldquo;resources&rdquo; className=&ldquo;space-y-6&rdquo;>
        <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
          <TabsTrigger value=&ldquo;resources&rdquo;>Recursos Destacados</TabsTrigger>
          <TabsTrigger value=&ldquo;programs&rdquo;>Programas Disponibles</TabsTrigger>
          <TabsTrigger value=&ldquo;stories&rdquo;>Historias de Éxito</TabsTrigger>
        </TabsList>

        {/* Featured Resources */}
        <TabsContent value=&ldquo;resources&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex justify-between items-center&rdquo;>
            <h2 className=&ldquo;text-2xl font-bold&rdquo;>Recursos Más Populares</h2>
            <Button asChild variant=&ldquo;outline&rdquo;>
              <Link href=&ldquo;/entrepreneurship/resources&rdquo;>
                Ver Todos
                <ArrowRight className=&ldquo;h-4 w-4 ml-2&rdquo; />
              </Link>
            </Button>
          </div>

          <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-6&rdquo;>
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className=&ldquo;hover:shadow-lg transition-shadow&rdquo;
              >
                <div className=&ldquo;aspect-video relative&rdquo;>
                  <div className=&ldquo;w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center&rdquo;>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className=&ldquo;absolute top-3 left-3&rdquo;>
                    <div className=&ldquo;bg-white rounded-full p-2&rdquo;>
                      {getResourceIcon(resource.type)}
                    </div>
                  </div>
                </div>
                <CardContent className=&ldquo;p-4&rdquo;>
                  <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;mb-2&rdquo;>
                    {resource.category}
                  </Badge>
                  <h3 className=&ldquo;font-semibold mb-2&rdquo;>{resource.title}</h3>
                  <p className=&ldquo;text-sm text-muted-foreground mb-3&rdquo;>
                    {resource.description}
                  </p>
                  <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground&rdquo;>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Star className=&ldquo;h-3 w-3 fill-yellow-400 text-yellow-400&rdquo; />
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
        <TabsContent value=&ldquo;programs&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex justify-between items-center&rdquo;>
            <h2 className=&ldquo;text-2xl font-bold&rdquo;>Programas de Apoyo</h2>
            <Button asChild variant=&ldquo;outline&rdquo;>
              <Link href=&ldquo;/entrepreneurship/directory&rdquo;>
                Ver Directorio Completo
                <ArrowRight className=&ldquo;h-4 w-4 ml-2&rdquo; />
              </Link>
            </Button>
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {programs.map((program) => (
              <Card key={program.id}>
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-start justify-between mb-4&rdquo;>
                    <div className=&ldquo;flex-1&rdquo;>
                      <div className=&ldquo;flex items-center gap-3 mb-2&rdquo;>
                        <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                          {program.name}
                        </h3>
                        <Badge className={getProgramTypeColor(program.type)}>
                          {program.type === &ldquo;accelerator&rdquo;
                            ? &ldquo;Aceleradora&rdquo;
                            : program.type === &ldquo;incubator&rdquo;
                              ? &ldquo;Incubadora&rdquo;
                              : program.type === &ldquo;grant&rdquo;
                                ? &ldquo;Fondo&rdquo;
                                : &ldquo;Mentoría&rdquo;}
                        </Badge>
                      </div>
                      <p className=&ldquo;text-muted-foreground mb-3&rdquo;>
                        {program.description}
                      </p>
                      <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground&rdquo;>
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <Calendar className=&ldquo;h-4 w-4&rdquo; />
                          Duración: {program.duration}
                        </div>
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <MapPin className=&ldquo;h-4 w-4&rdquo; />
                          {program.location}
                        </div>
                      </div>
                    </div>
                    <div className=&ldquo;text-right&rdquo;>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Cierra:</p>
                      <p className=&ldquo;font-semibold&rdquo;>
                        {program.deadline.toLocaleDateString()}
                      </p>
                      <Button className=&ldquo;mt-3&rdquo; size=&ldquo;sm&rdquo;>
                        Aplicar Ahora
                      </Button>
                    </div>
                  </div>
                  <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Organizado por:{&ldquo; &rdquo;}
                    <span className=&ldquo;font-medium&rdquo;>{program.organizer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Success Stories */}
        <TabsContent value=&ldquo;stories&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex justify-between items-center&rdquo;>
            <h2 className=&ldquo;text-2xl font-bold&rdquo;>Historias de Éxito Locales</h2>
            <Button asChild variant=&ldquo;outline&rdquo;>
              <Link href=&ldquo;/entrepreneurship/network&rdquo;>
                Conectar con Emprendedores
                <ArrowRight className=&ldquo;h-4 w-4 ml-2&rdquo; />
              </Link>
            </Button>
          </div>

          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;>
            {stories.map((story) => (
              <Card key={story.id} className=&ldquo;overflow-hidden&rdquo;>
                <div className=&ldquo;flex&rdquo;>
                  <div className=&ldquo;w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center flex-shrink-0&rdquo;>
                    <Store className=&ldquo;h-16 w-16 text-green-600&rdquo; />
                  </div>
                  <CardContent className=&ldquo;p-4 flex-1&rdquo;>
                    <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
                      <Badge variant=&ldquo;outline&rdquo;>{story.industry}</Badge>
                      <Badge variant=&ldquo;secondary&rdquo;>{story.location}</Badge>
                    </div>
                    <h3 className=&ldquo;font-semibold text-lg&rdquo;>
                      {story.businessName}
                    </h3>
                    <p className=&ldquo;text-sm text-muted-foreground mb-3&rdquo;>
                      por {story.entrepreneur}
                    </p>
                    <p className=&ldquo;text-sm mb-3&rdquo;>{story.description}</p>
                    <div className=&ldquo;flex justify-between text-xs text-muted-foreground&rdquo;>
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
      <Card className=&ldquo;bg-gradient-to-r from-green-600 to-blue-600 text-white&rdquo;>
        <CardContent className=&ldquo;p-8 text-center&rdquo;>
          <h2 className=&ldquo;text-2xl font-bold mb-4&rdquo;>¿Listo para Emprender?</h2>
          <p className=&ldquo;text-lg mb-6 opacity-90&rdquo;>
            Accede a recursos exclusivos y conecta con la comunidad emprendedora
          </p>
          <Button
            asChild
            size=&ldquo;lg&rdquo;
            className=&ldquo;bg-white text-green-600 hover:bg-gray-100&rdquo;
          >
            <Link href=&ldquo;/entrepreneurship/resources&rdquo;>
              <BookOpen className=&ldquo;h-5 w-5 mr-2&rdquo; />
              Explorar Recursos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
