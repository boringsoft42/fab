import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { Enrollment, EnrollmentStatus } from &ldquo;@/types/courses&rdquo;;

// Mock enrollment data
const mockEnrollments: Enrollment[] = [
  {
    id: &ldquo;enrollment-1&rdquo;,
    userId: &ldquo;user-1&rdquo;,
    courseId: &ldquo;soft-skills-empowerment&rdquo;,
    enrolledAt: new Date(&ldquo;2024-02-01&rdquo;),
    lastAccessedAt: new Date(&ldquo;2024-02-28&rdquo;),
    status: EnrollmentStatus.IN_PROGRESS,
    progress: {
      courseId: &ldquo;soft-skills-empowerment&rdquo;,
      userId: &ldquo;user-1&rdquo;,
      completedLessons: [&ldquo;lesson-1-1&rdquo;],
      completedModules: [],
      currentLesson: &ldquo;lesson-1-2&rdquo;,
      currentModule: &ldquo;module-1&rdquo;,
      totalProgress: 15,
      timeSpent: 450,
      quizScores: [],
      certificates: [],
    },
  },
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: &ldquo;ID de usuario requerido&rdquo; },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = mockEnrollments.find(
      (enrollment) =>
        enrollment.userId === userId && enrollment.courseId === courseId
    );

    if (existingEnrollment) {
      // Return existing enrollment instead of error
      return NextResponse.json({
        message: &ldquo;Ya estás inscrito en este curso&rdquo;,
        enrollment: existingEnrollment,
      });
    }

    // Create new enrollment
    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      status: EnrollmentStatus.ENROLLED,
      progress: {
        courseId,
        userId,
        completedLessons: [],
        completedModules: [],
        totalProgress: 0,
        timeSpent: 0,
        quizScores: [],
        certificates: [],
      },
    };

    mockEnrollments.push(newEnrollment);

    return NextResponse.json({
      message: &ldquo;Inscripción exitosa&rdquo;,
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error(&ldquo;Error enrolling in course:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get(&ldquo;userId&rdquo;);

    if (!userId) {
      return NextResponse.json(
        { error: &ldquo;ID de usuario requerido&rdquo; },
        { status: 400 }
      );
    }

    const enrollment = mockEnrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );

    if (!enrollment) {
      return NextResponse.json(
        { error: &ldquo;No inscrito en este curso&rdquo; },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error(&ldquo;Error fetching enrollment:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}
