&ldquo;use client&rdquo;;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
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
  Rocket,
  Sparkles,
  Trophy,
  Heart,
  Zap,
  PartyPopper,
  Send,
} from &ldquo;lucide-react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { useState, useEffect } from &ldquo;react&rdquo;;
import { motion } from &ldquo;framer-motion&rdquo;;

// News types
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  authorName: string;
  authorType: &ldquo;COMPANY&rdquo; | &ldquo;GOVERNMENT&rdquo; | &ldquo;NGO&rdquo;;
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
        &ldquo;/api/news?type=company&featured=true&targetAudience=YOUTH&limit=6&rdquo;
      );
      const companyData = await companyResponse.json();
      const govResponse = await fetch(
        &ldquo;/api/news?type=government&targetAudience=YOUTH&limit=6&rdquo;
      );
      const govData = await govResponse.json();
      const ngoResponse = await fetch(
        &ldquo;/api/news?type=ngo&targetAudience=YOUTH&limit=6&rdquo;
      );
      const ngoData = await ngoResponse.json();
      setCompanyNews(companyData.news || []);
      setGovernmentNews([...(govData.news || []), ...(ngoData.news || [])]);
    } catch (error) {
      console.error(&ldquo;Error fetching news:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return &ldquo;Hace 1 día&rdquo;;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30)
      return `Hace ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? &ldquo;s&rdquo; : &ldquo;&rdquo;}`;
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      day: &ldquo;2-digit&rdquo;,
      month: &ldquo;short&rdquo;,
    });
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Link href={`/news/${article.id}`} className=&ldquo;block&rdquo;>
      <Card className=&ldquo;group cursor-pointer hover:shadow-lg transition-all duration-300 h-full&rdquo;>
        <div className=&ldquo;relative h-40&rdquo;>
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className=&ldquo;w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity&rdquo;
            />
          ) : (
            <div className=&ldquo;w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg&rdquo;>
              <Newspaper className=&ldquo;w-8 h-8 text-gray-400&rdquo; />
            </div>
          )}
          <div className=&ldquo;absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg&rdquo; />
          <div className=&ldquo;absolute bottom-3 left-3 right-3&rdquo;>
            <div className=&ldquo;flex items-center gap-2 mb-1&rdquo;>
              <Avatar className=&ldquo;w-5 h-5&rdquo;>
                <AvatarImage
                  src={article.authorLogo}
                  alt={article.authorName}
                />
                <AvatarFallback>
                  {article.authorType === &ldquo;COMPANY&rdquo; ? (
                    <Building2 className=&ldquo;w-3 h-3&rdquo; />
                  ) : (
                    <Shield className=&ldquo;w-3 h-3&rdquo; />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className=&ldquo;text-xs text-white/90&rdquo;>
                {article.authorName}
              </span>
            </div>
          </div>
        </div>
        <CardContent className=&ldquo;p-4&rdquo;>
          <h3 className=&ldquo;font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors&rdquo;>
            {article.title}
          </h3>
          <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground&rdquo;>
            <span>{formatTimeAgo(article.publishedAt)}</span>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <span className=&ldquo;flex items-center gap-1&rdquo;>
                <Eye className=&ldquo;w-3 h-3&rdquo; />
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
      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-8&rdquo;>
        {[0, 1].map((i) => (
          <div key={i} className=&ldquo;space-y-4&rdquo;>
            <Skeleton className=&ldquo;h-8 w-48&rdquo; />
            <Skeleton className=&ldquo;h-[300px] w-full rounded-lg&rdquo; />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=&ldquo;space-y-8&rdquo;>
      <div className=&ldquo;text-center space-y-2&rdquo;>
        <h2 className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>Centro de Noticias</h2>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Mantente informado sobre las últimas novedades
        </p>
      </div>

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-8&rdquo;>
        {/* Company News Column */}
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <div className=&ldquo;w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center&rdquo;>
                <Building2 className=&ldquo;w-4 h-4 text-white&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold&rdquo;>Noticias Empresariales</h3>
            </div>
            <div className=&ldquo;flex gap-1&rdquo;>
              <Button
                variant=&ldquo;outline&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() =>
                  setCompanyIndex(
                    (prev) =>
                      (prev - 1 + companyNews.length) % companyNews.length
                  )
                }
                disabled={companyNews.length <= 1}
              >
                <ChevronLeft className=&ldquo;w-4 h-4&rdquo; />
              </Button>
              <Button
                variant=&ldquo;outline&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() =>
                  setCompanyIndex((prev) => (prev + 1) % companyNews.length)
                }
                disabled={companyNews.length <= 1}
              >
                <ChevronRight className=&ldquo;w-4 h-4&rdquo; />
              </Button>
            </div>
          </div>
          {companyNews.length > 0 ? (
            <NewsCard article={companyNews[companyIndex]} />
          ) : (
            <Card className=&ldquo;p-6 text-center border-dashed&rdquo;>
              <Building2 className=&ldquo;w-12 h-12 text-gray-300 mx-auto mb-3&rdquo; />
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                No hay noticias empresariales disponibles
              </p>
            </Card>
          )}
        </div>

        {/* Government/NGO News Column */}
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <div className=&ldquo;w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center&rdquo;>
                <Shield className=&ldquo;w-4 h-4 text-white&rdquo; />
              </div>
              <h3 className=&ldquo;font-semibold&rdquo;>Noticias Institucionales</h3>
            </div>
            <div className=&ldquo;flex gap-1&rdquo;>
              <Button
                variant=&ldquo;outline&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() =>
                  setGovernmentIndex(
                    (prev) =>
                      (prev - 1 + governmentNews.length) % governmentNews.length
                  )
                }
                disabled={governmentNews.length <= 1}
              >
                <ChevronLeft className=&ldquo;w-4 h-4&rdquo; />
              </Button>
              <Button
                variant=&ldquo;outline&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() =>
                  setGovernmentIndex(
                    (prev) => (prev + 1) % governmentNews.length
                  )
                }
                disabled={governmentNews.length <= 1}
              >
                <ChevronRight className=&ldquo;w-4 h-4&rdquo; />
              </Button>
            </div>
          </div>
          {governmentNews.length > 0 ? (
            <NewsCard article={governmentNews[governmentIndex]} />
          ) : (
            <Card className=&ldquo;p-6 text-center border-dashed&rdquo;>
              <Shield className=&ldquo;w-12 h-12 text-gray-300 mx-auto mb-3&rdquo; />
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                No hay noticias institucionales disponibles
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className=&ldquo;flex justify-center&rdquo;>
        <Button asChild>
          <Link href=&ldquo;/news&rdquo;>
            <Newspaper className=&ldquo;w-4 h-4 mr-2&rdquo; />
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
      title: &ldquo;Empleos&rdquo;,
      description: &ldquo;¡Encuentra tu trabajo ideal!&rdquo;,
      icon: Rocket,
      href: &ldquo;/jobs&rdquo;,
      color: &ldquo;bg-blue-500&rdquo;,
      metric: { label: &ldquo;Ofertas&rdquo;, value: &ldquo;156&rdquo;, icon: Sparkles },
      actions: [
        { label: &ldquo;Explorar&rdquo;, href: &ldquo;/jobs/browse&rdquo; },
        { label: &ldquo;Mis Postulaciones&rdquo;, href: &ldquo;/jobs/applications&rdquo; },
      ],
    },
    {
      title: &ldquo;Cursos&rdquo;,
      description: &ldquo;¡Aprende algo nuevo!&rdquo;,
      icon: GraduationCap,
      href: &ldquo;/training&rdquo;,
      color: &ldquo;bg-green-500&rdquo;,
      metric: { label: &ldquo;En curso&rdquo;, value: &ldquo;2&rdquo;, icon: Play },
      actions: [
        { label: &ldquo;Ver Cursos&rdquo;, href: &ldquo;/training/courses&rdquo; },
        { label: &ldquo;Mis Cursos&rdquo;, href: &ldquo;/training/my-courses&rdquo; },
      ],
    },
    {
      title: &ldquo;Emprendimiento&rdquo;,
      description: &ldquo;¡Crea tu negocio!&rdquo;,
      icon: Zap,
      href: &ldquo;/entrepreneurship&rdquo;,
      color: &ldquo;bg-purple-500&rdquo;,
      metric: { label: &ldquo;Proyectos&rdquo;, value: &ldquo;1&rdquo;, icon: Target },
      actions: [
        { label: &ldquo;Empezar&rdquo;, href: &ldquo;/entrepreneurship/ideas&rdquo; },
        { label: &ldquo;Mi Proyecto&rdquo;, href: &ldquo;/entrepreneurship/my-project&rdquo; },
      ],
    },
  ];

  return (
    <div className=&ldquo;space-y-8 px-10 py-4&rdquo;>
      {/* Welcome Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=&ldquo;bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg&rdquo;
      >
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div className=&ldquo;space-y-2&rdquo;>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className=&ldquo;text-4xl font-bold&rdquo;
            >
              ¡Hola! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className=&ldquo;text-xl text-blue-100&rdquo;
            >
              ¿Qué quieres hacer hoy?
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: &ldquo;spring&rdquo;, stiffness: 200 }}
            className=&ldquo;hidden md:block&rdquo;
          >
            <BrainCircuit className=&ldquo;w-24 h-24 text-blue-200&rdquo; />
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
      <div className=&ldquo;grid grid-cols-3 gap-6&rdquo;>
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`${module.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className=&ldquo;flex flex-col items-center text-center space-y-3&rdquo;>
              <motion.div
                whileHover={{ rotate: 10 }}
                className=&ldquo;bg-white/20 rounded-xl p-3&rdquo;
              >
                <module.metric.icon className=&ldquo;w-8 h-8&rdquo; />
              </motion.div>
              <p className=&ldquo;text-3xl font-bold&rdquo;>{module.metric.value}</p>
              <p className=&ldquo;text-sm text-white/90&rdquo;>{module.metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Modules with Animation */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-6&rdquo;>
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className=&ldquo;group cursor-pointer hover:shadow-xl transition-all duration-300&rdquo;>
                <CardHeader>
                  <div className=&ldquo;flex items-center gap-4&rdquo;>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center`}
                    >
                      <Icon className=&ldquo;w-8 h-8 text-white&rdquo; />
                    </motion.div>
                    <div>
                      <CardTitle className=&ldquo;text-2xl&rdquo;>{module.title}</CardTitle>
                      <CardDescription className=&ldquo;text-base&rdquo;>
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Actions */}
                  <div className=&ldquo;flex gap-3&rdquo;>
                    {module.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={index === 0 ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;}
                        size=&ldquo;lg&rdquo;
                        className=&ldquo;flex-1&rdquo;
                        asChild
                      >
                        <Link href={action.href}>
                          {action.label}
                          <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
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
            <CardTitle className=&ldquo;flex items-center gap-2 text-2xl&rdquo;>
              <FileText className=&ldquo;w-8 h-8&rdquo; />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className=&ldquo;space-y-4&rdquo;>
              {[
                {
                  icon: Briefcase,
                  text: &ldquo;¡Postulaste a un trabajo!&rdquo;,
                  time: &ldquo;Hace 2 días&rdquo;,
                  color: &ldquo;blue&rdquo;,
                },
                {
                  icon: BookOpen,
                  text: &ldquo;¡Completaste un curso!&rdquo;,
                  time: &ldquo;Hace 5 días&rdquo;,
                  color: &ldquo;green&rdquo;,
                },
                {
                  icon: Target,
                  text: &ldquo;¡Nueva idea de negocio!&rdquo;,
                  time: &ldquo;Hace 1 semana&rdquo;,
                  color: &ldquo;purple&rdquo;,
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className={`flex items-center justify-between p-4 bg-${activity.color}-50 rounded-xl`}
                >
                  <div className=&ldquo;flex items-center gap-3&rdquo;>
                    <activity.icon
                      className={`w-6 h-6 text-${activity.color}-600`}
                    />
                    <span className=&ldquo;text-lg&rdquo;>{activity.text}</span>
                  </div>
                  <Badge variant=&ldquo;secondary&rdquo;>{activity.time}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
