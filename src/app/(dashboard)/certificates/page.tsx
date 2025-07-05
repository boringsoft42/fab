import { Metadata } from &ldquo;next&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Award, Download, Calendar, CheckCircle } from &ldquo;lucide-react&rdquo;;

export const metadata: Metadata = {
  title: &ldquo;Mis Certificados&rdquo;,
  description: &ldquo;Certificados obtenidos de cursos completados&rdquo;,
};

export default function CertificatesPage() {
  // Mock certificates data
  const certificates = [
    {
      id: &ldquo;1&rdquo;,
      courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
      instructor: &ldquo;Dra. Ana Pérez&rdquo;,
      completedDate: &ldquo;2024-12-15&rdquo;,
      certificateUrl: &ldquo;/certificates/cert-1.pdf&rdquo;,
      grade: &ldquo;90%&rdquo;,
      credentialId: &ldquo;CEMSE-2024-001&rdquo;,
    },
    {
      id: &ldquo;2&rdquo;,
      courseName: &ldquo;Comunicación Efectiva&rdquo;,
      instructor: &ldquo;Lic. Carlos López&rdquo;,
      completedDate: &ldquo;2024-11-28&rdquo;,
      certificateUrl: &ldquo;/certificates/cert-2.pdf&rdquo;,
      grade: &ldquo;85%&rdquo;,
      credentialId: &ldquo;CEMSE-2024-002&rdquo;,
    },
  ];

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>
            Mis Certificados
          </h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Certificados obtenidos de cursos completados exitosamente
          </p>
        </div>
        <div className=&ldquo;flex gap-4&rdquo;>
          <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-lg px-3 py-1&rdquo;>
            <Award className=&ldquo;mr-2 h-4 w-4&rdquo; />
            {certificates.length} Certificados
          </Badge>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className=&ldquo;flex flex-col items-center justify-center py-12&rdquo;>
            <Award className=&ldquo;h-12 w-12 text-muted-foreground mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
              No tienes certificados aún
            </h3>
            <p className=&ldquo;text-muted-foreground text-center mb-4&rdquo;>
              Completa cursos para obtener certificados y validar tus
              habilidades
            </p>
            <Button>Explorar Cursos</Button>
          </CardContent>
        </Card>
      ) : (
        <div className=&ldquo;grid gap-6 md:grid-cols-2 lg:grid-cols-3&rdquo;>
          {certificates.map((certificate) => (
            <Card key={certificate.id} className=&ldquo;relative overflow-hidden&rdquo;>
              <div className=&ldquo;absolute top-2 right-2&rdquo;>
                <Badge
                  variant=&ldquo;secondary&rdquo;
                  className=&ldquo;bg-green-100 text-green-800 border-green-200&rdquo;
                >
                  <CheckCircle className=&ldquo;mr-1 h-3 w-3&rdquo; />
                  Completado
                </Badge>
              </div>

              <CardHeader className=&ldquo;pb-3&rdquo;>
                <CardTitle className=&ldquo;text-lg leading-tight pr-20&rdquo;>
                  {certificate.courseName}
                </CardTitle>
              </CardHeader>

              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;space-y-2 text-sm text-muted-foreground&rdquo;>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Calendar className=&ldquo;h-4 w-4&rdquo; />
                    Completado:{&ldquo; &rdquo;}
                    {new Date(certificate.completedDate).toLocaleDateString(
                      &ldquo;es-ES&rdquo;
                    )}
                  </div>
                  <div>Instructor: {certificate.instructor}</div>
                  <div>
                    Calificación:{&ldquo; &rdquo;}
                    <span className=&ldquo;font-semibold text-foreground&rdquo;>
                      {certificate.grade}
                    </span>
                  </div>
                  <div className=&ldquo;text-xs&rdquo;>
                    ID Credencial: {certificate.credentialId}
                  </div>
                </div>

                <div className=&ldquo;flex gap-2 pt-2&rdquo;>
                  <Button size=&ldquo;sm&rdquo; className=&ldquo;flex-1&rdquo;>
                    <Download className=&ldquo;mr-2 h-4 w-4&rdquo; />
                    Descargar Pdf
                  </Button>
                  <Button size=&ldquo;sm&rdquo; variant=&ldquo;outline&rdquo;>
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {certificates.length > 0 && (
        <div className=&ldquo;mt-8 p-6 bg-muted/50 rounded-lg&rdquo;>
          <h3 className=&ldquo;font-semibold mb-2&rdquo;>
            💡 Consejos para tus certificados
          </h3>
          <ul className=&ldquo;text-sm text-muted-foreground space-y-1&rdquo;>
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
