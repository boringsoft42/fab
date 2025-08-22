import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Event } from "@/hooks/use-events";

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onAttend?: (eventId: string) => void;
  onUnattend?: (eventId: string) => void;
  showActions?: boolean;
}

export function EventCard({
  event,
  onViewDetails,
  onAttend,
  onUnattend,
  showActions = true,
}: EventCardProps) {
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      IN_PERSON: { label: "Presencial", variant: "default" as const },
      VIRTUAL: { label: "Virtual", variant: "secondary" as const },
      HYBRID: { label: "Híbrido", variant: "outline" as const },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isRegistrationOpen = (event: Event) => {
    if (!event.registrationDeadline) return true;
    const deadline = new Date(event.registrationDeadline);
    const now = new Date();
    return now <= deadline;
  };

  const isEventFull = (event: Event) => {
    if (!event.maxCapacity) return false;
    return event.currentAttendees >= event.maxCapacity;
  };

  return (
    <Card className="overflow-hidden">
      {event.imageUrl && (
        <div className="aspect-video bg-muted">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{event.organizer}</p>
          </div>
          {event.isFeatured && (
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(event.date), "dd/MM/yyyy", { locale: es })}
          </span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          {getTypeBadge(event.type)}
          <Badge variant="outline">{event.category}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{event.currentAttendees}</span>
          {event.maxCapacity && <span>/ {event.maxCapacity}</span>}
        </div>
        {event.price && event.price > 0 && (
          <div className="text-sm font-medium">Precio: ${event.price}</div>
        )}
        {showActions && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(event)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
            {event.isRegistered ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onUnattend?.(event.id)}
                disabled={!isRegistrationOpen(event)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onAttend?.(event.id)}
                disabled={!isRegistrationOpen(event) || isEventFull(event)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isEventFull(event) ? "Lleno" : "Asistir"}
              </Button>
            )}
          </div>
        )}
        {!isRegistrationOpen(event) && (
          <div className="text-xs text-red-500">Registro cerrado</div>
        )}
        {isEventFull(event) && !event.isRegistered && (
          <div className="text-xs text-red-500">Evento lleno</div>
        )}
      </CardContent>
    </Card>
  );
}
