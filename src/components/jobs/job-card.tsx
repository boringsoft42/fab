"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Star,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobOffer } from "@/types/jobs";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface JobCardProps {
  job: JobOffer;
  viewMode: "grid" | "list";
}

export const JobCard = ({ job, viewMode }: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const expiresAt = job.expiresAt
    ? new Date(job.expiresAt)
    : new Date(new Date(job.publishedAt).getTime() + 15 * 24 * 60 * 60 * 1000);
  const formatSalary = (min?: number, max?: number, currency = "BOB") => {
    if (!min && !max) return "Salario a convenir";
    if (min && max)
      return `Bs. ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde Bs. ${min.toLocaleString()}`;
    return `Hasta Bs. ${max!.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hace 1 día";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Tiempo completo";
      case "PART_TIME":
        return "Medio tiempo";
      case "INTERNSHIP":
        return "Prácticas";
      case "VOLUNTEER":
        return "Voluntariado";
      case "FREELANCE":
        return "Freelance";
      default:
        return type;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case "ON_SITE":
        return "Presencial";
      case "REMOTE":
        return "Remoto";
      case "HYBRID":
        return "Híbrido";
      default:
        return modality;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case "NO_EXPERIENCE":
        return "Sin experiencia";
      case "ENTRY_LEVEL":
        return "Principiante";
      case "MID_LEVEL":
        return "Intermedio";
      case "SENIOR_LEVEL":
        return "Senior";
      default:
        return level;
    }
  };

  const handleSaveJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: Implement save/unsave job functionality
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/jobs/${job.id}/apply`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (viewMode === "list") {
    return (
      <Link href={`/jobs/${job.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                          {job.featured && (
                            <Star className="inline-block w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </h3>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="font-medium">
                            {job.company.name}
                          </span>
                          {job.company.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{job.company.rating}</span>
                              <span>({job.company.reviewCount})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{getModalityLabel(job.workModality)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applicationCount} aplicaciones</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{job.viewCount} vistas</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {truncateText(job.description, 150)}
                        </p>

                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">
                            {getContractTypeLabel(job.contractType)}
                          </Badge>
                          <Badge variant="outline">
                            {getExperienceLabel(job.experienceLevel)}
                          </Badge>
                          {job.requiredSkills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.requiredSkills.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatSalary(
                              job.salaryMin,
                              job.salaryMax,
                              job.salaryCurrency
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(job.publishedAt)}
                          </p>
                          {expiresAt && (
                            <p className="text-sm text-gray-400 flex items-center justify-end">
                              <Calendar className="w-4 h-4 mr-1" />
                              Vence el{" "}
                              {format(expiresAt, "dd 'de' MMMM", {
                                locale: es,
                              })}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveJob}
                            className="w-10 h-10 p-0"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={handleApplyClick}
                            size="sm"
                            className="min-w-[80px]"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={job.company.logo} alt={job.company.name} />
                <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {job.title}
                  {job.featured && (
                    <Star className="inline-block w-4 h-4 text-yellow-500 ml-1" />
                  )}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{job.company.name}</span>
                  {job.company.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{job.company.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveJob}
              className="w-8 h-8 p-0 flex-shrink-0"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{getModalityLabel(job.workModality)}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm line-clamp-3">
              {truncateText(job.description, 120)}
            </p>

            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {getContractTypeLabel(job.contractType)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getExperienceLabel(job.experienceLevel)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.requiredSkills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requiredSkills.length - 4}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(job.publishedAt)}
                </p>
                <p className="text-xs text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Vence el {format(expiresAt, "dd 'de' MMMM", { locale: es })}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{job.applicationCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{job.viewCount}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleApplyClick} className="w-full" size="sm">
              Aplicar ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
