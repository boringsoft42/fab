"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarUpload } from './AvatarUpload';
import { ProfileForm } from './ProfileForm';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  GraduationCap,
  Edit,
  Eye,
  Award,
  Calendar,
  Star
} from 'lucide-react';

interface StudentProfileData {
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
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'course' | 'certificate' | 'project' | 'volunteer';
}

interface StudentProfileProps {
  profile: StudentProfileData;
  onProfileUpdate?: (data: any) => Promise<void>;
  className?: string;
}

export const StudentProfile = ({ 
  profile, 
  onProfileUpdate, 
  className = "" 
}: StudentProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleProfileSave = async (data: any) => {
    try {
      await onProfileUpdate?.(data);
      setIsEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  };

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

  if (isEditing) {
    return (
      <div className={className}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
        <ProfileForm
          initialData={profile}
          onSave={handleProfileSave}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar del estudiante"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Profile Completion Badge */}
                <div className="absolute -bottom-2 -right-2">
                  <Badge 
                    variant={profile.profileCompletion >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {profile.profileCompletion}% completo
                  </Badge>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-muted-foreground">Estudiante</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Miembro desde {profile.joinDate}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsViewing(!isViewing)}>
                <Eye className="h-4 w-4 mr-2" />
                {isViewing ? 'Ocultar' : 'Vista previa'}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profile.skills.length}</div>
              <div className="text-sm text-gray-600">Habilidades</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile.interests.length}</div>
              <div className="text-sm text-gray-600">Intereses</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{profile.achievements.length}</div>
              <div className="text-sm text-gray-600">Logros</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{profile.profileCompletion}%</div>
              <div className="text-sm text-gray-600">Completado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
            <CardTitle className="flex items-center gap-2">
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
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Habilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
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
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Intereses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge key={index} variant="outline">
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

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Logros y Certificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
