&ldquo;use client&rdquo;;

import { useEffect, useState } from &ldquo;react&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
} from &ldquo;lucide-react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { Avatar, AvatarFallback } from &ldquo;@/components/ui/avatar&rdquo;;

export default function NewApplicationPage() {
  const [hasCV, setHasCV] = useState(false);
  const [hasCoverLetter, setHasCoverLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setProfile({
        name: &ldquo;Ana Martínez&rdquo;,
        email: &ldquo;ana.martinez@email.com&rdquo;,
        phone: &ldquo;+591 77777777&rdquo;,
        city: &ldquo;La Paz&rdquo;,
        country: &ldquo;Bolivia&rdquo;,
        education: &ldquo;Bachiller - Colegio La Salle&rdquo;,
        interests: [&ldquo;Tecnología&rdquo;, &ldquo;Marketing Digital&rdquo;, &ldquo;Diseño&rdquo;],
      });
      setHasCV(true);
      setHasCoverLetter(false);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerate = () => {
    alert(&ldquo;Postulación generada correctamente.&rdquo;);
    router.push(&ldquo;/my-applications&rdquo;);
  };

  if (loading) {
    return <p className=&ldquo;p-6&rdquo;>Cargando datos del perfil...</p>;
  }

  return (
    <div className=&ldquo;max-w-3xl mx-auto py-6 space-y-6&rdquo;>
      <Button variant=&ldquo;ghost&rdquo; onClick={() => router.back()} className=&ldquo;mb-4&rdquo;>
        <ArrowLeft className=&ldquo;w-4 h-4 mr-2&rdquo; />
        Volver
      </Button>

      {/* Perfil del Joven */}
      <Card>
        <CardContent className=&ldquo;flex flex-col md:flex-row items-start justify-between p-6&rdquo;>
          <div className=&ldquo;flex items-start space-x-4&rdquo;>
            <Avatar className=&ldquo;w-16 h-16&rdquo;>
              <AvatarFallback>
                {profile?.name?.[0] ?? &ldquo;U&rdquo;}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className=&ldquo;text-xl font-bold&rdquo;>{profile?.name}</h2>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Perfil Joven</p>

              <div className=&ldquo;mt-4 space-y-1 text-sm text-gray-800&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Mail className=&ldquo;w-4 h-4&rdquo; /> {profile?.email}
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Phone className=&ldquo;w-4 h-4&rdquo; /> {profile?.phone}
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <MapPin className=&ldquo;w-4 h-4&rdquo; /> {profile?.city}, {profile?.country}
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <GraduationCap className=&ldquo;w-4 h-4&rdquo; /> {profile?.education}
                </div>
              </div>
            </div>
          </div>

          <div className=&ldquo;mt-4 md:mt-0 text-sm text-right&rdquo;>
            <p className=&ldquo;font-semibold mb-1&rdquo;>Intereses</p>
            <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
              {profile?.interests?.map((interest: string) => (
                <Badge key={interest} variant=&ldquo;secondary&rdquo;>
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
          <CardTitle className=&ldquo;text-lg&rdquo;>Verificación de documentos</CardTitle>
        </CardHeader>
        <CardContent className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <span className=&ldquo;flex items-center gap-2 text-gray-800&rdquo;>
              <FileText className=&ldquo;w-5 h-5&rdquo; />
              Curriculum Vitae
            </span>
            {hasCV ? (
              <Badge className=&ldquo;bg-green-100 text-green-800&rdquo;>
                <CheckCircle className=&ldquo;w-4 h-4 mr-1&rdquo; />
                Disponible
              </Badge>
            ) : (
              <Badge className=&ldquo;bg-red-100 text-red-800&rdquo;>
                <XCircle className=&ldquo;w-4 h-4 mr-1&rdquo; />
                No disponible
              </Badge>
            )}
          </div>

          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <span className=&ldquo;flex items-center gap-2 text-gray-800&rdquo;>
              <FileText className=&ldquo;w-5 h-5&rdquo; />
              Carta de Presentación
            </span>
            {hasCoverLetter ? (
              <Badge className=&ldquo;bg-green-100 text-green-800&rdquo;>
                <CheckCircle className=&ldquo;w-4 h-4 mr-1&rdquo; />
                Disponible
              </Badge>
            ) : (
              <Badge className=&ldquo;bg-red-100 text-red-800&rdquo;>
                <XCircle className=&ldquo;w-4 h-4 mr-1&rdquo; />
                No disponible
              </Badge>
            )}
          </div>

          {!hasCV && (
            <Button variant=&ldquo;outline&rdquo; className=&ldquo;w-full&rdquo;>
              Crear CV
            </Button>
          )}
          {!hasCoverLetter && (
            <Button variant=&ldquo;outline&rdquo; className=&ldquo;w-full&rdquo;>
              Crear Carta de Presentación
            </Button>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleGenerate} className=&ldquo;w-full&rdquo;>
        Generar Postulación
      </Button>
    </div>
  );
}
