"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { UserProfile } from "@/types/api";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  profileId?: string;
  className?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
  showAvatar?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileId,
  className = "",
  onProfileUpdate,
  showAvatar = true,
}) => {
  const { profile, loading, error, getProfile, updateProfile, clearError } =
    useProfileAvatar();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load profile on mount
  useEffect(() => {
    if (profileId || !profile) {
      getProfile();
    }
  }, [profileId, profile, getProfile]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        interests: profile.interests || [],
        skills: profile.skills || [],
        education: profile.education || "",
        experience: profile.experience || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field: keyof UserProfile, value: string) => {
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: arrayValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.id) {
      console.error("No profile ID available");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    clearError();

    try {
      const updatedProfile = await updateProfile(formData);
      setSaveSuccess(true);

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (onProfileUpdate && profile) {
      onProfileUpdate({
        ...profile,
        avatarUrl: newAvatarUrl,
      });
    }
  };

  if (loading && !profile) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando perfil...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Avatar Upload Section */}
      {showAvatar && (
        <ProfileAvatarUpload
          profileId={profileId}
          currentAvatarUrl={profile?.avatarUrl}
          onAvatarUpdate={handleAvatarUpdate}
          size="lg"
        />
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {saveSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Perfil actualizado exitosamente
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Tu nombre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Tu número de teléfono"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Ciudad, Departamento"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <select
                  id="gender"
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Seleccionar género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
              />
            </div>

            {/* Skills and Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades</Label>
                <Input
                  id="skills"
                  value={
                    Array.isArray(formData.skills)
                      ? formData.skills.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleArrayInputChange("skills", e.target.value)
                  }
                  placeholder="Habilidad 1, Habilidad 2, Habilidad 3"
                />
                <p className="text-xs text-muted-foreground">
                  Separa las habilidades con comas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Intereses</Label>
                <Input
                  id="interests"
                  value={
                    Array.isArray(formData.interests)
                      ? formData.interests.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleArrayInputChange("interests", e.target.value)
                  }
                  placeholder="Interés 1, Interés 2, Interés 3"
                />
                <p className="text-xs text-muted-foreground">
                  Separa los intereses con comas
                </p>
              </div>
            </div>

            {/* Education and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">Educación</Label>
                <Textarea
                  id="education"
                  value={formData.education || ""}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  placeholder="Tu formación académica..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia</Label>
                <Textarea
                  id="experience"
                  value={formData.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="Tu experiencia laboral..."
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving || loading}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
