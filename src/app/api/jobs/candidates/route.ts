import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { JobApplication, ApplicationStatus } from &ldquo;@/types/jobs&rdquo;;

// Mock candidates data with comprehensive information
const candidates: JobApplication[] = [
  {
    id: &ldquo;app-1&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Senior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-1&rdquo;,
    applicantName: &ldquo;María González Pérez&rdquo;,
    applicantEmail: &ldquo;maria.gonzalez@email.com&rdquo;,
    cvUrl: &ldquo;/cv/maria-gonzalez-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Estimado equipo de reclutamiento,\n\nMe dirijo a ustedes con gran interés en la posición de Desarrollador Frontend Senior. Con más de 4 años de experiencia en React, TypeScript y desarrollo de interfaces modernas, creo que puedo aportar significativamente a su equipo.\n\nHe trabajado en proyectos de gran escala donde he liderado equipos y implementado mejores prácticas de desarrollo. Mi experiencia incluye optimización de rendimiento, implementación de testing automatizado y colaboración estrecha con equipos de diseño UX/UI.\n\nEspero tener la oportunidad de discutir cómo mis habilidades pueden contribuir al éxito de TechCorp Bolivia.\n\nSaludos cordiales,\nMaría González&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Cuántos años de experiencia tienes con React?&rdquo;,
        answer:
          &ldquo;4 años de experiencia profesional con React, incluyendo hooks, context API, y bibliotecas del ecosistema como Redux y React Query.&rdquo;,
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question: &ldquo;¿Tienes experiencia con TypeScript?&rdquo;,
        answer:
          &ldquo;Sí, 3 años de experiencia con TypeScript en proyectos React y Node.js. Manejo tipos avanzados, generics y configuración de tsconfig.&rdquo;,
      },
      {
        questionId: &ldquo;q3&rdquo;,
        question: &ldquo;¿Estarías disponible para trabajar en modalidad híbrida?&rdquo;,
        answer:
          &ldquo;Sí, tengo disponibilidad completa para modalidad híbrida. Tengo experiencia trabajando tanto presencial como remotamente.&rdquo;,
      },
    ],
    status: &ldquo;UNDER_REVIEW&rdquo;,
    appliedAt: &ldquo;2024-02-25T09:30:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-26T14:20:00Z&rdquo;,
    notes:
      &ldquo;Excelente perfil técnico. Experiencia relevante en React y TypeScript. CV muy bien estructurado. Programar entrevista técnica.&rdquo;,
    rating: 4,
  },
  {
    id: &ldquo;app-2&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Senior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-2&rdquo;,
    applicantName: &ldquo;Carlos Mamani Quispe&rdquo;,
    applicantEmail: &ldquo;carlos.mamani@email.com&rdquo;,
    cvUrl: &ldquo;/cv/carlos-mamani-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Hola,\n\nVi su oferta de trabajo y me parece muy interesante. Tengo experiencia en desarrollo web y me gustaría formar parte de su equipo.\n\nGracias por su consideración.\n\nCarlos Mamani&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Cuántos años de experiencia tienes con React?&rdquo;,
        answer:
          &ldquo;2 años trabajando con React en proyectos personales y un proyecto freelance.&rdquo;,
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question: &ldquo;¿Tienes experiencia con TypeScript?&rdquo;,
        answer:
          &ldquo;Estoy aprendiendo TypeScript. He hecho algunos tutoriales y pequeños proyectos.&rdquo;,
      },
      {
        questionId: &ldquo;q3&rdquo;,
        question: &ldquo;¿Estarías disponible para trabajar en modalidad híbrida?&rdquo;,
        answer: &ldquo;Sí, sin problemas.&rdquo;,
      },
    ],
    status: &ldquo;REJECTED&rdquo;,
    appliedAt: &ldquo;2024-02-24T16:45:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-26T10:15:00Z&rdquo;,
    notes:
      &ldquo;Experiencia insuficiente para el puesto senior. Considerar para posiciones junior en el futuro.&rdquo;,
    rating: 2,
  },
  {
    id: &ldquo;app-3&rdquo;,
    jobId: &ldquo;job-2&rdquo;,
    jobTitle: &ldquo;Especialista en Marketing Digital&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-3&rdquo;,
    applicantName: &ldquo;Ana Gutiérrez Silva&rdquo;,
    applicantEmail: &ldquo;ana.gutierrez@email.com&rdquo;,
    cvUrl: &ldquo;/cv/ana-gutierrez-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Estimado equipo de marketing,\n\nCon gran entusiasmo me postulo para la posición de Especialista en Marketing Digital. Mi experiencia de 3 años en agencias de marketing digital me ha permitido desarrollar campañas exitosas para diversos sectores, logrando incrementos promedio del 40% en conversiones.\n\nManejo herramientas como Google Ads, Facebook Ads Manager, Google Analytics, y tengo certificaciones en Google y Meta. Además, tengo experiencia en marketing de contenidos, SEO y email marketing.\n\nMe motiva especialmente la oportunidad de trabajar en el sector tecnológico y aportar al crecimiento de TechCorp Bolivia.\n\nQuedo a su disposición para una entrevista.\n\nSaludos,\nAna Gutiérrez&rdquo;,
    answers: [
      {
        questionId: &ldquo;q4&rdquo;,
        question: &ldquo;¿Qué experiencia tienes con Google Ads?&rdquo;,
        answer:
          &ldquo;3 años manejando campañas de Google Ads con presupuestos desde $500 hasta $10,000 mensuales. Certificada en Google Ads Search, Display y Shopping.&rdquo;,
      },
      {
        questionId: &ldquo;q5&rdquo;,
        question: &ldquo;¿Has trabajado en el sector tecnológico antes?&rdquo;,
        answer:
          &ldquo;Sí, durante 1 año trabajé en una startup de fintech donde manejé todo el marketing digital y ayudé a incrementar usuarios registrados en 150%.&rdquo;,
      },
    ],
    status: &ldquo;PRE_SELECTED&rdquo;,
    appliedAt: &ldquo;2024-02-23T11:20:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-27T09:00:00Z&rdquo;,
    notes:
      &ldquo;Perfil ideal para la posición. Excelente experiencia y resultados comprobables. Programar entrevista final con el director de marketing.&rdquo;,
    rating: 5,
  },
  {
    id: &ldquo;app-4&rdquo;,
    jobId: &ldquo;job-2&rdquo;,
    jobTitle: &ldquo;Especialista en Marketing Digital&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-4&rdquo;,
    applicantName: &ldquo;Luis Vargas Mendoza&rdquo;,
    applicantEmail: &ldquo;luis.vargas@email.com&rdquo;,
    cvUrl: &ldquo;/cv/luis-vargas-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Buenos días,\n\nMe interesa mucho la posición de marketing digital. Soy recién graduado en Marketing con especialización en marketing digital. Durante mi carrera realicé prácticas en una empresa local donde apoyé en redes sociales y contenido.\n\nEstoy muy motivado por aprender y crecer profesionalmente en una empresa como TechCorp.\n\nGracias por la oportunidad.\n\nLuis Vargas&rdquo;,
    answers: [
      {
        questionId: &ldquo;q4&rdquo;,
        question: &ldquo;¿Qué experiencia tienes con Google Ads?&rdquo;,
        answer:
          &ldquo;Tengo certificación básica de Google Ads y he hecho campañas de práctica durante mi carrera universitaria.&rdquo;,
      },
      {
        questionId: &ldquo;q5&rdquo;,
        question: &ldquo;¿Has trabajado en el sector tecnológico antes?&rdquo;,
        answer:
          &ldquo;No directamente, pero durante mis prácticas trabajé con herramientas digitales y siempre me ha interesado la tecnología.&rdquo;,
      },
    ],
    status: &ldquo;SENT&rdquo;,
    appliedAt: &ldquo;2024-02-26T08:15:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-26T08:15:00Z&rdquo;,
    notes: &ldquo;&rdquo;,
    rating: undefined,
  },
  {
    id: &ldquo;app-5&rdquo;,
    jobId: &ldquo;job-3&rdquo;,
    jobTitle: &ldquo;Analista de Datos&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-5&rdquo;,
    applicantName: &ldquo;Patricia Sosa Delgado&rdquo;,
    applicantEmail: &ldquo;patricia.sosa@email.com&rdquo;,
    cvUrl: &ldquo;/cv/patricia-sosa-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Estimado equipo de datos,\n\nSoy Ingeniera en Sistemas con especialización en ciencia de datos y me emociona la oportunidad de contribuir como Analista de Datos en TechCorp Bolivia.\n\nMi experiencia incluye:\n• 2 años como analista de datos en sector financiero\n• Dominio de Python, R, SQL, y herramientas como Tableau y Power BI\n• Experiencia en machine learning y modelos predictivos\n• Gestión de bases de datos y ETL processes\n\nHe liderado proyectos que resultaron en mejoras del 25% en eficiencia operativa mediante análisis predictivo y automatización de reportes.\n\nEspero poder aportar mi experiencia analítica al crecimiento de TechCorp.\n\nSaludos cordiales,\nPatricia Sosa&rdquo;,
    answers: [
      {
        questionId: &ldquo;q6&rdquo;,
        question: &ldquo;¿Qué experiencia tienes con Python y R?&rdquo;,
        answer:
          &ldquo;3 años con Python (pandas, numpy, scikit-learn, matplotlib) y 2 años con R para análisis estadístico y visualización de datos.&rdquo;,
      },
      {
        questionId: &ldquo;q7&rdquo;,
        question: &ldquo;¿Has trabajado con bases de datos grandes?&rdquo;,
        answer:
          &ldquo;Sí, he trabajado con bases de datos de hasta 10M de registros usando SQL, PostgreSQL y herramientas de BigQuery para análisis.&rdquo;,
      },
      {
        questionId: &ldquo;q8&rdquo;,
        question: &ldquo;¿Tienes experiencia con visualización de datos?&rdquo;,
        answer:
          &ldquo;Experiencia avanzada con Tableau, Power BI, y bibliotecas de Python como matplotlib, seaborn y plotly para crear dashboards interactivos.&rdquo;,
      },
    ],
    status: &ldquo;HIRED&rdquo;,
    appliedAt: &ldquo;2024-02-20T14:30:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-28T16:45:00Z&rdquo;,
    notes:
      &ldquo;Excelente candidata. Experiencia técnica sólida y buenos resultados previos. Contratada para iniciar el 15 de marzo.&rdquo;,
    rating: 5,
  },
  {
    id: &ldquo;app-6&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Senior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-6&rdquo;,
    applicantName: &ldquo;Roberto Silva Morales&rdquo;,
    applicantEmail: &ldquo;roberto.silva@email.com&rdquo;,
    cvUrl: &ldquo;/cv/roberto-silva-cv.pdf&rdquo;,
    coverLetter:
      &ldquo;Distinguido equipo técnico,\n\nCon 6 años de experiencia en desarrollo frontend, incluyendo 4 años como tech lead, estoy muy interesado en la posición de Desarrollador Frontend Senior.\n\nMi experiencia abarca:\n• Arquitectura y desarrollo de SPAs con React, Vue.js y Angular\n• Liderazgo técnico de equipos de 3-8 desarrolladores\n• Implementación de CI/CD y mejores prácticas de desarrollo\n• Optimización de performance y SEO técnico\n• Mentoring de desarrolladores junior y mid-level\n\nBusco un nuevo desafío donde pueda contribuir no solo técnicamente sino también en el crecimiento del equipo y la adopción de nuevas tecnologías.\n\nQuedo a su disposición.\n\nSaludos,\nRoberto Silva&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Cuántos años de experiencia tienes con React?&rdquo;,
        answer:
          &ldquo;5 años de experiencia con React, incluyendo la migración de aplicaciones legacy y implementación de arquitecturas escalables con microfrontends.&rdquo;,
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question: &ldquo;¿Tienes experiencia con TypeScript?&rdquo;,
        answer:
          &ldquo;4 años con TypeScript, incluyendo configuración avanzada, desarrollo de librerías internas y establecimiento de estándares de código.&rdquo;,
      },
      {
        questionId: &ldquo;q3&rdquo;,
        question: &ldquo;¿Estarías disponible para trabajar en modalidad híbrida?&rdquo;,
        answer:
          &ldquo;Perfectamente. Tengo experiencia liderando equipos remotos e híbridos, con excelentes habilidades de comunicación y coordinación.&rdquo;,
      },
    ],
    status: &ldquo;PRE_SELECTED&rdquo;,
    appliedAt: &ldquo;2024-02-21T10:15:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-27T11:30:00Z&rdquo;,
    notes:
      &ldquo;Perfil senior excepcional. Experiencia de liderazgo muy valiosa. Considerar también para posición de tech lead. Programar entrevista con CTO.&rdquo;,
    rating: 5,
  },
];

// GET /api/jobs/candidates - List candidates for company's jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get(&ldquo;jobId&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const search = searchParams.get(&ldquo;search&rdquo;);
    const sortBy = searchParams.get(&ldquo;sortBy&rdquo;) || &ldquo;appliedAt&rdquo;;
    const sortOrder = searchParams.get(&ldquo;sortOrder&rdquo;) || &ldquo;desc&rdquo;;
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

    let filtered = [...candidates];

    // Filter by job if specified
    if (jobId && jobId !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((candidate) => candidate.jobId === jobId);
    }

    // Filter by status if specified
    if (status && status !== &ldquo;all&rdquo;) {
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
        case &ldquo;applicantName&rdquo;:
          aValue = a.applicantName;
          bValue = b.applicantName;
          break;
        case &ldquo;appliedAt&rdquo;:
          aValue = new Date(a.appliedAt);
          bValue = new Date(b.appliedAt);
          break;
        case &ldquo;status&rdquo;:
          aValue = a.status;
          bValue = b.status;
          break;
        case &ldquo;rating&rdquo;:
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case &ldquo;jobTitle&rdquo;:
          aValue = a.jobTitle;
          bValue = b.jobTitle;
          break;
        default:
          aValue = new Date(a.appliedAt);
          bValue = new Date(b.appliedAt);
      }

      if (aValue < bValue) return sortOrder === &ldquo;asc&rdquo; ? -1 : 1;
      if (aValue > bValue) return sortOrder === &ldquo;asc&rdquo; ? 1 : -1;
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
        sent: candidates.filter((c) => c.status === &ldquo;SENT&rdquo;).length,
        underReview: candidates.filter((c) => c.status === &ldquo;UNDER_REVIEW&rdquo;)
          .length,
        preSelected: candidates.filter((c) => c.status === &ldquo;PRE_SELECTED&rdquo;)
          .length,
        rejected: candidates.filter((c) => c.status === &ldquo;REJECTED&rdquo;).length,
        hired: candidates.filter((c) => c.status === &ldquo;HIRED&rdquo;).length,
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
    console.error(&ldquo;Error fetching candidates:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener candidatos&rdquo; },
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
        { error: &ldquo;Candidato no encontrado&rdquo; },
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
      message: &ldquo;Candidato actualizado exitosamente&rdquo;,
      candidate: candidates[candidateIndex],
    });
  } catch (error) {
    console.error(&ldquo;Error updating candidate:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al actualizar candidato&rdquo; },
      { status: 500 }
    );
  }
}
