import { NextRequest, NextResponse } from "next/server";
import { Enrollment, Course, EnrollmentStatus } from "@/types/courses";

// Extended mock data including course information with enrollments
const mockUserCourses = [
  {
    enrollment: {
      id: "enrollment-1",
      userId: "user-1",
      courseId: "soft-skills-empowerment",
      enrolledAt: new Date("2024-02-01"),
      lastAccessedAt: new Date("2024-02-28"),
      status: EnrollmentStatus.IN_PROGRESS,
      progress: {
        courseId: "soft-skills-empowerment",
        userId: "user-1",
        completedLessons: ["lesson-1-1", "lesson-1-2"],
        completedModules: [],
        currentLesson: "lesson-2-1",
        currentModule: "module-2",
        totalProgress: 25,
        timeSpent: 720,
        quizScores: [
          {
            quizId: "quiz-1-2",
            lessonId: "lesson-1-2",
            score: 85,
            totalQuestions: 5,
            correctAnswers: 4,
            timeSpent: 180,
            attemptNumber: 1,
            completedAt: new Date("2024-02-15"),
            answers: [],
          },
        ],
        certificates: [],
      },
    },
    course: {
      id: "soft-skills-empowerment",
      title: "Habilidades Blandas y Empoderamiento Personal",
      thumbnail: "/api/placeholder/400/250",
      instructor: {
        id: "maria-lopez",
        name: "María López",
        title: "Especialista en Desarrollo Personal",
        avatar: "/api/placeholder/100/100",
        bio: "Especialista en desarrollo personal",
        rating: 4.8,
        totalStudents: 2500,
        totalCourses: 8,
      },
      duration: 20,
      totalLessons: 30,
      isMandatory: true,
      certification: true,
    },
  },
  {
    enrollment: {
      id: "enrollment-2",
      userId: "user-1",
      courseId: "basic-competencies",
      enrolledAt: new Date("2024-01-15"),
      completedAt: new Date("2024-02-10"),
      lastAccessedAt: new Date("2024-02-10"),
      status: EnrollmentStatus.COMPLETED,
      progress: {
        courseId: "basic-competencies",
        userId: "user-1",
        completedLessons: [
          "lesson-basic-1-1",
          "lesson-basic-1-2",
          "lesson-basic-2-1",
        ],
        completedModules: ["module-basic-1", "module-basic-2"],
        totalProgress: 100,
        timeSpent: 300,
        quizScores: [
          {
            quizId: "quiz-basic-final",
            lessonId: "lesson-basic-final",
            score: 92,
            totalQuestions: 10,
            correctAnswers: 9,
            timeSpent: 240,
            attemptNumber: 1,
            completedAt: new Date("2024-02-10"),
            answers: [],
          },
        ],
        certificates: ["cert-basic-competencies-001"],
      },
    },
    course: {
      id: "basic-competencies",
      title: "Competencias Básicas Fundamentales",
      thumbnail: "/api/placeholder/400/250",
      instructor: {
        id: "carlos-rivera",
        name: "Carlos Rivera",
        title: "Especialista en Competencias Básicas",
        avatar: "/api/placeholder/100/100",
        bio: "Educador especializado",
        rating: 4.9,
        totalStudents: 3200,
        totalCourses: 5,
      },
      duration: 5,
      totalLessons: 15,
      isMandatory: true,
      certification: true,
    },
  },
  {
    enrollment: {
      id: "enrollment-3",
      userId: "user-1",
      courseId: "job-placement-skills",
      enrolledAt: new Date("2024-02-20"),
      lastAccessedAt: new Date("2024-02-20"),
      status: EnrollmentStatus.ENROLLED,
      progress: {
        courseId: "job-placement-skills",
        userId: "user-1",
        completedLessons: [],
        completedModules: [],
        totalProgress: 0,
        timeSpent: 0,
        quizScores: [],
        certificates: [],
      },
    },
    course: {
      id: "job-placement-skills",
      title: "Inserción Laboral y Técnicas de Búsqueda de Empleo",
      thumbnail: "/api/placeholder/400/250",
      instructor: {
        id: "ana-garcia",
        name: "Ana García",
        title: "Consultora en Recursos Humanos",
        avatar: "/api/placeholder/100/100",
        bio: "Especialista en inserción laboral",
        rating: 4.7,
        totalStudents: 1800,
        totalCourses: 6,
      },
      duration: 8,
      totalLessons: 20,
      isMandatory: true,
      certification: true,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as EnrollmentStatus;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Filter user's courses
    let userCourses = mockUserCourses.filter(
      (item) => item.enrollment.userId === userId
    );

    // Apply status filter if provided
    if (status) {
      userCourses = userCourses.filter(
        (item) => item.enrollment.status === status
      );
    }

    // Calculate statistics
    const stats = {
      total: userCourses.length,
      inProgress: userCourses.filter(
        (item) => item.enrollment.status === EnrollmentStatus.IN_PROGRESS
      ).length,
      completed: userCourses.filter(
        (item) => item.enrollment.status === EnrollmentStatus.COMPLETED
      ).length,
      enrolled: userCourses.filter(
        (item) => item.enrollment.status === EnrollmentStatus.ENROLLED
      ).length,
      totalTimeSpent: userCourses.reduce(
        (total, item) => total + item.enrollment.progress.timeSpent,
        0
      ),
      averageProgress:
        userCourses.length > 0
          ? userCourses.reduce(
              (total, item) => total + item.enrollment.progress.totalProgress,
              0
            ) / userCourses.length
          : 0,
      certificatesEarned: userCourses.reduce(
        (total, item) => total + item.enrollment.progress.certificates.length,
        0
      ),
    };

    // Sort by last accessed (most recent first)
    userCourses.sort(
      (a, b) =>
        new Date(b.enrollment.lastAccessedAt).getTime() -
        new Date(a.enrollment.lastAccessedAt).getTime()
    );

    // Pagination
    const total = userCourses.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = userCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      courses: paginatedCourses,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
