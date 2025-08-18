"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Mail,
  MapPin,
  Phone,
  School,
  Award,
  Pencil,
  Plus,
  X,
  Building2,
  Trophy,
} from "lucide-react";
import { CVTemplate } from "@/components/profile/templates/cv-template";
import { CoverLetterTemplate } from "@/components/profile/templates/cover-letter-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentProfile } from "@/hooks/useProfileApi";
import { Profile } from "@/types/profile";

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Mock data for demonstration
const mockProfile: Profile = {
  id: "1",
  userId: "1",
  firstName: "Juan Carlos",
  lastName: "Pérez",
  email: "juan.perez@email.com",
  phone: "+591 700 123 456",
  address: "Av. Principal 123",
  municipality: "La Paz",
  department: "La Paz",
  country: "Bolivia",
  educationLevel: "SECONDARY",
  currentInstitution: "Colegio Nacional",
  skills: ["JavaScript", "React", "HTML", "CSS", "Excel"],
  interests: ["Programación", "Diseño web", "Tecnología", "Música"],
  active: true,
  status: "ACTIVE",
  role: "YOUTH",
  profileCompletion: 85,
  parentalConsent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Primer lugar en Hackathon 2023",
    description: "Gané el primer lugar en el hackathon de desarrollo web organizado por la universidad",
    date: "2023"
  },
  {
    id: "2", 
    title: "Certificación en JavaScript",
    description: "Completé exitosamente el curso avanzado de JavaScript",
    date: "2023"
  },
  {
    id: "3",
    title: "Proyecto de voluntariado",
    description: "Participé en un proyecto de enseñanza de programación a niños",
    date: "2022"
  }
];

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
  const [newInterest, setNewInterest] = useState("");
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: "",
    title: "",
    description: "",
    date: "",
  });

  const { data: profile, loading, error } = useCurrentProfile();
  const [localProfile, setLocalProfile] = useState<Profile>(mockProfile);
  const [localAchievements, setLocalAchievements] = useState<Achievement[]>(mockAchievements);

  // Use profile data if available, otherwise use mock data
  const currentProfile = profile || localProfile;

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error al cargar el perfil</h2>
          <p className="text-gray-600 mt-2">No se pudo cargar la información del perfil</p>
        </div>
      </div>
    );
  }

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const updatedInterests = [...(currentProfile.interests || []), newInterest.trim()];
      setLocalProfile({
        ...currentProfile,
        interests: updatedInterests,
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = (currentProfile.interests || []).filter((i: string) => i !== interest);
    setLocalProfile({
      ...currentProfile,
      interests: updatedInterests,
    });
  };

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setLocalAchievements([
        ...localAchievements,
        { ...newAchievement, id: Date.now().toString() },
      ]);
      setNewAchievement({ id: "", title: "", description: "", date: "" });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-semibold">
                {`${currentProfile.firstName || ''} ${currentProfile.lastName || ''}`
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{`${currentProfile.firstName || ''} ${currentProfile.lastName || ''}`}</h1>
                <p className="text-muted-foreground">Perfil Joven</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={currentProfile.email || ''}
                    onChange={(e) =>
                      setLocalProfile({ ...currentProfile, email: e.target.value })
                    }
                  />
                ) : (
                  <span>{currentProfile.email || 'No especificado'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={currentProfile.phone || ''}
                    onChange={(e) =>
                      setLocalProfile({ ...currentProfile, phone: e.target.value })
                    }
                  />
                ) : (
                  <span>{currentProfile.phone || 'No especificado'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={`${currentProfile.address || ''}, ${currentProfile.municipality || ''}`}
                    onChange={(e) =>
                      setLocalProfile({ ...currentProfile, address: e.target.value })
                    }
                  />
                ) : (
                  <span>{`${currentProfile.address || 'No especificado'}, ${currentProfile.municipality || ''}`}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={currentProfile.currentInstitution || ''}
                    onChange={(e) =>
                      setLocalProfile({ ...currentProfile, currentInstitution: e.target.value })
                    }
                  />
                ) : (
                  <span>{currentProfile.currentInstitution || 'No especificado'}</span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Intereses</h3>
                                <div className="flex flex-wrap gap-2">
                  {(currentProfile.interests || []).map((interest: string) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Nuevo interés"
                        className="w-32"
                      />
                      <Button size="sm" onClick={handleAddInterest}>
                        <Plus className="h-4 w-4" />
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
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Logros
            </CardTitle>
            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Logro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Logro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
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
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
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
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        value={newAchievement.date}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            date: e.target.value,
                          })
                        }
                        placeholder="Ej: 2023 o 2022-2023"
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
          <div className="space-y-4">
            {localAchievements.map((achievement: Achievement) => (
              <div
                key={achievement.id}
                className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                  <Badge variant="outline">{achievement.date}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos Profesionales</CardTitle>
          <CardDescription>
            Prepara tu CV y carta de presentación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowCVDialog(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Curriculum Vitae
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowCoverLetterDialog(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Carta de Presentación
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificados de mis cursos
          </CardTitle>
          <CardDescription>
            Visualiza y descarga tus certificados técnicos completados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              nombre: "Fundamentos de Programación en JavaScript",
              fecha: "15 de abril de 2024",
            },
            {
              nombre: "Diseño Gráfico con Canva y Photoshop",
              fecha: "2 de marzo de 2024",
            },
            {
              nombre: "Manejo de Redes Sociales para Emprendimientos",
              fecha: "20 de febrero de 2024",
            },
            {
              nombre: "Microsoft Excel Básico e Intermedio",
              fecha: "10 de enero de 2024",
            },
          ].map((cert, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">{cert.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  Finalizado el {cert.fecha}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Descargar Pdf
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CV Dialog */}
      <Dialog open={showCVDialog} onOpenChange={setShowCVDialog}>
        <DialogContent className="max-w-4xl">
          <CVTemplate />
        </DialogContent>
      </Dialog>

      {/* Cover Letter Dialog */}
      <Dialog
        open={showCoverLetterDialog}
        onOpenChange={setShowCoverLetterDialog}
      >
        <DialogContent className="max-w-4xl">
          <CoverLetterTemplate />
        </DialogContent>
      </Dialog>
    </div>
  );
}
