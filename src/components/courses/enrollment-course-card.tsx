import Link from "next/link";
import { EnrollmentStatus } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Trophy,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { UserCourse } from "@/hooks/useMyCourses";

interface EnrollmentCourseCardProps {
  userCourse: UserCourse;
}

export const EnrollmentCourseCard = ({ userCourse }: EnrollmentCourseCardProps) => {
  const { course } = userCourse;

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case EnrollmentStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case EnrollmentStatus.ENROLLED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return "Completado";
      case EnrollmentStatus.IN_PROGRESS:
        return "En progreso";
      case EnrollmentStatus.ENROLLED:
        return "Inscrito";
      default:
        return status;
    }
  };

  const getActionButton = () => {
    const learnUrl = `/courses/${course.id}/learn`;
    console.log("🔍 EnrollmentCourseCard - Course ID:", course.id);
    console.log("🔍 EnrollmentCourseCard - Learn URL:", learnUrl);
    
    switch (userCourse.status) {
      case EnrollmentStatus.COMPLETED:
        return (
          <Button asChild className="w-full" variant="outline">
            <Link href={learnUrl}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Revisar curso
            </Link>
          </Button>
        );
      case EnrollmentStatus.IN_PROGRESS:
        return (
          <Button asChild className="w-full">
            <Link href={learnUrl}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Continuar
            </Link>
          </Button>
        );
      default:
        return (
          <Button asChild className="w-full" variant="outline">
            <Link href={learnUrl}>Comenzar curso</Link>
          </Button>
        );
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-blue-600" />
        </div>

        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(userCourse.status)}>
            {getStatusLabel(userCourse.status)}
          </Badge>
        </div>

        {course.isMandatory && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500">Obligatorio</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/courses/${course.id}`}>
          <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>

        {userCourse.status !== EnrollmentStatus.ENROLLED && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso</span>
              <span>{userCourse.progress}%</span>
            </div>
            <Progress value={parseFloat(userCourse.progress)} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{course.totalLessons} lecciones</span>
          </div>
          {course.certification && (
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span>Certificado</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {getActionButton()}

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Inscrito{" "}
              {formatDistanceToNow(new Date(userCourse.enrolledAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
            {userCourse.completedAt && (
              <span>
                Completado{" "}
                {formatDistanceToNow(new Date(userCourse.completedAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
