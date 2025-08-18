"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Calendar, CheckCircle } from "lucide-react";
import { useCertificates } from "@/hooks/useCertificateApi";

export default function CertificatesPage() {
  const { data: certificates, loading, error } = useCertificates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mis Certificados
          </h1>
          <p className="text-muted-foreground">
            Certificados obtenidos de cursos completados exitosamente
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Award className="mr-2 h-4 w-4" />
            {certificates?.length || 0} Certificados
          </Badge>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p>Cargando certificados...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p>Error al cargar los certificados: {error.message}</p>
          </CardContent>
        </Card>
      ) : certificates?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes certificados aún
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Completa cursos para obtener certificados y validar tus
              habilidades
            </p>
            <Button>Explorar Cursos</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates?.map((certificate) => (
            <Card key={certificate.id} className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completado
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight pr-20">
                  {certificate.courseName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Completado:{" "}
                    {new Date(certificate.completedDate).toLocaleDateString(
                      "es-ES"
                    )}
                  </div>
                  <div>Instructor: {certificate.instructor}</div>
                  <div>Calificación: {certificate.grade}</div>
                  <div className="text-xs">
                    ID Credencial: {certificate.credentialId}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Pdf
                  </Button>
                  <Button size="sm" variant="outline">
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {certificates?.length > 0 && (
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">
            💡 Consejos para tus certificados
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Agrega estos certificados a tu perfil profesional</li>
            <li>• Compártelos en redes sociales profesionales</li>
            <li>• Incluye el ID de credencial en tu CV</li>
            <li>
              • Los empleadores pueden verificar la autenticidad usando el ID
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
