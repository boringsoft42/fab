import { NextRequest, NextResponse } from "next/server";
import { JobOffer, JobStatus } from "@/types/jobs";

// Mock job data (same as in main jobs route for consistency)
const mockJobs: JobOffer[] = [
  {
    id: "job-1",
    title: "Desarrollador Frontend Junior",
    description:
      "Buscamos un desarrollador frontend junior para unirse a nuestro equipo dinámico. Trabajarás en proyectos web modernos usando React, TypeScript y Tailwind CSS. \n\nTe unirás a un equipo apasionado donde tendrás la oportunidad de crecer profesionalmente mientras contribuyes al desarrollo de aplicaciones web innovadoras. Ofrecemos un ambiente colaborativo donde tus ideas son valoradas y donde podrás aprender de desarrolladores senior experimentados.",
    company: {
      id: "company-1",
      name: "TechCorp Bolivia",
      logo: "/logos/techcorp.svg",
      description:
        "Empresa líder en desarrollo de software con más de 10 años de experiencia en el mercado boliviano. Nos especializamos en soluciones web modernas y aplicaciones móviles.",
      website: "https://techcorp.bo",
      sector: "Tecnología",
      size: "51-200 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.5,
      reviewCount: 28,
    },
    location: "Cochabamba, Bolivia",
    contractType: "FULL_TIME",
    workModality: "HYBRID",
    experienceLevel: "ENTRY_LEVEL",
    salaryMin: 3000,
    salaryMax: 4500,
    salaryCurrency: "BOB",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS"],
    desiredSkills: ["TypeScript", "Tailwind CSS", "Git", "Node.js"],
    benefits: [
      "Seguro médico privado",
      "Capacitaciones técnicas continuas",
      "Ambiente de trabajo flexible",
      "Horarios flexibles",
      "Equipos de trabajo modernos",
      "Oportunidades de crecimiento",
    ],
    requirements: [
      "Título en Ingeniería de Sistemas, Informática o afines",
      "Conocimientos sólidos de React y JavaScript",
      "Experiencia básica con HTML5 y CSS3",
      "Conocimientos de Git y control de versiones",
      "Inglés básico (lectura técnica)",
      "Capacidad de trabajo en equipo",
    ],
    responsibilities: [
      "Desarrollar y mantener interfaces de usuario responsivas",
      "Colaborar con el equipo de diseño para implementar mockups",
      "Participar en code reviews y mejores prácticas",
      "Optimizar aplicaciones para máximo rendimiento",
      "Mantener código limpio y bien documentado",
      "Participar en reuniones de planning y retrospectivas",
    ],
    status: "ACTIVE",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 15,
    viewCount: 124,
    featured: true,
    questions: [
      {
        id: "q1",
        question: "¿Tienes experiencia previa trabajando con React?",
        type: "MULTIPLE_CHOICE",
        required: true,
        options: [
          "Menos de 6 meses",
          "6 meses - 1 año",
          "1-2 años",
          "Más de 2 años",
          "No tengo experiencia",
        ],
      },
      {
        id: "q2",
        question:
          "Describe brevemente tu proyecto más importante con JavaScript",
        type: "TEXT",
        required: true,
      },
    ],
  },
  {
    id: "job-2",
    title: "Asistente de Marketing Digital",
    description:
      "Oportunidad única para jóvenes creativos y apasionados por el marketing digital. Te unirás a nuestro equipo donde aprenderás sobre estrategias de marketing en redes sociales, creación de contenido digital, análisis de métricas y campañas publicitarias online.\n\nEsta posición es perfecta para estudiantes o recién graduados que buscan ganar experiencia práctica en el mundo del marketing digital mientras desarrollan sus habilidades creativas y analíticas.",
    company: {
      id: "company-2",
      name: "Mindful Co.",
      logo: "/logos/mindfulco.svg",
      description:
        "Agencia de marketing digital especializada en ayudar a empresas locales a crecer en el mundo digital.",
      website: "https://mindfulco.bo",
      sector: "Marketing",
      size: "11-50 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.2,
      reviewCount: 15,
    },
    location: "Cochabamba, Bolivia",
    contractType: "PART_TIME",
    workModality: "ON_SITE",
    experienceLevel: "NO_EXPERIENCE",
    salaryMin: 1500,
    salaryMax: 2500,
    salaryCurrency: "BOB",
    requiredSkills: ["Redes sociales", "Creatividad", "Comunicación"],
    desiredSkills: ["Photoshop", "Canva", "Google Analytics", "Copywriting"],
    benefits: [
      "Capacitación continua en marketing digital",
      "Horarios flexibles compatibles con estudios",
      "Ambiente creativo y dinámico",
      "Certificación en Google Analytics",
      "Proyecto final para portafolio",
    ],
    requirements: [
      "Estudiante universitario o bachiller reciente",
      "Manejo avanzado de redes sociales",
      "Creatividad y pensamiento innovador",
      "Excelentes habilidades de comunicación escrita",
      "Proactividad y ganas de aprender",
      "Disponibilidad de 4-6 horas diarias",
    ],
    responsibilities: [
      "Crear contenido atractivo para redes sociales",
      "Analizar métricas y KPIs de campañas",
      "Apoyar en la planificación de estrategias digitales",
      "Interactuar con la comunidad online",
      "Realizar investigación de mercado y competencia",
      "Participar en sesiones de brainstorming creativo",
    ],
    status: "ACTIVE",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 8,
    viewCount: 89,
    questions: [
      {
        id: "q1",
        question: "¿Qué redes sociales utilizas más frecuentemente?",
        type: "MULTIPLE_CHOICE",
        required: true,
        options: [
          "Instagram",
          "Facebook",
          "TikTok",
          "LinkedIn",
          "Twitter",
          "YouTube",
        ],
      },
    ],
  },
  {
    id: "job-3",
    title: "Practicante de Contabilidad",
    description:
      "Excelente oportunidad para estudiantes de contabilidad que buscan ganar experiencia práctica en una empresa consolidada del sector salud. Durante esta práctica profesional tendrás la oportunidad de aplicar los conocimientos teóricos en situaciones reales mientras eres guiado por profesionales experimentados.\n\nEsta posición te permitirá familiarizarte con software contable especializado y procesos administrativos del sector salud, brindándote una base sólida para tu carrera profesional.",
    company: {
      id: "company-3",
      name: "Zenith Health",
      logo: "/logos/zenithhealth.svg",
      description:
        "Clínica de salud integral con más de 15 años brindando servicios médicos de calidad en Cochabamba.",
      website: "https://zenithhealth.bo",
      sector: "Salud",
      size: "101-500 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.7,
      reviewCount: 42,
    },
    location: "Cochabamba, Bolivia",
    contractType: "INTERNSHIP",
    workModality: "ON_SITE",
    experienceLevel: "NO_EXPERIENCE",
    salaryMin: 800,
    salaryMax: 1200,
    salaryCurrency: "BOB",
    requiredSkills: [
      "Excel",
      "Contabilidad básica",
      "Organización",
      "Atención al detalle",
    ],
    desiredSkills: ["Software contable", "Inglés básico", "PowerBI"],
    benefits: [
      "Certificado oficial de prácticas profesionales",
      "Tutoría personalizada con contador senior",
      "Capacitación en software contable especializado",
      "Posibilidad de contratación al finalizar",
      "Experiencia en sector salud",
      "Flexibilidad con horarios académicos",
    ],
    requirements: [
      "Estudiante de Contabilidad o Auditoría",
      "Mínimo 6to semestre cursado",
      "Conocimientos sólidos de contabilidad general",
      "Manejo avanzado de Excel",
      "Disponibilidad mínima de 6 meses",
      "Responsabilidad y confidencialidad",
    ],
    responsibilities: [
      "Apoyo en registro de transacciones contables",
      "Organización y archivo de documentos fiscales",
      "Elaboración de reportes financieros básicos",
      "Asistencia en procesos de facturación",
      "Reconciliación de cuentas bancarias",
      "Apoyo en preparación de declaraciones tributarias",
    ],
    status: "ACTIVE",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    closingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 23,
    viewCount: 156,
    questions: [
      {
        id: "q1",
        question: "¿En qué semestre de la carrera te encuentras actualmente?",
        type: "MULTIPLE_CHOICE",
        required: true,
        options: [
          "6to semestre",
          "7mo semestre",
          "8vo semestre",
          "9no semestre",
          "10mo semestre",
          "Egresado",
        ],
      },
      {
        id: "q2",
        question:
          "¿Tienes disponibilidad para trabajar medio tiempo por 6 meses?",
        type: "YES_NO",
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
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment view count (in real app, this would update database)
    job.viewCount += 1;

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details" },
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
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
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
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
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
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Mark as closed instead of deleting
    mockJobs[jobIndex].status = "CLOSED" as JobStatus;

    return NextResponse.json({ message: "Job closed successfully" });
  } catch (error) {
    console.error("Error closing job:", error);
    return NextResponse.json({ error: "Failed to close job" }, { status: 500 });
  }
}
