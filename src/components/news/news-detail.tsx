"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  ExternalLink,
  MapPin,
  Tag,
  Eye,
  Clock,
} from "lucide-react";
import { NewsArticle } from "@/types/news";

interface NewsDetailProps {
  news: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-800";
    case "DRAFT":
      return "bg-yellow-100 text-yellow-800";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800";
    case "LOW":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getAuthorTypeColor = (type: string) => {
  switch (type) {
    case "COMPANY":
      return "bg-blue-100 text-blue-800";
    case "GOVERNMENT":
      return "bg-green-100 text-green-800";
    case "NGO":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function NewsDetail({ news, isOpen, onClose }: NewsDetailProps) {
  if (!news) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-4">
        {line}
      </p>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {news.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getStatusColor(news.status)}>
                  {news.status === "PUBLISHED" && "Publicado"}
                  {news.status === "DRAFT" && "Borrador"}
                  {news.status === "ARCHIVED" && "Archivado"}
                </Badge>
                <Badge className={getPriorityColor(news.priority)}>
                  {news.priority === "URGENT" && "Urgente"}
                  {news.priority === "HIGH" && "Alta"}
                  {news.priority === "MEDIUM" && "Media"}
                  {news.priority === "LOW" && "Baja"}
                </Badge>
                {news.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Destacada
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagen principal */}
          {news.imageUrl && (
            <div className="relative">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Información del autor */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={news.authorLogo} alt={news.authorName} />
              <AvatarFallback>
                {news.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-lg font-semibold">{news.authorName}</div>
              <div className="flex items-center space-x-2">
                <Badge className={getAuthorTypeColor(news.authorType)}>
                  {news.authorType === "COMPANY" && "Empresa"}
                  {news.authorType === "GOVERNMENT" && "Gobierno"}
                  {news.authorType === "NGO" && "ONG"}
                </Badge>
                {news.region && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {news.region}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Resumen</h3>
            <p className="text-blue-800">{news.summary}</p>
          </div>

          {/* Contenido */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contenido</h3>
            <div className="prose max-w-none text-gray-700">
              {formatContent(news.content)}
            </div>
          </div>

          {/* Video */}
          {news.videoUrl && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Video</h3>
              <div className="aspect-video">
                <video
                  src={news.videoUrl}
                  controls
                  className="w-full h-full rounded-lg"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          )}

          {/* Enlaces relacionados */}
          {news.relatedLinks && news.relatedLinks.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Enlaces Relacionados</h3>
              <div className="space-y-2">
                {news.relatedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Información</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Publicado:</strong> {formatDate(news.publishedAt || news.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Actualizado:</strong> {formatDate(news.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Vistas:</strong> {news.viewCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Estadísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Vistas:</strong> {news.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Me gusta:</strong> {news.likeCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    <strong>Comentarios:</strong> {news.commentCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categoría y etiquetas */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categorización</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Categoría:</span>
                <Badge variant="outline" className="ml-2">
                  {news.category}
                </Badge>
              </div>
              
              {news.tags && news.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Etiquetas:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {news.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {news.targetAudience && news.targetAudience.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Audiencia objetivo:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {news.targetAudience.map((audience, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {audience === "YOUTH" && "Jóvenes"}
                        {audience === "ADOLESCENTS" && "Adolescentes"}
                        {audience === "COMPANIES" && "Empresas"}
                        {audience === "ALL" && "Todos"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
