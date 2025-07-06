import { NextRequest, NextResponse } from "next/server";
import { JobApplication} from "@/types/jobs";

// Mock candidates data with comprehensive information
const candidates: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Senior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-1",
    applicantName: "María González Pérez",
    applicantEmail: "maria.gonzalez@email.com",
    cvUrl: "/cv/maria-gonzalez-cv.pdf",
    coverLetter:
      "Estimado equipo de reclutamiento,\n\nMe dirijo a ustedes con gran interés en la posición de Desarrollador Frontend Senior. Con más de 4 años de experiencia en React, TypeScript y desarrollo de interfaces modernas, creo que puedo aportar significativamente a su equipo.\n\nHe trabajado en proyectos de gran escala donde he liderado equipos y implementado mejores prácticas de desarrollo. Mi experiencia incluye optimización de rendimiento, implementación de testing automatizado y colaboración estrecha con equipos de diseño UX/UI.\n\nEspero tener la oportunidad de discutir cómo mis habilidades pueden contribuir al éxito de TechCorp Bolivia.\n\nSaludos cordiales,\nMaría González",
    answers: [
      {
        questionId: "q1",
        question: "¿Cuántos años de experiencia tienes con React?",
        answer:
          "4 años de experiencia profesional con React, incluyendo hooks, context API, y bibliotecas del ecosistema como Redux y React Query.",
      },
      {
        questionId: "q2",
        question: "¿Tienes experiencia con TypeScript?",
        answer:
          "Sí, 3 años de experiencia con TypeScript en proyectos React y Node.js. Manejo tipos avanzados, generics y configuración de tsconfig.",
      },
      {
        questionId: "q3",
        question: "¿Estarías disponible para trabajar en modalidad híbrida?",
        answer:
          "Sí, tengo disponibilidad completa para modalidad híbrida. Tengo experiencia trabajando tanto presencial como remotamente.",
      },
    ],
    status: "UNDER_REVIEW",
    appliedAt: "2024-02-25T09:30:00Z",
    updatedAt: "2024-02-26T14:20:00Z",
    notes:
      "Excelente perfil técnico. Experiencia relevante en React y TypeScript. CV muy bien estructurado. Programar entrevista técnica.",
    rating: 4,
  },
  {
    id: "app-2",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Senior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-2",
    applicantName: "Carlos Mamani Quispe",
    applicantEmail: "carlos.mamani@email.com",
    cvUrl: "/cv/carlos-mamani-cv.pdf",
    coverLetter:
      "Hola,\n\nVi su oferta de trabajo y me parece muy interesante. Tengo experiencia en desarrollo web y me gustaría formar parte de su equipo.\n\nGracias por su consideración.\n\nCarlos Mamani",
    answers: [
      {
        questionId: "q1",
        question: "¿Cuántos años de experiencia tienes con React?",
        answer:
          "2 años trabajando con React en proyectos personales y un proyecto freelance.",
      },
      {
        questionId: "q2",
        question: "¿Tienes experiencia con TypeScript?",
        answer:
          "Estoy aprendiendo TypeScript. He hecho algunos tutoriales y pequeños proyectos.",
      },
      {
        questionId: "q3",
        question: "¿Estarías disponible para trabajar en modalidad híbrida?",
        answer: "Sí, sin problemas.",
      },
    ],
    status: "REJECTED",
    appliedAt: "2024-02-24T16:45:00Z",
    updatedAt: "2024-02-26T10:15:00Z",
    notes:
      "Experiencia insuficiente para el puesto senior. Considerar para posiciones junior en el futuro.",
    rating: 2,
  },
  {
    id: "app-3",
    jobId: "job-2",
    jobTitle: "Especialista en Marketing Digital",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-3",
    applicantName: "Ana Gutiérrez Silva",
    applicantEmail: "ana.gutierrez@email.com",
    cvUrl: "/cv/ana-gutierrez-cv.pdf",
    coverLetter:
      "Estimado equipo de marketing,\n\nCon gran entusiasmo me postulo para la posición de Especialista en Marketing Digital. Mi experiencia de 3 años en agencias de marketing digital me ha permitido desarrollar campañas exitosas para diversos sectores, logrando incrementos promedio del 40% en conversiones.\n\nManejo herramientas como Google Ads, Facebook Ads Manager, Google Analytics, y tengo certificaciones en Google y Meta. Además, tengo experiencia en marketing de contenidos, SEO y email marketing.\n\nMe motiva especialmente la oportunidad de trabajar en el sector tecnológico y aportar al crecimiento de TechCorp Bolivia.\n\nQuedo a su disposición para una entrevista.\n\nSaludos,\nAna Gutiérrez",
    answers: [
      {
        questionId: "q4",
        question: "¿Qué experiencia tienes con Google Ads?",
        answer:
          "3 años manejando campañas de Google Ads con presupuestos desde $500 hasta $10,000 mensuales. Certificada en Google Ads Search, Display y Shopping.",
      },
      {
        questionId: "q5",
        question: "¿Has trabajado en el sector tecnológico antes?",
        answer:
          "Sí, durante 1 año trabajé en una startup de fintech donde manejé todo el marketing digital y ayudé a incrementar usuarios registrados en 150%.",
      },
    ],
    status: "PRE_SELECTED",
    appliedAt: "2024-02-23T11:20:00Z",
    updatedAt: "2024-02-27T09:00:00Z",
    notes:
      "Perfil ideal para la posición. Excelente experiencia y resultados comprobables. Programar entrevista final con el director de marketing.",
    rating: 5,
  },
  {
    id: "app-4",
    jobId: "job-2",
    jobTitle: "Especialista en Marketing Digital",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-4",
    applicantName: "Luis Vargas Mendoza",
    applicantEmail: "luis.vargas@email.com",
    cvUrl: "/cv/luis-vargas-cv.pdf",
    coverLetter:
      "Buenos días,\n\nMe interesa mucho la posición de marketing digital. Soy recién graduado en Marketing con especialización en marketing digital. Durante mi carrera realicé prácticas en una empresa local donde apoyé en redes sociales y contenido.\n\nEstoy muy motivado por aprender y crecer profesionalmente en una empresa como TechCorp.\n\nGracias por la oportunidad.\n\nLuis Vargas",
    answers: [
      {
        questionId: "q4",
        question: "¿Qué experiencia tienes con Google Ads?",
        answer:
          "Tengo certificación básica de Google Ads y he hecho campañas de práctica durante mi carrera universitaria.",
      },
      {
        questionId: "q5",
        question: "¿Has trabajado en el sector tecnológico antes?",
        answer:
          "No directamente, pero durante mis prácticas trabajé con herramientas digitales y siempre me ha interesado la tecnología.",
      },
    ],
    status: "SENT",
    appliedAt: "2024-02-26T08:15:00Z",
    updatedAt: "2024-02-26T08:15:00Z",
    notes: "",
    rating: undefined,
  },
  {
    id: "app-5",
    jobId: "job-3",
    jobTitle: "Analista de Datos",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-5",
    applicantName: "Patricia Sosa Delgado",
    applicantEmail: "patricia.sosa@email.com",
    cvUrl: "/cv/patricia-sosa-cv.pdf",
    coverLetter:
      "Estimado equipo de datos,\n\nSoy Ingeniera en Sistemas con especialización en ciencia de datos y me emociona la oportunidad de contribuir como Analista de Datos en TechCorp Bolivia.\n\nMi experiencia incluye:\n• 2 años como analista de datos en sector financiero\n• Dominio de Python, R, SQL, y herramientas como Tableau y Power BI\n• Experiencia en machine learning y modelos predictivos\n• Gestión de bases de datos y ETL processes\n\nHe liderado proyectos que resultaron en mejoras del 25% en eficiencia operativa mediante análisis predictivo y automatización de reportes.\n\nEspero poder aportar mi experiencia analítica al crecimiento de TechCorp.\n\nSaludos cordiales,\nPatricia Sosa",
    answers: [
      {
        questionId: "q6",
        question: "¿Qué experiencia tienes con Python y R?",
        answer:
          "3 años con Python (pandas, numpy, scikit-learn, matplotlib) y 2 años con R para análisis estadístico y visualización de datos.",
      },
      {
        questionId: "q7",
        question: "¿Has trabajado con bases de datos grandes?",
        answer:
          "Sí, he trabajado con bases de datos de hasta 10M de registros usando SQL, PostgreSQL y herramientas de BigQuery para análisis.",
      },
      {
        questionId: "q8",
        question: "¿Tienes experiencia con visualización de datos?",
        answer:
          "Experiencia avanzada con Tableau, Power BI, y bibliotecas de Python como matplotlib, seaborn y plotly para crear dashboards interactivos.",
      },
    ],
    status: "HIRED",
    appliedAt: "2024-02-20T14:30:00Z",
    updatedAt: "2024-02-28T16:45:00Z",
    notes:
      "Excelente candidata. Experiencia técnica sólida y buenos resultados previos. Contratada para iniciar el 15 de marzo.",
    rating: 5,
  },
  {
    id: "app-6",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Senior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-6",
    applicantName: "Roberto Silva Morales",
    applicantEmail: "roberto.silva@email.com",
    cvUrl: "/cv/roberto-silva-cv.pdf",
    coverLetter:
      "Distinguido equipo técnico,\n\nCon 6 años de experiencia en desarrollo frontend, incluyendo 4 años como tech lead, estoy muy interesado en la posición de Desarrollador Frontend Senior.\n\nMi experiencia abarca:\n• Arquitectura y desarrollo de SPAs con React, Vue.js y Angular\n• Liderazgo técnico de equipos de 3-8 desarrolladores\n• Implementación de CI/CD y mejores prácticas de desarrollo\n• Optimización de performance y SEO técnico\n• Mentoring de desarrolladores junior y mid-level\n\nBusco un nuevo desafío donde pueda contribuir no solo técnicamente sino también en el crecimiento del equipo y la adopción de nuevas tecnologías.\n\nQuedo a su disposición.\n\nSaludos,\nRoberto Silva",
    answers: [
      {
        questionId: "q1",
        question: "¿Cuántos años de experiencia tienes con React?",
        answer:
          "5 años de experiencia con React, incluyendo la migración de aplicaciones legacy y implementación de arquitecturas escalables con microfrontends.",
      },
      {
        questionId: "q2",
        question: "¿Tienes experiencia con TypeScript?",
        answer:
          "4 años con TypeScript, incluyendo configuración avanzada, desarrollo de librerías internas y establecimiento de estándares de código.",
      },
      {
        questionId: "q3",
        question: "¿Estarías disponible para trabajar en modalidad híbrida?",
        answer:
          "Perfectamente. Tengo experiencia liderando equipos remotos e híbridos, con excelentes habilidades de comunicación y coordinación.",
      },
    ],
    status: "PRE_SELECTED",
    appliedAt: "2024-02-21T10:15:00Z",
    updatedAt: "2024-02-27T11:30:00Z",
    notes:
      "Perfil senior excepcional. Experiencia de liderazgo muy valiosa. Considerar también para posición de tech lead. Programar entrevista con CTO.",
    rating: 5,
  },
];

// GET /api/jobs/candidates - List candidates for company's jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "appliedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = [...candidates];

    // Filter by job if specified
    if (jobId && jobId !== "all") {
      filtered = filtered.filter((candidate) => candidate.jobId === jobId);
    }

    // Filter by status if specified
    if (status && status !== "all") {
      filtered = filtered.filter((candidate) => candidate.status === status);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (candidate) =>
          candidate.applicantName.toLowerCase().includes(searchLower) ||
          candidate.applicantEmail.toLowerCase().includes(searchLower) ||
          candidate.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "applicantName":
          aValue = a.applicantName;
          bValue = b.applicantName;
          break;
        case "appliedAt":
          aValue = new Date(a.appliedAt);
          bValue = new Date(b.appliedAt);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "jobTitle":
          aValue = a.jobTitle;
          bValue = b.jobTitle;
          break;
        default:
          aValue = new Date(a.appliedAt);
          bValue = new Date(b.appliedAt);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidates = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      byStatus: {
        sent: candidates.filter((c) => c.status === "SENT").length,
        underReview: candidates.filter((c) => c.status === "UNDER_REVIEW")
          .length,
        preSelected: candidates.filter((c) => c.status === "PRE_SELECTED")
          .length,
        rejected: candidates.filter((c) => c.status === "REJECTED").length,
        hired: candidates.filter((c) => c.status === "HIRED").length,
      },
      byJob: candidates.reduce(
        (acc, candidate) => {
          if (!acc[candidate.jobId]) {
            acc[candidate.jobId] = {
              jobTitle: candidate.jobTitle,
              count: 0,
            };
          }
          acc[candidate.jobId].count++;
          return acc;
        },
        {} as Record<string, { jobTitle: string; count: number }>
      ),
      averageRating:
        candidates
          .filter((c) => c.rating)
          .reduce((sum, c) => sum + (c.rating || 0), 0) /
          candidates.filter((c) => c.rating).length || 0,
    };

    return NextResponse.json({
      candidates: paginatedCandidates,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Error al obtener candidatos" },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/candidates - Update candidate application
export async function PUT(request: NextRequest) {
  try {
    const { candidateId, updates } = await request.json();

    const candidateIndex = candidates.findIndex((c) => c.id === candidateId);
    if (candidateIndex === -1) {
      return NextResponse.json(
        { error: "Candidato no encontrado" },
        { status: 404 }
      );
    }

    // Update candidate
    candidates[candidateIndex] = {
      ...candidates[candidateIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: "Candidato actualizado exitosamente",
      candidate: candidates[candidateIndex],
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Error al actualizar candidato" },
      { status: 500 }
    );
  }
}
