&ldquo;use client&rdquo;;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Briefcase,
  Users,
  UserCheck,
  ArrowRight,
  Building,
} from &ldquo;lucide-react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { useEffect, useState } from &ldquo;react&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from &ldquo;@/components/ui/dialog&rdquo;;

// Componente de tarjeta de oferta con temporizador y modal
function SimulatedJobCard() {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [result, setResult] = useState<null | boolean>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const hired = Math.random() > 0.5;
          setResult(hired);
          setShowModal(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
  };

  return (
    <>
      <div className=&ldquo;flex items-center justify-between p-4 bg-blue-50 rounded-lg&rdquo;>
        <div className=&ldquo;flex items-center gap-4&rdquo;>
          <div className=&ldquo;w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center&rdquo;>
            <Briefcase className=&ldquo;w-5 h-5 text-white&rdquo; />
          </div>
          <div>
            <h4 className=&ldquo;font-medium&rdquo;>Desarrollador Frontend Senior</h4>
            <p className=&ldquo;text-sm text-gray-600&rdquo;>
              Cierra en {secondsLeft}s
            </p>
          </div>
        </div>
        <div className=&ldquo;text-right space-y-1&rdquo;>
          <p className=&ldquo;font-medium&rdquo;>24 candidatos</p>
          {result === null ? (
            <Badge variant=&ldquo;default&rdquo;>Activa</Badge>
          ) : result ? (
            <Badge variant=&ldquo;success&rdquo;>¡Contratado!</Badge>
          ) : (
            <Badge variant=&ldquo;destructive&rdquo;>Sin contratar</Badge>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resultado de la Oferta</DialogTitle>
            <DialogDescription>
              {result
                ? &ldquo;🎉 ¡Se ha contratado un candidato exitosamente!&rdquo;
                : &ldquo;❌ No se logró contratar a ningún candidato esta vez.&rdquo;}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DashboardCompany() {
  return (
    <div className=&ldquo;space-y-8 px-10 py-4&rdquo;>
      {/* Header */}
      <div className=&ldquo;bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div>
            <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Panel de Empresa</h1>
            <p className=&ldquo;text-blue-100&rdquo;>
              Publica ofertas de empleo y gestiona tus procesos de selección
            </p>
          </div>
          <Building className=&ldquo;w-16 h-16 text-blue-200 hidden md:block&rdquo; />
        </div>
      </div>

      {/* Stats */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center space-x-2&rdquo;>
              <Briefcase className=&ldquo;w-5 h-5 text-blue-500&rdquo; />
              <div>
                <p className=&ldquo;text-sm font-medium&rdquo;>Ofertas Activas</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center space-x-2&rdquo;>
              <Users className=&ldquo;w-5 h-5 text-green-500&rdquo; />
              <div>
                <p className=&ldquo;text-sm font-medium&rdquo;>Candidatos Totales</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>124</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center space-x-2&rdquo;>
              <UserCheck className=&ldquo;w-5 h-5 text-purple-500&rdquo; />
              <div>
                <p className=&ldquo;text-sm font-medium&rdquo;>En Proceso</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
  <CardContent className=&ldquo;p-4&rdquo;>
    <div className=&ldquo;flex items-center space-x-2&rdquo;>
      <Briefcase className=&ldquo;w-5 h-5 text-gray-500&rdquo; />
      <div>
        <p className=&ldquo;text-sm font-medium&rdquo;>Ofertas Cerradas</p>
        <p className=&ldquo;text-2xl font-bold&rdquo;>5</p>
      </div>
    </div>
  </CardContent>
</Card>

<Card>
  <CardContent className=&ldquo;p-4&rdquo;>
    <div className=&ldquo;flex items-center space-x-2&rdquo;>
      <Users className=&ldquo;w-5 h-5 text-orange-500&rdquo; />
      <div>
        <p className=&ldquo;text-sm font-medium&rdquo;>Candidatos por Oferta</p>
        <p className=&ldquo;text-2xl font-bold&rdquo;>15.5</p>
      </div>
    </div>
  </CardContent>
</Card>

<Card>
  <CardContent className=&ldquo;p-4&rdquo;>
    <div className=&ldquo;flex items-center space-x-2&rdquo;>
      <UserCheck className=&ldquo;w-5 h-5 text-teal-600&rdquo; />
      <div>
        <p className=&ldquo;text-sm font-medium&rdquo;>Tasa de Conversión</p>
        <p className=&ldquo;text-2xl font-bold&rdquo;>12%</p>
      </div>
    </div>
  </CardContent>
</Card>

      </div>

      {/* Crear Nueva Oferta */}
      <Card className=&ldquo;border-dashed&rdquo;>
        <CardContent className=&ldquo;p-6 text-center&rdquo;>
          <Briefcase className=&ldquo;w-8 h-8 text-blue-500 mx-auto mb-4&rdquo; />
          <h3 className=&ldquo;text-lg font-medium mb-2&rdquo;>Publicar Nueva Oferta</h3>
          <p className=&ldquo;text-gray-600 mb-4&rdquo;>
            Crea una nueva publicación para atraer talento ideal
          </p>
          <Button asChild>
            <Link href=&ldquo;/jobs/create&rdquo;>
              Crear Oferta
              <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Ofertas activas destacadas */}
      <Card>
        <CardHeader>
          <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
            <Briefcase className=&ldquo;w-5 h-5&rdquo; />
            Ofertas de Trabajo Activas
          </CardTitle>
          <CardDescription>
            Revisa y gestiona tus publicaciones activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;space-y-4&rdquo;>
            <SimulatedJobCard />
            {/* Puedes duplicar <SimulatedJobCard /> para simular más ofertas */}
          </div>

          <div className=&ldquo;mt-4 pt-4 border-t&rdquo;>
            <Button asChild className=&ldquo;w-full&rdquo;>
              <Link href=&ldquo;/job-publishing/my-offers&rdquo;>
                Ver Todas las Ofertas
                <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      


      {/* Postulaciones Recientes */}
<Card>
  <CardHeader>
    <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
      <Users className=&ldquo;w-5 h-5&rdquo; />
      Postulaciones Recientes
    </CardTitle>
    <CardDescription>
      Revisa las postulaciones enviadas recientemente por jóvenes
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4&rdquo;>
      {[
        {
          name: &ldquo;Ana Martínez&rdquo;,
          email: &ldquo;ana.martinez@email.com&rdquo;,
          phone: &ldquo;+591 77777777&rdquo;,
          city: &ldquo;La Paz&rdquo;,
          education: &ldquo;Bachiller - Colegio La Salle&rdquo;,
          interests: [&ldquo;Tecnología&rdquo;, &ldquo;Marketing Digital&rdquo;, &ldquo;Diseño&rdquo;],
          cv: true,
          cover: false,
        },
        {
          name: &ldquo;Carlos Rojas&rdquo;,
          email: &ldquo;carlosr@email.com&rdquo;,
          phone: &ldquo;+591 78888888&rdquo;,
          city: &ldquo;Cochabamba&rdquo;,
          education: &ldquo;Técnico Medio - INFOCAL&rdquo;,
          interests: [&ldquo;Redes&rdquo;, &ldquo;Hardware&rdquo;, &ldquo;Sistemas&rdquo;],
          cv: true,
          cover: true,
        },
      ].map((user) => (
        <Card key={user.email} className=&ldquo;border border-gray-200 p-4&rdquo;>
          <div className=&ldquo;flex flex-col space-y-1 mb-2&rdquo;>
            <h4 className=&ldquo;font-semibold text-base&rdquo;>{user.name}</h4>
            <p className=&ldquo;text-sm text-gray-600&rdquo;>{user.email}</p>
            <p className=&ldquo;text-sm text-gray-600&rdquo;>{user.phone}</p>
            <p className=&ldquo;text-sm text-gray-600&rdquo;>{user.city}</p>
            <p className=&ldquo;text-sm text-gray-600&rdquo;>{user.education}</p>
          </div>
          <div className=&ldquo;flex flex-wrap gap-1 mb-2&rdquo;>
            {user.interests.map((tag) => (
              <Badge key={tag} variant=&ldquo;secondary&rdquo;>
                {tag}
              </Badge>
            ))}
          </div>
          <div className=&ldquo;flex items-center justify-between&rdquo;>
            <Badge variant={user.cv ? &ldquo;success&rdquo; : &ldquo;destructive&rdquo;}>
              CV {user.cv ? &ldquo;Disponible&rdquo; : &ldquo;Faltante&rdquo;}
            </Badge>
            <Badge variant={user.cover ? &ldquo;success&rdquo; : &ldquo;destructive&rdquo;}>
              Carta {user.cover ? &ldquo;Disponible&rdquo; : &ldquo;Faltante&rdquo;}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>


      {/* Acciones rápidas */}
      {/* <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
        <Card className=&ldquo;border-dashed&rdquo;>
          <CardContent className=&ldquo;p-6 text-center&rdquo;>
            <Users className=&ldquo;w-8 h-8 text-green-500 mx-auto mb-4&rdquo; />
            <h3 className=&ldquo;text-lg font-medium mb-2&rdquo;>Gestionar Candidatos</h3>
            <p className=&ldquo;text-gray-600 mb-4&rdquo;>
              Visualiza postulaciones y avanza en tus procesos de selección
            </p>
            <Button variant=&ldquo;outline&rdquo; asChild>
              <Link href=&ldquo;/job-publishing/candidates&rdquo;>
                Ver Candidatos
                <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
