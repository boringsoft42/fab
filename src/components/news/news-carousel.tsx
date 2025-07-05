&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MessageSquare,
  Eye,
  ExternalLink,
  Building2,
  Shield,
} from &ldquo;lucide-react&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { NewsArticle } from &ldquo;@/types/news&rdquo;;

interface NewsCarouselProps {
  className?: string;
}

export function NewsCarousel({ className }: NewsCarouselProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case &ldquo;URGENT&rdquo;:
        return &ldquo;bg-red-500&rdquo;;
      case &ldquo;HIGH&rdquo;:
        return &ldquo;bg-orange-500&rdquo;;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;bg-blue-500&rdquo;;
      case &ldquo;LOW&rdquo;:
        return &ldquo;bg-gray-500&rdquo;;
      default:
        return &ldquo;bg-gray-500&rdquo;;
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

  const NewsCard = ({
    article,
    compact = false,
  }: {
    article: NewsArticle;
    compact?: boolean;
  }) => (
    <Card
      className={`hover:shadow-lg transition-shadow cursor-pointer ${compact ? &ldquo;h-full&rdquo; : &ldquo;&rdquo;}`}
    >
      <div className=&ldquo;relative&rdquo;>
        {article.imageUrl && (
          <div
            className={`relative ${compact ? &ldquo;h-32&rdquo; : &ldquo;h-48&rdquo;} overflow-hidden rounded-t-lg`}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className=&ldquo;w-full h-full object-cover&rdquo;
            />
            <div className=&ldquo;absolute top-2 left-2&rdquo;>
              <Badge
                className={`${getPriorityColor(article.priority)} text-white border-0`}
              >
                {article.priority === &ldquo;URGENT&rdquo;
                  ? &ldquo;Urgente&rdquo;
                  : article.priority === &ldquo;HIGH&rdquo;
                    ? &ldquo;Importante&rdquo;
                    : article.priority === &ldquo;MEDIUM&rdquo;
                      ? &ldquo;Medio&rdquo;
                      : &ldquo;Bajo&rdquo;}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <CardContent className=&ldquo;p-4&rdquo;>
        <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
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
          <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
            {article.authorName}
          </span>
          <div className=&ldquo;flex items-center gap-1 text-xs text-muted-foreground ml-auto&rdquo;>
            <Clock className=&ldquo;w-3 h-3&rdquo; />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <h3
          className={`font-semibold mb-2 line-clamp-2 ${compact ? &ldquo;text-sm&rdquo; : &ldquo;text-base&rdquo;}`}
        >
          {article.title}
        </h3>

        <p
          className={`text-muted-foreground mb-3 line-clamp-2 ${compact ? &ldquo;text-xs&rdquo; : &ldquo;text-sm&rdquo;}`}
        >
          {article.summary}
        </p>

        <div className=&ldquo;flex flex-wrap gap-1 mb-3&rdquo;>
          {article.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
              {tag}
            </Badge>
          ))}
        </div>

        <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground&rdquo;>
          <div className=&ldquo;flex items-center gap-3&rdquo;>
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Eye className=&ldquo;w-3 h-3&rdquo; />
              {article.viewCount}
            </div>
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Heart className=&ldquo;w-3 h-3&rdquo; />
              {article.likeCount}
            </div>
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <MessageSquare className=&ldquo;w-3 h-3&rdquo; />
              {article.commentCount}
            </div>
          </div>
          <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo; className=&ldquo;h-6 px-2&rdquo;>
            <ExternalLink className=&ldquo;w-3 h-3&rdquo; />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
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
                    <Skeleton className=&ldquo;h-32 w-full rounded&rdquo; />
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className=&ldquo;text-center&rdquo;>
        <h2 className=&ldquo;text-2xl font-bold text-gray-900 mb-2&rdquo;>
          Noticias Destacadas
        </h2>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Mantente informado sobre las últimas oportunidades y anuncios
          importantes
        </p>
      </div>

      {/* News Grid */}
      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
        {/* Company News Column */}
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h3 className=&ldquo;text-lg font-semibold flex items-center gap-2&rdquo;>
              <Building2 className=&ldquo;w-5 h-5 text-blue-600&rdquo; />
              Noticias Empresariales
            </h3>
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
                <NewsCard article={companyNews[companyIndex]} />

                {/* Compact articles */}
                <div className=&ldquo;grid grid-cols-1 gap-3&rdquo;>
                  {companyNews
                    .slice(companyIndex + 1, companyIndex + 3)
                    .map((article, index) => (
                      <NewsCard key={article.id} article={article} compact />
                    ))}
                </div>
              </>
            ) : (
              <Card className=&ldquo;p-6 text-center&rdquo;>
                <Building2 className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-3&rdquo; />
                <p className=&ldquo;text-muted-foreground&rdquo;>
                  No hay noticias empresariales disponibles
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Government/NGO News Column */}
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <h3 className=&ldquo;text-lg font-semibold flex items-center gap-2&rdquo;>
              <Shield className=&ldquo;w-5 h-5 text-green-600&rdquo; />
              Noticias Gubernamentales y ONGs
            </h3>
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
                <NewsCard article={governmentNews[governmentIndex]} />

                {/* Compact articles */}
                <div className=&ldquo;grid grid-cols-1 gap-3&rdquo;>
                  {governmentNews
                    .slice(governmentIndex + 1, governmentIndex + 3)
                    .map((article, index) => (
                      <NewsCard key={article.id} article={article} compact />
                    ))}
                </div>
              </>
            ) : (
              <Card className=&ldquo;p-6 text-center&rdquo;>
                <Shield className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-3&rdquo; />
                <p className=&ldquo;text-muted-foreground&rdquo;>
                  No hay noticias gubernamentales disponibles
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <div className=&ldquo;text-center&rdquo;>
        <Button variant=&ldquo;outline&rdquo; size=&ldquo;lg&rdquo;>
          Ver Todas las Noticias
          <ExternalLink className=&ldquo;w-4 h-4 ml-2&rdquo; />
        </Button>
      </div>
    </div>
  );
}
