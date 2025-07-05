&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Course, Enrollment, EnrollmentStatus } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Download,
  Share2,
} from &ldquo;lucide-react&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { formatDistanceToNow } from &ldquo;date-fns&rdquo;;
import { es } from &ldquo;date-fns/locale&rdquo;;

interface UserCourse {
  enrollment: Enrollment;
  course: {
    id: string;
    title: string;
    thumbnail: string;
    instructor: {
      id: string;
      name: string;
      title: string;
      avatar: string;
      bio: string;
      rating: number;
      totalStudents: number;
      totalCourses: number;
    };
    duration: number;
    totalLessons: number;
    isMandatory: boolean;
    certification: boolean;
  };
}

interface CourseStats {
  total: number;
  inProgress: number;
  completed: number;
  enrolled: number;
  totalTimeSpent: number;
  averageProgress: number;
  certificatesEarned: number;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EnrollmentStatus | &ldquo;all&rdquo;>(&ldquo;all&rdquo;);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);

  useEffect(() => {
    fetchMyCourses();
  }, [filter]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      params.append(&ldquo;userId&rdquo;, &ldquo;user-1&rdquo;); // Replace with actual user ID
      if (filter !== &ldquo;all&rdquo;) {
        params.append(&ldquo;status&rdquo;, filter);
      }

      const response = await fetch(`/api/my-courses?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
        setStats(data.stats);
      }
    } catch (error) {
      console.error(&ldquo;Error fetching courses:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course.instructor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case EnrollmentStatus.IN_PROGRESS:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case EnrollmentStatus.ENROLLED:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return &ldquo;Completado&rdquo;;
      case EnrollmentStatus.IN_PROGRESS:
        return &ldquo;En progreso&rdquo;;
      case EnrollmentStatus.ENROLLED:
        return &ldquo;Inscrito&rdquo;;
      default:
        return status;
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes % 60}m`;
  };

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-6 mb-8&rdquo;>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className=&ldquo;animate-pulse&rdquo;>
              <CardContent className=&ldquo;p-6&rdquo;>
                <div className=&ldquo;h-8 bg-gray-200 rounded mb-2&rdquo; />
                <div className=&ldquo;h-4 bg-gray-200 rounded&rdquo; />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className=&ldquo;animate-pulse&rdquo;>
              <div className=&ldquo;h-48 bg-gray-200&rdquo; />
              <CardContent className=&ldquo;p-4&rdquo;>
                <div className=&ldquo;h-4 bg-gray-200 rounded mb-2&rdquo; />
                <div className=&ldquo;h-3 bg-gray-200 rounded&rdquo; />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Mis Cursos</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Gestiona tu progreso de aprendizaje y continúa con tus cursos
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8&rdquo;>
          <Card>
            <CardContent className=&ldquo;p-6&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                    Total de Cursos
                  </p>
                  <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</p>
                </div>
                <BookOpen className=&ldquo;h-8 w-8 text-blue-600&rdquo; />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className=&ldquo;p-6&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                    En Progreso
                  </p>
                  <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.inProgress}</p>
                </div>
                <TrendingUp className=&ldquo;h-8 w-8 text-orange-600&rdquo; />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className=&ldquo;p-6&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                    Completados
                  </p>
                  <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.completed}</p>
                </div>
                <CheckCircle2 className=&ldquo;h-8 w-8 text-green-600&rdquo; />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className=&ldquo;p-6&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                    Certificados
                  </p>
                  <p className=&ldquo;text-2xl font-bold&rdquo;>
                    {stats.certificatesEarned}
                  </p>
                </div>
                <Trophy className=&ldquo;h-8 w-8 text-yellow-600&rdquo; />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className=&ldquo;flex flex-col sm:flex-row gap-4 mb-6&rdquo;>
        <div className=&ldquo;relative flex-1&rdquo;>
          <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4&rdquo; />
          <Input
            placeholder=&ldquo;Buscar cursos...&rdquo;
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=&ldquo;pl-10&rdquo;
          />
        </div>

        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(value as EnrollmentStatus | &ldquo;all&rdquo;)
          }
        >
          <SelectTrigger className=&ldquo;w-48&rdquo;>
            <SelectValue placeholder=&ldquo;Filtrar por estado&rdquo; />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=&ldquo;all&rdquo;>Todos los cursos</SelectItem>
            <SelectItem value={EnrollmentStatus.ENROLLED}>Inscritos</SelectItem>
            <SelectItem value={EnrollmentStatus.IN_PROGRESS}>
              En progreso
            </SelectItem>
            <SelectItem value={EnrollmentStatus.COMPLETED}>
              Completados
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className=&ldquo;p-8 text-center&rdquo;>
            <BookOpen className=&ldquo;h-16 w-16 text-muted-foreground mx-auto mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>No hay cursos</h3>
            <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
              {searchQuery || filter !== &ldquo;all&rdquo;
                ? &ldquo;No se encontraron cursos con los filtros aplicados&rdquo;
                : &ldquo;Aún no te has inscrito en ningún curso&rdquo;}
            </p>
            {!searchQuery && filter === &ldquo;all&rdquo; && (
              <Button asChild>
                <Link href=&ldquo;/courses&rdquo;>Explorar cursos</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
          {filteredCourses.map((userCourse) => (
            <CourseCard
              key={userCourse.enrollment.id}
              userCourse={userCourse}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className=&ldquo;mt-12 grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;>
        <Card>
          <CardHeader>
            <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
              <TrendingUp className=&ldquo;h-5 w-5&rdquo; />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className=&ldquo;space-y-4&rdquo;>
                <div>
                  <div className=&ldquo;flex justify-between text-sm mb-2&rdquo;>
                    <span>Progreso promedio</span>
                    <span>{Math.round(stats.averageProgress)}%</span>
                  </div>
                  <Progress value={stats.averageProgress} className=&ldquo;h-2&rdquo; />
                </div>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                  <p>
                    Tiempo total invertido:{&ldquo; &rdquo;}
                    {formatTimeSpent(stats.totalTimeSpent)}
                  </p>
                  <p>Cursos activos: {stats.inProgress}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
              <Trophy className=&ldquo;h-5 w-5&rdquo; />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;space-y-3&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <span className=&ldquo;text-sm&rdquo;>Cursos completados</span>
                <Badge variant=&ldquo;secondary&rdquo;>{stats?.completed || 0}</Badge>
              </div>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <span className=&ldquo;text-sm&rdquo;>Certificados obtenidos</span>
                <Badge variant=&ldquo;secondary&rdquo;>
                  {stats?.certificatesEarned || 0}
                </Badge>
              </div>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <span className=&ldquo;text-sm&rdquo;>Tiempo de estudio</span>
                <Badge variant=&ldquo;secondary&rdquo;>
                  {formatTimeSpent(stats?.totalTimeSpent || 0)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Course Card Component
const CourseCard = ({ userCourse }: { userCourse: UserCourse }) => {
  const { enrollment, course } = userCourse;

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case EnrollmentStatus.IN_PROGRESS:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case EnrollmentStatus.ENROLLED:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return &ldquo;Completado&rdquo;;
      case EnrollmentStatus.IN_PROGRESS:
        return &ldquo;En progreso&rdquo;;
      case EnrollmentStatus.ENROLLED:
        return &ldquo;Inscrito&rdquo;;
      default:
        return status;
    }
  };

  const getActionButton = () => {
    switch (enrollment.status) {
      case EnrollmentStatus.COMPLETED:
        return (
          <Button asChild className=&ldquo;w-full&rdquo; variant=&ldquo;outline&rdquo;>
            <Link href={`/courses/${course.id}/learn`}>
              <CheckCircle2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Revisar curso
            </Link>
          </Button>
        );
      case EnrollmentStatus.IN_PROGRESS:
        return (
          <Button asChild className=&ldquo;w-full&rdquo;>
            <Link href={`/courses/${course.id}/learn`}>
              <PlayCircle className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Continuar
            </Link>
          </Button>
        );
      default:
        return (
          <Button asChild className=&ldquo;w-full&rdquo; variant=&ldquo;outline&rdquo;>
            <Link href={`/courses/${course.id}/learn`}>Comenzar curso</Link>
          </Button>
        );
    }
  };

  return (
    <Card className=&ldquo;group hover:shadow-lg transition-all duration-200&rdquo;>
      <div className=&ldquo;relative&rdquo;>
        <div className=&ldquo;aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center&rdquo;>
          <BookOpen className=&ldquo;h-12 w-12 text-blue-600&rdquo; />
        </div>

        <div className=&ldquo;absolute top-3 left-3&rdquo;>
          <Badge className={getStatusColor(enrollment.status)}>
            {getStatusLabel(enrollment.status)}
          </Badge>
        </div>

        {course.isMandatory && (
          <div className=&ldquo;absolute top-3 right-3&rdquo;>
            <Badge className=&ldquo;bg-red-500&rdquo;>Obligatorio</Badge>
          </div>
        )}
      </div>

      <CardContent className=&ldquo;p-4&rdquo;>
        <Link href={`/courses/${course.id}`}>
          <h3 className=&ldquo;font-semibold mb-2 hover:text-blue-600 transition-colors line-clamp-2&rdquo;>
            {course.title}
          </h3>
        </Link>

        {/* <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
          <Avatar className=&ldquo;h-6 w-6&rdquo;>
            <AvatarImage src={course.instructor.avatar} />
            <AvatarFallback className=&ldquo;text-xs&rdquo;>
              {course.instructor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
            {course.instructor.name}
          </span>
        </div> */}

        {enrollment.status !== EnrollmentStatus.ENROLLED && (
          <div className=&ldquo;mb-3&rdquo;>
            <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
              <span>Progreso</span>
              <span>{enrollment.progress.totalProgress}%</span>
            </div>
            <Progress
              value={enrollment.progress.totalProgress}
              className=&ldquo;h-2&rdquo;
            />
          </div>
        )}

        <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground mb-4&rdquo;>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <Clock className=&ldquo;h-3 w-3&rdquo; />
            <span>{course.duration}h</span>
          </div>
          <div className=&ldquo;flex items-center gap-1&rdquo;>
            <BookOpen className=&ldquo;h-3 w-3&rdquo; />
            <span>{course.totalLessons} lecciones</span>
          </div>
          {course.certification && (
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Trophy className=&ldquo;h-3 w-3&rdquo; />
              <span>Certificado</span>
            </div>
          )}
        </div>

        <div className=&ldquo;space-y-2&rdquo;>
          {getActionButton()}

          <div className=&ldquo;flex justify-between text-xs text-muted-foreground&rdquo;>
            <span>
              Inscrito{&ldquo; &rdquo;}
              {formatDistanceToNow(new Date(enrollment.enrolledAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
            {enrollment.completedAt && (
              <span>
                Completado{&ldquo; &rdquo;}
                {formatDistanceToNow(new Date(enrollment.completedAt), {
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
