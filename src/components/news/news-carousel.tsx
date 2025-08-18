"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsArticle } from "@/types/news";
import { useNewsArticles } from "@/hooks/useNewsArticleApi";

interface NewsCarouselProps {
  className?: string;
}

export function NewsCarousel({ className }: NewsCarouselProps) {
  const { data: newsArticles, loading, error } = useNewsArticles();
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
        "/api/news?type=company&featured=true&targetAudience=YOUTH&limit=6"
      );
      const companyData = await companyResponse.json();

      // Fetch government/NGO news
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "LOW":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
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
      className={`hover:shadow-lg transition-shadow cursor-pointer ${compact ? "h-full" : ""}`}
    >
      <div className="relative">
        {article.imageUrl && (
          <div
            className={`relative ${compact ? "h-32" : "h-48"} overflow-hidden rounded-t-lg`}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge
                className={`${getPriorityColor(article.priority)} text-white border-0`}
              >
                {article.priority === "URGENT"
                  ? "Urgente"
                  : article.priority === "HIGH"
                    ? "Importante"
                    : article.priority === "MEDIUM"
                      ? "Medio"
                      : "Bajo"}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={article.authorLogo} alt={article.authorName} />
            <AvatarFallback className="text-xs">
              {article.authorType === "COMPANY" ? (
                <Building2 className="w-3 h-3" />
              ) : (
                <Shield className="w-3 h-3" />
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {article.authorName}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Clock className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <h3
          className={`font-semibold mb-2 line-clamp-2 ${compact ? "text-sm" : "text-base"}`}
        >
          {article.title}
        </h3>

        <p
          className={`text-muted-foreground mb-3 line-clamp-2 ${compact ? "text-xs" : "text-sm"}`}
        >
          {article.summary}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {article.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {article.likeCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {article.commentCount}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-3">
                    <Skeleton className="h-32 w-full rounded" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Noticias Destacadas
        </h2>
        <p className="text-muted-foreground">
          Mantente informado sobre las últimas oportunidades y anuncios
          importantes
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company News Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Noticias Empresariales
            </h3>
            {companyNews.length > 3 && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={prevCompany}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextCompany}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {companyNews.length > 0 ? (
              <>
                {/* Featured article */}
                <NewsCard article={companyNews[companyIndex]} />

                {/* Compact articles */}
                <div className="grid grid-cols-1 gap-3">
                  {companyNews
                    .slice(companyIndex + 1, companyIndex + 3)
                    .map((article, index) => (
                      <NewsCard key={article.id} article={article} compact />
                    ))}
                </div>
              </>
            ) : (
              <Card className="p-6 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No hay noticias empresariales disponibles
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Government/NGO News Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Noticias Gubernamentales y ONGs
            </h3>
            {governmentNews.length > 3 && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={prevGovernment}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextGovernment}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {governmentNews.length > 0 ? (
              <>
                {/* Featured article */}
                <NewsCard article={governmentNews[governmentIndex]} />

                {/* Compact articles */}
                <div className="grid grid-cols-1 gap-3">
                  {governmentNews
                    .slice(governmentIndex + 1, governmentIndex + 3)
                    .map((article, index) => (
                      <NewsCard key={article.id} article={article} compact />
                    ))}
                </div>
              </>
            ) : (
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No hay noticias gubernamentales disponibles
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Ver Todas las Noticias
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
