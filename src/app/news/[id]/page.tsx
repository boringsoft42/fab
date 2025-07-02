"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Shield,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronLeft,
  AlertCircle,
  Star,
  Lightbulb,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  authorType: "COMPANY" | "GOVERNMENT" | "NGO";
  authorLogo?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
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

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news details");
      }
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("No se pudo cargar la noticia");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-blue-500 text-white";
      case "LOW":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <AlertCircle className="w-4 h-4" />;
      case "HIGH":
        return <Star className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="text-center p-8">
          <CardTitle className="text-red-500 mb-4">Error</CardTitle>
          <p className="text-muted-foreground mb-6">
            {error || "No se encontró la noticia"}
          </p>
          <Button asChild>
            <Link href="/news">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver a Noticias
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/news">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </Link>
        </Button>
      </div>

      <article className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge
              className={`${getPriorityColor(news.priority)} flex items-center gap-1`}
            >
              {getPriorityIcon(news.priority)}
              {news.priority === "URGENT"
                ? "Urgente"
                : news.priority === "HIGH"
                  ? "Importante"
                  : news.priority === "MEDIUM"
                    ? "Medio"
                    : "Información"}
            </Badge>
            {news.category && <Badge variant="outline">{news.category}</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{news.title}</h1>
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={news.authorLogo} alt={news.authorName} />
                <AvatarFallback>
                  {news.authorType === "COMPANY" ? (
                    <Building2 className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{news.authorName}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(news.publishedAt)}
                  </span>
                  {news.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {news.readTime} min de lectura
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>

        {/* Image */}
        {news.imageUrl && (
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {news.summary}
          </p>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200">
            {news.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {news.viewCount.toLocaleString()} vistas
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              {news.likeCount.toLocaleString()} me gusta
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {news.commentCount.toLocaleString()} comentarios
            </div>
            {news.shareCount && (
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                {news.shareCount.toLocaleString()} compartidos
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
