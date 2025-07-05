import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { JobOffer, JobStatus } from &ldquo;@/types/jobs&rdquo;;

// Mock job data (same as in main jobs route for consistency)
const mockJobs: JobOffer[] = [
  {
    id: &ldquo;job-1&rdquo;,
    title: &ldquo;Desarrollador Frontend Junior&rdquo;,
    description:
      &ldquo;Buscamos un desarrollador frontend junior para unirse a nuestro equipo dinámico. Trabajarás en proyectos web modernos usando React, TypeScript y Tailwind CSS. \n\nTe unirás a un equipo apasionado donde tendrás la oportunidad de crecer profesionalmente mientras contribuyes al desarrollo de aplicaciones web innovadoras. Ofrecemos un ambiente colaborativo donde tus ideas son valoradas y donde podrás aprender de desarrolladores senior experimentados.&rdquo;,
    company: {
      id: &ldquo;company-1&rdquo;,
      name: &ldquo;TechCorp Bolivia&rdquo;,
      logo: &ldquo;/logos/techcorp.svg&rdquo;,
      description:
        &ldquo;Empresa líder en desarrollo de software con más de 10 años de experiencia en el mercado boliviano. Nos especializamos en soluciones web modernas y aplicaciones móviles.&rdquo;,
      website: &ldquo;https://techcorp.bo&rdquo;,
      sector: &ldquo;Tecnología&rdquo;,
      size: &ldquo;51-200 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.5,
      reviewCount: 28,
      images: [
        &ldquo;https://placehold.co/800x400/67e8f9/1e293b?text=Modern+Office+Space&rdquo;,
        &ldquo;https://placehold.co/800x400/67e8f9/1e293b?text=Development+Team&rdquo;,
        &ldquo;https://placehold.co/800x400/67e8f9/1e293b?text=Meeting+Room&rdquo;,
      ],
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;FULL_TIME&rdquo;,
    workModality: &ldquo;HYBRID&rdquo;,
    experienceLevel: &ldquo;ENTRY_LEVEL&rdquo;,
    salaryMin: 3000,
    salaryMax: 4500,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [&ldquo;React&rdquo;, &ldquo;JavaScript&rdquo;, &ldquo;HTML&rdquo;, &ldquo;CSS&rdquo;],
    desiredSkills: [&ldquo;TypeScript&rdquo;, &ldquo;Tailwind CSS&rdquo;, &ldquo;Git&rdquo;, &ldquo;Node.js&rdquo;],
    benefits: [
      &ldquo;Seguro médico privado&rdquo;,
      &ldquo;Capacitaciones técnicas continuas&rdquo;,
      &ldquo;Ambiente de trabajo flexible&rdquo;,
      &ldquo;Horarios flexibles&rdquo;,
      &ldquo;Equipos de trabajo modernos&rdquo;,
      &ldquo;Oportunidades de crecimiento&rdquo;,
    ],
    requirements: [
      &ldquo;Título en Ingeniería de Sistemas, Informática o afines&rdquo;,
      &ldquo;Conocimientos sólidos de React y JavaScript&rdquo;,
      &ldquo;Experiencia básica con HTML5 y CSS3&rdquo;,
      &ldquo;Conocimientos de Git y control de versiones&rdquo;,
      &ldquo;Inglés básico (lectura técnica)&rdquo;,
      &ldquo;Capacidad de trabajo en equipo&rdquo;,
    ],
    responsibilities: [
      &ldquo;Desarrollar y mantener interfaces de usuario responsivas&rdquo;,
      &ldquo;Colaborar con el equipo de diseño para implementar mockups&rdquo;,
      &ldquo;Participar en code reviews y mejores prácticas&rdquo;,
      &ldquo;Optimizar aplicaciones para máximo rendimiento&rdquo;,
      &ldquo;Mantener código limpio y bien documentado&rdquo;,
      &ldquo;Participar en reuniones de planning y retrospectivas&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo;,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 15,
    viewCount: 124,
    featured: true,
    questions: [
      {
        id: &ldquo;q1&rdquo;,
        question: &ldquo;¿Tienes experiencia previa trabajando con React?&rdquo;,
        type: &ldquo;MULTIPLE_CHOICE&rdquo;,
        required: true,
        options: [
          &ldquo;Menos de 6 meses&rdquo;,
          &ldquo;6 meses - 1 año&rdquo;,
          &ldquo;1-2 años&rdquo;,
          &ldquo;Más de 2 años&rdquo;,
          &ldquo;No tengo experiencia&rdquo;,
        ],
      },
      {
        id: &ldquo;q2&rdquo;,
        question:
          &ldquo;Describe brevemente tu proyecto más importante con JavaScript&rdquo;,
        type: &ldquo;TEXT&rdquo;,
        required: true,
      },
    ],
  },
  {
    id: &ldquo;job-2&rdquo;,
    title: &ldquo;Asistente de Marketing Digital&rdquo;,
    description:
      &ldquo;Oportunidad única para jóvenes creativos y apasionados por el marketing digital. Te unirás a nuestro equipo donde aprenderás sobre estrategias de marketing en redes sociales, creación de contenido digital, análisis de métricas y campañas publicitarias online.\n\nEsta posición es perfecta para estudiantes o recién graduados que buscan ganar experiencia práctica en el mundo del marketing digital mientras desarrollan sus habilidades creativas y analíticas.&rdquo;,
    company: {
      id: &ldquo;company-2&rdquo;,
      name: &ldquo;Mindful Co.&rdquo;,
      logo: &ldquo;/logos/mindfulco.svg&rdquo;,
      description:
        &ldquo;Agencia de marketing digital especializada en ayudar a empresas locales a crecer en el mundo digital.&rdquo;,
      website: &ldquo;https://mindfulco.bo&rdquo;,
      sector: &ldquo;Marketing&rdquo;,
      size: &ldquo;11-50 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.2,
      reviewCount: 15,
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;PART_TIME&rdquo;,
    workModality: &ldquo;ON_SITE&rdquo;,
    experienceLevel: &ldquo;NO_EXPERIENCE&rdquo;,
    salaryMin: 1500,
    salaryMax: 2500,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [&ldquo;Redes sociales&rdquo;, &ldquo;Creatividad&rdquo;, &ldquo;Comunicación&rdquo;],
    desiredSkills: [&ldquo;Photoshop&rdquo;, &ldquo;Canva&rdquo;, &ldquo;Google Analytics&rdquo;, &ldquo;Copywriting&rdquo;],
    benefits: [
      &ldquo;Capacitación continua en marketing digital&rdquo;,
      &ldquo;Horarios flexibles compatibles con estudios&rdquo;,
      &ldquo;Ambiente creativo y dinámico&rdquo;,
      &ldquo;Certificación en Google Analytics&rdquo;,
      &ldquo;Proyecto final para portafolio&rdquo;,
    ],
    requirements: [
      &ldquo;Estudiante universitario o bachiller reciente&rdquo;,
      &ldquo;Manejo avanzado de redes sociales&rdquo;,
      &ldquo;Creatividad y pensamiento innovador&rdquo;,
      &ldquo;Excelentes habilidades de comunicación escrita&rdquo;,
      &ldquo;Proactividad y ganas de aprender&rdquo;,
      &ldquo;Disponibilidad de 4-6 horas diarias&rdquo;,
    ],
    responsibilities: [
      &ldquo;Crear contenido atractivo para redes sociales&rdquo;,
      &ldquo;Analizar métricas y KPIs de campañas&rdquo;,
      &ldquo;Apoyar en la planificación de estrategias digitales&rdquo;,
      &ldquo;Interactuar con la comunidad online&rdquo;,
      &ldquo;Realizar investigación de mercado y competencia&rdquo;,
      &ldquo;Participar en sesiones de brainstorming creativo&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo;,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 8,
    viewCount: 89,
    questions: [
      {
        id: &ldquo;q1&rdquo;,
        question: &ldquo;¿Qué redes sociales utilizas más frecuentemente?&rdquo;,
        type: &ldquo;MULTIPLE_CHOICE&rdquo;,
        required: true,
        options: [
          &ldquo;Instagram&rdquo;,
          &ldquo;Facebook&rdquo;,
          &ldquo;TikTok&rdquo;,
          &ldquo;LinkedIn&rdquo;,
          &ldquo;Twitter&rdquo;,
          &ldquo;YouTube&rdquo;,
        ],
      },
    ],
  },
  {
    id: &ldquo;job-3&rdquo;,
    title: &ldquo;Practicante de Contabilidad&rdquo;,
    description:
      &ldquo;Excelente oportunidad para estudiantes de contabilidad que buscan ganar experiencia práctica en una empresa consolidada del sector salud. Durante esta práctica profesional tendrás la oportunidad de aplicar los conocimientos teóricos en situaciones reales mientras eres guiado por profesionales experimentados.\n\nEsta posición te permitirá familiarizarte con software contable especializado y procesos administrativos del sector salud, brindándote una base sólida para tu carrera profesional.&rdquo;,
    company: {
      id: &ldquo;company-3&rdquo;,
      name: &ldquo;Zenith Health&rdquo;,
      logo: &ldquo;/logos/zenithhealth.svg&rdquo;,
      description:
        &ldquo;Clínica de salud integral con más de 15 años brindando servicios médicos de calidad en Cochabamba.&rdquo;,
      website: &ldquo;https://zenithhealth.bo&rdquo;,
      sector: &ldquo;Salud&rdquo;,
      size: &ldquo;101-500 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.7,
      reviewCount: 42,
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;INTERNSHIP&rdquo;,
    workModality: &ldquo;ON_SITE&rdquo;,
    experienceLevel: &ldquo;NO_EXPERIENCE&rdquo;,
    salaryMin: 800,
    salaryMax: 1200,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [
      &ldquo;Excel&rdquo;,
      &ldquo;Contabilidad básica&rdquo;,
      &ldquo;Organización&rdquo;,
      &ldquo;Atención al detalle&rdquo;,
    ],
    desiredSkills: [&ldquo;Software contable&rdquo;, &ldquo;Inglés básico&rdquo;, &ldquo;PowerBI&rdquo;],
    benefits: [
      &ldquo;Certificado oficial de prácticas profesionales&rdquo;,
      &ldquo;Tutoría personalizada con contador senior&rdquo;,
      &ldquo;Capacitación en software contable especializado&rdquo;,
      &ldquo;Posibilidad de contratación al finalizar&rdquo;,
      &ldquo;Experiencia en sector salud&rdquo;,
      &ldquo;Flexibilidad con horarios académicos&rdquo;,
    ],
    requirements: [
      &ldquo;Estudiante de Contabilidad o Auditoría&rdquo;,
      &ldquo;Mínimo 6to semestre cursado&rdquo;,
      &ldquo;Conocimientos sólidos de contabilidad general&rdquo;,
      &ldquo;Manejo avanzado de Excel&rdquo;,
      &ldquo;Disponibilidad mínima de 6 meses&rdquo;,
      &ldquo;Responsabilidad y confidencialidad&rdquo;,
    ],
    responsibilities: [
      &ldquo;Apoyo en registro de transacciones contables&rdquo;,
      &ldquo;Organización y archivo de documentos fiscales&rdquo;,
      &ldquo;Elaboración de reportes financieros básicos&rdquo;,
      &ldquo;Asistencia en procesos de facturación&rdquo;,
      &ldquo;Reconciliación de cuentas bancarias&rdquo;,
      &ldquo;Apoyo en preparación de declaraciones tributarias&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo;,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 23,
    viewCount: 156,
    questions: [
      {
        id: &ldquo;q1&rdquo;,
        question: &ldquo;¿En qué semestre de la carrera te encuentras actualmente?&rdquo;,
        type: &ldquo;MULTIPLE_CHOICE&rdquo;,
        required: true,
        options: [
          &ldquo;6to semestre&rdquo;,
          &ldquo;7mo semestre&rdquo;,
          &ldquo;8vo semestre&rdquo;,
          &ldquo;9no semestre&rdquo;,
          &ldquo;10mo semestre&rdquo;,
          &ldquo;Egresado&rdquo;,
        ],
      },
      {
        id: &ldquo;q2&rdquo;,
        question:
          &ldquo;¿Tienes disponibilidad para trabajar medio tiempo por 6 meses?&rdquo;,
        type: &ldquo;YES_NO&rdquo;,
        required: true,
      },
    ],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = mockJobs.find((j) => j.id === id);

    if (!job) {
      return NextResponse.json({ error: &ldquo;Job not found&rdquo; }, { status: 404 });
    }

    // Increment view count (in real app, this would update database)
    job.viewCount += 1;

    return NextResponse.json(job);
  } catch (error) {
    console.error(&ldquo;Error fetching job details:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch job details&rdquo; },
      { status: 500 }
    );
  }
}

// PUT: Update job (for companies)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const jobIndex = mockJobs.findIndex((j) => j.id === id);

    if (jobIndex === -1) {
      return NextResponse.json({ error: &ldquo;Job not found&rdquo; }, { status: 404 });
    }

    // Update job with new data
    const updatedJob = {
      ...mockJobs[jobIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockJobs[jobIndex] = updatedJob;

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(&ldquo;Error updating job:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to update job&rdquo; },
      { status: 500 }
    );
  }
}

// DELETE: Delete job (for companies)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jobIndex = mockJobs.findIndex((j) => j.id === id);

    if (jobIndex === -1) {
      return NextResponse.json({ error: &ldquo;Job not found&rdquo; }, { status: 404 });
    }

    // Mark as closed instead of deleting
    mockJobs[jobIndex].status = &ldquo;CLOSED&rdquo; as JobStatus;

    return NextResponse.json({ message: &ldquo;Job closed successfully&rdquo; });
  } catch (error) {
    console.error(&ldquo;Error closing job:&rdquo;, error);
    return NextResponse.json({ error: &ldquo;Failed to close job&rdquo; }, { status: 500 });
  }
}
