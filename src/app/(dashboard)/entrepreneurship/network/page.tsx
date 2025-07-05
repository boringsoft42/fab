&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

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
  type: &ldquo;virtual&rdquo; | &ldquo;presencial&rdquo; | &ldquo;hybrid&rdquo;;
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
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [activeTab, setActiveTab] = useState(&ldquo;entrepreneurs&rdquo;);

  useEffect(() => {
    fetchNetworkingData();
  }, []);

  const fetchNetworkingData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockEntrepreneurs: Entrepreneur[] = [
        {
          id: &ldquo;ent-1&rdquo;,
          name: &ldquo;María González&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          businessName: &ldquo;EcoTech Bolivia&rdquo;,
          category: &ldquo;AgTech&rdquo;,
          location: &ldquo;Santa Cruz&rdquo;,
          bio: &ldquo;Ingeniera en sistemas especializada en soluciones tecnológicas para el agro. Busco colaboraciones en proyectos de sostenibilidad.&rdquo;,
          skills: [&ldquo;Desarrollo de Software&rdquo;, &ldquo;IoT&rdquo;, &ldquo;Agricultura Digital&rdquo;],
          interests: [&ldquo;Sostenibilidad&rdquo;, &ldquo;Tecnología Verde&rdquo;, &ldquo;Innovación Rural&rdquo;],
          experience: &ldquo;5 años&rdquo;,
          rating: 4.9,
          reviewCount: 47,
          connections: 234,
          isOnline: true,
          lastActive: new Date(),
          lookingFor: [&ldquo;Inversionistas&rdquo;, &ldquo;Socios Técnicos&rdquo;, &ldquo;Mentores&rdquo;],
          offering: [
            &ldquo;Consultoría AgTech&rdquo;,
            &ldquo;Desarrollo de Prototipos&rdquo;,
            &ldquo;Capacitación&rdquo;,
          ],
        },
        {
          id: &ldquo;ent-2&rdquo;,
          name: &ldquo;Carlos Mamani&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          businessName: &ldquo;Artesanías Digitales&rdquo;,
          category: &ldquo;E-commerce&rdquo;,
          location: &ldquo;La Paz&rdquo;,
          bio: &ldquo;Emprendedor social enfocado en digitalizar el comercio de artesanías bolivianas y conectar artesanos con mercados globales.&rdquo;,
          skills: [&ldquo;Marketing Digital&rdquo;, &ldquo;E-commerce&rdquo;, &ldquo;Fotografía&rdquo;],
          interests: [
            &ldquo;Comercio Justo&rdquo;,
            &ldquo;Cultura Boliviana&rdquo;,
            &ldquo;Emprendimiento Social&rdquo;,
          ],
          experience: &ldquo;3 años&rdquo;,
          rating: 4.7,
          reviewCount: 31,
          connections: 189,
          isOnline: false,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          lookingFor: [
            &ldquo;Artesanos&rdquo;,
            &ldquo;Mercados Internacionales&rdquo;,
            &ldquo;Financiamiento&rdquo;,
          ],
          offering: [
            &ldquo;Marketing Digital&rdquo;,
            &ldquo;Fotografía de Producto&rdquo;,
            &ldquo;Asesoría E-commerce&rdquo;,
          ],
        },
        {
          id: &ldquo;ent-3&rdquo;,
          name: &ldquo;Ana Gutiérrez&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          businessName: &ldquo;FoodTech Express&rdquo;,
          category: &ldquo;FoodTech&rdquo;,
          location: &ldquo;Cochabamba&rdquo;,
          bio: &ldquo;CEO y fundadora de startup de delivery de comida casera. Experta en logística y operaciones de delivery urbano.&rdquo;,
          skills: [&ldquo;Operaciones&rdquo;, &ldquo;Logística&rdquo;, &ldquo;Desarrollo de Apps&rdquo;],
          interests: [
            &ldquo;Gastronomía Local&rdquo;,
            &ldquo;Logística Urbana&rdquo;,
            &ldquo;Tecnología Móvil&rdquo;,
          ],
          experience: &ldquo;4 años&rdquo;,
          rating: 4.8,
          reviewCount: 56,
          connections: 312,
          isOnline: true,
          lastActive: new Date(),
          lookingFor: [&ldquo;Inversionistas Serie A&rdquo;, &ldquo;CTO&rdquo;, &ldquo;Expansión Regional&rdquo;],
          offering: [
            &ldquo;Mentoría en Operaciones&rdquo;,
            &ldquo;Consultoría Logística&rdquo;,
            &ldquo;Networking&rdquo;,
          ],
        },
      ];

      const mockEvents: NetworkingEvent[] = [
        {
          id: &ldquo;event-1&rdquo;,
          title: &ldquo;Startup Pitch Night Cochabamba&rdquo;,
          description:
            &ldquo;Noche de pitches para startups emergentes. Oportunidad de presentar tu idea ante inversionistas y mentores.&rdquo;,
          date: new Date(&ldquo;2024-03-15&rdquo;),
          time: &ldquo;19:00 - 22:00&rdquo;,
          location: &ldquo;Centro de Convenciones Cochabamba&rdquo;,
          type: &ldquo;presencial&rdquo;,
          category: &ldquo;Pitch&rdquo;,
          organizer: &ldquo;Startup Hub Bolivia&rdquo;,
          attendees: 67,
          maxAttendees: 100,
          price: 0,
          image: &ldquo;/api/placeholder/400/200&rdquo;,
          tags: [&ldquo;Pitch&rdquo;, &ldquo;Inversión&rdquo;, &ldquo;Networking&rdquo;],
        },
        {
          id: &ldquo;event-2&rdquo;,
          title: &ldquo;Workshop: Marketing Digital para Emprendedores&rdquo;,
          description:
            &ldquo;Aprende estrategias efectivas de marketing digital para hacer crecer tu emprendimiento.&rdquo;,
          date: new Date(&ldquo;2024-03-20&rdquo;),
          time: &ldquo;14:00 - 17:00&rdquo;,
          location: &ldquo;Online - Zoom&rdquo;,
          type: &ldquo;virtual&rdquo;,
          category: &ldquo;Workshop&rdquo;,
          organizer: &ldquo;Digital Entrepreneurs BO&rdquo;,
          attendees: 134,
          maxAttendees: 200,
          price: 50,
          image: &ldquo;/api/placeholder/400/200&rdquo;,
          tags: [&ldquo;Marketing&rdquo;, &ldquo;Digital&rdquo;, &ldquo;Capacitación&rdquo;],
        },
        {
          id: &ldquo;event-3&rdquo;,
          title: &ldquo;Feria de Emprendimientos Sostenibles&rdquo;,
          description:
            &ldquo;Exposición de emprendimientos con enfoque en sostenibilidad y responsabilidad social.&rdquo;,
          date: new Date(&ldquo;2024-03-25&rdquo;),
          time: &ldquo;09:00 - 18:00&rdquo;,
          location: &ldquo;Plaza Murillo, La Paz&rdquo;,
          type: &ldquo;presencial&rdquo;,
          category: &ldquo;Feria&rdquo;,
          organizer: &ldquo;EcoEmprende Bolivia&rdquo;,
          attendees: 89,
          maxAttendees: 150,
          price: 0,
          image: &ldquo;/api/placeholder/400/200&rdquo;,
          tags: [&ldquo;Sostenibilidad&rdquo;, &ldquo;Expo&rdquo;, &ldquo;Verde&rdquo;],
        },
      ];

      const mockDiscussions: Discussion[] = [
        {
          id: &ldquo;disc-1&rdquo;,
          title: &ldquo;¿Cómo conseguir financiamiento para startups en Bolivia?&rdquo;,
          content:
            &ldquo;Hola emprendedores! Estoy buscando consejos sobre las mejores formas de conseguir financiamiento para mi startup de AgTech...&rdquo;,
          author: {
            name: &ldquo;María González&rdquo;,
            avatar: &ldquo;/api/placeholder/50/50&rdquo;,
            businessName: &ldquo;EcoTech Bolivia&rdquo;,
          },
          category: &ldquo;Financiamiento&rdquo;,
          replies: 23,
          views: 456,
          likes: 78,
          createdAt: new Date(&ldquo;2024-02-20&rdquo;),
          tags: [&ldquo;Financiamiento&rdquo;, &ldquo;Startups&rdquo;, &ldquo;Inversión&rdquo;],
          isSticky: true,
        },
        {
          id: &ldquo;disc-2&rdquo;,
          title: &ldquo;Experiencias con marketplaces internacionales&rdquo;,
          content:
            &ldquo;¿Alguien ha tenido experiencia vendiendo en Amazon, eBay o Etsy desde Bolivia? Me gustaría conocer sus experiencias...&rdquo;,
          author: {
            name: &ldquo;Carlos Mamani&rdquo;,
            avatar: &ldquo;/api/placeholder/50/50&rdquo;,
            businessName: &ldquo;Artesanías Digitales&rdquo;,
          },
          category: &ldquo;E-commerce&rdquo;,
          replies: 15,
          views: 289,
          likes: 34,
          createdAt: new Date(&ldquo;2024-02-18&rdquo;),
          tags: [&ldquo;E-commerce&rdquo;, &ldquo;Internacional&rdquo;, &ldquo;Marketplaces&rdquo;],
          isSticky: false,
        },
        {
          id: &ldquo;disc-3&rdquo;,
          title: &ldquo;Herramientas gratuitas para gestionar emprendimientos&rdquo;,
          content:
            &ldquo;Comparto una lista de herramientas gratuitas que uso para gestionar mi startup de delivery...&rdquo;,
          author: {
            name: &ldquo;Ana Gutiérrez&rdquo;,
            avatar: &ldquo;/api/placeholder/50/50&rdquo;,
            businessName: &ldquo;FoodTech Express&rdquo;,
          },
          category: &ldquo;Herramientas&rdquo;,
          replies: 42,
          views: 678,
          likes: 156,
          createdAt: new Date(&ldquo;2024-02-15&rdquo;),
          tags: [&ldquo;Herramientas&rdquo;, &ldquo;Productividad&rdquo;, &ldquo;Gestión&rdquo;],
          isSticky: false,
        },
      ];

      setEntrepreneurs(mockEntrepreneurs);
      setEvents(mockEvents);
      setDiscussions(mockDiscussions);
    } catch (error) {
      console.error(&ldquo;Error fetching networking data:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-32 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
            {[...Array(6)].map((_, i) => (
              <div key={i} className=&ldquo;h-64 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Red de Emprendedores</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Conecta, colabora y crece junto a otros emprendedores bolivianos
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=&ldquo;space-y-6&rdquo;
      >
        <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
          <TabsTrigger value=&ldquo;entrepreneurs&rdquo;>Emprendedores</TabsTrigger>
          <TabsTrigger value=&ldquo;events&rdquo;>Eventos</TabsTrigger>
          <TabsTrigger value=&ldquo;discussions&rdquo;>Discusiones</TabsTrigger>
        </TabsList>

        {/* Entrepreneurs Tab */}
        <TabsContent value=&ldquo;entrepreneurs&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;relative flex-1 max-w-md&rdquo;>
              <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
              <Input
                placeholder=&ldquo;Buscar emprendedores por nombre, negocio o habilidades...&rdquo;
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=&ldquo;pl-10&rdquo;
              />
            </div>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo;>
                <Filter className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Filtros
              </Button>
              <Button asChild>
                <Link href=&ldquo;/profile&rdquo;>
                  <UserPlus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Completar mi Perfil
                </Link>
              </Button>
            </div>
          </div>

          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
            {entrepreneurs.map((entrepreneur) => (
              <Card
                key={entrepreneur.id}
                className=&ldquo;overflow-hidden hover:shadow-lg transition-shadow&rdquo;
              >
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-center gap-3 mb-4&rdquo;>
                    <div className=&ldquo;relative&rdquo;>
                      <Avatar className=&ldquo;h-12 w-12&rdquo;>
                        <AvatarImage
                          src={entrepreneur.avatar}
                          alt={entrepreneur.name}
                        />
                        <AvatarFallback>
                          {entrepreneur.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {entrepreneur.isOnline && (
                        <div className=&ldquo;absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white&rdquo; />
                      )}
                    </div>
                    <div className=&ldquo;flex-1&rdquo;>
                      <h3 className=&ldquo;font-semibold&rdquo;>{entrepreneur.name}</h3>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        {entrepreneur.businessName}
                      </p>
                      <div className=&ldquo;flex items-center gap-1 text-xs text-muted-foreground&rdquo;>
                        <MapPin className=&ldquo;h-3 w-3&rdquo; />
                        {entrepreneur.location}
                      </div>
                    </div>
                  </div>

                  <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
                    <Badge variant=&ldquo;secondary&rdquo;>{entrepreneur.category}</Badge>
                    <div className=&ldquo;flex items-center gap-1 text-xs&rdquo;>
                      <Star className=&ldquo;h-3 w-3 fill-yellow-400 text-yellow-400&rdquo; />
                      {entrepreneur.rating}
                    </div>
                  </div>

                  <p className=&ldquo;text-sm text-muted-foreground mb-4 line-clamp-2&rdquo;>
                    {entrepreneur.bio}
                  </p>

                  <div className=&ldquo;space-y-3&rdquo;>
                    <div>
                      <p className=&ldquo;text-xs font-medium text-muted-foreground mb-1&rdquo;>
                        Habilidades
                      </p>
                      <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                        {entrepreneur.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-xs&rdquo;
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className=&ldquo;text-xs font-medium text-muted-foreground mb-1&rdquo;>
                        Busca
                      </p>
                      <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                        {entrepreneur.lookingFor.slice(0, 2).map((item) => (
                          <Badge
                            key={item}
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-xs bg-blue-50 text-blue-700&rdquo;
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className=&ldquo;flex items-center justify-between mt-4 pt-4 border-t&rdquo;>
                    <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                      {entrepreneur.connections} conexiones
                    </div>
                    <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                      Disponible para networking
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value=&ldquo;events&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h2 className=&ldquo;text-xl font-semibold&rdquo;>Próximos Eventos</h2>
            <Button asChild>
              <Link href=&ldquo;/entrepreneurship/create-event&rdquo;>
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Crear Evento
              </Link>
            </Button>
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {events.map((event) => (
              <Card key={event.id} className=&ldquo;overflow-hidden&rdquo;>
                <div className=&ldquo;flex&rdquo;>
                  <div className=&ldquo;w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0&rdquo;>
                    <Calendar className=&ldquo;h-16 w-16 text-blue-600&rdquo; />
                  </div>
                  <CardContent className=&ldquo;p-6 flex-1&rdquo;>
                    <div className=&ldquo;flex items-start justify-between mb-2&rdquo;>
                      <div className=&ldquo;flex-1&rdquo;>
                        <div className=&ldquo;flex items-center gap-2 mb-1&rdquo;>
                          <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                            {event.title}
                          </h3>
                          <Badge
                            variant={
                              event.type === &ldquo;virtual&rdquo;
                                ? &ldquo;secondary&rdquo;
                                : event.type === &ldquo;presencial&rdquo;
                                  ? &ldquo;default&rdquo;
                                  : &ldquo;outline&rdquo;
                            }
                          >
                            {event.type === &ldquo;virtual&rdquo;
                              ? &ldquo;Virtual&rdquo;
                              : event.type === &ldquo;presencial&rdquo;
                                ? &ldquo;Presencial&rdquo;
                                : &ldquo;Híbrido&rdquo;}
                          </Badge>
                        </div>
                        <p className=&ldquo;text-sm text-muted-foreground mb-3&rdquo;>
                          {event.description}
                        </p>

                        <div className=&ldquo;grid grid-cols-2 md:grid-cols-4 gap-4 text-sm&rdquo;>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <Calendar className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                            <span>{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <Clock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                            <span>{event.time}</span>
                          </div>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <MapPin className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                            <span>{event.location}</span>
                          </div>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                            <span>
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className=&ldquo;text-right&rdquo;>
                        <div className=&ldquo;text-sm text-muted-foreground mb-2&rdquo;>
                          {event.price === 0
                            ? &ldquo;Gratuito&rdquo;
                            : `Bs. ${event.price}`}
                        </div>
                        <Button>Registrarse</Button>
                      </div>
                    </div>

                    <div className=&ldquo;flex items-center justify-between mt-4&rdquo;>
                      <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                        {event.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant=&ldquo;outline&rdquo;
                            className=&ldquo;text-xs&rdquo;
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
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
        <TabsContent value=&ldquo;discussions&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h2 className=&ldquo;text-xl font-semibold&rdquo;>
              Discusiones de la Comunidad
            </h2>
            <Button asChild>
              <Link href=&ldquo;/entrepreneurship/create-discussion&rdquo;>
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Nueva Discusión
              </Link>
            </Button>
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={
                  discussion.isSticky ? &ldquo;border-blue-200 bg-blue-50/50&rdquo; : &ldquo;&rdquo;
                }
              >
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-start gap-4&rdquo;>
                    <Avatar className=&ldquo;h-10 w-10 flex-shrink-0&rdquo;>
                      <AvatarImage
                        src={discussion.author.avatar}
                        alt={discussion.author.name}
                      />
                      <AvatarFallback>
                        {discussion.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className=&ldquo;flex-1&rdquo;>
                      <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
                        {discussion.isSticky && (
                          <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                            Fijado
                          </Badge>
                        )}
                        <h3 className=&ldquo;font-semibold text-lg&rdquo;>
                          {discussion.title}
                        </h3>
                      </div>

                      <div className=&ldquo;flex items-center gap-2 text-sm text-muted-foreground mb-3&rdquo;>
                        <span>{discussion.author.name}</span>
                        <span>•</span>
                        <span>{discussion.author.businessName}</span>
                        <span>•</span>
                        <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                          {discussion.category}
                        </Badge>
                        <span>•</span>
                        <span>{discussion.createdAt.toLocaleDateString()}</span>
                      </div>

                      <p className=&ldquo;text-muted-foreground mb-4 line-clamp-2&rdquo;>
                        {discussion.content}
                      </p>

                      <div className=&ldquo;flex items-center justify-between&rdquo;>
                        <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                          {discussion.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant=&ldquo;outline&rdquo;
                              className=&ldquo;text-xs&rdquo;
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground&rdquo;>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <Heart className=&ldquo;h-4 w-4&rdquo; />
                            {discussion.likes}
                          </div>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <MessageCircle className=&ldquo;h-4 w-4&rdquo; />
                            {discussion.replies}
                          </div>
                          <div className=&ldquo;flex items-center gap-1&rdquo;>
                            <TrendingUp className=&ldquo;h-4 w-4&rdquo; />
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
