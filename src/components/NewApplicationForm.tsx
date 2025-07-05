"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function NewApplicationPage() {
  const [hasCV, setHasCV] = useState(false);
  const [hasCoverLetter, setHasCoverLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setProfile({
        name: "Ana Martínez",
        email: "ana.martinez@email.com",
        phone: "+591 77777777",
        city: "La Paz",
        country: "Bolivia",
        education: "Bachiller - Colegio La Salle",
        interests: ["Tecnología", "Marketing Digital", "Diseño"],
      });
      setHasCV(true);
      setHasCoverLetter(false);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerate = () => {
    alert("Postulación generada correctamente.");
    router.push("/my-applications");
  };

  if (loading) {
    return <p className="p-6">Cargando datos del perfil...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Perfil del Joven */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-start justify-between p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback>
                {profile?.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">Perfil Joven</p>

              <div className="mt-4 space-y-1 text-sm text-gray-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {profile?.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {profile?.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile?.city}, {profile?.country}
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> {profile?.education}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 text-sm text-right">
            <p className="font-semibold mb-1">Intereses</p>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.map((interest: string) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verificación de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verificación de documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-800">
              <FileText className="w-5 h-5" />
              Curriculum Vitae
            </span>
            {hasCV ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Disponible
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="w-4 h-4 mr-1" />
                No disponible
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-800">
              <FileText className="w-5 h-5" />
              Carta de Presentación
            </span>
            {hasCoverLetter ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Disponible
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="w-4 h-4 mr-1" />
                No disponible
              </Badge>
            )}
          </div>

          {!hasCV && (
            <Button variant="outline" className="w-full">
              Crear CV
            </Button>
          )}
          {!hasCoverLetter && (
            <Button variant="outline" className="w-full">
              Crear Carta de Presentación
            </Button>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleGenerate} className="w-full">
        Generar Postulación
      </Button>
    </div>
  );
}
