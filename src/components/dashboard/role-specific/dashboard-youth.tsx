"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  FileText,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Clock,
  Award,
  Target,
  ArrowRight,
  User,
  BookOpen,
  Briefcase,
  BrainCircuit,
  BarChart3,
  Shield,
  Building2,
  Newspaper,
  Star,
  Calendar,
  ThumbsUp,
  Share2,
  Bookmark,
  Play,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  ExternalLink,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// News types
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  authorName: string;
  authorType: "COMPANY" | "GOVERNMENT" | "NGO";
  authorLogo?: string;
  publishedAt: string;
}

function NewsCarousel() {
  const [companyNews, setCompanyNews] = useState<NewsArticle[]>([]);
  const [governmentNews, setGovernmentNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyIndex, setCompanyIndex] = useState(0);
  const [governmentIndex, setGovernmentIndex] = useState(0);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const companyResponse = await fetch(
        "/api/news?type=company&featured=true&targetAudience=YOUTH&limit=6"
      );
      const companyData = await companyResponse.json();
      const govResponse = await fetch(
        "/api/news?type=government&targetAudience=YOUTH&limit=6"
      );
      const govData = await govResponse.json();
      const ngoResponse = await fetch(
        "/api/news?type=ngo&targetAudience=YOUTH&limit=6"
      );
      const ngoData = await ngoResponse.json();
      setCompanyNews(companyData.news || []);
      setGovernmentNews([...(govData.news || []), ...(ngoData.news || [])]);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Hace 1 día";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30)
      return `Hace ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? "s" : ""}`;
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Link href={`/news/${article.id}`} className="block">
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-40">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
              <Newspaper className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="w-5 h-5">
                <AvatarImage
                  src={article.authorLogo}
                  alt={article.authorName}
                />
                <AvatarFallback>
                  {article.authorType === "COMPANY" ? (
                    <Building2 className="w-3 h-3" />
                  ) : (
                    <Shield className="w-3 h-3" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-white/90">
                {article.authorName}
              </span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTimeAgo(article.publishedAt)}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Ver más
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Centro de Noticias</h2>
        <p className="text-muted-foreground">
          Mantente informado sobre las últimas novedades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company News Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Noticias Empresariales</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCompanyIndex(
                    (prev) =>
                      (prev - 1 + companyNews.length) % companyNews.length
                  )
                }
                disabled={companyNews.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCompanyIndex((prev) => (prev + 1) % companyNews.length)
                }
                disabled={companyNews.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {companyNews.length > 0 ? (
            <NewsCard article={companyNews[companyIndex]} />
          ) : (
            <Card className="p-6 text-center border-dashed">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay noticias empresariales disponibles
              </p>
            </Card>
          )}
        </div>

        {/* Government/NGO News Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Noticias Institucionales</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setGovernmentIndex(
                    (prev) =>
                      (prev - 1 + governmentNews.length) % governmentNews.length
                  )
                }
                disabled={governmentNews.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setGovernmentIndex(
                    (prev) => (prev + 1) % governmentNews.length
                  )
                }
                disabled={governmentNews.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {governmentNews.length > 0 ? (
            <NewsCard article={governmentNews[governmentIndex]} />
          ) : (
            <Card className="p-6 text-center border-dashed">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay noticias institucionales disponibles
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/news">
            <Newspaper className="w-4 h-4 mr-2" />
            Ver Todas las Noticias
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function DashboardYouth() {
  const modules = [
    {
      title: "Búsqueda de Empleo",
      description:
        "Encuentra oportunidades laborales que se ajusten a tu perfil",
      icon: Search,
      href: "/jobs",
      color: "bg-blue-500",
      stats: [
        { label: "Ofertas Activas", value: "156" },
        { label: "Postulaciones", value: "3" },
        { label: "Entrevistas", value: "1" },
      ],
      actions: [
        { label: "Explorar Ofertas", href: "/jobs/browse" },
        { label: "Mis Postulaciones", href: "/jobs/applications" },
        { label: "Crear Alerta", href: "/jobs/alerts" },
      ],
    },
    {
      title: "Capacitación y Recursos Formativos",
      description: "Desarrolla nuevas habilidades y obtén certificaciones",
      icon: GraduationCap,
      href: "/training",
      color: "bg-green-500",
      stats: [
        { label: "Cursos Disponibles", value: "45" },
        { label: "En Progreso", value: "2" },
        { label: "Completados", value: "8" },
      ],
      actions: [
        { label: "Ver Cursos", href: "/training/courses" },
        { label: "Mis Cursos", href: "/training/my-courses" },
        { label: "Certificados", href: "/training/certificates" },
      ],
    },
    {
      title: "Emprendimiento",
      description: "Convierte tus ideas en negocios exitosos",
      icon: Target,
      href: "/entrepreneurship",
      color: "bg-purple-500",
      stats: [
        { label: "Recursos", value: "28" },
        { label: "Mentorías", value: "12" },
        { label: "Mi Proyecto", value: "1" },
      ],
      actions: [
        { label: "Ideas de Negocio", href: "/entrepreneurship/ideas" },
        { label: "Buscar Mentor", href: "/entrepreneurship/mentoring" },
        { label: "Mi Proyecto", href: "/entrepreneurship/my-project" },
      ],
    },
    {
      title: "Reportes Personales",
      description: "Analiza tu progreso y rendimiento laboral",
      icon: BarChart3,
      href: "/reports",
      color: "bg-orange-500",
      stats: [
        { label: "Postulaciones", value: "15" },
        { label: "Respuestas", value: "8" },
        { label: "Tasa Éxito", value: "53%" },
      ],
      actions: [
        { label: "Ver Reportes", href: "/reports/personal" },
        { label: "Análisis CV", href: "/reports/cv-analysis" },
        { label: "Progreso", href: "/reports/progress" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido Joven!</h1>
            <p className="text-blue-100">
              Explora oportunidades de empleo, desarrolla tus habilidades y
              construye tu futuro profesional
            </p>
          </div>
          <div className="hidden md:flex">
            <BrainCircuit className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* News Section */}
      <NewsCarousel />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Postulaciones Activas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Cursos en Progreso</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Proyecto Emprendimiento</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Tasa de Respuesta</p>
                <p className="text-2xl font-bold">53%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {module.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {module.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={action.href}>
                        {action.label}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  Te postulaste a "Desarrollador Frontend Jr."
                </span>
              </div>
              <Badge variant="secondary">Hace 2 días</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  Completaste "Fundamentos de React"
                </span>
              </div>
              <Badge variant="secondary">Hace 5 días</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Actualizaste tu plan de negocio</span>
              </div>
              <Badge variant="secondary">Hace 1 semana</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
