import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { apiCall, getUserFromToken } from "@/lib/api";

export interface Event {
    id: string;
    title: string;
    organizer: string;
    description: string;
    date: string;
    time: string;
    type: "IN_PERSON" | "VIRTUAL" | "HYBRID";
    category: string;
    location: string;
    maxCapacity?: number;
    currentAttendees?: number;
    attendeesCount?: number; // Backend uses this field
    price?: number;
    status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
    featured: boolean;
    isFeatured?: boolean; // Frontend uses this field
    registrationDeadline?: string;
    imageUrl?: string;
    tags?: string[];
    requirements?: string[];
    agenda?: string[];
    speakers?: string[];
    municipalityId?: string;
    createdAt: string;
    updatedAt: string;
    isRegistered?: boolean;
    attendeeStatus?: string;
    viewsCount?: number;
    attendanceRate?: string;
    publishedAt?: string;
    createdBy?: string;
    creator?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
    attendees?: unknown[];
}

export interface EventStats {
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
    attendanceRate: number;
    publishedEvents: number;
    featuredEvents: number;
}

export interface Attendee {
    id: string;
    userId: string;
    eventId: string;
    status: "REGISTERED" | "CONFIRMED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
    registeredAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface CreateEventData {
    title: string;
    organizer: string;
    description: string;
    date: string;
    time: string;
    type: "IN_PERSON" | "VIRTUAL" | "HYBRID";
    category: string;
    location: string;
    maxCapacity?: number;
    price?: number;
    status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
    featured: boolean;
    registrationDeadline?: string;
    imageUrl?: string;
    image?: File;
    tags?: string[];
    requirements?: string[];
    agenda?: string[];
    speakers?: string[];
    municipalityId?: string;
}

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiCall("/events");
            console.log('🔍 useEvents - Raw data from API:', data);

            // Get current user info to check registration status
            const currentUser = getUserFromToken();
            console.log('🔍 useEvents - Current user:', currentUser);

            // Handle the new response structure with events array and statistics
            let eventsData: Event[] = [];
            if (data && typeof data === 'object' && 'events' in data) {
                // New structure: { events: [...], total: number, statistics: {...} }
                eventsData = Array.isArray(data.events) ? data.events as Event[] : [];
            } else if (Array.isArray(data)) {
                // Legacy structure: direct array
                eventsData = data as Event[];
            } else {
                // Fallback: empty array
                eventsData = [];
            }

            // Process events to add isRegistered flag
            const processedEvents = eventsData.map(event => {
                const isRegistered = event.attendees && event.attendees.length > 0 &&
                    event.attendees.some((attendee: unknown) => {
                        const attendeeObj = attendee as { attendeeId?: string; attendee?: { id?: string } };
                        return attendeeObj.attendeeId === currentUser?.id ||
                            attendeeObj.attendee?.id === currentUser?.id;
                    });

                return {
                    ...event,
                    isRegistered: isRegistered || false
                };
            });

            console.log('🔍 useEvents - Processed events with registration status:', processedEvents);
            setEvents(processedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los eventos",
                variant: "destructive",
            });
            // Set empty array on error to prevent filter issues
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const createEvent = useCallback(async (eventData: CreateEventData) => {
        try {
            console.log('🔍 createEvent - Received event data:', eventData);

            const formData = new FormData();

            // Agregar campos del formulario
            Object.keys(eventData).forEach(key => {
                if (key === 'image' && eventData.image) {
                    formData.append('image', eventData.image);
                } else if (Array.isArray(eventData[key as keyof CreateEventData])) {
                    formData.append(key, JSON.stringify(eventData[key as keyof CreateEventData]));
                } else if (eventData[key as keyof CreateEventData] !== undefined) {
                    formData.append(key, String(eventData[key as keyof CreateEventData]));
                }
            });

            console.log('🔍 createEvent - FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
            }

            const newEvent = await apiCall("/events", {
                method: "POST",
                body: formData,
                headers: {
                    // No incluir Content-Type para FormData, se establece automáticamente
                }
            });
            setEvents(prev => [...prev, newEvent as Event]);
            toast({
                title: "Éxito",
                description: "Evento creado correctamente",
            });
            return newEvent;
        } catch (error) {
            console.error("Error creating event:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al crear el evento",
                variant: "destructive",
            });
            throw error;
        }
    }, [toast]);

    const updateEvent = useCallback(async (eventId: string, eventData: Partial<CreateEventData>) => {
        try {
            const formData = new FormData();

            // Agregar campos del formulario
            Object.keys(eventData).forEach(key => {
                if (key === 'image' && eventData.image) {
                    formData.append('image', eventData.image);
                } else if (Array.isArray(eventData[key as keyof CreateEventData])) {
                    formData.append(key, JSON.stringify(eventData[key as keyof CreateEventData]));
                } else if (eventData[key as keyof CreateEventData] !== undefined) {
                    formData.append(key, String(eventData[key as keyof CreateEventData]));
                }
            });

            const updatedEvent = await apiCall(`/events/${eventId}`, {
                method: "PUT",
                body: formData,
                headers: {
                    // No incluir Content-Type para FormData, se establece automáticamente
                }
            });
            setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent as Event : event));
            toast({
                title: "Éxito",
                description: "Evento actualizado correctamente",
            });
            return updatedEvent;
        } catch (error) {
            console.error("Error updating event:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al actualizar el evento",
                variant: "destructive",
            });
            throw error;
        }
    }, [toast]);

    const deleteEvent = useCallback(async (eventId: string) => {
        try {
            await apiCall(`/events/${eventId}`, {
                method: "DELETE",
            });
            setEvents(prev => prev.filter(event => event.id !== eventId));
            toast({
                title: "Éxito",
                description: "Evento eliminado correctamente",
            });
        } catch (error) {
            console.error("Error deleting event:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al eliminar el evento",
                variant: "destructive",
            });
            throw error;
        }
    }, [toast]);

    return {
        events,
        loading,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
    };
}

export function useMyEvents() {
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchMyEvents = useCallback(async () => {
        setLoading(true);
        try {
            // Use the new endpoint that automatically gets municipalityId from token
            const endpoint = "/events/my-municipality";

            console.log('🔍 useMyEvents - Calling endpoint:', endpoint);

            const data = await apiCall(endpoint);
            // Ensure data is an array, if not, set empty array
            setMyEvents(Array.isArray(data) ? data as Event[] : []);
        } catch (error) {
            console.error("Error fetching my events:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar tus eventos",
                variant: "destructive",
            });
            // Set empty array on error to prevent filter issues
            setMyEvents([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    return {
        myEvents,
        loading,
        fetchMyEvents,
    };
}

export function useMyAttendances() {
    const [myAttendances, setMyAttendances] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchMyAttendances = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiCall("/events/my-attendances");
            // Ensure data is an array, if not, set empty array
            setMyAttendances(Array.isArray(data) ? data as Event[] : []);
        } catch (error) {
            console.error("Error fetching my attendances:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar tus asistencias",
                variant: "destructive",
            });
            // Set empty array on error to prevent filter/map issues
            setMyAttendances([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const attendEvent = useCallback(async (eventId: string) => {
        try {
            await apiCall(`/events/${eventId}/attend`, {
                method: "POST",
            });
            await fetchMyAttendances();
            toast({
                title: "Éxito",
                description: "Te has registrado al evento correctamente",
            });
        } catch (error) {
            console.error("Error attending event:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al registrarse al evento",
                variant: "destructive",
            });
            throw error;
        }
    }, [fetchMyAttendances, toast]);

    const unattendEvent = useCallback(async (eventId: string) => {
        try {
            await apiCall(`/events/${eventId}/unattend`, {
                method: "DELETE",
            });
            await fetchMyAttendances();
            toast({
                title: "Éxito",
                description: "Has cancelado tu asistencia al evento",
            });
        } catch (error) {
            console.error("Error unattending event:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al cancelar asistencia",
                variant: "destructive",
            });
            throw error;
        }
    }, [fetchMyAttendances, toast]);

    return {
        myAttendances,
        loading,
        fetchMyAttendances,
        attendEvent,
        unattendEvent,
    };
}

export function useEventStats() {
    const [stats, setStats] = useState<EventStats>({
        totalEvents: 0,
        upcomingEvents: 0,
        totalAttendees: 0,
        attendanceRate: 0,
        publishedEvents: 0,
        featuredEvents: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiCall("/events/stats");
            setStats(data as EventStats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        loading,
        fetchStats,
    };
}

export function useMyEventStats() {
    const [stats, setStats] = useState<EventStats>({
        totalEvents: 0,
        upcomingEvents: 0,
        totalAttendees: 0,
        attendanceRate: 0,
        publishedEvents: 0,
        featuredEvents: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchMyStats = useCallback(async () => {
        setLoading(true);
        try {
            // Use the new endpoint that automatically gets municipalityId from token
            const endpoint = "/events/my-municipality";

            const data = await apiCall(endpoint);
            // Extract stats from the response
            const eventsData = Array.isArray(data) ? data : ((data as Record<string, unknown>)?.events as Event[] || []);

            // Calculate stats from events data
            const calculatedStats = {
                totalEvents: eventsData.length,
                upcomingEvents: eventsData.filter((e: Event) => new Date(e.date) > new Date()).length,
                totalAttendees: eventsData.reduce((sum: number, e: Event) => sum + (e.currentAttendees || 0), 0),
                attendanceRate: eventsData.length > 0
                    ? Math.round((eventsData.reduce((sum: number, e: Event) => sum + (e.currentAttendees || 0), 0) /
                        eventsData.reduce((sum: number, e: Event) => sum + (e.maxCapacity || 0), 0)) * 100)
                    : 0,
                publishedEvents: eventsData.filter((e: Event) => e.status === "PUBLISHED").length,
                featuredEvents: eventsData.filter((e: Event) => e.featured).length,
            };

            setStats(calculatedStats);
        } catch (error) {
            console.error("Error fetching my stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        loading,
        fetchMyStats,
    };
}

export function useEventAttendees() {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchEventAttendees = useCallback(async (eventId: string) => {
        setLoading(true);
        try {
            const data = await apiCall(`/events/${eventId}/attendees`);
            // Ensure data is an array, if not, set empty array
            setAttendees(Array.isArray(data) ? data as Attendee[] : []);
        } catch (error) {
            console.error("Error fetching attendees:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los asistentes",
                variant: "destructive",
            });
            // Set empty array on error to prevent map issues
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const updateAttendeeStatus = useCallback(async (eventId: string, attendeeId: string, status: string) => {
        try {
            await apiCall(`/events/${eventId}/attendees/${attendeeId}`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });
            await fetchEventAttendees(eventId);
            toast({
                title: "Éxito",
                description: "Estado del asistente actualizado",
            });
        } catch (error) {
            console.error("Error updating attendee status:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al actualizar el estado",
                variant: "destructive",
            });
            throw error;
        }
    }, [fetchEventAttendees, toast]);

    return {
        attendees,
        loading,
        fetchEventAttendees,
        updateAttendeeStatus,
    };
} 