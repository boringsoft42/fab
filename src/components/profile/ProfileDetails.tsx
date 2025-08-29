"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  GraduationCap,
  Award,
  Calendar,
  Star,
  ExternalLink,
  Download
} from 'lucide-react';

interface ProfileDetailsData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  municipality: string;
  department: string;
  country: string;
  educationLevel: string;
  currentInstitution: string;
  skills: string[];
  interests: string[];
  avatar?: string;
  profileCompletion: number;
  joinDate: string;
  achievements: Achievement[];
  certificates: Certificate[];
  courses: Course[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'course' | 'certificate' | 'project' | 'volunteer';
}

interface Certificate {
  id: string;
  title: string;
  course: string;
  issueDate: string;
  status: 'active' | 'expired' | 'pending';
  downloadUrl?: string;
}

interface Course {
  id: string;
  title: string;
  progress: number;
  status: 'enrolled' | 'completed' | 'in_progress';
  lastAccessed: string;
}

interface ProfileDetailsProps {
  profile: ProfileDetailsData;
  onDownloadCertificate?: (certificateId: string) => void;
  onViewCourse?: (courseId: string) => void;
  className?: string;
}

export const ProfileDetails = ({ 
  profile, 
  onDownloadCertificate,
  onViewCourse,
  className = "" 
}: ProfileDetailsProps) => {
  const getEducationLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      'PRIMARY': 'Primaria',
      'SECONDARY': 'Secundaria',
      'TECHNICAL': 'Técnico',
      'UNIVERSITY': 'Universidad',
      'POSTGRADUATE': 'Postgrado'
    };
    return levels[level] || level;
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <GraduationCap className="w-4 h-4" />;
      case 'certificate':
        return <Award className="w-4 h-4" />;
      case 'project':
        return <Building2 className="w-4 h-4" />;
      case 'volunteer':
        return <Star className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getCertificateStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="text-xs">Activo</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expirado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pendiente</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getCourseStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge variant="outline" className="text-xs">Inscrito</Badge>;
      case 'completed':
        return <Badge variant="default" className="text-xs">Completado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="text-xs">En Progreso</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar del usuario"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Profile Completion Badge */}
              <div className="absolute -bottom-2 -right-2">
                <Badge 
                  variant={profile.profileCompletion >= 80 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {profile.profileCompletion}%
                </Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-muted-foreground text-sm">Estudiante</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                Miembro desde {profile.joinDate}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{profile.skills.length}</div>
              <div className="text-xs text-gray-600">Habilidades</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{profile.courses.length}</div>
              <div className="text-xs text-gray-600">Cursos</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">{profile.certificates.length}</div>
              <div className="text-xs text-gray-600">Certificados</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">{profile.achievements.length}</div>
              <div className="text-xs text-gray-600">Logros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Education */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5" />
                Educación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Nivel de Educación</div>
                <div className="text-sm text-muted-foreground">
                  {getEducationLevelLabel(profile.educationLevel)}
                </div>
              </div>
              {profile.currentInstitution && (
                <div>
                  <div className="text-sm font-medium">Institución Actual</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.currentInstitution}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-medium">{profile.municipality}</span>
                {profile.department && `, ${profile.department}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {profile.country}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Interests */}
        <div className="space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5" />
                Habilidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No hay habilidades registradas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Intereses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No hay intereses registrados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Cursos ({profile.courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    {getCourseStatusBadge(course.status)}
                    <span className="text-xs text-gray-600">
                      Progreso: {course.progress}%
                    </span>
                    <span className="text-xs text-gray-600">
                      Último acceso: {course.lastAccessed}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewCourse?.(course.id)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver
                </Button>
              </div>
            ))}
            {profile.courses.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay cursos registrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificados ({profile.certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.certificates.map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{certificate.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-600">
                      Curso: {certificate.course}
                    </span>
                    {getCertificateStatusBadge(certificate.status)}
                    <span className="text-xs text-gray-600">
                      Emitido: {certificate.issueDate}
                    </span>
                  </div>
                </div>
                {certificate.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadCertificate?.(certificate.id)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargar
                  </Button>
                )}
              </div>
            ))}
            {profile.certificates.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay certificados registrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Logros ({profile.achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  {getAchievementIcon(achievement.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {achievement.date}
                  </div>
                </div>
              </div>
            ))}
            {profile.achievements.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay logros registrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
