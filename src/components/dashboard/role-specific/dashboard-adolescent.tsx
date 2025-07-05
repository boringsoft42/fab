&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
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
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
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
  Users,
  BookOpen,
  Briefcase,
  Shield,
  Info,
  GraduationCapIcon,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  ExternalLink,
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
} from &ldquo;lucide-react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;

// News types
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  authorName: string;
  authorType: &ldquo;COMPANY&rdquo; | &ldquo;GOVERNMENT&rdquo; | &ldquo;NGO&rdquo;;
  authorLogo?: string;
  priority: &ldquo;LOW&rdquo; | &ldquo;MEDIUM&rdquo; | &ldquo;HIGH&rdquo; | &ldquo;URGENT&rdquo;;
  category?: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  tags: string[];
  featured?: boolean;
  readTime?: number;
}

// Enhanced News Carousel Component
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

      // Fetch company news
      const companyResponse = await fetch(
        &ldquo;/api/news?type=company&featured=true&targetAudience=YOUTH&limit=6&rdquo;
      );
      const companyData = await companyResponse.json();

      // Fetch government/NGO news
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      day: &ldquo;2-digit&rdquo;,
      month: &ldquo;short&rdquo;,
      year: &ldquo;numeric&rdquo;,
    });
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
    return formatDate(dateString);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case &ldquo;URGENT&rdquo;:
        return &ldquo;bg-red-500 text-white&rdquo;;
      case &ldquo;HIGH&rdquo;:
        return &ldquo;bg-orange-500 text-white&rdquo;;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;bg-blue-500 text-white&rdquo;;
      case &ldquo;LOW&rdquo;:
        return &ldquo;bg-gray-500 text-white&rdquo;;
      default:
        return &ldquo;bg-gray-500 text-white&rdquo;;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case &ldquo;URGENT&rdquo;:
        return <AlertCircle className=&ldquo;w-3 h-3&rdquo; />;
      case &ldquo;HIGH&rdquo;:
        return <Star className=&ldquo;w-3 h-3&rdquo; />;
      default:
        return <Info className=&ldquo;w-3 h-3&rdquo; />;
    }
  };

  const nextCompany = () => {
    setCompanyIndex((prev) => (prev + 1) % Math.max(1, companyNews.length - 2));
  };

  const prevCompany = () => {
    setCompanyIndex(
      (prev) =>
        (prev - 1 + Math.max(1, companyNews.length - 2)) %
        Math.max(1, companyNews.length - 2)
    );
  };

  const nextGovernment = () => {
    setGovernmentIndex(
      (prev) => (prev + 1) % Math.max(1, governmentNews.length - 2)
    );
  };

  const prevGovernment = () => {
    setGovernmentIndex(
      (prev) =>
        (prev - 1 + Math.max(1, governmentNews.length - 2)) %
        Math.max(1, governmentNews.length - 2)
    );
  };

  const EnhancedNewsCard = ({
    article,
    compact = false,
    featured = false,
  }: {
    article: NewsArticle;
    compact?: boolean;
    featured?: boolean;
  }) => (
    <Card
      className={`hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
        compact ? &ldquo;h-full&rdquo; : &ldquo;&rdquo;
      } ${featured ? &ldquo;ring-2 ring-blue-500/20 shadow-lg&rdquo; : &ldquo;&rdquo;}`}
    >
      <div className=&ldquo;relative&rdquo;>
        {article.imageUrl ? (
          <div
            className={`relative ${compact ? &ldquo;h-32&rdquo; : &ldquo;h-48&rdquo;} overflow-hidden`}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className=&ldquo;w-full h-full object-cover group-hover:scale-105 transition-transform duration-300&rdquo;
            />
            <div className=&ldquo;absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent&rdquo; />

            {/* Priority Badge */}
            <div className=&ldquo;absolute top-3 left-3&rdquo;>
              <Badge
                className={`${getPriorityColor(article.priority)} border-0 flex items-center gap-1`}
              >
                {getPriorityIcon(article.priority)}
                {article.priority === &ldquo;URGENT&rdquo;
                  ? &ldquo;Urgente&rdquo;
                  : article.priority === &ldquo;HIGH&rdquo;
                    ? &ldquo;Importante&rdquo;
                    : article.priority === &ldquo;MEDIUM&rdquo;
                      ? &ldquo;Medio&rdquo;
                      : &ldquo;Información&rdquo;}
              </Badge>
            </div>

            {/* Category Badge */}
            {article.category && (
              <div className=&ldquo;absolute top-3 right-3&rdquo;>
                <Badge
                  variant=&ldquo;secondary&rdquo;
                  className=&ldquo;bg-white/90 text-gray-700&rdquo;
                >
                  {article.category}
                </Badge>
              </div>
            )}

            {/* Featured Badge */}
            {featured && (
              <div className=&ldquo;absolute bottom-3 right-3&rdquo;>
                <Badge className=&ldquo;bg-yellow-500 text-white&rdquo;>
                  <Star className=&ldquo;w-3 h-3 mr-1&rdquo; />
                  Destacado
                </Badge>
              </div>
            )}

            {/* Read Time */}
            {article.readTime && (
              <div className=&ldquo;absolute bottom-3 left-3&rdquo;>
                <Badge
                  variant=&ldquo;secondary&rdquo;
                  className=&ldquo;bg-black/50 text-white border-0&rdquo;
                >
                  <Clock className=&ldquo;w-3 h-3 mr-1&rdquo; />
                  {article.readTime} min
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`${compact ? &ldquo;h-32&rdquo; : &ldquo;h-48&rdquo;} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
          >
            <Newspaper className=&ldquo;w-8 h-8 text-gray-400&rdquo; />
          </div>
        )}
      </div>

      <CardContent className=&ldquo;p-4 space-y-3&rdquo;>
        {/* Author Info */}
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div className=&ldquo;flex items-center gap-2&rdquo;>
            <Avatar className=&ldquo;w-6 h-6&rdquo;>
              <AvatarImage src={article.authorLogo} alt={article.authorName} />
              <AvatarFallback className=&ldquo;text-xs&rdquo;>
                {article.authorType === &ldquo;COMPANY&rdquo; ? (
                  <Building2 className=&ldquo;w-3 h-3&rdquo; />
                ) : (
                  <Shield className=&ldquo;w-3 h-3&rdquo; />
                )}
              </AvatarFallback>
            </Avatar>
            <span className=&ldquo;text-xs font-medium text-gray-600&rdquo;>
              {article.authorName}
            </span>
          </div>
          <div className=&ldquo;flex items-center gap-1 text-xs text-muted-foreground&rdquo;>
            <Calendar className=&ldquo;w-3 h-3&rdquo; />
            {formatTimeAgo(article.publishedAt)}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors ${
            compact ? &ldquo;text-sm&rdquo; : &ldquo;text-base&rdquo;
          }`}
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p
          className={`text-muted-foreground line-clamp-2 ${
            compact ? &ldquo;text-xs&rdquo; : &ldquo;text-sm&rdquo;
          }`}
        >
          {article.summary}
        </p>

        {/* Tags */}
        <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
          {article.tags.slice(0, compact ? 2 : 3).map((tag, index) => (
            <Badge
              key={index}
              variant=&ldquo;outline&rdquo;
              className=&ldquo;text-xs px-2 py-0.5 border-gray-300 text-gray-600 hover:bg-gray-50&rdquo;
            >
              {tag}
            </Badge>
          ))}
          {article.tags.length > (compact ? 2 : 3) && (
            <Badge
              variant=&ldquo;outline&rdquo;
              className=&ldquo;text-xs px-2 py-0.5 text-gray-500&rdquo;
            >
              +{article.tags.length - (compact ? 2 : 3)}
            </Badge>
          )}
        </div>

        {/* Engagement Stats & Actions */}
        <div className=&ldquo;flex items-center justify-between pt-2 border-t border-gray-100&rdquo;>
          <div className=&ldquo;flex items-center gap-4 text-xs text-muted-foreground&rdquo;>
            <div className=&ldquo;flex items-center gap-1 hover:text-blue-600 cursor-pointer&rdquo;>
              <Eye className=&ldquo;w-3 h-3&rdquo; />
              {article.viewCount.toLocaleString()}
            </div>
            <div className=&ldquo;flex items-center gap-1 hover:text-red-500 cursor-pointer&rdquo;>
              <ThumbsUp className=&ldquo;w-3 h-3&rdquo; />
              {article.likeCount.toLocaleString()}
            </div>
            <div className=&ldquo;flex items-center gap-1 hover:text-green-600 cursor-pointer&rdquo;>
              <MessageSquare className=&ldquo;w-3 h-3&rdquo; />
              {article.commentCount.toLocaleString()}
            </div>
            {article.shareCount && (
              <div className=&ldquo;flex items-center gap-1 hover:text-purple-600 cursor-pointer&rdquo;>
                <Share2 className=&ldquo;w-3 h-3&rdquo; />
                {article.shareCount.toLocaleString()}
              </div>
            )}
          </div>

          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Button
              variant=&ldquo;ghost&rdquo;
              size=&ldquo;sm&rdquo;
              className=&ldquo;h-6 px-2 hover:bg-blue-50 hover:text-blue-600&rdquo;
            >
              <Bookmark className=&ldquo;w-3 h-3&rdquo; />
            </Button>
            <Button
              variant=&ldquo;ghost&rdquo;
              size=&ldquo;sm&rdquo;
              className=&ldquo;h-6 px-2 hover:bg-blue-50 hover:text-blue-600&rdquo;
            >
              <ExternalLink className=&ldquo;w-3 h-3&rdquo; />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className=&ldquo;space-y-6&rdquo;>
        <div className=&ldquo;text-center&rdquo;>
          <Skeleton className=&ldquo;h-8 w-64 mx-auto mb-2&rdquo; />
          <Skeleton className=&ldquo;h-4 w-96 mx-auto&rdquo; />
        </div>
        <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
          {[...Array(2)].map((_, i) => (
            <div key={i} className=&ldquo;space-y-4&rdquo;>
              <Skeleton className=&ldquo;h-6 w-48&rdquo; />
              <div className=&ldquo;grid gap-4&rdquo;>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className=&ldquo;space-y-3&rdquo;>
                    <Skeleton className=&ldquo;h-48 w-full rounded&rdquo; />
                    <Skeleton className=&ldquo;h-4 w-full&rdquo; />
                    <Skeleton className=&ldquo;h-3 w-3/4&rdquo; />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;space-y-8 px-10 py-4&rdquo;>
      {/* Enhanced Header */}
      <div className=&ldquo;text-center space-y-4&rdquo;>
        <div className=&ldquo;flex items-center justify-center gap-3 mb-4&rdquo;>
          <div className=&ldquo;w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center&rdquo;>
            <Newspaper className=&ldquo;w-6 h-6 text-white&rdquo; />
          </div>
          <div className=&ldquo;text-left&rdquo;>
            <h2 className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>
              Centro de Noticias
            </h2>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Mantente informado sobre las últimas oportunidades y anuncios
              importantes
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className=&ldquo;flex items-center justify-center gap-6 text-sm text-muted-foreground&rdquo;>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Building2 className=&ldquo;w-4 h-4&rdquo; />
            {companyNews.length} Noticias Empresariales
          </div>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Shield className=&ldquo;w-4 h-4&rdquo; />
            {governmentNews.length} Noticias Oficiales
          </div>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Clock className=&ldquo;w-4 h-4&rdquo; />
            Actualizado hoy
          </div>
        </div>
      </div>

      {/* Enhanced News Grid */}
      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-8&rdquo;>
        {/* Company News Column */}
        <div className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center&rdquo;>
                <Building2 className=&ldquo;w-5 h-5 text-white&rdquo; />
              </div>
              <div>
                <h3 className=&ldquo;text-xl font-semibold text-gray-900&rdquo;>
                  Noticias Empresariales
                </h3>
                <p className=&ldquo;text-sm text-gray-600&rdquo;>
                  Oportunidades laborales y novedades corporativas
                </p>
              </div>
            </div>
            {companyNews.length > 3 && (
              <div className=&ldquo;flex gap-1&rdquo;>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={prevCompany}>
                  <ChevronLeft className=&ldquo;w-4 h-4&rdquo; />
                </Button>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={nextCompany}>
                  <ChevronRight className=&ldquo;w-4 h-4&rdquo; />
                </Button>
              </div>
            )}
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {companyNews.length > 0 ? (
              <>
                {/* Featured article */}
                <EnhancedNewsCard
                  article={companyNews[companyIndex]}
                  featured={true}
                />

                {/* Compact articles */}
                <div className=&ldquo;grid grid-cols-1 gap-4&rdquo;>
                  {companyNews
                    .slice(companyIndex + 1, companyIndex + 3)
                    .map((article) => (
                      <EnhancedNewsCard
                        key={article.id}
                        article={article}
                        compact
                      />
                    ))}
                </div>
              </>
            ) : (
              <Card className=&ldquo;p-8 text-center border-dashed&rdquo;>
                <Building2 className=&ldquo;w-16 h-16 text-gray-300 mx-auto mb-4&rdquo; />
                <h4 className=&ldquo;font-medium text-gray-900 mb-2&rdquo;>
                  Sin noticias empresariales
                </h4>
                <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
                  No hay noticias empresariales disponibles en este momento
                </p>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo;>
                  <Search className=&ldquo;w-4 h-4 mr-2&rdquo; />
                  Explorar Empleos
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Government/NGO News Column */}
        <div className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center&rdquo;>
                <Shield className=&ldquo;w-5 h-5 text-white&rdquo; />
              </div>
              <div>
                <h3 className=&ldquo;text-xl font-semibold text-gray-900&rdquo;>
                  Noticias Oficiales
                </h3>
                <p className=&ldquo;text-sm text-gray-600&rdquo;>
                  Anuncios gubernamentales y programas sociales
                </p>
              </div>
            </div>
            {governmentNews.length > 3 && (
              <div className=&ldquo;flex gap-1&rdquo;>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={prevGovernment}>
                  <ChevronLeft className=&ldquo;w-4 h-4&rdquo; />
                </Button>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={nextGovernment}>
                  <ChevronRight className=&ldquo;w-4 h-4&rdquo; />
                </Button>
              </div>
            )}
          </div>

          <div className=&ldquo;space-y-4&rdquo;>
            {governmentNews.length > 0 ? (
              <>
                {/* Featured article */}
                <EnhancedNewsCard
                  article={governmentNews[governmentIndex]}
                  featured={true}
                />

                {/* Compact articles */}
                <div className=&ldquo;grid grid-cols-1 gap-4&rdquo;>
                  {governmentNews
                    .slice(governmentIndex + 1, governmentIndex + 3)
                    .map((article) => (
                      <EnhancedNewsCard
                        key={article.id}
                        article={article}
                        compact
                      />
                    ))}
                </div>
              </>
            ) : (
              <Card className=&ldquo;p-8 text-center border-dashed&rdquo;>
                <Shield className=&ldquo;w-16 h-16 text-gray-300 mx-auto mb-4&rdquo; />
                <h4 className=&ldquo;font-medium text-gray-900 mb-2&rdquo;>
                  Sin noticias oficiales
                </h4>
                <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
                  No hay noticias gubernamentales disponibles en este momento
                </p>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo;>
                  <Target className=&ldquo;w-4 h-4 mr-2&rdquo; />
                  Ver Programas
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced View More Section */}
      <div className=&ldquo;text-center space-y-4&rdquo;>
        <div className=&ldquo;flex items-center justify-center gap-4&rdquo;>
          <Button size=&ldquo;lg&rdquo; className=&ldquo;px-6&rdquo;>
            <Newspaper className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Ver Todas las Noticias
          </Button>
          <Button variant=&ldquo;outline&rdquo; size=&ldquo;lg&rdquo;>
            <Star className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Noticias Destacadas
          </Button>
        </div>
        <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
          Actualizado automáticamente cada hora • Últimas{&ldquo; &rdquo;}
          {companyNews.length + governmentNews.length} noticias
        </p>
      </div>
    </div>
  );
}

export function DashboardAdolescent() {
  return (
    <div className=&ldquo;space-y-8&rdquo;>
      {/* Welcome Section */}
      <div className=&ldquo;bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div>
            <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>¡Bienvenido Joven!</h1>
            <p className=&ldquo;text-green-100&rdquo;>
              Explora oportunidades, desarrolla tus habilidades y construye tu
              futuro profesional
            </p>
          </div>
          <div className=&ldquo;hidden md:flex&rdquo;>
            <GraduationCapIcon className=&ldquo;w-16 h-16 text-green-200&rdquo; />
          </div>
        </div>
      </div>

      {/* Parental Consent Notice */}
      <div className=&ldquo;bg-amber-50 border border-amber-200 rounded-lg p-4&rdquo;>
        <div className=&ldquo;flex items-center gap-3&rdquo;>
          <Shield className=&ldquo;w-5 h-5 text-amber-600&rdquo; />
          <div>
            <h3 className=&ldquo;text-sm font-medium text-amber-800&rdquo;>
              Recordatorio Importante
            </h3>
            <p className=&ldquo;text-sm text-amber-700&rdquo;>
              Recuerda que para ciertas actividades necesitas autorización de
              tus padres o tutores.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced News Carousel */}
      <NewsCarousel />

      {/* Quick Access Modules */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-6&rdquo;>
        <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
          <CardHeader className=&ldquo;pb-3&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center&rdquo;>
                <Search className=&ldquo;w-5 h-5 text-white&rdquo; />
              </div>
              <CardTitle className=&ldquo;text-lg&rdquo;>Búsqueda de Empleo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
              Encuentra oportunidades laborales apropiadas para jóvenes
            </p>
            <Button asChild size=&ldquo;sm&rdquo; className=&ldquo;w-full&rdquo;>
              <Link href=&ldquo;/jobs&rdquo;>
                Explorar Ofertas
                <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
          <CardHeader className=&ldquo;pb-3&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center&rdquo;>
                <GraduationCap className=&ldquo;w-5 h-5 text-white&rdquo; />
              </div>
              <CardTitle className=&ldquo;text-lg&rdquo;>Capacitación</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
              Desarrolla nuevas habilidades y obtén certificaciones
            </p>
            <Button asChild size=&ldquo;sm&rdquo; className=&ldquo;w-full&rdquo;>
              <Link href=&ldquo;/courses&rdquo;>
                Ver Cursos
                <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer&rdquo;>
          <CardHeader className=&ldquo;pb-3&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center&rdquo;>
                <Target className=&ldquo;w-5 h-5 text-white&rdquo; />
              </div>
              <CardTitle className=&ldquo;text-lg&rdquo;>Emprendimiento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
              Desarrolla ideas de negocio y habilidades empresariales
            </p>
            <Button asChild size=&ldquo;sm&rdquo; className=&ldquo;w-full&rdquo;>
              <Link href=&ldquo;/entrepreneurship&rdquo;>
                Explorar Ideas
                <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
            <FileText className=&ldquo;w-5 h-5&rdquo; />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;space-y-3&rdquo;>
            <div className=&ldquo;flex items-center justify-between p-3 bg-green-50 rounded-lg&rdquo;>
              <div className=&ldquo;flex items-center gap-3&rdquo;>
                <CheckCircle className=&ldquo;w-4 h-4 text-green-600&rdquo; />
                <span className=&ldquo;text-sm&rdquo;>
                  Completaste &ldquo;Orientación Vocacional - Módulo 1&rdquo;
                </span>
              </div>
              <Badge variant=&ldquo;secondary&rdquo;>Hace 1 día</Badge>
            </div>

            <div className=&ldquo;flex items-center justify-between p-3 bg-purple-50 rounded-lg&rdquo;>
              <div className=&ldquo;flex items-center gap-3&rdquo;>
                <Target className=&ldquo;w-4 h-4 text-purple-600&rdquo; />
                <span className=&ldquo;text-sm&rdquo;>
                  Participaste en taller &ldquo;Educación Financiera Básica&rdquo;
                </span>
              </div>
              <Badge variant=&ldquo;secondary&rdquo;>Hace 3 días</Badge>
            </div>

            <div className=&ldquo;flex items-center justify-between p-3 bg-blue-50 rounded-lg&rdquo;>
              <div className=&ldquo;flex items-center gap-3&rdquo;>
                <Bookmark className=&ldquo;w-4 h-4 text-blue-600&rdquo; />
                <span className=&ldquo;text-sm&rdquo;>
                  Guardaste oferta de trabajo de medio tiempo
                </span>
              </div>
              <Badge variant=&ldquo;secondary&rdquo;>Hace 5 días</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Personal Metrics */}
      <Card className=&ldquo;border border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50&rdquo;>
        <CardHeader>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <div className=&ldquo;flex items-center gap-3&rdquo;>
              <div className=&ldquo;w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center&rdquo;>
                <TrendingUp className=&ldquo;w-6 h-6 text-white&rdquo; />
              </div>
              <div>
                <CardTitle className=&ldquo;text-xl&rdquo;>Progreso Personal</CardTitle>
                <CardDescription>
                  Un vistazo completo a tu actividad y avances en la plataforma
                </CardDescription>
              </div>
            </div>
            <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo;>
              <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Ver Detalles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;grid grid-cols-2 md:grid-cols-4 gap-6&rdquo;>
            <div className=&ldquo;text-center space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mx-auto&rdquo;>
                <Search className=&ldquo;w-8 h-8 text-blue-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>3</div>
                <p className=&ldquo;text-sm font-medium text-gray-600&rdquo;>
                  Postulaciones Activas
                </p>
                <div className=&ldquo;w-full bg-blue-100 rounded-full h-2 mt-2&rdquo;>
                  <div
                    className=&ldquo;bg-blue-500 h-2 rounded-full&rdquo;
                    style={{ width: &ldquo;60%&rdquo; }}
                  ></div>
                </div>
                <p className=&ldquo;text-xs text-gray-500 mt-1&rdquo;>
                  60% tasa de respuesta
                </p>
              </div>
            </div>

            <div className=&ldquo;text-center space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mx-auto&rdquo;>
                <GraduationCap className=&ldquo;w-8 h-8 text-green-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>2</div>
                <p className=&ldquo;text-sm font-medium text-gray-600&rdquo;>
                  Cursos en Progreso
                </p>
                <div className=&ldquo;w-full bg-green-100 rounded-full h-2 mt-2&rdquo;>
                  <div
                    className=&ldquo;bg-green-500 h-2 rounded-full&rdquo;
                    style={{ width: &ldquo;75%&rdquo; }}
                  ></div>
                </div>
                <p className=&ldquo;text-xs text-gray-500 mt-1&rdquo;>75% completado</p>
              </div>
            </div>

            <div className=&ldquo;text-center space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mx-auto&rdquo;>
                <Target className=&ldquo;w-8 h-8 text-purple-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>1</div>
                <p className=&ldquo;text-sm font-medium text-gray-600&rdquo;>
                  Proyecto Emprendimiento
                </p>
                <div className=&ldquo;w-full bg-purple-100 rounded-full h-2 mt-2&rdquo;>
                  <div
                    className=&ldquo;bg-purple-500 h-2 rounded-full&rdquo;
                    style={{ width: &ldquo;40%&rdquo; }}
                  ></div>
                </div>
                <p className=&ldquo;text-xs text-gray-500 mt-1&rdquo;>En desarrollo</p>
              </div>
            </div>

            <div className=&ldquo;text-center space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-center w-16 h-16 bg-orange-100 rounded-xl mx-auto&rdquo;>
                <Award className=&ldquo;w-8 h-8 text-orange-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>4</div>
                <p className=&ldquo;text-sm font-medium text-gray-600&rdquo;>
                  Certificados Obtenidos
                </p>
                <div className=&ldquo;w-full bg-orange-100 rounded-full h-2 mt-2&rdquo;>
                  <div
                    className=&ldquo;bg-orange-500 h-2 rounded-full&rdquo;
                    style={{ width: &ldquo;80%&rdquo; }}
                  ></div>
                </div>
                <p className=&ldquo;text-xs text-gray-500 mt-1&rdquo;>
                  Meta: 5 certificados
                </p>
              </div>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className=&ldquo;grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200&rdquo;>
            <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center&rdquo;>
                <Clock className=&ldquo;w-5 h-5 text-yellow-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>12h</div>
                <p className=&ldquo;text-xs text-gray-600&rdquo;>
                  Tiempo de estudio esta semana
                </p>
              </div>
            </div>

            <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center&rdquo;>
                <Users className=&ldquo;w-5 h-5 text-indigo-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>8</div>
                <p className=&ldquo;text-xs text-gray-600&rdquo;>
                  Conexiones profesionales
                </p>
              </div>
            </div>

            <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
              <div className=&ldquo;w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center&rdquo;>
                <Star className=&ldquo;w-5 h-5 text-pink-600&rdquo; />
              </div>
              <div>
                <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>4.8</div>
                <p className=&ldquo;text-xs text-gray-600&rdquo;>Calificación promedio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className=&ldquo;border-dashed&rdquo;>
        <CardContent className=&ldquo;p-6 text-center&rdquo;>
          <Heart className=&ldquo;w-8 h-8 text-pink-500 mx-auto mb-4&rdquo; />
          <h3 className=&ldquo;text-lg font-medium mb-2&rdquo;>¿Necesitas ayuda?</h3>
          <p className=&ldquo;text-gray-600 mb-4&rdquo;>
            Estamos aquí para apoyarte en tu desarrollo académico y profesional
          </p>
          <div className=&ldquo;flex flex-col sm:flex-row gap-2 justify-center&rdquo;>
            <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; asChild>
              <Link href=&ldquo;/support/academic&rdquo;>Apoyo Académico</Link>
            </Button>
            <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; asChild>
              <Link href=&ldquo;/support/career&rdquo;>Orientación Profesional</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
