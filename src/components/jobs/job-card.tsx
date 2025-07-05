&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Star,
  Bookmark,
  BookmarkCheck,
} from &ldquo;lucide-react&rdquo;;
import { Card, CardContent, CardHeader } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { JobOffer } from &ldquo;@/types/jobs&rdquo;;
import { Calendar } from &ldquo;lucide-react&rdquo;
import { format } from &ldquo;date-fns&rdquo;
import { es } from &ldquo;date-fns/locale&rdquo;  

interface JobCardProps {
  job: JobOffer;
  viewMode: &ldquo;grid&rdquo; | &ldquo;list&rdquo;;
}

export const JobCard = ({ job, viewMode }: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const expiresAt = job.expiresAt
  ? new Date(job.expiresAt)
  : new Date(new Date(job.publishedAt).getTime() + 15 * 24 * 60 * 60 * 1000);
  const formatSalary = (min?: number, max?: number, currency = &ldquo;BOB&rdquo;) => {
    if (!min && !max) return &ldquo;Salario a convenir&rdquo;;
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

    if (diffDays === 1) return &ldquo;Hace 1 día&rdquo;;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case &ldquo;FULL_TIME&rdquo;:
        return &ldquo;Tiempo completo&rdquo;;
      case &ldquo;PART_TIME&rdquo;:
        return &ldquo;Medio tiempo&rdquo;;
      case &ldquo;INTERNSHIP&rdquo;:
        return &ldquo;Prácticas&rdquo;;
      case &ldquo;VOLUNTEER&rdquo;:
        return &ldquo;Voluntariado&rdquo;;
      case &ldquo;FREELANCE&rdquo;:
        return &ldquo;Freelance&rdquo;;
      default:
        return type;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case &ldquo;ON_SITE&rdquo;:
        return &ldquo;Presencial&rdquo;;
      case &ldquo;REMOTE&rdquo;:
        return &ldquo;Remoto&rdquo;;
      case &ldquo;HYBRID&rdquo;:
        return &ldquo;Híbrido&rdquo;;
      default:
        return modality;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case &ldquo;NO_EXPERIENCE&rdquo;:
        return &ldquo;Sin experiencia&rdquo;;
      case &ldquo;ENTRY_LEVEL&rdquo;:
        return &ldquo;Principiante&rdquo;;
      case &ldquo;MID_LEVEL&rdquo;:
        return &ldquo;Intermedio&rdquo;;
      case &ldquo;SENIOR_LEVEL&rdquo;:
        return &ldquo;Senior&rdquo;;
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
    return text.slice(0, maxLength) + &ldquo;...&rdquo;;
  };

  if (viewMode === &ldquo;list&rdquo;) {
    return (
      <Link href={`/jobs/${job.id}`}>
        <Card className=&ldquo;hover:shadow-md transition-shadow cursor-pointer&rdquo;>
          <CardContent className=&ldquo;p-6&rdquo;>
            <div className=&ldquo;flex items-start justify-between&rdquo;>
              <div className=&ldquo;flex-1&rdquo;>
                <div className=&ldquo;flex items-start space-x-4&rdquo;>
                  <Avatar className=&ldquo;w-12 h-12 flex-shrink-0&rdquo;>
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className=&ldquo;flex-1 min-w-0&rdquo;>
                    <div className=&ldquo;flex items-start justify-between&rdquo;>
                      <div className=&ldquo;flex-1&rdquo;>
                        <h3 className=&ldquo;text-lg font-semibold text-gray-900 mb-1&rdquo;>
                          {job.title}
                          {job.featured && (
                            <Star className=&ldquo;inline-block w-4 h-4 text-yellow-500 ml-2&rdquo; />
                          )}
                        </h3>

                        <div className=&ldquo;flex items-center space-x-4 text-sm text-gray-600 mb-2&rdquo;>
                          <span className=&ldquo;font-medium&rdquo;>
                            {job.company.name}
                          </span>
                          {job.company.rating && (
                            <div className=&ldquo;flex items-center space-x-1&rdquo;>
                              <Star className=&ldquo;w-3 h-3 fill-yellow-400 text-yellow-400&rdquo; />
                              <span>{job.company.rating}</span>
                              <span>({job.company.reviewCount})</span>
                            </div>
                          )}
                        </div>

                        <div className=&ldquo;flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3&rdquo;>
                          <div className=&ldquo;flex items-center space-x-1&rdquo;>
                            <MapPin className=&ldquo;w-4 h-4&rdquo; />
                            <span>{job.location}</span>
                          </div>
                          <div className=&ldquo;flex items-center space-x-1&rdquo;>
                            <Clock className=&ldquo;w-4 h-4&rdquo; />
                            <span>{getModalityLabel(job.workModality)}</span>
                          </div>
                          <div className=&ldquo;flex items-center space-x-1&rdquo;>
                            <Users className=&ldquo;w-4 h-4&rdquo; />
                            <span>{job.applicationCount} aplicaciones</span>
                          </div>
                          <div className=&ldquo;flex items-center space-x-1&rdquo;>
                            <Eye className=&ldquo;w-4 h-4&rdquo; />
                            <span>{job.viewCount} vistas</span>
                          </div>
                        </div>

                        <p className=&ldquo;text-gray-700 mb-3 line-clamp-2&rdquo;>
                          {truncateText(job.description, 150)}
                        </p>

                        <div className=&ldquo;flex items-center flex-wrap gap-2 mb-3&rdquo;>
                          <Badge variant=&ldquo;secondary&rdquo;>
                            {getContractTypeLabel(job.contractType)}
                          </Badge>
                          <Badge variant=&ldquo;outline&rdquo;>
                            {getExperienceLabel(job.experienceLevel)}
                          </Badge>
                          {job.requiredSkills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant=&ldquo;outline&rdquo;
                              className=&ldquo;text-xs&rdquo;
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                              +{job.requiredSkills.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className=&ldquo;flex flex-col items-end space-y-2 ml-4&rdquo;>
                        <div className=&ldquo;text-right&rdquo;>
                          <p className=&ldquo;font-semibold text-gray-900&rdquo;>
                            {formatSalary(
                              job.salaryMin,
                              job.salaryMax,
                              job.salaryCurrency
                            )}
                          </p>
                          <p className=&ldquo;text-sm text-gray-500&rdquo;>
                            {formatDate(job.publishedAt)}
                          </p>
                          {expiresAt && (
  <p className=&ldquo;text-sm text-gray-400 flex items-center justify-end&rdquo;>
    <Calendar className=&ldquo;w-4 h-4 mr-1&rdquo; />
    Vence el {format(expiresAt, &ldquo;dd 'de' MMMM&rdquo;, { locale: es })}
  </p>
)}

                        </div>

                        <div className=&ldquo;flex space-x-2&rdquo;>
                          <Button
                            variant=&ldquo;outline&rdquo;
                            size=&ldquo;sm&rdquo;
                            onClick={handleSaveJob}
                            className=&ldquo;w-10 h-10 p-0&rdquo;
                          >
                            {isSaved ? (
                              <BookmarkCheck className=&ldquo;w-4 h-4 text-blue-600&rdquo; />
                            ) : (
                              <Bookmark className=&ldquo;w-4 h-4&rdquo; />
                            )}
                          </Button>
                          <Button
                            onClick={handleApplyClick}
                            size=&ldquo;sm&rdquo;
                            className=&ldquo;min-w-[80px]&rdquo;
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
      <Card className=&ldquo;hover:shadow-lg transition-shadow cursor-pointer h-full&rdquo;>
        <CardHeader className=&ldquo;pb-3&rdquo;>
          <div className=&ldquo;flex items-start justify-between&rdquo;>
            <div className=&ldquo;flex items-start space-x-3&rdquo;>
              <Avatar className=&ldquo;w-10 h-10&rdquo;>
                <AvatarImage src={job.company.logo} alt={job.company.name} />
                <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className=&ldquo;flex-1 min-w-0&rdquo;>
                <h3 className=&ldquo;font-semibold text-gray-900 line-clamp-1&rdquo;>
                  {job.title}
                  {job.featured && (
                    <Star className=&ldquo;inline-block w-4 h-4 text-yellow-500 ml-1&rdquo; />
                  )}
                </h3>
                <div className=&ldquo;flex items-center space-x-2 text-sm text-gray-600&rdquo;>
                  <span>{job.company.name}</span>
                  {job.company.rating && (
                    <div className=&ldquo;flex items-center space-x-1&rdquo;>
                      <Star className=&ldquo;w-3 h-3 fill-yellow-400 text-yellow-400&rdquo; />
                      <span>{job.company.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant=&ldquo;ghost&rdquo;
              size=&ldquo;sm&rdquo;
              onClick={handleSaveJob}
              className=&ldquo;w-8 h-8 p-0 flex-shrink-0&rdquo;
            >
              {isSaved ? (
                <BookmarkCheck className=&ldquo;w-4 h-4 text-blue-600&rdquo; />
              ) : (
                <Bookmark className=&ldquo;w-4 h-4&rdquo; />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className=&ldquo;pt-0&rdquo;>
          <div className=&ldquo;space-y-3&rdquo;>
            <div className=&ldquo;flex items-center flex-wrap gap-2 text-sm text-gray-600&rdquo;>
              <div className=&ldquo;flex items-center space-x-1&rdquo;>
                <MapPin className=&ldquo;w-3 h-3&rdquo; />
                <span>{job.location}</span>
              </div>
              <div className=&ldquo;flex items-center space-x-1&rdquo;>
                <Clock className=&ldquo;w-3 h-3&rdquo; />
                <span>{getModalityLabel(job.workModality)}</span>
              </div>
            </div>

            <p className=&ldquo;text-gray-700 text-sm line-clamp-3&rdquo;>
              {truncateText(job.description, 120)}
            </p>

            <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
              <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                {getContractTypeLabel(job.contractType)}
              </Badge>
              <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                {getExperienceLabel(job.experienceLevel)}
              </Badge>
            </div>

            <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
              {job.requiredSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                  {skill}
                </Badge>
              ))}
              {job.requiredSkills.length > 4 && (
                <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                  +{job.requiredSkills.length - 4}
                </Badge>
              )}
            </div>

            <div className=&ldquo;flex items-center justify-between pt-2 border-t&rdquo;>
              <div>
                <p className=&ldquo;font-semibold text-gray-900 text-sm&rdquo;>
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency
                  )}
                </p>
                <p className=&ldquo;text-xs text-gray-500&rdquo;>
                  {formatDate(job.publishedAt)}
                </p>
                <p className=&ldquo;text-xs text-gray-400 flex items-center&rdquo;>
    <Calendar className=&ldquo;w-3 h-3 mr-1&rdquo; />
    Vence el {format(expiresAt, &ldquo;dd 'de' MMMM&rdquo;, { locale: es })}
  </p>
              </div>

              <div className=&ldquo;flex items-center space-x-3 text-xs text-gray-500&rdquo;>
                <div className=&ldquo;flex items-center space-x-1&rdquo;>
                  <Users className=&ldquo;w-3 h-3&rdquo; />
                  <span>{job.applicationCount}</span>
                </div>
                <div className=&ldquo;flex items-center space-x-1&rdquo;>
                  <Eye className=&ldquo;w-3 h-3&rdquo; />
                  <span>{job.viewCount}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleApplyClick} className=&ldquo;w-full&rdquo; size=&ldquo;sm&rdquo;>
              Aplicar ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
