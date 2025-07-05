import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import {
  JobApplication,
  ApplicationStatus,
  JobQuestionAnswer,
} from &ldquo;@/types/jobs&rdquo;;

// Mock applications data
let mockApplications: JobApplication[] = [
  {
    id: &ldquo;app-1&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Junior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-1&rdquo;,
    applicantName: &ldquo;María González&rdquo;,
    applicantEmail: &ldquo;maria.gonzalez@email.com&rdquo;,
    cvUrl: &ldquo;/cv/maria-gonzalez.pdf&rdquo;,
    coverLetter:
      &ldquo;Estimado equipo de TechCorp, estoy muy interesada en la posición de Desarrolladora Frontend Junior. Durante mis estudios universitarios he desarrollado varios proyectos con React...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Tienes experiencia previa trabajando con React?&rdquo;,
        answer: &ldquo;6 meses - 1 año&rdquo;,
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question:
          &ldquo;Describe brevemente tu proyecto más importante con JavaScript&rdquo;,
        answer:
          &ldquo;Desarrollé una aplicación web de gestión de tareas usando React, Redux y Firebase. La aplicación permite crear, editar y organizar tareas con diferentes categorías y filtros.&rdquo;,
      },
    ],
    status: &ldquo;UNDER_REVIEW&rdquo;,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
  },
  {
    id: &ldquo;app-2&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Junior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;user-2&rdquo;,
    applicantName: &ldquo;Carlos Mamani&rdquo;,
    applicantEmail: &ldquo;carlos.mamani@email.com&rdquo;,
    cvUrl: &ldquo;/cv/carlos-mamani.pdf&rdquo;,
    coverLetter:
      &ldquo;Hola equipo de TechCorp, soy un desarrollador junior con gran pasión por la tecnología frontend...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Tienes experiencia previa trabajando con React?&rdquo;,
        answer: &ldquo;Menos de 6 meses&rdquo;,
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question:
          &ldquo;Describe brevemente tu proyecto más importante con JavaScript&rdquo;,
        answer:
          &ldquo;Creé un sitio web personal con JavaScript vanilla que incluye un portafolio interactivo y formulario de contacto.&rdquo;,
      },
    ],
    status: &ldquo;SENT&rdquo;,
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: &ldquo;app-3&rdquo;,
    jobId: &ldquo;job-2&rdquo;,
    jobTitle: &ldquo;Asistente de Marketing Digital&rdquo;,
    companyName: &ldquo;Mindful Co.&rdquo;,
    companyLogo: &ldquo;/logos/mindfulco.svg&rdquo;,
    applicantId: &ldquo;user-3&rdquo;,
    applicantName: &ldquo;Ana Quispe&rdquo;,
    applicantEmail: &ldquo;ana.quispe@email.com&rdquo;,
    cvUrl: &ldquo;/cv/ana-quispe.pdf&rdquo;,
    coverLetter:
      &ldquo;Estimado equipo de Mindful Co., estoy emocionada por la oportunidad de unirme a su equipo creativo...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Qué redes sociales utilizas más frecuentemente?&rdquo;,
        answer: &ldquo;Instagram&rdquo;,
      },
    ],
    status: &ldquo;PRE_SELECTED&rdquo;,
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: &ldquo;Candidata muy prometedora con buen portafolio en redes sociales&rdquo;,
    rating: 5,
  },
];

// GET: Get applications for a specific job (for companies)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { searchParams } = new URL(request.url);

    // Filter applications by job ID
    let jobApplications = mockApplications.filter((app) => app.jobId === jobId);

    // Apply status filter if provided
    const statusFilter = searchParams.get(&ldquo;status&rdquo;) as ApplicationStatus;
    if (statusFilter) {
      jobApplications = jobApplications.filter(
        (app) => app.status === statusFilter
      );
    }

    // Apply date filter if provided
    const dateFrom = searchParams.get(&ldquo;dateFrom&rdquo;);
    if (dateFrom) {
      jobApplications = jobApplications.filter(
        (app) => new Date(app.appliedAt) >= new Date(dateFrom)
      );
    }

    // Sort by application date (newest first)
    jobApplications.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

    return NextResponse.json({
      applications: jobApplications,
      total: jobApplications.length,
      stats: {
        sent: jobApplications.filter((app) => app.status === &ldquo;SENT&rdquo;).length,
        underReview: jobApplications.filter(
          (app) => app.status === &ldquo;UNDER_REVIEW&rdquo;
        ).length,
        preSelected: jobApplications.filter(
          (app) => app.status === &ldquo;PRE_SELECTED&rdquo;
        ).length,
        rejected: jobApplications.filter((app) => app.status === &ldquo;REJECTED&rdquo;)
          .length,
        hired: jobApplications.filter((app) => app.status === &ldquo;HIRED&rdquo;).length,
      },
    });
  } catch (error) {
    console.error(&ldquo;Error fetching job applications:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch job applications&rdquo; },
      { status: 500 }
    );
  }
}

// POST: Submit application (for youth/adolescents)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const applicationData = await request.json();

    // Check if user already applied to this job
    const existingApplication = mockApplications.find(
      (app) =>
        app.jobId === jobId && app.applicantId === applicationData.applicantId
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: &ldquo;Ya has aplicado a esta oferta de trabajo&rdquo; },
        { status: 409 }
      );
    }

    // Create new application
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: applicationData.jobTitle,
      companyName: applicationData.companyName,
      companyLogo: applicationData.companyLogo,
      applicantId: applicationData.applicantId,
      applicantName: applicationData.applicantName,
      applicantEmail: applicationData.applicantEmail,
      cvUrl: applicationData.cvUrl,
      coverLetter: applicationData.coverLetter,
      answers: applicationData.answers || [],
      status: &ldquo;SENT&rdquo;,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockApplications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error(&ldquo;Error submitting application:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to submit application&rdquo; },
      { status: 500 }
    );
  }
}

// PUT: Update application status (for companies)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { applicationId, status, notes, rating } = await request.json();

    const applicationIndex = mockApplications.findIndex(
      (app) => app.id === applicationId && app.jobId === jobId
    );

    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Application not found&rdquo; },
        { status: 404 }
      );
    }

    // Update application
    mockApplications[applicationIndex] = {
      ...mockApplications[applicationIndex],
      status: status as ApplicationStatus,
      notes: notes || mockApplications[applicationIndex].notes,
      rating:
        rating !== undefined
          ? rating
          : mockApplications[applicationIndex].rating,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockApplications[applicationIndex]);
  } catch (error) {
    console.error(&ldquo;Error updating application:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to update application&rdquo; },
      { status: 500 }
    );
  }
}
