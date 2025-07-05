import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { JobApplication, ApplicationStatus } from &ldquo;@/types/jobs&rdquo;;

// Mock applications data (same as job applications but filtered by user)
const mockApplications: JobApplication[] = [
  {
    id: &ldquo;app-1&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Junior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;mock-user-id&rdquo;, // Current user ID
    applicantName: &ldquo;John Doe&rdquo;,
    applicantEmail: &ldquo;john@example.com&rdquo;,
    cvUrl: &ldquo;/cv/john-doe.pdf&rdquo;,
    coverLetter: &ldquo;Estimado equipo de TechCorp, estoy muy interesado en la posición de Desarrollador Frontend Junior...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Tienes experiencia previa trabajando con React?&rdquo;,
        answer: &ldquo;6 meses - 1 año&rdquo;
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question: &ldquo;Describe brevemente tu proyecto más importante con JavaScript&rdquo;,
        answer: &ldquo;Desarrollé una aplicación web de gestión de tareas usando React y Node.js con autenticación y base de datos.&rdquo;
      }
    ],
    status: &ldquo;UNDER_REVIEW&rdquo;,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4
  },
  {
    id: &ldquo;app-2&rdquo;,
    jobId: &ldquo;job-2&rdquo;,
    jobTitle: &ldquo;Asistente de Marketing Digital&rdquo;,
    companyName: &ldquo;Mindful Co.&rdquo;,
    companyLogo: &ldquo;/logos/mindfulco.svg&rdquo;,
    applicantId: &ldquo;mock-user-id&rdquo;,
    applicantName: &ldquo;John Doe&rdquo;,
    applicantEmail: &ldquo;john@example.com&rdquo;,
    cvUrl: &ldquo;/cv/john-doe.pdf&rdquo;,
    coverLetter: &ldquo;Estimado equipo de Mindful Co., estoy emocionado por la oportunidad de unirme a su equipo creativo...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿Qué redes sociales utilizas más frecuentemente?&rdquo;,
        answer: &ldquo;Instagram&rdquo;
      }
    ],
    status: &ldquo;PRE_SELECTED&rdquo;,
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: &ldquo;Candidato con buen potencial creativo&rdquo;,
    rating: 5
  },
  {
    id: &ldquo;app-3&rdquo;,
    jobId: &ldquo;job-3&rdquo;,
    jobTitle: &ldquo;Practicante de Contabilidad&rdquo;,
    companyName: &ldquo;Zenith Health&rdquo;,
    companyLogo: &ldquo;/logos/zenithhealth.svg&rdquo;,
    applicantId: &ldquo;mock-user-id&rdquo;,
    applicantName: &ldquo;John Doe&rdquo;,
    applicantEmail: &ldquo;john@example.com&rdquo;,
    cvUrl: &ldquo;/cv/john-doe.pdf&rdquo;,
    coverLetter: &ldquo;Estimado equipo de Zenith Health, estoy interesado en realizar mis prácticas profesionales...&rdquo;,
    answers: [
      {
        questionId: &ldquo;q1&rdquo;,
        question: &ldquo;¿En qué semestre de la carrera te encuentras actualmente?&rdquo;,
        answer: &ldquo;7mo semestre&rdquo;
      },
      {
        questionId: &ldquo;q2&rdquo;,
        question: &ldquo;¿Tienes disponibilidad para trabajar medio tiempo por 6 meses?&rdquo;,
        answer: &ldquo;Sí&rdquo;
      }
    ],
    status: &ldquo;REJECTED&rdquo;,
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: &ldquo;No cumple con los requisitos mínimos de experiencia&rdquo;
  },
  {
    id: &ldquo;app-4&rdquo;,
    jobId: &ldquo;job-1&rdquo;,
    jobTitle: &ldquo;Desarrollador Frontend Junior&rdquo;,
    companyName: &ldquo;TechCorp Bolivia&rdquo;,
    companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    applicantId: &ldquo;mock-user-id&rdquo;,
    applicantName: &ldquo;John Doe&rdquo;,
    applicantEmail: &ldquo;john@example.com&rdquo;,
    cvUrl: &ldquo;/cv/john-doe-v2.pdf&rdquo;,
    coverLetter: &ldquo;Segunda aplicación con CV actualizado...&rdquo;,
    answers: [],
    status: &ldquo;SENT&rdquo;,
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET: Get current user's applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // In a real app, get userId from authentication
    const userId = &ldquo;mock-user-id&rdquo;;
    
    // Filter applications by current user
    let userApplications = mockApplications.filter(app => app.applicantId === userId);
    
    // Apply status filter if provided
    const statusFilter = searchParams.get(&ldquo;status&rdquo;) as ApplicationStatus;
    if (statusFilter) {
      userApplications = userApplications.filter(app => app.status === statusFilter);
    }
    
    // Apply company filter if provided
    const companyFilter = searchParams.get(&ldquo;company&rdquo;);
    if (companyFilter) {
      userApplications = userApplications.filter(app => 
        app.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    
    // Apply date range filter if provided
    const dateFrom = searchParams.get(&ldquo;dateFrom&rdquo;);
    const dateTo = searchParams.get(&ldquo;dateTo&rdquo;);
    
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
      sent: userApplications.filter(app => app.status === &ldquo;SENT&rdquo;).length,
      underReview: userApplications.filter(app => app.status === &ldquo;UNDER_REVIEW&rdquo;).length,
      preSelected: userApplications.filter(app => app.status === &ldquo;PRE_SELECTED&rdquo;).length,
      rejected: userApplications.filter(app => app.status === &ldquo;REJECTED&rdquo;).length,
      hired: userApplications.filter(app => app.status === &ldquo;HIRED&rdquo;).length,
    };
    
    return NextResponse.json({
      applications: userApplications,
      stats
    });
  } catch (error) {
    console.error(&ldquo;Error fetching user applications:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch applications&rdquo; },
      { status: 500 }
    );
  }
}

// DELETE: Withdraw application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get(&ldquo;applicationId&rdquo;);
    
    if (!applicationId) {
      return NextResponse.json(
        { error: &ldquo;Application ID is required&rdquo; },
        { status: 400 }
      );
    }
    
    // In a real app, verify that the application belongs to the current user
    const userId = &ldquo;mock-user-id&rdquo;;
    
    const applicationIndex = mockApplications.findIndex(
      app => app.id === applicationId && app.applicantId === userId
    );
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Application not found or unauthorized&rdquo; },
        { status: 404 }
      );
    }
    
    // Check if application can be withdrawn (only SENT status)
    if (mockApplications[applicationIndex].status !== &ldquo;SENT&rdquo;) {
      return NextResponse.json(
        { error: &ldquo;Cannot withdraw application that is already being reviewed&rdquo; },
        { status: 400 }
      );
    }
    
    // Remove application (in real app, might just mark as withdrawn)
    mockApplications.splice(applicationIndex, 1);
    
    return NextResponse.json({ message: &ldquo;Application withdrawn successfully&rdquo; });
  } catch (error) {
    console.error(&ldquo;Error withdrawing application:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to withdraw application&rdquo; },
      { status: 500 }
    );
  }
} 