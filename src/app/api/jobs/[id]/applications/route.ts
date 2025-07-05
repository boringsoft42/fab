import { NextRequest, NextResponse } from "next/server";
import {
  JobApplication,
  ApplicationStatus,
  JobQuestionAnswer,
} from "@/types/jobs";

// Mock applications data
let mockApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Junior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-1",
    applicantName: "María González",
    applicantEmail: "maria.gonzalez@email.com",
    cvUrl: "/cv/maria-gonzalez.pdf",
    coverLetter:
      "Estimado equipo de TechCorp, estoy muy interesada en la posición de Desarrolladora Frontend Junior. Durante mis estudios universitarios he desarrollado varios proyectos con React...",
    answers: [
      {
        questionId: "q1",
        question: "¿Tienes experiencia previa trabajando con React?",
        answer: "6 meses - 1 año",
      },
      {
        questionId: "q2",
        question:
          "Describe brevemente tu proyecto más importante con JavaScript",
        answer:
          "Desarrollé una aplicación web de gestión de tareas usando React, Redux y Firebase. La aplicación permite crear, editar y organizar tareas con diferentes categorías y filtros.",
      },
    ],
    status: "UNDER_REVIEW",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
  },
  {
    id: "app-2",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Junior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "user-2",
    applicantName: "Carlos Mamani",
    applicantEmail: "carlos.mamani@email.com",
    cvUrl: "/cv/carlos-mamani.pdf",
    coverLetter:
      "Hola equipo de TechCorp, soy un desarrollador junior con gran pasión por la tecnología frontend...",
    answers: [
      {
        questionId: "q1",
        question: "¿Tienes experiencia previa trabajando con React?",
        answer: "Menos de 6 meses",
      },
      {
        questionId: "q2",
        question:
          "Describe brevemente tu proyecto más importante con JavaScript",
        answer:
          "Creé un sitio web personal con JavaScript vanilla que incluye un portafolio interactivo y formulario de contacto.",
      },
    ],
    status: "SENT",
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app-3",
    jobId: "job-2",
    jobTitle: "Asistente de Marketing Digital",
    companyName: "Mindful Co.",
    companyLogo: "/logos/mindfulco.svg",
    applicantId: "user-3",
    applicantName: "Ana Quispe",
    applicantEmail: "ana.quispe@email.com",
    cvUrl: "/cv/ana-quispe.pdf",
    coverLetter:
      "Estimado equipo de Mindful Co., estoy emocionada por la oportunidad de unirme a su equipo creativo...",
    answers: [
      {
        questionId: "q1",
        question: "¿Qué redes sociales utilizas más frecuentemente?",
        answer: "Instagram",
      },
    ],
    status: "PRE_SELECTED",
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Candidata muy prometedora con buen portafolio en redes sociales",
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
    const statusFilter = searchParams.get("status") as ApplicationStatus;
    if (statusFilter) {
      jobApplications = jobApplications.filter(
        (app) => app.status === statusFilter
      );
    }

    // Apply date filter if provided
    const dateFrom = searchParams.get("dateFrom");
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
        sent: jobApplications.filter((app) => app.status === "SENT").length,
        underReview: jobApplications.filter(
          (app) => app.status === "UNDER_REVIEW"
        ).length,
        preSelected: jobApplications.filter(
          (app) => app.status === "PRE_SELECTED"
        ).length,
        rejected: jobApplications.filter((app) => app.status === "REJECTED")
          .length,
        hired: jobApplications.filter((app) => app.status === "HIRED").length,
      },
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
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
        { error: "Ya has aplicado a esta oferta de trabajo" },
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
      status: "SENT",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockApplications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
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
        { error: "Application not found" },
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
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
