&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  FileText,
  Mail,
  MapPin,
  Phone,
  School,
  Star,
  User,
  Briefcase,
  Award,
  Pencil,
  Plus,
  X,
  Building2,
  Trophy,
} from &ldquo;lucide-react&rdquo;;
import { CVTemplate } from &ldquo;@/components/profile/templates/cv-template&rdquo;;
import { CoverLetterTemplate } from &ldquo;@/components/profile/templates/cover-letter-template&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  education: string;
  interests: string[];
  skills: string[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function ProfilePage() {
  const [showCVDialog, setShowCVDialog] = useState(false);
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState(&ldquo;&rdquo;);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: &ldquo;&rdquo;,
    title: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    date: &ldquo;&rdquo;,
  });

  const [profile, setProfile] = useState<ProfileData>({
    name: &ldquo;Ana Martínez&rdquo;,
    email: &ldquo;ana.martinez@email.com&rdquo;,
    phone: &ldquo;+591 77777777&rdquo;,
    location: &ldquo;La Paz, Bolivia&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    education: &ldquo;Bachiller - Colegio La Salle&rdquo;,
    interests: [&ldquo;Tecnología&rdquo;, &ldquo;Marketing Digital&rdquo;, &ldquo;Diseño&rdquo;],
    skills: [&ldquo;Microsoft Office&rdquo;, &ldquo;Redes Sociales&rdquo;, &ldquo;Fotografía&rdquo;],
    achievements: [
      {
        id: &ldquo;1&rdquo;,
        title: &ldquo;Primer lugar en Feria de Ciencias 2023&rdquo;,
        description:
          &ldquo;Proyecto de innovación tecnológica para el cuidado del medio ambiente&rdquo;,
        date: &ldquo;2023&rdquo;,
      },
      {
        id: &ldquo;2&rdquo;,
        title: &ldquo;Líder del Club de Emprendimiento&rdquo;,
        description:
          &ldquo;Liderazgo de equipo y organización de eventos de emprendimiento&rdquo;,
        date: &ldquo;2022-2023&rdquo;,
      },
    ],
  });

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()],
      });
      setNewInterest(&ldquo;&rdquo;);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    });
  };

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setProfile({
        ...profile,
        achievements: [
          ...profile.achievements,
          { ...newAchievement, id: Date.now().toString() },
        ],
      });
      setNewAchievement({ id: &ldquo;&rdquo;, title: &ldquo;&rdquo;, description: &ldquo;&rdquo;, date: &ldquo;&rdquo; });
    }
  };

  return (
    <div className=&ldquo;container mx-auto py-6 space-y-6&rdquo;>
      <Card>
        <CardContent className=&ldquo;pt-6&rdquo;>
          <div className=&ldquo;flex justify-between items-start mb-6&rdquo;>
            <div className=&ldquo;flex items-center gap-4&rdquo;>
              <div className=&ldquo;w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-semibold&rdquo;>
                {profile.name
                  .split(&ldquo; &rdquo;)
                  .map((n) => n[0])
                  .join(&ldquo;&rdquo;)}
              </div>
              <div>
                <h1 className=&ldquo;text-2xl font-bold&rdquo;>{profile.name}</h1>
                <p className=&ldquo;text-muted-foreground&rdquo;>Perfil Joven</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Pencil className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Editar Perfil
            </Button>
          </div>

          <div className=&ldquo;grid grid-cols-2 gap-6&rdquo;>
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center gap-2&rdquo;>
                <Mail className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                {isEditing ? (
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
              </div>
              <div className=&ldquo;flex items-center gap-2&rdquo;>
                <Phone className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                {isEditing ? (
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
              <div className=&ldquo;flex items-center gap-2&rdquo;>
                <MapPin className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                {isEditing ? (
                  <Input
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.location}</span>
                )}
              </div>
              <div className=&ldquo;flex items-center gap-2&rdquo;>
                <School className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                {isEditing ? (
                  <Input
                    value={profile.education}
                    onChange={(e) =>
                      setProfile({ ...profile, education: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.education}</span>
                )}
              </div>
            </div>

            <div className=&ldquo;space-y-6&rdquo;>
              <div>
                <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>Intereses</h3>
                <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                  {profile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant=&ldquo;secondary&rdquo;
                      className=&ldquo;flex items-center gap-1&rdquo;
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className=&ldquo;ml-1 hover:text-destructive&rdquo;
                        >
                          <X className=&ldquo;h-3 w-3&rdquo; />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className=&ldquo;flex items-center gap-2&rdquo;>
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder=&ldquo;Nuevo interés&rdquo;
                        className=&ldquo;w-32&rdquo;
                      />
                      <Button size=&ldquo;sm&rdquo; onClick={handleAddInterest}>
                        <Plus className=&ldquo;h-4 w-4&rdquo; />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className=&ldquo;flex justify-between items-center&rdquo;>
            <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
              <Trophy className=&ldquo;h-5 w-5&rdquo; />
              Logros
            </CardTitle>
            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                    Agregar Logro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Logro</DialogTitle>
                  </DialogHeader>
                  <div className=&ldquo;space-y-4&rdquo;>
                    <div>
                      <Label htmlFor=&ldquo;title&rdquo;>Título</Label>
                      <Input
                        id=&ldquo;title&rdquo;
                        value={newAchievement.title}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor=&ldquo;description&rdquo;>Descripción</Label>
                      <Textarea
                        id=&ldquo;description&rdquo;
                        value={newAchievement.description}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor=&ldquo;date&rdquo;>Fecha</Label>
                      <Input
                        id=&ldquo;date&rdquo;
                        value={newAchievement.date}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            date: e.target.value,
                          })
                        }
                        placeholder=&ldquo;Ej: 2023 o 2022-2023&rdquo;
                      />
                    </div>
                    <Button onClick={handleAddAchievement}>Guardar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;space-y-4&rdquo;>
            {profile.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className=&ldquo;border rounded-lg p-4 hover:bg-accent/5 transition-colors&rdquo;
              >
                <div className=&ldquo;flex justify-between items-start&rdquo;>
                  <div>
                    <h4 className=&ldquo;font-semibold&rdquo;>{achievement.title}</h4>
                    <p className=&ldquo;text-sm text-muted-foreground mt-1&rdquo;>
                      {achievement.description}
                    </p>
                  </div>
                  <Badge variant=&ldquo;outline&rdquo;>{achievement.date}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className=&ldquo;text-lg&rdquo;>Documentos Profesionales</CardTitle>
          <CardDescription>
            Prepara tu CV y carta de presentación
          </CardDescription>
        </CardHeader>
        <CardContent className=&ldquo;space-y-4&rdquo;>
          <Button
            variant=&ldquo;outline&rdquo;
            className=&ldquo;w-full justify-start&rdquo;
            onClick={() => setShowCVDialog(true)}
          >
            <FileText className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Curriculum Vitae
          </Button>
          <Button
            variant=&ldquo;outline&rdquo;
            className=&ldquo;w-full justify-start&rdquo;
            onClick={() => setShowCoverLetterDialog(true)}
          >
            <Mail className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Carta de Presentación
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className=&ldquo;text-lg flex items-center gap-2&rdquo;>
            <Award className=&ldquo;h-5 w-5&rdquo; />
            Certificados de mis cursos
          </CardTitle>
          <CardDescription>
            Visualiza y descarga tus certificados técnicos completados.
          </CardDescription>
        </CardHeader>
        <CardContent className=&ldquo;space-y-4&rdquo;>
          {[
            {
              nombre: &ldquo;Fundamentos de Programación en JavaScript&rdquo;,
              fecha: &ldquo;15 de abril de 2024&rdquo;,
            },
            {
              nombre: &ldquo;Diseño Gráfico con Canva y Photoshop&rdquo;,
              fecha: &ldquo;2 de marzo de 2024&rdquo;,
            },
            {
              nombre: &ldquo;Manejo de Redes Sociales para Emprendimientos&rdquo;,
              fecha: &ldquo;20 de febrero de 2024&rdquo;,
            },
            {
              nombre: &ldquo;Microsoft Excel Básico e Intermedio&rdquo;,
              fecha: &ldquo;10 de enero de 2024&rdquo;,
            },
          ].map((cert, index) => (
            <div
              key={index}
              className=&ldquo;flex items-center justify-between border rounded-lg p-3&rdquo;
            >
              <div>
                <p className=&ldquo;font-medium&rdquo;>{cert.nombre}</p>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                  Finalizado el {cert.fecha}
                </p>
              </div>
              <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo;>
                <FileText className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Descargar Pdf
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CV Dialog */}
      <Dialog open={showCVDialog} onOpenChange={setShowCVDialog}>
        <DialogContent className=&ldquo;max-w-4xl&rdquo;>
          <CVTemplate />
        </DialogContent>
      </Dialog>

      {/* Cover Letter Dialog */}
      <Dialog
        open={showCoverLetterDialog}
        onOpenChange={setShowCoverLetterDialog}
      >
        <DialogContent className=&ldquo;max-w-4xl&rdquo;>
          <CoverLetterTemplate />
        </DialogContent>
      </Dialog>
    </div>
  );
}
