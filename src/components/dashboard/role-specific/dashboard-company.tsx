"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  UserCheck,
  ArrowRight,
  Building,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Desarrollador Frontend Senior</h4>
            <p className="text-sm text-gray-600">
              Cierra en {secondsLeft}s
            </p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="font-medium">24 candidatos</p>
          {result === null ? (
            <Badge variant="default">Activa</Badge>
          ) : result ? (
            <Badge variant="success">¡Contratado!</Badge>
          ) : (
            <Badge variant="destructive">Sin contratar</Badge>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resultado de la Oferta</DialogTitle>
            <DialogDescription>
              {result
                ? "🎉 ¡Se ha contratado un candidato exitosamente!"
                : "❌ No se logró contratar a ningún candidato esta vez."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DashboardCompany() {
  return (
    <div className="space-y-8 px-10 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Empresa</h1>
            <p className="text-blue-100">
              Publica ofertas de empleo y gestiona tus procesos de selección
            </p>
          </div>
          <Building className="w-16 h-16 text-blue-200 hidden md:block" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Ofertas Activas</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Candidatos Totales</p>
                <p className="text-2xl font-bold">124</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">En Proceso</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
  <CardContent className="p-4">
    <div className="flex items-center space-x-2">
      <Briefcase className="w-5 h-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium">Ofertas Cerradas</p>
        <p className="text-2xl font-bold">5</p>
      </div>
    </div>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-4">
    <div className="flex items-center space-x-2">
      <Users className="w-5 h-5 text-orange-500" />
      <div>
        <p className="text-sm font-medium">Candidatos por Oferta</p>
        <p className="text-2xl font-bold">15.5</p>
      </div>
    </div>
  </CardContent>
</Card>

<Card>
  <CardContent className="p-4">
    <div className="flex items-center space-x-2">
      <UserCheck className="w-5 h-5 text-teal-600" />
      <div>
        <p className="text-sm font-medium">Tasa de Conversión</p>
        <p className="text-2xl font-bold">12%</p>
      </div>
    </div>
  </CardContent>
</Card>

      </div>

      {/* Crear Nueva Oferta */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Publicar Nueva Oferta</h3>
          <p className="text-gray-600 mb-4">
            Crea una nueva publicación para atraer talento ideal
          </p>
          <Button asChild>
            <Link href="/jobs/create">
              Crear Oferta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Ofertas activas destacadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Ofertas de Trabajo Activas
          </CardTitle>
          <CardDescription>
            Revisa y gestiona tus publicaciones activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SimulatedJobCard />
            {/* Puedes duplicar <SimulatedJobCard /> para simular más ofertas */}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button asChild className="w-full">
              <Link href="/job-publishing/my-offers">
                Ver Todas las Ofertas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      


      {/* Postulaciones Recientes */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Users className="w-5 h-5" />
      Postulaciones Recientes
    </CardTitle>
    <CardDescription>
      Revisa las postulaciones enviadas recientemente por jóvenes
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        {
          name: "Ana Martínez",
          email: "ana.martinez@email.com",
          phone: "+591 77777777",
          city: "La Paz",
          education: "Bachiller - Colegio La Salle",
          interests: ["Tecnología", "Marketing Digital", "Diseño"],
          cv: true,
          cover: false,
        },
        {
          name: "Carlos Rojas",
          email: "carlosr@email.com",
          phone: "+591 78888888",
          city: "Cochabamba",
          education: "Técnico Medio - INFOCAL",
          interests: ["Redes", "Hardware", "Sistemas"],
          cv: true,
          cover: true,
        },
      ].map((user) => (
        <Card key={user.email} className="border border-gray-200 p-4">
          <div className="flex flex-col space-y-1 mb-2">
            <h4 className="font-semibold text-base">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
            <p className="text-sm text-gray-600">{user.city}</p>
            <p className="text-sm text-gray-600">{user.education}</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {user.interests.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Badge variant={user.cv ? "success" : "destructive"}>
              CV {user.cv ? "Disponible" : "Faltante"}
            </Badge>
            <Badge variant={user.cover ? "success" : "destructive"}>
              Carta {user.cover ? "Disponible" : "Faltante"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>


      {/* Acciones rápidas */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Gestionar Candidatos</h3>
            <p className="text-gray-600 mb-4">
              Visualiza postulaciones y avanza en tus procesos de selección
            </p>
            <Button variant="outline" asChild>
              <Link href="/job-publishing/candidates">
                Ver Candidatos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
