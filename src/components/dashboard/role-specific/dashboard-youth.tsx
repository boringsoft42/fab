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
  FileText,
  Building2,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Rocket,
  Sparkles,
  GraduationCap,
  Play,
  Zap,
  Target,
  BrainCircuit,
  ArrowRight,
  Briefcase,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
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
      title: "Empleos",
      description: "¡Encuentra tu trabajo ideal!",
      icon: Rocket,
      href: "/jobs",
      color: "bg-blue-500",
      metric: { label: "Ofertas", value: "156", icon: Sparkles },
      actions: [
        { label: "Explorar", href: "/jobs/browse" },
        { label: "Mis Postulaciones", href: "/jobs/applications" },
      ],
    },
    {
      title: "Cursos",
      description: "¡Aprende algo nuevo!",
      icon: GraduationCap,
      href: "/training",
      color: "bg-green-500",
      metric: { label: "En curso", value: "2", icon: Play },
      actions: [
        { label: "Ver Cursos", href: "/training/courses" },
        { label: "Mis Cursos", href: "/training/my-courses" },
      ],
    },
    {
      title: "Emprendimiento",
      description: "¡Crea tu negocio!",
      icon: Zap,
      href: "/entrepreneurship",
      color: "bg-purple-500",
      metric: { label: "Proyectos", value: "1", icon: Target },
      actions: [
        { label: "Empezar", href: "/entrepreneurship/ideas" },
        { label: "Mi Proyecto", href: "/entrepreneurship/my-project" },
      ],
    },
  ];

  return (
    <div className="space-y-8 px-10 py-4">
      {/* Welcome Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold"
            >
              ¡Hola! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl text-blue-100"
            >
              ¿Qué quieres hacer hoy?
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="hidden md:block"
          >
            <BrainCircuit className="w-24 h-24 text-blue-200" />
          </motion.div>
        </div>
      </motion.div>

      {/* News Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <NewsCarousel />
      </motion.div>

      {/* Quick Stats with Animation - Single Row */}
      <div className="grid grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`${module.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="bg-white/20 rounded-xl p-3"
              >
                <module.metric.icon className="w-8 h-8" />
              </motion.div>
              <p className="text-3xl font-bold">{module.metric.value}</p>
              <p className="text-sm text-white/90">{module.metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Modules with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl">{module.title}</CardTitle>
                      <CardDescription className="text-base">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Actions */}
                  <div className="flex gap-3">
                    {module.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={index === 0 ? "default" : "outline"}
                        size="lg"
                        className="flex-1"
                        asChild
                      >
                        <Link href={action.href}>
                          {action.label}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-8 h-8" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-4">
              {[
                {
                  icon: Briefcase,
                  text: "¡Postulaste a un trabajo!",
                  time: "Hace 2 días",
                  color: "blue",
                },
                {
                  icon: BookOpen,
                  text: "¡Completaste un curso!",
                  time: "Hace 5 días",
                  color: "green",
                },
                {
                  icon: Target,
                  text: "¡Nueva idea de negocio!",
                  time: "Hace 1 semana",
                  color: "purple",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className={`flex items-center justify-between p-4 bg-${activity.color}-50 rounded-xl`}
                >
                  <div className="flex items-center gap-3">
                    <activity.icon
                      className={`w-6 h-6 text-${activity.color}-600`}
                    />
                    <span className="text-lg">{activity.text}</span>
                  </div>
                  <Badge variant="secondary">{activity.time}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
