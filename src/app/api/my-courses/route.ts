import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { Enrollment, Course, EnrollmentStatus } from &ldquo;@/types/courses&rdquo;;

// Extended mock data including course information with enrollments
const mockUserCourses = [
  {
    enrollment: {
      id: &ldquo;enrollment-1&rdquo;,
      userId: &ldquo;user-1&rdquo;,
      courseId: &ldquo;soft-skills-empowerment&rdquo;,
      enrolledAt: new Date(&ldquo;2024-02-01&rdquo;),
      lastAccessedAt: new Date(&ldquo;2024-02-28&rdquo;),
      status: EnrollmentStatus.IN_PROGRESS,
      progress: {
        courseId: &ldquo;soft-skills-empowerment&rdquo;,
        userId: &ldquo;user-1&rdquo;,
        completedLessons: [&ldquo;lesson-1-1&rdquo;, &ldquo;lesson-1-2&rdquo;],
        completedModules: [],
        currentLesson: &ldquo;lesson-2-1&rdquo;,
        currentModule: &ldquo;module-2&rdquo;,
        totalProgress: 25,
        timeSpent: 720,
        quizScores: [
          {
            quizId: &ldquo;quiz-1-2&rdquo;,
            lessonId: &ldquo;lesson-1-2&rdquo;,
            score: 85,
            totalQuestions: 5,
            correctAnswers: 4,
            timeSpent: 180,
            attemptNumber: 1,
            completedAt: new Date(&ldquo;2024-02-15&rdquo;),
            answers: [],
          },
        ],
        certificates: [],
      },
    },
    course: {
      id: &ldquo;soft-skills-empowerment&rdquo;,
      title: &ldquo;Habilidades Blandas y Empoderamiento Personal&rdquo;,
      thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
      instructor: {
        id: &ldquo;maria-lopez&rdquo;,
        name: &ldquo;María López&rdquo;,
        title: &ldquo;Especialista en Desarrollo Personal&rdquo;,
        avatar: &ldquo;/api/placeholder/100/100&rdquo;,
        bio: &ldquo;Especialista en desarrollo personal&rdquo;,
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
      id: &ldquo;enrollment-2&rdquo;,
      userId: &ldquo;user-1&rdquo;,
      courseId: &ldquo;basic-competencies&rdquo;,
      enrolledAt: new Date(&ldquo;2024-01-15&rdquo;),
      completedAt: new Date(&ldquo;2024-02-10&rdquo;),
      lastAccessedAt: new Date(&ldquo;2024-02-10&rdquo;),
      status: EnrollmentStatus.COMPLETED,
      progress: {
        courseId: &ldquo;basic-competencies&rdquo;,
        userId: &ldquo;user-1&rdquo;,
        completedLessons: [
          &ldquo;lesson-basic-1-1&rdquo;,
          &ldquo;lesson-basic-1-2&rdquo;,
          &ldquo;lesson-basic-2-1&rdquo;,
        ],
        completedModules: [&ldquo;module-basic-1&rdquo;, &ldquo;module-basic-2&rdquo;],
        totalProgress: 100,
        timeSpent: 300,
        quizScores: [
          {
            quizId: &ldquo;quiz-basic-final&rdquo;,
            lessonId: &ldquo;lesson-basic-final&rdquo;,
            score: 92,
            totalQuestions: 10,
            correctAnswers: 9,
            timeSpent: 240,
            attemptNumber: 1,
            completedAt: new Date(&ldquo;2024-02-10&rdquo;),
            answers: [],
          },
        ],
        certificates: [&ldquo;cert-basic-competencies-001&rdquo;],
      },
    },
    course: {
      id: &ldquo;basic-competencies&rdquo;,
      title: &ldquo;Competencias Básicas Fundamentales&rdquo;,
      thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
      instructor: {
        id: &ldquo;carlos-rivera&rdquo;,
        name: &ldquo;Carlos Rivera&rdquo;,
        title: &ldquo;Especialista en Competencias Básicas&rdquo;,
        avatar: &ldquo;/api/placeholder/100/100&rdquo;,
        bio: &ldquo;Educador especializado&rdquo;,
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
      id: &ldquo;enrollment-3&rdquo;,
      userId: &ldquo;user-1&rdquo;,
      courseId: &ldquo;job-placement-skills&rdquo;,
      enrolledAt: new Date(&ldquo;2024-02-20&rdquo;),
      lastAccessedAt: new Date(&ldquo;2024-02-20&rdquo;),
      status: EnrollmentStatus.ENROLLED,
      progress: {
        courseId: &ldquo;job-placement-skills&rdquo;,
        userId: &ldquo;user-1&rdquo;,
        completedLessons: [],
        completedModules: [],
        totalProgress: 0,
        timeSpent: 0,
        quizScores: [],
        certificates: [],
      },
    },
    course: {
      id: &ldquo;job-placement-skills&rdquo;,
      title: &ldquo;Inserción Laboral y Técnicas de Búsqueda de Empleo&rdquo;,
      thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
      instructor: {
        id: &ldquo;ana-garcia&rdquo;,
        name: &ldquo;Ana García&rdquo;,
        title: &ldquo;Consultora en Recursos Humanos&rdquo;,
        avatar: &ldquo;/api/placeholder/100/100&rdquo;,
        bio: &ldquo;Especialista en inserción laboral&rdquo;,
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
    const userId = searchParams.get(&ldquo;userId&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;) as EnrollmentStatus;
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);

    if (!userId) {
      return NextResponse.json(
        { error: &ldquo;ID de usuario requerido&rdquo; },
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
    console.error(&ldquo;Error fetching user courses:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}
