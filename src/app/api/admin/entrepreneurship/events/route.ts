import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in real app this would come from Prisma/database
const events = [
  {
    id: "event-1",
    title: "Startup Pitch Night Cochabamba",
    description:
      "Noche de pitches para startups emergentes. Oportunidad de presentar tu idea ante inversionistas y mentores.",
    date: new Date("2024-03-15"),
    time: "19:00 - 22:00",
    location: "Centro de Convenciones Cochabamba",
    type: "presencial",
    category: "Pitch",
    organizer: "Startup Hub Bolivia",
    organizerId: "org-1",
    attendees: 67,
    maxAttendees: 100,
    price: 0,
    image: "/api/placeholder/400/200",
    tags: ["Pitch", "Inversión", "Networking"],
    status: "published",
    featured: true,
    registrationDeadline: new Date("2024-03-13"),
    requirements: ["Presentación de 5 minutos", "Pitch deck obligatorio"],
    agenda: [
      { time: "19:00", activity: "Registro y networking" },
      { time: "19:30", activity: "Presentaciones startup" },
      { time: "21:30", activity: "Evaluación y networking" },
    ],
    speakers: [
      { name: "Dr. Roberto Silva", role: "Inversionista Ángel" },
      { name: "María González", role: "Mentora Startup" },
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "event-2",
    title: "Workshop: Marketing Digital para Emprendedores",
    description:
      "Aprende estrategias efectivas de marketing digital para hacer crecer tu emprendimiento.",
    date: new Date("2024-03-20"),
    time: "14:00 - 17:00",
    location: "Online - Zoom",
    type: "virtual",
    category: "Workshop",
    organizer: "Digital Entrepreneurs BO",
    organizerId: "org-2",
    attendees: 134,
    maxAttendees: 200,
    price: 50,
    image: "/api/placeholder/400/200",
    tags: ["Marketing", "Digital", "Capacitación"],
    status: "published",
    featured: false,
    registrationDeadline: new Date("2024-03-18"),
    requirements: [
      "Conocimientos básicos de marketing",
      "Laptop o dispositivo",
    ],
    agenda: [
      { time: "14:00", activity: "Introducción al marketing digital" },
      { time: "15:00", activity: "Estrategias de redes sociales" },
      { time: "16:00", activity: "Métricas y análisis" },
    ],
    speakers: [
      {
        name: "Lic. Carmen Rodriguez",
        role: "Especialista en Marketing Digital",
      },
    ],
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-18"),
  },
  {
    id: "event-3",
    title: "Feria de Emprendimientos Sostenibles",
    description:
      "Exposición de emprendimientos con enfoque en sostenibilidad y responsabilidad social.",
    date: new Date("2024-03-25"),
    time: "09:00 - 18:00",
    location: "Plaza Murillo, La Paz",
    type: "presencial",
    category: "Feria",
    organizer: "EcoEmprende Bolivia",
    organizerId: "org-3",
    attendees: 89,
    maxAttendees: 150,
    price: 0,
    image: "/api/placeholder/400/200",
    tags: ["Sostenibilidad", "Expo", "Verde"],
    status: "published",
    featured: true,
    registrationDeadline: new Date("2024-03-23"),
    requirements: ["Emprendimiento con enfoque sostenible"],
    agenda: [
      { time: "09:00", activity: "Apertura y bienvenida" },
      { time: "10:00", activity: "Exposición de emprendimientos" },
      { time: "16:00", activity: "Panel: Futuro sostenible" },
    ],
    speakers: [
      { name: "Dr. Luis Vargas", role: "Experto en Sostenibilidad" },
      { name: "Ana Morales", role: "Emprendedora Social" },
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-22"),
  },
];

// GET /api/admin/entrepreneurship/events - List and filter events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = [...events];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase()) ||
          event.organizer.toLowerCase().includes(search.toLowerCase()) ||
          event.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Apply type filter
    if (type && type !== "all") {
      filtered = filtered.filter((event) => event.type === type);
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((event) => event.category === category);
    }

    // Apply status filter
    if (status && status !== "all") {
      filtered = filtered.filter((event) => event.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      byType: {
        virtual: events.filter((e) => e.type === "virtual").length,
        presencial: events.filter((e) => e.type === "presencial").length,
        hybrid: events.filter((e) => e.type === "hybrid").length,
      },
      byCategory: {
        pitch: events.filter((e) => e.category === "Pitch").length,
        workshop: events.filter((e) => e.category === "Workshop").length,
        feria: events.filter((e) => e.category === "Feria").length,
        networking: events.filter((e) => e.category === "Networking").length,
      },
      byStatus: {
        published: events.filter((e) => e.status === "published").length,
        draft: events.filter((e) => e.status === "draft").length,
        cancelled: events.filter((e) => e.status === "cancelled").length,
      },
      totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
      averageAttendance:
        events.reduce((sum, e) => sum + e.attendees / e.maxAttendees, 0) /
        events.length,
      featured: events.filter((e) => e.featured).length,
      upcoming: events.filter((e) => new Date(e.date) > new Date()).length,
    };

    return NextResponse.json({
      events: paginatedEvents,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/entrepreneurship/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "location",
      "type",
      "category",
      "organizer",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Create new event
    const newEvent = {
      id: `event-${Date.now()}`,
      ...data,
      attendees: 0,
      organizerId: "current-user-id", // This would come from user context
      status: data.status || "draft",
      featured: data.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would save to database using Prisma
    events.push(newEvent);

    return NextResponse.json(
      {
        message: "Evento creado exitosamente",
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error al crear evento" },
      { status: 500 }
    );
  }
}
