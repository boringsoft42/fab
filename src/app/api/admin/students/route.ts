import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

// Mock data for demonstration - in real app this would come from Prisma/database
const students = [
  {
    id: &ldquo;student-1&rdquo;,
    name: &ldquo;María González&rdquo;,
    email: &ldquo;maria.gonzalez@email.com&rdquo;,
    avatar: &ldquo;/api/placeholder/60/60&rdquo;,
    age: 22,
    location: &ldquo;Santa Cruz, Bolivia&rdquo;,
    phone: &ldquo;+591-3-1234567&rdquo;,
    enrollmentDate: new Date(&ldquo;2024-01-15&rdquo;),
    status: &ldquo;active&rdquo;,
    totalCourses: 3,
    completedCourses: 1,
    inProgressCourses: 2,
    totalHours: 45,
    completedHours: 32,
    overallProgress: 71,
    certificates: 1,
    lastActivity: new Date(&ldquo;2024-02-28&rdquo;),
    enrolledCourses: [
      {
        courseId: &ldquo;course-1&rdquo;,
        courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
        instructor: &ldquo;Dr. Roberto Silva&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-15&rdquo;),
        progress: 100,
        status: &ldquo;completed&rdquo;,
        grade: 95,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: &ldquo;course-2&rdquo;,
        courseName: &ldquo;Emprendimiento Digital&rdquo;,
        instructor: &ldquo;Lic. Carmen Rodriguez&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-20&rdquo;),
        progress: 65,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 12,
        certificateIssued: false,
      },
      {
        courseId: &ldquo;course-3&rdquo;,
        courseName: &ldquo;Finanzas Personales&rdquo;,
        instructor: &ldquo;Ing. Luis Mamani&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-01&rdquo;),
        progress: 30,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 5,
        certificateIssued: false,
      },
    ],
  },
  {
    id: &ldquo;student-2&rdquo;,
    name: &ldquo;Carlos Mamani&rdquo;,
    email: &ldquo;carlos.mamani@email.com&rdquo;,
    avatar: &ldquo;/api/placeholder/60/60&rdquo;,
    age: 19,
    location: &ldquo;La Paz, Bolivia&rdquo;,
    phone: &ldquo;+591-2-2345678&rdquo;,
    enrollmentDate: new Date(&ldquo;2024-01-20&rdquo;),
    status: &ldquo;active&rdquo;,
    totalCourses: 2,
    completedCourses: 0,
    inProgressCourses: 2,
    totalHours: 30,
    completedHours: 18,
    overallProgress: 60,
    certificates: 0,
    lastActivity: new Date(&ldquo;2024-02-27&rdquo;),
    enrolledCourses: [
      {
        courseId: &ldquo;course-1&rdquo;,
        courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
        instructor: &ldquo;Dr. Roberto Silva&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-20&rdquo;),
        progress: 85,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 13,
        certificateIssued: false,
      },
      {
        courseId: &ldquo;course-4&rdquo;,
        courseName: &ldquo;Tecnología para Jóvenes&rdquo;,
        instructor: &ldquo;Ing. Ana Gutierrez&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-05&rdquo;),
        progress: 45,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 8,
        certificateIssued: false,
      },
    ],
  },
  {
    id: &ldquo;student-3&rdquo;,
    name: &ldquo;Ana Gutiérrez&rdquo;,
    email: &ldquo;ana.gutierrez@email.com&rdquo;,
    avatar: &ldquo;/api/placeholder/60/60&rdquo;,
    age: 24,
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    phone: &ldquo;+591-4-3456789&rdquo;,
    enrollmentDate: new Date(&ldquo;2024-01-10&rdquo;),
    status: &ldquo;active&rdquo;,
    totalCourses: 4,
    completedCourses: 2,
    inProgressCourses: 2,
    totalHours: 60,
    completedHours: 48,
    overallProgress: 80,
    certificates: 2,
    lastActivity: new Date(&ldquo;2024-02-29&rdquo;),
    enrolledCourses: [
      {
        courseId: &ldquo;course-1&rdquo;,
        courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
        instructor: &ldquo;Dr. Roberto Silva&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-10&rdquo;),
        progress: 100,
        status: &ldquo;completed&rdquo;,
        grade: 92,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: &ldquo;course-2&rdquo;,
        courseName: &ldquo;Emprendimiento Digital&rdquo;,
        instructor: &ldquo;Lic. Carmen Rodriguez&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-15&rdquo;),
        progress: 100,
        status: &ldquo;completed&rdquo;,
        grade: 88,
        timeSpent: 18,
        certificateIssued: true,
      },
      {
        courseId: &ldquo;course-3&rdquo;,
        courseName: &ldquo;Finanzas Personales&rdquo;,
        instructor: &ldquo;Ing. Luis Mamani&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-01&rdquo;),
        progress: 55,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 8,
        certificateIssued: false,
      },
      {
        courseId: &ldquo;course-5&rdquo;,
        courseName: &ldquo;Liderazgo Juvenil&rdquo;,
        instructor: &ldquo;Psic. Patricia Sosa&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-10&rdquo;),
        progress: 25,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 7,
        certificateIssued: false,
      },
    ],
  },
  {
    id: &ldquo;student-4&rdquo;,
    name: &ldquo;Luis Vargas&rdquo;,
    email: &ldquo;luis.vargas@email.com&rdquo;,
    avatar: &ldquo;/api/placeholder/60/60&rdquo;,
    age: 20,
    location: &ldquo;Tarija, Bolivia&rdquo;,
    phone: &ldquo;+591-4-4567890&rdquo;,
    enrollmentDate: new Date(&ldquo;2024-02-01&rdquo;),
    status: &ldquo;active&rdquo;,
    totalCourses: 1,
    completedCourses: 0,
    inProgressCourses: 1,
    totalHours: 15,
    completedHours: 3,
    overallProgress: 20,
    certificates: 0,
    lastActivity: new Date(&ldquo;2024-02-25&rdquo;),
    enrolledCourses: [
      {
        courseId: &ldquo;course-1&rdquo;,
        courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
        instructor: &ldquo;Dr. Roberto Silva&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-01&rdquo;),
        progress: 20,
        status: &ldquo;in_progress&rdquo;,
        grade: null,
        timeSpent: 3,
        certificateIssued: false,
      },
    ],
  },
  {
    id: &ldquo;student-5&rdquo;,
    name: &ldquo;Patricia Sosa&rdquo;,
    email: &ldquo;patricia.sosa@email.com&rdquo;,
    avatar: &ldquo;/api/placeholder/60/60&rdquo;,
    age: 23,
    location: &ldquo;Potosí, Bolivia&rdquo;,
    phone: &ldquo;+591-2-5678901&rdquo;,
    enrollmentDate: new Date(&ldquo;2024-01-25&rdquo;),
    status: &ldquo;inactive&rdquo;,
    totalCourses: 2,
    completedCourses: 1,
    inProgressCourses: 0,
    totalHours: 30,
    completedHours: 15,
    overallProgress: 50,
    certificates: 1,
    lastActivity: new Date(&ldquo;2024-02-10&rdquo;),
    enrolledCourses: [
      {
        courseId: &ldquo;course-1&rdquo;,
        courseName: &ldquo;Habilidades Laborales Básicas&rdquo;,
        instructor: &ldquo;Dr. Roberto Silva&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-01-25&rdquo;),
        progress: 100,
        status: &ldquo;completed&rdquo;,
        grade: 87,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: &ldquo;course-2&rdquo;,
        courseName: &ldquo;Emprendimiento Digital&rdquo;,
        instructor: &ldquo;Lic. Carmen Rodriguez&rdquo;,
        enrollmentDate: new Date(&ldquo;2024-02-01&rdquo;),
        progress: 15,
        status: &ldquo;dropped&rdquo;,
        grade: null,
        timeSpent: 2,
        certificateIssued: false,
      },
    ],
  },
];

// GET /api/admin/students - List and filter students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get(&ldquo;search&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const course = searchParams.get(&ldquo;course&rdquo;);
    const sortBy = searchParams.get(&ldquo;sortBy&rdquo;) || &ldquo;name&rdquo;;
    const sortOrder = searchParams.get(&ldquo;sortOrder&rdquo;) || &ldquo;asc&rdquo;;
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

    let filtered = [...students];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase()) ||
          student.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status && status !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((student) => student.status === status);
    }

    // Apply course filter
    if (course && course !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((student) =>
        student.enrolledCourses.some(
          (enrollment) => enrollment.courseId === course
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case &ldquo;name&rdquo;:
          aValue = a.name;
          bValue = b.name;
          break;
        case &ldquo;enrollmentDate&rdquo;:
          aValue = new Date(a.enrollmentDate);
          bValue = new Date(b.enrollmentDate);
          break;
        case &ldquo;progress&rdquo;:
          aValue = a.overallProgress;
          bValue = b.overallProgress;
          break;
        case &ldquo;courses&rdquo;:
          aValue = a.totalCourses;
          bValue = b.totalCourses;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortOrder === &ldquo;asc&rdquo; ? -1 : 1;
      if (aValue > bValue) return sortOrder === &ldquo;asc&rdquo; ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      active: students.filter((s) => s.status === &ldquo;active&rdquo;).length,
      inactive: students.filter((s) => s.status === &ldquo;inactive&rdquo;).length,
      totalEnrollments: students.reduce((sum, s) => sum + s.totalCourses, 0),
      totalCertificates: students.reduce((sum, s) => sum + s.certificates, 0),
      averageProgress:
        students.reduce((sum, s) => sum + s.overallProgress, 0) /
        students.length,
      totalHoursStudied: students.reduce((sum, s) => sum + s.completedHours, 0),
      completionRate:
        (students.reduce((sum, s) => sum + s.completedCourses, 0) /
          students.reduce((sum, s) => sum + s.totalCourses, 0)) *
        100,
    };

    return NextResponse.json({
      students: paginatedStudents,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error(&ldquo;Error fetching students:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener estudiantes&rdquo; },
      { status: 500 }
    );
  }
}

// POST /api/admin/students - Create new student enrollment (if needed)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [&ldquo;name&rdquo;, &ldquo;email&rdquo;];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Create new student
    const newStudent = {
      id: `student-${Date.now()}`,
      ...data,
      enrollmentDate: new Date(),
      status: data.status || &ldquo;active&rdquo;,
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalHours: 0,
      completedHours: 0,
      overallProgress: 0,
      certificates: 0,
      lastActivity: new Date(),
      enrolledCourses: [],
    };

    // In real app, this would save to database using Prisma
    students.push(newStudent);

    return NextResponse.json(
      {
        message: &ldquo;Estudiante creado exitosamente&rdquo;,
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating student:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear estudiante&rdquo; },
      { status: 500 }
    );
  }
}
