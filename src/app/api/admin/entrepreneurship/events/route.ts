import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

// Mock data for demonstration - in real app this would come from Prisma/database
const events = [
  {
    id: &ldquo;event-1&rdquo;,
    title: &ldquo;Startup Pitch Night Cochabamba&rdquo;,
    description:
      &ldquo;Noche de pitches para startups emergentes. Oportunidad de presentar tu idea ante inversionistas y mentores.&rdquo;,
    date: new Date(&ldquo;2024-03-15&rdquo;),
    time: &ldquo;19:00 - 22:00&rdquo;,
    location: &ldquo;Centro de Convenciones Cochabamba&rdquo;,
    type: &ldquo;presencial&rdquo;,
    category: &ldquo;Pitch&rdquo;,
    organizer: &ldquo;Startup Hub Bolivia&rdquo;,
    organizerId: &ldquo;org-1&rdquo;,
    attendees: 67,
    maxAttendees: 100,
    price: 0,
    image: &ldquo;/api/placeholder/400/200&rdquo;,
    tags: [&ldquo;Pitch&rdquo;, &ldquo;Inversión&rdquo;, &ldquo;Networking&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: true,
    registrationDeadline: new Date(&ldquo;2024-03-13&rdquo;),
    requirements: [&ldquo;Presentación de 5 minutos&rdquo;, &ldquo;Pitch deck obligatorio&rdquo;],
    agenda: [
      { time: &ldquo;19:00&rdquo;, activity: &ldquo;Registro y networking&rdquo; },
      { time: &ldquo;19:30&rdquo;, activity: &ldquo;Presentaciones startup&rdquo; },
      { time: &ldquo;21:30&rdquo;, activity: &ldquo;Evaluación y networking&rdquo; },
    ],
    speakers: [
      { name: &ldquo;Dr. Roberto Silva&rdquo;, role: &ldquo;Inversionista Ángel&rdquo; },
      { name: &ldquo;María González&rdquo;, role: &ldquo;Mentora Startup&rdquo; },
    ],
    createdAt: new Date(&ldquo;2024-02-01&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-20&rdquo;),
  },
  {
    id: &ldquo;event-2&rdquo;,
    title: &ldquo;Workshop: Marketing Digital para Emprendedores&rdquo;,
    description:
      &ldquo;Aprende estrategias efectivas de marketing digital para hacer crecer tu emprendimiento.&rdquo;,
    date: new Date(&ldquo;2024-03-20&rdquo;),
    time: &ldquo;14:00 - 17:00&rdquo;,
    location: &ldquo;Online - Zoom&rdquo;,
    type: &ldquo;virtual&rdquo;,
    category: &ldquo;Workshop&rdquo;,
    organizer: &ldquo;Digital Entrepreneurs BO&rdquo;,
    organizerId: &ldquo;org-2&rdquo;,
    attendees: 134,
    maxAttendees: 200,
    price: 50,
    image: &ldquo;/api/placeholder/400/200&rdquo;,
    tags: [&ldquo;Marketing&rdquo;, &ldquo;Digital&rdquo;, &ldquo;Capacitación&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: false,
    registrationDeadline: new Date(&ldquo;2024-03-18&rdquo;),
    requirements: [
      &ldquo;Conocimientos básicos de marketing&rdquo;,
      &ldquo;Laptop o dispositivo&rdquo;,
    ],
    agenda: [
      { time: &ldquo;14:00&rdquo;, activity: &ldquo;Introducción al marketing digital&rdquo; },
      { time: &ldquo;15:00&rdquo;, activity: &ldquo;Estrategias de redes sociales&rdquo; },
      { time: &ldquo;16:00&rdquo;, activity: &ldquo;Métricas y análisis&rdquo; },
    ],
    speakers: [
      {
        name: &ldquo;Lic. Carmen Rodriguez&rdquo;,
        role: &ldquo;Especialista en Marketing Digital&rdquo;,
      },
    ],
    createdAt: new Date(&ldquo;2024-02-05&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-18&rdquo;),
  },
  {
    id: &ldquo;event-3&rdquo;,
    title: &ldquo;Feria de Emprendimientos Sostenibles&rdquo;,
    description:
      &ldquo;Exposición de emprendimientos con enfoque en sostenibilidad y responsabilidad social.&rdquo;,
    date: new Date(&ldquo;2024-03-25&rdquo;),
    time: &ldquo;09:00 - 18:00&rdquo;,
    location: &ldquo;Plaza Murillo, La Paz&rdquo;,
    type: &ldquo;presencial&rdquo;,
    category: &ldquo;Feria&rdquo;,
    organizer: &ldquo;EcoEmprende Bolivia&rdquo;,
    organizerId: &ldquo;org-3&rdquo;,
    attendees: 89,
    maxAttendees: 150,
    price: 0,
    image: &ldquo;/api/placeholder/400/200&rdquo;,
    tags: [&ldquo;Sostenibilidad&rdquo;, &ldquo;Expo&rdquo;, &ldquo;Verde&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: true,
    registrationDeadline: new Date(&ldquo;2024-03-23&rdquo;),
    requirements: [&ldquo;Emprendimiento con enfoque sostenible&rdquo;],
    agenda: [
      { time: &ldquo;09:00&rdquo;, activity: &ldquo;Apertura y bienvenida&rdquo; },
      { time: &ldquo;10:00&rdquo;, activity: &ldquo;Exposición de emprendimientos&rdquo; },
      { time: &ldquo;16:00&rdquo;, activity: &ldquo;Panel: Futuro sostenible&rdquo; },
    ],
    speakers: [
      { name: &ldquo;Dr. Luis Vargas&rdquo;, role: &ldquo;Experto en Sostenibilidad&rdquo; },
      { name: &ldquo;Ana Morales&rdquo;, role: &ldquo;Emprendedora Social&rdquo; },
    ],
    createdAt: new Date(&ldquo;2024-02-10&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-22&rdquo;),
  },
];

// GET /api/admin/entrepreneurship/events - List and filter events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get(&ldquo;search&rdquo;);
    const type = searchParams.get(&ldquo;type&rdquo;);
    const category = searchParams.get(&ldquo;category&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

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
    if (type && type !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((event) => event.type === type);
    }

    // Apply category filter
    if (category && category !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((event) => event.category === category);
    }

    // Apply status filter
    if (status && status !== &ldquo;all&rdquo;) {
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
        virtual: events.filter((e) => e.type === &ldquo;virtual&rdquo;).length,
        presencial: events.filter((e) => e.type === &ldquo;presencial&rdquo;).length,
        hybrid: events.filter((e) => e.type === &ldquo;hybrid&rdquo;).length,
      },
      byCategory: {
        pitch: events.filter((e) => e.category === &ldquo;Pitch&rdquo;).length,
        workshop: events.filter((e) => e.category === &ldquo;Workshop&rdquo;).length,
        feria: events.filter((e) => e.category === &ldquo;Feria&rdquo;).length,
        networking: events.filter((e) => e.category === &ldquo;Networking&rdquo;).length,
      },
      byStatus: {
        published: events.filter((e) => e.status === &ldquo;published&rdquo;).length,
        draft: events.filter((e) => e.status === &ldquo;draft&rdquo;).length,
        cancelled: events.filter((e) => e.status === &ldquo;cancelled&rdquo;).length,
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
    console.error(&ldquo;Error fetching events:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener eventos&rdquo; },
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
      &ldquo;title&rdquo;,
      &ldquo;description&rdquo;,
      &ldquo;date&rdquo;,
      &ldquo;time&rdquo;,
      &ldquo;location&rdquo;,
      &ldquo;type&rdquo;,
      &ldquo;category&rdquo;,
      &ldquo;organizer&rdquo;,
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
      organizerId: &ldquo;current-user-id&rdquo;, // This would come from user context
      status: data.status || &ldquo;draft&rdquo;,
      featured: data.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would save to database using Prisma
    events.push(newEvent);

    return NextResponse.json(
      {
        message: &ldquo;Evento creado exitosamente&rdquo;,
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating event:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear evento&rdquo; },
      { status: 500 }
    );
  }
}
