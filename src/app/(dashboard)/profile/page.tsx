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
import { StudentProfile } from "@/components/profile/StudentProfile";
import { ProfileDetails } from "@/components/profile/ProfileDetails";

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

// Extended mock data for new components
const mockStudentProfileData = {
  ...mockProfile,
  avatar: null,
  joinDate: "Enero 2023",
  achievements: [
    {
      id: "1",
      title: "Primer lugar en Hackathon 2023",
      description: "Gané el primer lugar en el hackathon de desarrollo web organizado por la universidad",
      date: "2023",
      type: "project" as const
    },
    {
      id: "2", 
      title: "Certificación en JavaScript",
      description: "Completé exitosamente el curso avanzado de JavaScript",
      date: "2023",
      type: "certificate" as const
    },
    {
      id: "3",
      title: "Proyecto de voluntariado",
      description: "Participé en un proyecto de enseñanza de programación a niños",
      date: "2022",
      type: "volunteer" as const
    }
  ],
  certificates: [
    {
      id: "1",
      title: "Certificado de JavaScript Avanzado",
      course: "JavaScript para Desarrolladores",
      issueDate: "15 Mar 2023",
      status: "active" as const,
      downloadUrl: "#"
    },
    {
      id: "2",
      title: "Certificado de React Fundamentals",
      course: "React desde Cero",
      issueDate: "20 Feb 2023",
      status: "active" as const,
      downloadUrl: "#"
    }
  ],
  courses: [
    {
      id: "1",
      title: "Desarrollo Web Full Stack",
      progress: 75,
      status: "in_progress" as const,
      lastAccessed: "Hace 2 días"
    },
    {
      id: "2",
      title: "Python para Principiantes",
      progress: 100,
      status: "completed" as const,
      lastAccessed: "Hace 1 semana"
    },
    {
      id: "3",
      title: "Machine Learning Básico",
      progress: 25,
      status: "enrolled" as const,
      lastAccessed: "Hace 3 días"
    }
  ]
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

  const handleProfileUpdate = async (data: any) => {
    // TODO: Implement actual profile update
    console.log('Profile update:', data);
    // For now, just update local state
    setLocalProfile(prev => ({ ...prev, ...data }));
  };

  const handleDownloadCertificate = (certificateId: string) => {
    // TODO: Implement certificate download
    console.log('Download certificate:', certificateId);
  };

  const handleViewCourse = (courseId: string) => {
    // TODO: Navigate to course
    console.log('View course:', courseId);
  };

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
    <div className="container mx-auto py-6">
      <StudentProfile
        profile={mockStudentProfileData}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
