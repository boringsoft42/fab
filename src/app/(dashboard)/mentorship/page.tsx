&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

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
    type: &ldquo;free&rdquo; | &ldquo;paid&rdquo;;
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
  status: &ldquo;scheduled&rdquo; | &ldquo;completed&rdquo; | &ldquo;cancelled&rdquo;;
  topic: string;
  type: &ldquo;video&rdquo; | &ldquo;chat&rdquo; | &ldquo;presencial&rdquo;;
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
  level: &ldquo;beginner&rdquo; | &ldquo;intermediate&rdquo; | &ldquo;advanced&rdquo;;
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
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [filterExpertise, setFilterExpertise] = useState(&ldquo;all&rdquo;);
  const [filterPrice, setFilterPrice] = useState(&ldquo;all&rdquo;);
  const [activeTab, setActiveTab] = useState(&ldquo;mentors&rdquo;);

  useEffect(() => {
    fetchMentorshipData();
  }, []);

  const fetchMentorshipData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockMentors: Mentor[] = [
        {
          id: &ldquo;mentor-1&rdquo;,
          name: &ldquo;Dr. Roberto Silva&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          title: &ldquo;CEO & Fundador&rdquo;,
          company: &ldquo;TechBolivia&rdquo;,
          location: &ldquo;La Paz, Bolivia&rdquo;,
          bio: &ldquo;Emprendedor serial con más de 15 años de experiencia en tecnología. He fundado 3 startups exitosas y actualmente mentor jóvenes emprendedores.&rdquo;,
          expertise: [
            &ldquo;Tecnología&rdquo;,
            &ldquo;Startups&rdquo;,
            &ldquo;Liderazgo&rdquo;,
            &ldquo;Estrategia de Negocio&rdquo;,
          ],
          experience: &ldquo;15+ años&rdquo;,
          rating: 4.9,
          reviewCount: 89,
          mentees: 156,
          responseTime: &ldquo;2 horas&rdquo;,
          languages: [&ldquo;Español&rdquo;, &ldquo;Inglés&rdquo;],
          price: { type: &ldquo;free&rdquo; },
          availability: {
            timezone: &ldquo;GMT-4&rdquo;,
            schedule: &ldquo;Lunes a Viernes 14:00-18:00&rdquo;,
          },
          achievements: [
            &ldquo;Fundador Exitoso&rdquo;,
            &ldquo;Mentor del Año 2023&rdquo;,
            &ldquo;Experto en AI&rdquo;,
          ],
          isVerified: true,
          isOnline: true,
        },
        {
          id: &ldquo;mentor-2&rdquo;,
          name: &ldquo;Lic. Carmen Rodriguez&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          title: &ldquo;Directora de Marketing&rdquo;,
          company: &ldquo;Grupo Boliviano&rdquo;,
          location: &ldquo;Santa Cruz, Bolivia&rdquo;,
          bio: &ldquo;Especialista en marketing digital y desarrollo de marcas. He ayudado a más de 100 emprendimientos a posicionarse en el mercado.&rdquo;,
          expertise: [
            &ldquo;Marketing Digital&rdquo;,
            &ldquo;Branding&rdquo;,
            &ldquo;Redes Sociales&rdquo;,
            &ldquo;Ventas&rdquo;,
          ],
          experience: &ldquo;12+ años&rdquo;,
          rating: 4.8,
          reviewCount: 67,
          mentees: 98,
          responseTime: &ldquo;4 horas&rdquo;,
          languages: [&ldquo;Español&rdquo;, &ldquo;Portugués&rdquo;],
          price: { type: &ldquo;paid&rdquo;, amount: 150 },
          availability: {
            timezone: &ldquo;GMT-4&rdquo;,
            schedule: &ldquo;Martes y Jueves 16:00-20:00&rdquo;,
          },
          achievements: [
            &ldquo;Top Marketer 2022&rdquo;,
            &ldquo;Certificación Google&rdquo;,
            &ldquo;Especialista en Growth&rdquo;,
          ],
          isVerified: true,
          isOnline: false,
        },
        {
          id: &ldquo;mentor-3&rdquo;,
          name: &ldquo;Ing. Luis Mamani&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          title: &ldquo;Consultor Financiero&rdquo;,
          company: &ldquo;FinanzasPro&rdquo;,
          location: &ldquo;Cochabamba, Bolivia&rdquo;,
          bio: &ldquo;Contador público y consultor financiero especializado en startups. Ayudo a emprendedores a estructurar sus finanzas y conseguir inversión.&rdquo;,
          expertise: [
            &ldquo;Finanzas&rdquo;,
            &ldquo;Contabilidad&rdquo;,
            &ldquo;Inversión&rdquo;,
            &ldquo;Planificación Financiera&rdquo;,
          ],
          experience: &ldquo;10+ años&rdquo;,
          rating: 4.7,
          reviewCount: 43,
          mentees: 72,
          responseTime: &ldquo;6 horas&rdquo;,
          languages: [&ldquo;Español&rdquo;, &ldquo;Inglés&rdquo;],
          price: { type: &ldquo;paid&rdquo;, amount: 100 },
          availability: {
            timezone: &ldquo;GMT-4&rdquo;,
            schedule: &ldquo;Miércoles a Viernes 10:00-14:00&rdquo;,
          },
          achievements: [
            &ldquo;CPA Certificado&rdquo;,
            &ldquo;Especialista en Startups&rdquo;,
            &ldquo;Mentor Fundación Emprende&rdquo;,
          ],
          isVerified: true,
          isOnline: true,
        },
      ];

      const mockSessions: MentorshipSession[] = [
        {
          id: &ldquo;session-1&rdquo;,
          mentorId: &ldquo;mentor-1&rdquo;,
          mentorName: &ldquo;Dr. Roberto Silva&rdquo;,
          mentorAvatar: &ldquo;/api/placeholder/50/50&rdquo;,
          date: new Date(&ldquo;2024-03-15T15:00:00&rdquo;),
          duration: 60,
          status: &ldquo;scheduled&rdquo;,
          topic: &ldquo;Estrategia de Crecimiento para Startup&rdquo;,
          type: &ldquo;video&rdquo;,
        },
        {
          id: &ldquo;session-2&rdquo;,
          mentorId: &ldquo;mentor-2&rdquo;,
          mentorName: &ldquo;Lic. Carmen Rodriguez&rdquo;,
          mentorAvatar: &ldquo;/api/placeholder/50/50&rdquo;,
          date: new Date(&ldquo;2024-02-28T16:30:00&rdquo;),
          duration: 45,
          status: &ldquo;completed&rdquo;,
          topic: &ldquo;Plan de Marketing Digital&rdquo;,
          type: &ldquo;video&rdquo;,
          feedback: {
            rating: 5,
            comment:
              &ldquo;Excelente sesión, muy práctica y útil para mi emprendimiento.&rdquo;,
          },
        },
      ];

      const mockPrograms: MentorshipProgram[] = [
        {
          id: &ldquo;program-1&rdquo;,
          title: &ldquo;Acelerador de Startups Tecnológicas&rdquo;,
          description:
            &ldquo;Programa intensivo de 8 semanas para acelerar el crecimiento de startups tecnológicas. Incluye mentoría personalizada, workshops y networking.&rdquo;,
          duration: &ldquo;8 semanas&rdquo;,
          level: &ldquo;intermediate&rdquo;,
          mentorId: &ldquo;mentor-1&rdquo;,
          mentorName: &ldquo;Dr. Roberto Silva&rdquo;,
          mentorAvatar: &ldquo;/api/placeholder/50/50&rdquo;,
          participants: 12,
          maxParticipants: 15,
          price: 0,
          startDate: new Date(&ldquo;2024-04-01&rdquo;),
          topics: [
            &ldquo;Modelo de Negocio&rdquo;,
            &ldquo;Tecnología&rdquo;,
            &ldquo;Fundraising&rdquo;,
            &ldquo;Escalabilidad&rdquo;,
          ],
          objectives: [
            &ldquo;Definir propuesta de valor única&rdquo;,
            &ldquo;Desarrollar MVP funcional&rdquo;,
            &ldquo;Preparar pitch para inversionistas&rdquo;,
            &ldquo;Establecer métricas clave&rdquo;,
          ],
        },
        {
          id: &ldquo;program-2&rdquo;,
          title: &ldquo;Marketing Digital para Emprendedores&rdquo;,
          description:
            &ldquo;Aprende a crear y ejecutar estrategias de marketing digital efectivas para hacer crecer tu emprendimiento.&rdquo;,
          duration: &ldquo;6 semanas&rdquo;,
          level: &ldquo;beginner&rdquo;,
          mentorId: &ldquo;mentor-2&rdquo;,
          mentorName: &ldquo;Lic. Carmen Rodriguez&rdquo;,
          mentorAvatar: &ldquo;/api/placeholder/50/50&rdquo;,
          participants: 8,
          maxParticipants: 20,
          price: 0,
          startDate: new Date(&ldquo;2024-03-20&rdquo;),
          topics: [
            &ldquo;Estrategia Digital&rdquo;,
            &ldquo;Redes Sociales&rdquo;,
            &ldquo;Content Marketing&rdquo;,
            &ldquo;Analytics&rdquo;,
          ],
          objectives: [
            &ldquo;Crear plan de marketing digital&rdquo;,
            &ldquo;Dominar redes sociales principales&rdquo;,
            &ldquo;Medir ROI de campañas&rdquo;,
            &ldquo;Automatizar procesos de marketing&rdquo;,
          ],
        },
      ];

      setMentors(mockMentors);
      setSessions(mockSessions);
      setPrograms(mockPrograms);
    } catch (error) {
      console.error(&ldquo;Error fetching mentorship data:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const expertiseAreas = [
    &ldquo;Tecnología&rdquo;,
    &ldquo;Marketing Digital&rdquo;,
    &ldquo;Finanzas&rdquo;,
    &ldquo;Liderazgo&rdquo;,
    &ldquo;Ventas&rdquo;,
    &ldquo;Operaciones&rdquo;,
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === &ldquo;&rdquo; ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpertise =
      filterExpertise === &ldquo;all&rdquo; || mentor.expertise.includes(filterExpertise);
    const matchesPrice =
      filterPrice === &ldquo;all&rdquo; ||
      (filterPrice === &ldquo;free&rdquo; && mentor.price.type === &ldquo;free&rdquo;) ||
      (filterPrice === &ldquo;paid&rdquo; && mentor.price.type === &ldquo;paid&rdquo;);

    return matchesSearch && matchesExpertise && matchesPrice;
  });

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
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Plataforma de Mentorías</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Conecta con mentores expertos y acelera el crecimiento de tu
          emprendimiento
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=&ldquo;space-y-6&rdquo;
      >
        <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
          <TabsTrigger value=&ldquo;mentors&rdquo;>Mentores</TabsTrigger>
          <TabsTrigger value=&ldquo;programs&rdquo;>Programas</TabsTrigger>
          <TabsTrigger value=&ldquo;become-mentor&rdquo;>Ser Mentor</TabsTrigger>
        </TabsList>

        {/* Mentors Tab */}
        <TabsContent value=&ldquo;mentors&rdquo; className=&ldquo;space-y-6&rdquo;>
          {/* Search and Filters */}
          <div className=&ldquo;flex flex-col md:flex-row gap-4&rdquo;>
            <div className=&ldquo;relative flex-1&rdquo;>
              <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
              <Input
                placeholder=&ldquo;Buscar mentores por nombre, expertise o empresa...&rdquo;
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=&ldquo;pl-10&rdquo;
              />
            </div>
            <Select value={filterExpertise} onValueChange={setFilterExpertise}>
              <SelectTrigger className=&ldquo;w-48&rdquo;>
                <SelectValue placeholder=&ldquo;Área de expertise&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todas las áreas</SelectItem>
                {expertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger className=&ldquo;w-32&rdquo;>
                <SelectValue placeholder=&ldquo;Precio&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                <SelectItem value=&ldquo;free&rdquo;>Gratuito</SelectItem>
                <SelectItem value=&ldquo;paid&rdquo;>De pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mentors Grid */}
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
            {filteredMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className=&ldquo;overflow-hidden hover:shadow-lg transition-shadow&rdquo;
              >
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-center gap-3 mb-4&rdquo;>
                    <div className=&ldquo;relative&rdquo;>
                      <Avatar className=&ldquo;h-16 w-16&rdquo;>
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {mentor.isOnline && (
                        <div className=&ldquo;absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white&rdquo; />
                      )}
                      {mentor.isVerified && (
                        <div className=&ldquo;absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center&rdquo;>
                          <CheckCircle className=&ldquo;h-3 w-3 text-white&rdquo; />
                        </div>
                      )}
                    </div>
                    <div className=&ldquo;flex-1&rdquo;>
                      <h3 className=&ldquo;font-semibold text-lg&rdquo;>{mentor.name}</h3>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        {mentor.title}
                      </p>
                      <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                        {mentor.company}
                      </p>
                    </div>
                  </div>

                  <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                      <span className=&ldquo;text-sm font-medium&rdquo;>
                        {mentor.rating}
                      </span>
                      <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
                        ({mentor.reviewCount})
                      </span>
                    </div>
                    <span className=&ldquo;text-xs text-muted-foreground&rdquo;>•</span>
                    <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
                      {mentor.mentees} mentees
                    </span>
                  </div>

                  <p className=&ldquo;text-sm text-muted-foreground mb-4 line-clamp-3&rdquo;>
                    {mentor.bio}
                  </p>

                  <div className=&ldquo;space-y-3&rdquo;>
                    <div>
                      <p className=&ldquo;text-xs font-medium text-muted-foreground mb-1&rdquo;>
                        Expertise
                      </p>
                      <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <Badge
                            key={exp}
                            variant=&ldquo;secondary&rdquo;
                            className=&ldquo;text-xs&rdquo;
                          >
                            {exp}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                            +{mentor.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className=&ldquo;flex items-center justify-between text-sm&rdquo;>
                      <div>
                        <span className=&ldquo;text-muted-foreground&rdquo;>
                          Responde en:{&ldquo; &rdquo;}
                        </span>
                        <span className=&ldquo;font-medium&rdquo;>
                          {mentor.responseTime}
                        </span>
                      </div>
                      <div>
  <span className=&ldquo;text-muted-foreground&rdquo;>WhatsApp: </span>
  <a
    href={`https://wa.me/${mentor.whatsapp}`}
    target=&ldquo;_blank&rdquo;
    rel=&ldquo;noopener noreferrer&rdquo;
    className=&ldquo;font-medium text-green-600 hover:underline&rdquo;
  >
    Escribir
  </a>
</div>

                      
                      
                      {/* <div className=&ldquo;font-semibold&rdquo;>
                        {mentor.price.type === &ldquo;free&rdquo; ? (
                          <span className=&ldquo;text-green-600&rdquo;>Gratuito</span>
                        ) : (
                          <span>Bs. {mentor.price.amount}/hora</span>
                        )}
                      </div> */}
                      
                    </div>

                    {mentor.achievements.length > 0 && (
                      <div>
                        <p className=&ldquo;text-xs font-medium text-muted-foreground mb-1&rdquo;>
                          Logros
                        </p>
                        <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                          {mentor.achievements
                            .slice(0, 2)
                            .map((achievement) => (
                              <Badge
                                key={achievement}
                                variant=&ldquo;outline&rdquo;
                                className=&ldquo;text-xs bg-yellow-50 text-yellow-700&rdquo;
                              >
                                <Award className=&ldquo;h-2 w-2 mr-1&rdquo; />
                                {achievement}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* <div className=&ldquo;flex gap-2 mt-4 pt-4 border-t&rdquo;>
                    <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; className=&ldquo;flex-1&rdquo;>
                      <MessageCircle className=&ldquo;h-3 w-3 mr-1&rdquo; />
                      Mensaje
                    </Button>
                    <Button size=&ldquo;sm&rdquo; className=&ldquo;flex-1&rdquo;>
                      <Calendar className=&ldquo;h-3 w-3 mr-1&rdquo; />
                      Agendar
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Sessions Tab */}
        <TabsContent value=&ldquo;sessions&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h2 className=&ldquo;text-xl font-semibold&rdquo;>Mis Sesiones de Mentoría</h2>
            <Button asChild>
              <Link href=&ldquo;#mentors&rdquo; onClick={() => setActiveTab(&ldquo;mentors&rdquo;)}>
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Agendar Nueva Sesión
              </Link>
            </Button>
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-center justify-between&rdquo;>
                    <div className=&ldquo;flex items-center gap-4&rdquo;>
                      <Avatar className=&ldquo;h-12 w-12&rdquo;>
                        <AvatarImage
                          src={session.mentorAvatar}
                          alt={session.mentorName}
                        />
                        <AvatarFallback>
                          {session.mentorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className=&ldquo;font-semibold&rdquo;>{session.topic}</h3>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          Mentor: {session.mentorName}
                        </p>
                        <div className=&ldquo;flex items-center gap-2 text-xs text-muted-foreground mt-1&rdquo;>
                          <Calendar className=&ldquo;h-3 w-3&rdquo; />
                          {session.date.toLocaleDateString()} -{&ldquo; &rdquo;}
                          {session.date.toLocaleTimeString()}
                          <span>•</span>
                          <Clock className=&ldquo;h-3 w-3&rdquo; />
                          {session.duration} minutos
                          <span>•</span>
                          <Video className=&ldquo;h-3 w-3&rdquo; />
                          {session.type === &ldquo;video&rdquo;
                            ? &ldquo;Video llamada&rdquo;
                            : session.type === &ldquo;chat&rdquo;
                              ? &ldquo;Chat&rdquo;
                              : &ldquo;Presencial&rdquo;}
                        </div>
                      </div>
                    </div>

                    <div className=&ldquo;flex items-center gap-2&rdquo;>
                      <Badge
                        variant={
                          session.status === &ldquo;scheduled&rdquo;
                            ? &ldquo;default&rdquo;
                            : session.status === &ldquo;completed&rdquo;
                              ? &ldquo;secondary&rdquo;
                              : &ldquo;destructive&rdquo;
                        }
                      >
                        {session.status === &ldquo;scheduled&rdquo;
                          ? &ldquo;Programada&rdquo;
                          : session.status === &ldquo;completed&rdquo;
                            ? &ldquo;Completada&rdquo;
                            : &ldquo;Cancelada&rdquo;}
                      </Badge>

                      {session.status === &ldquo;scheduled&rdquo; && (
                        <Button size=&ldquo;sm&rdquo;>
                          <Video className=&ldquo;h-3 w-3 mr-1&rdquo; />
                          Unirse
                        </Button>
                      )}

                      {session.status === &ldquo;completed&rdquo; && session.feedback && (
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                          <span className=&ldquo;text-sm&rdquo;>
                            {session.feedback.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {session.feedback && (
                    <div className=&ldquo;mt-4 p-3 bg-gray-50 rounded-lg&rdquo;>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
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
        <TabsContent value=&ldquo;programs&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h2 className=&ldquo;text-xl font-semibold&rdquo;>
              Programas de Mentoría Grupal
            </h2>
          </div>

          <div className=&ldquo;space-y-6&rdquo;>
            {programs.map((program) => (
              <Card key={program.id} className=&ldquo;overflow-hidden&rdquo;>
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-start justify-between mb-4&rdquo;>
                    <div className=&ldquo;flex-1&rdquo;>
                      <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
                        <h3 className=&ldquo;text-xl font-semibold&rdquo;>
                          {program.title}
                        </h3>
                        <Badge variant=&ldquo;outline&rdquo;>
                          {program.level === &ldquo;beginner&rdquo;
                            ? &ldquo;Principiante&rdquo;
                            : program.level === &ldquo;intermediate&rdquo;
                              ? &ldquo;Intermedio&rdquo;
                              : &ldquo;Avanzado&rdquo;}
                        </Badge>
                      </div>

                      <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                        {program.description}
                      </p>

                      <div className=&ldquo;flex items-center gap-4 mb-4&rdquo;>
                        <Avatar className=&ldquo;h-8 w-8&rdquo;>
                          <AvatarImage
                            src={program.mentorAvatar}
                            alt={program.mentorName}
                          />
                          <AvatarFallback>
                            {program.mentorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className=&ldquo;text-sm font-medium&rdquo;>
                            {program.mentorName}
                          </p>
                          <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                            Mentor principal
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className=&ldquo;text-right&rdquo;>
                      <div className=&ldquo;text-2xl font-bold mb-1&rdquo;>
                        Bs. {program.price}
                      </div>
                      <div className=&ldquo;text-sm text-muted-foreground mb-2&rdquo;>
                        {program.duration}
                      </div>
                      <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        Inicia: {program.startDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-6 mb-4&rdquo;>
                    <div>
                      <h4 className=&ldquo;font-medium mb-2&rdquo;>Temas que se cubren:</h4>
                      <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                        {program.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant=&ldquo;secondary&rdquo;
                            className=&ldquo;text-xs&rdquo;
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className=&ldquo;font-medium mb-2&rdquo;>
                        Objetivos del programa:
                      </h4>
                      <ul className=&ldquo;text-sm text-muted-foreground space-y-1&rdquo;>
                        {program.objectives
                          .slice(0, 3)
                          .map((objective, index) => (
                            <li key={index} className=&ldquo;flex items-center gap-2&rdquo;>
                              <CheckCircle className=&ldquo;h-3 w-3 text-green-500 flex-shrink-0&rdquo; />
                              {objective}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className=&ldquo;flex items-center justify-between&rdquo;>
                    <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground&rdquo;>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Users className=&ldquo;h-4 w-4&rdquo; />
                        {program.participants}/{program.maxParticipants}{&ldquo; &rdquo;}
                        participantes
                      </div>
                      <Progress
                        value={
                          (program.participants / program.maxParticipants) * 100
                        }
                        className=&ldquo;w-24 h-2&rdquo;
                      />
                    </div>

                    <Button>
                      <BookOpen className=&ldquo;h-4 w-4 mr-2&rdquo; />
                      Inscribirse al Programa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Become Mentor Tab */}
        <TabsContent value=&ldquo;become-mentor&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader className=&ldquo;text-center&rdquo;>
              <CardTitle className=&ldquo;text-2xl&rdquo;>Conviértete en Mentor</CardTitle>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Comparte tu experiencia y ayuda a la próxima generación de
                emprendedores
              </p>
            </CardHeader>
            <CardContent className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-6&rdquo;>
                <Card>
                  <CardContent className=&ldquo;p-6 text-center&rdquo;>
                    <div className=&ldquo;w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                      <Users className=&ldquo;h-6 w-6 text-blue-600&rdquo; />
                    </div>
                    <h3 className=&ldquo;font-semibold mb-2&rdquo;>Impacto Real</h3>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Ayuda a emprendedores jóvenes a superar desafíos y
                      alcanzar sus metas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className=&ldquo;p-6 text-center&rdquo;>
                    <div className=&ldquo;w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                      <Trophy className=&ldquo;h-6 w-6 text-green-600&rdquo; />
                    </div>
                    <h3 className=&ldquo;font-semibold mb-2&rdquo;>Reconocimiento</h3>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Gana reconocimiento como líder en tu industria y expande
                      tu red
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className=&ldquo;p-6 text-center&rdquo;>
                    <div className=&ldquo;w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4&rdquo;>
                      <Target className=&ldquo;h-6 w-6 text-purple-600&rdquo; />
                    </div>
                    <h3 className=&ldquo;font-semibold mb-2&rdquo;>Flexibilidad</h3>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Define tu horario, tarifas y el tipo de mentoría que
                      quieres ofrecer
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className=&ldquo;space-y-4&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                  Requisitos para ser mentor:
                </h3>
                <ul className=&ldquo;space-y-2&rdquo;>
                  <li className=&ldquo;flex items-center gap-2&rdquo;>
                    <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                    <span className=&ldquo;text-sm&rdquo;>
                      Mínimo 3 años de experiencia en tu área
                    </span>
                  </li>
                  <li className=&ldquo;flex items-center gap-2&rdquo;>
                    <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                    <span className=&ldquo;text-sm&rdquo;>
                      Experiencia como emprendedor o en liderazgo
                    </span>
                  </li>
                  <li className=&ldquo;flex items-center gap-2&rdquo;>
                    <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                    <span className=&ldquo;text-sm&rdquo;>
                      Pasión por ayudar a otros emprendedores
                    </span>
                  </li>
                  <li className=&ldquo;flex items-center gap-2&rdquo;>
                    <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                    <span className=&ldquo;text-sm&rdquo;>
                      Compromiso de al menos 2 horas por semana
                    </span>
                  </li>
                </ul>
              </div>

              <div className=&ldquo;text-center&rdquo;>
                <Button size=&ldquo;lg&rdquo; className=&ldquo;w-full md:w-auto&rdquo;>
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
