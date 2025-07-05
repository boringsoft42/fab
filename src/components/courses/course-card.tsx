&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { Course } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Award,
  Play,
  CheckCircle,
} from &ldquo;lucide-react&rdquo;;
import { formatDistanceToNow } from &ldquo;date-fns&rdquo;;
import { es } from &ldquo;date-fns/locale&rdquo;;

interface CourseCardProps {
  course: Course;
  viewMode?: &ldquo;grid&rdquo; | &ldquo;list&rdquo;;
  enrollment?: {
    isEnrolled: boolean;
    progress?: number;
    status?: string;
  };
}

export const CourseCard = ({
  course,
  viewMode = &ldquo;grid&rdquo;,
  enrollment,
}: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${hours}h`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return &ldquo;Gratis&rdquo;;
    return `$${price.toLocaleString()} BOB`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      soft_skills: &ldquo;Habilidades Blandas&rdquo;,
      basic_competencies: &ldquo;Competencias Básicas&rdquo;,
      job_placement: &ldquo;Inserción Laboral&rdquo;,
      entrepreneurship: &ldquo;Emprendimiento&rdquo;,
      technical_skills: &ldquo;Habilidades Técnicas&rdquo;,
      digital_literacy: &ldquo;Alfabetización Digital&rdquo;,
      communication: &ldquo;Comunicación&rdquo;,
      leadership: &ldquo;Liderazgo&rdquo;,
    };
    return labels[category] || category;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: &ldquo;bg-green-100 text-green-800&rdquo;,
      intermediate: &ldquo;bg-yellow-100 text-yellow-800&rdquo;,
      advanced: &ldquo;bg-red-100 text-red-800&rdquo;,
    };
    return colors[level] || &ldquo;bg-gray-100 text-gray-800&rdquo;;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: &ldquo;Principiante&rdquo;,
      intermediate: &ldquo;Intermedio&rdquo;,
      advanced: &ldquo;Avanzado&rdquo;,
    };
    return labels[level] || level;
  };

  if (viewMode === &ldquo;list&rdquo;) {
    return (
      <Card className=&ldquo;hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500&rdquo;>
        <CardContent className=&ldquo;p-0&rdquo;>
          <div className=&ldquo;flex flex-col lg:flex-row&rdquo;>
            {/* Course Image */}
            <div className=&ldquo;relative lg:w-80 h-48 lg:h-auto&rdquo;>
              <Link href={`/courses/${course.id}`}>
                {!imageError ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className=&ldquo;object-cover rounded-l-lg&rdquo;
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className=&ldquo;w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-l-lg&rdquo;>
                    <BookOpen className=&ldquo;h-12 w-12 text-blue-600&rdquo; />
                  </div>
                )}
                {course.videoPreview && (
                  <div className=&ldquo;absolute inset-0 flex items-center justify-center&rdquo;>
                    <div className=&ldquo;bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-opacity&rdquo;>
                      <Play className=&ldquo;h-6 w-6 text-white fill-current&rdquo; />
                    </div>
                  </div>
                )}
              </Link>

              {/* Badges */}
              <div className=&ldquo;absolute top-3 left-3 flex flex-col gap-2&rdquo;>
                {course.isMandatory && (
                  <Badge className=&ldquo;bg-red-500 hover:bg-red-600&rdquo;>
                    Obligatorio
                  </Badge>
                )}
                {course.price === 0 && (
                  <Badge className=&ldquo;bg-green-500 hover:bg-green-600&rdquo;>
                    Gratis
                  </Badge>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className=&ldquo;flex-1 p-6&rdquo;>
              <div className=&ldquo;flex justify-between items-start mb-4&rdquo;>
                <div className=&ldquo;flex-1&rdquo;>
                  <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
                    <Badge
                      variant=&ldquo;outline&rdquo;
                      className={getLevelColor(course.level)}
                    >
                      {getLevelLabel(course.level)}
                    </Badge>
                    <Badge variant=&ldquo;outline&rdquo;>
                      {getCategoryLabel(course.category)}
                    </Badge>
                  </div>

                  <Link href={`/courses/${course.id}`}>
                    <h3 className=&ldquo;text-xl font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2&rdquo;>
                      {course.title}
                    </h3>
                  </Link>

                  <p className=&ldquo;text-muted-foreground mb-4 line-clamp-2&rdquo;>
                    {course.shortDescription}
                  </p>

                  {/* Instructor */}
                  {/* <div className=&ldquo;flex items-center gap-3 mb-4&rdquo;>
                    <Avatar className=&ldquo;h-8 w-8&rdquo;>
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback>
                        {course.instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className=&ldquo;font-medium text-sm&rdquo;>
                        {course.instructor.name}
                      </p>
                      <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                        {course.instructor.title}
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className=&ldquo;text-right ml-4&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-blue-600 mb-1&rdquo;>
                    {formatPrice(course.price)}
                  </div>
                  {enrollment?.isEnrolled && (
                    <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;mb-2&rdquo;>
                      {enrollment.status === &ldquo;completed&rdquo;
                        ? &ldquo;Completado&rdquo;
                        : &ldquo;Inscrito&rdquo;}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {enrollment?.isEnrolled && enrollment.progress !== undefined && (
                <div className=&ldquo;mb-4&rdquo;>
                  <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
                    <span>Progreso del curso</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className=&ldquo;h-2&rdquo; />
                </div>
              )}

              {/* Course Stats */}
              <div className=&ldquo;flex items-center gap-6 text-sm text-muted-foreground mb-4&rdquo;>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                  <span className=&ldquo;font-medium&rdquo;>{course.rating}</span>
                </div>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Users className=&ldquo;h-4 w-4&rdquo; />
                  <span>
                    {course.studentCount.toLocaleString()} estudiantes
                  </span>
                </div>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Clock className=&ldquo;h-4 w-4&rdquo; />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <BookOpen className=&ldquo;h-4 w-4&rdquo; />
                  <span>{course.totalLessons} lecciones</span>
                </div>
                {course.certification && (
                  <div className=&ldquo;flex items-center gap-1&rdquo;>
                    <Award className=&ldquo;h-4 w-4&rdquo; />
                    <span>Certificado</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className=&ldquo;flex flex-wrap gap-2 mb-4&rdquo;>
                {course.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    {tag}
                  </Badge>
                ))}
                {course.tags.length > 3 && (
                  <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    +{course.tags.length - 3} más
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className=&ldquo;flex gap-3&rdquo;>
                {enrollment?.isEnrolled ? (
                  <Button asChild className=&ldquo;flex-1&rdquo;>
                    <Link href={`/courses/${course.id}/learn`}>
                      {enrollment.status === &ldquo;completed&rdquo;
                        ? &ldquo;Revisar curso&rdquo;
                        : &ldquo;Continuar&rdquo;}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className=&ldquo;flex-1&rdquo;>
                    <Link href={`/courses/${course.id}`}>Ver curso</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className=&ldquo;group hover:shadow-lg transition-all duration-200 overflow-hidden&rdquo;>
      <div className=&ldquo;relative&rdquo;>
        <Link href={`/courses/${course.id}`}>
          {!imageError ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={400}
              height={250}
              className=&ldquo;w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200&rdquo;
              onError={() => setImageError(true)}
            />
          ) : (
            <div className=&ldquo;w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center&rdquo;>
              <BookOpen className=&ldquo;h-12 w-12 text-blue-600&rdquo; />
            </div>
          )}
          {course.videoPreview && (
            <div className=&ldquo;absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity&rdquo;>
              <div className=&ldquo;bg-black bg-opacity-50 rounded-full p-3&rdquo;>
                <Play className=&ldquo;h-6 w-6 text-white fill-current&rdquo; />
              </div>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className=&ldquo;absolute top-3 left-3 flex flex-col gap-2&rdquo;>
          {course.isMandatory && (
            <Badge className=&ldquo;bg-red-500 hover:bg-red-600 text-xs&rdquo;>
              Obligatorio
            </Badge>
          )}
          {course.price === 0 && (
            <Badge className=&ldquo;bg-green-500 hover:bg-green-600 text-xs&rdquo;>
              Gratis
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className=&ldquo;absolute bottom-3 right-3 bg-white px-2 py-1 rounded-md shadow-md&rdquo;>
          <span className=&ldquo;font-bold text-blue-600&rdquo;>
            {formatPrice(course.price)}
          </span>
        </div>
      </div>

      <CardContent className=&ldquo;p-4&rdquo;>
        <div className=&ldquo;flex items-center gap-2 mb-2&rdquo;>
          <Badge
            variant=&ldquo;outline&rdquo;
            className={`text-xs ${getLevelColor(course.level)}`}
          >
            {getLevelLabel(course.level)}
          </Badge>
          <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
            {getCategoryLabel(course.category)}
          </Badge>
        </div>

        <Link href={`/courses/${course.id}`}>
          <h3 className=&ldquo;font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2&rdquo;>
            {course.title}
          </h3>
        </Link>

        <p className=&ldquo;text-sm text-muted-foreground mb-3 line-clamp-2&rdquo;>
          {course.shortDescription}
        </p>

        {/* Instructor */}
        {/* <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
          <Avatar className=&ldquo;h-6 w-6&rdquo;>
            <AvatarImage src={course.instructor.avatar} />
            <AvatarFallback className=&ldquo;text-xs&rdquo;>
              {course.instructor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
            {course.instructor.name}
          </span>
        </div> */}

        {/* Progress Bar (if enrolled) */}
        {enrollment?.isEnrolled && enrollment.progress !== undefined && (
          <div className=&ldquo;mb-3&rdquo;>
            <div className=&ldquo;flex justify-between text-xs mb-1&rdquo;>
              <span>Progreso</span>
              <span>{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className=&ldquo;h-1.5&rdquo; />
          </div>
        )}

        {/* Course Stats */}
        <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground mb-3&rdquo;>
          {/* <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Star className=&ldquo;h-3 w-3 fill-yellow-400 text-yellow-400&rdquo; />
            <span>{course.rating}</span>
          </div> */}
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Users className=&ldquo;h-3 w-3&rdquo; />
            <span>{course.studentCount}</span>
          </div>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Clock className=&ldquo;h-3 w-3&rdquo; />
            <span>{formatDuration(course.duration)}</span>
          </div>
          {/* {course.certification && (
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Award className=&ldquo;h-3 w-3&rdquo; />
            </div>
          )} */}
        </div>

        {/* Tags */}
        <div className=&ldquo;flex flex-wrap gap-1 mb-3&rdquo;>
          {course.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
              {tag}
            </Badge>
          ))}
          {course.tags.length > 2 && (
            <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
              +{course.tags.length - 2}
            </span>
          )}
        </div>

        {/* Action Button */}
        {enrollment?.isEnrolled ? (
          <Button asChild className=&ldquo;w-full&rdquo; size=&ldquo;sm&rdquo;>
            <Link href={`/courses/${course.id}/learn`}>
              {enrollment.status === &ldquo;completed&rdquo; ? (
                <>
                  <CheckCircle className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Completado
                </>
              ) : (
                &ldquo;Continuar&rdquo;
              )}
            </Link>
          </Button>
        ) : (
          <Button asChild className=&ldquo;w-full&rdquo; size=&ldquo;sm&rdquo;>
            <Link href={`/courses/${course.id}`}>Ver curso</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
