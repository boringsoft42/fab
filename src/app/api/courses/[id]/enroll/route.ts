import { NextRequest, NextResponse } from "next/server";
import { Enrollment, EnrollmentStatus } from "@/types/courses";

// Mock enrollment data
const mockEnrollments: Enrollment[] = [
  {
    id: "enrollment-1",
    userId: "user-1",
    courseId: "soft-skills-empowerment",
    enrolledAt: new Date("2024-02-01"),
    lastAccessedAt: new Date("2024-02-28"),
    status: EnrollmentStatus.IN_PROGRESS,
    progress: {
      courseId: "soft-skills-empowerment",
      userId: "user-1",
      completedLessons: ["lesson-1-1"],
      completedModules: [],
      currentLesson: "lesson-1-2",
      currentModule: "module-1",
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
        { error: "ID de usuario requerido" },
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
        message: "Ya estás inscrito en este curso",
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
      message: "Inscripción exitosa",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const enrollment = mockEnrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );

    if (!enrollment) {
      return NextResponse.json(
        { error: "No inscrito en este curso" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
