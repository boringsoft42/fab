import { NextRequest, NextResponse } from "next/server";
import { JobApplication, ApplicationStatus } from "@/types/jobs";

// Mock applications data (same as job applications but filtered by user)
const mockApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Junior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "mock-user-id", // Current user ID
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
    cvUrl: "/cv/john-doe.pdf",
    coverLetter: "Estimado equipo de TechCorp, estoy muy interesado en la posición de Desarrollador Frontend Junior...",
    answers: [
      {
        questionId: "q1",
        question: "¿Tienes experiencia previa trabajando con React?",
        answer: "6 meses - 1 año"
      },
      {
        questionId: "q2",
        question: "Describe brevemente tu proyecto más importante con JavaScript",
        answer: "Desarrollé una aplicación web de gestión de tareas usando React y Node.js con autenticación y base de datos."
      }
    ],
    status: "UNDER_REVIEW",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Asistente de Marketing Digital",
    companyName: "Mindful Co.",
    companyLogo: "/logos/mindfulco.svg",
    applicantId: "mock-user-id",
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
    cvUrl: "/cv/john-doe.pdf",
    coverLetter: "Estimado equipo de Mindful Co., estoy emocionado por la oportunidad de unirme a su equipo creativo...",
    answers: [
      {
        questionId: "q1",
        question: "¿Qué redes sociales utilizas más frecuentemente?",
        answer: "Instagram"
      }
    ],
    status: "PRE_SELECTED",
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Candidato con buen potencial creativo",
    rating: 5
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Practicante de Contabilidad",
    companyName: "Zenith Health",
    companyLogo: "/logos/zenithhealth.svg",
    applicantId: "mock-user-id",
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
    cvUrl: "/cv/john-doe.pdf",
    coverLetter: "Estimado equipo de Zenith Health, estoy interesado en realizar mis prácticas profesionales...",
    answers: [
      {
        questionId: "q1",
        question: "¿En qué semestre de la carrera te encuentras actualmente?",
        answer: "7mo semestre"
      },
      {
        questionId: "q2",
        question: "¿Tienes disponibilidad para trabajar medio tiempo por 6 meses?",
        answer: "Sí"
      }
    ],
    status: "REJECTED",
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "No cumple con los requisitos mínimos de experiencia"
  },
  {
    id: "app-4",
    jobId: "job-1",
    jobTitle: "Desarrollador Frontend Junior",
    companyName: "TechCorp Bolivia",
    companyLogo: "/logos/techcorp.svg",
    applicantId: "mock-user-id",
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
    cvUrl: "/cv/john-doe-v2.pdf",
    coverLetter: "Segunda aplicación con CV actualizado...",
    answers: [],
    status: "SENT",
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET: Get current user's applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // In a real app, get userId from authentication
    const userId = "mock-user-id";
    
    // Filter applications by current user
    let userApplications = mockApplications.filter(app => app.applicantId === userId);
    
    // Apply status filter if provided
    const statusFilter = searchParams.get("status") as ApplicationStatus;
    if (statusFilter) {
      userApplications = userApplications.filter(app => app.status === statusFilter);
    }
    
    // Apply company filter if provided
    const companyFilter = searchParams.get("company");
    if (companyFilter) {
      userApplications = userApplications.filter(app => 
        app.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    
    // Apply date range filter if provided
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    
    if (dateFrom) {
      userApplications = userApplications.filter(app => 
        new Date(app.appliedAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      userApplications = userApplications.filter(app => 
        new Date(app.appliedAt) <= new Date(dateTo)
      );
    }
    
    // Sort by application date (newest first)
    userApplications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
    
    // Calculate stats
    const stats = {
      total: userApplications.length,
      sent: userApplications.filter(app => app.status === "SENT").length,
      underReview: userApplications.filter(app => app.status === "UNDER_REVIEW").length,
      preSelected: userApplications.filter(app => app.status === "PRE_SELECTED").length,
      rejected: userApplications.filter(app => app.status === "REJECTED").length,
      hired: userApplications.filter(app => app.status === "HIRED").length,
    };
    
    return NextResponse.json({
      applications: userApplications,
      stats
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// DELETE: Withdraw application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    
    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }
    
    // In a real app, verify that the application belongs to the current user
    const userId = "mock-user-id";
    
    const applicationIndex = mockApplications.findIndex(
      app => app.id === applicationId && app.applicantId === userId
    );
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: "Application not found or unauthorized" },
        { status: 404 }
      );
    }
    
    // Check if application can be withdrawn (only SENT status)
    if (mockApplications[applicationIndex].status !== "SENT") {
      return NextResponse.json(
        { error: "Cannot withdraw application that is already being reviewed" },
        { status: 400 }
      );
    }
    
    // Remove application (in real app, might just mark as withdrawn)
    mockApplications.splice(applicationIndex, 1);
    
    return NextResponse.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    );
  }
} 