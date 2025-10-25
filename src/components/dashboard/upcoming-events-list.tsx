"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import type { UpcomingEvent } from "@/lib/actions/dashboard/admin-fab-actions";

interface UpcomingEventsListProps {
  events: UpcomingEvent[];
}

const tipoColors = {
  federativo: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  asociacion: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const estadoColors = {
  borrador: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  en_revision: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  aprobado: "bg-green-500/10 text-green-500 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-500 border-red-500/20",
  finalizado: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>No hay eventos próximos programados</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>Los 5 eventos más cercanos</CardDescription>
        </div>
        <Link href="/dashboard/events">
          <Button variant="ghost" size="sm">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{event.nombre}</h4>
                  <Badge variant="outline" className={tipoColors[event.tipo as keyof typeof tipoColors]}>
                    {event.tipo}
                  </Badge>
                  <Badge variant="outline" className={estadoColors[event.estado as keyof typeof estadoColors]}>
                    {event.estado.replace("_", " ")}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.fecha_evento).toLocaleDateString("es-BO", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.ciudad}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.total_inscritos} inscritos
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/events/${event.id}`}>
                <Button variant="ghost" size="sm">
                  Ver detalle
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
