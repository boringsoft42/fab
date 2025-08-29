import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in real app this would come from Prisma/database
const students = [
  {
    id: "student-1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    avatar: "/api/placeholder/60/60",
    age: 22,
    location: "Santa Cruz, Bolivia",
    phone: "+591-3-1234567",
    enrollmentDate: new Date("2024-01-15"),
    status: "active",
    totalCourses: 3,
    completedCourses: 1,
    inProgressCourses: 2,
    totalHours: 45,
    completedHours: 32,
    overallProgress: 71,
    certificates: 1,
    lastActivity: new Date("2024-02-28"),
    enrolledCourses: [
      {
        courseId: "course-1",
        courseName: "Habilidades Laborales Básicas",
        instructor: "Dr. Roberto Silva",
        enrollmentDate: new Date("2024-01-15"),
        progress: 100,
        status: "completed",
        grade: 95,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: "course-2",
        courseName: "Emprendimiento Digital",
        instructor: "Lic. Carmen Rodriguez",
        enrollmentDate: new Date("2024-01-20"),
        progress: 65,
        status: "in_progress",
        grade: null,
        timeSpent: 12,
        certificateIssued: false,
      },
      {
        courseId: "course-3",
        courseName: "Finanzas Personales",
        instructor: "Ing. Luis Mamani",
        enrollmentDate: new Date("2024-02-01"),
        progress: 30,
        status: "in_progress",
        grade: null,
        timeSpent: 5,
        certificateIssued: false,
      },
    ],
  },
  {
    id: "student-2",
    name: "Carlos Mamani",
    email: "carlos.mamani@email.com",
    avatar: "/api/placeholder/60/60",
    age: 19,
    location: "La Paz, Bolivia",
    phone: "+591-2-2345678",
    enrollmentDate: new Date("2024-01-20"),
    status: "active",
    totalCourses: 2,
    completedCourses: 0,
    inProgressCourses: 2,
    totalHours: 30,
    completedHours: 18,
    overallProgress: 60,
    certificates: 0,
    lastActivity: new Date("2024-02-27"),
    enrolledCourses: [
      {
        courseId: "course-1",
        courseName: "Habilidades Laborales Básicas",
        instructor: "Dr. Roberto Silva",
        enrollmentDate: new Date("2024-01-20"),
        progress: 85,
        status: "in_progress",
        grade: null,
        timeSpent: 13,
        certificateIssued: false,
      },
      {
        courseId: "course-4",
        courseName: "Tecnología para Jóvenes",
        instructor: "Ing. Ana Gutierrez",
        enrollmentDate: new Date("2024-02-05"),
        progress: 45,
        status: "in_progress",
        grade: null,
        timeSpent: 8,
        certificateIssued: false,
      },
    ],
  },
  {
    id: "student-3",
    name: "Ana Gutiérrez",
    email: "ana.gutierrez@email.com",
    avatar: "/api/placeholder/60/60",
    age: 24,
    location: "Cochabamba, Bolivia",
    phone: "+591-4-3456789",
    enrollmentDate: new Date("2024-01-10"),
    status: "active",
    totalCourses: 4,
    completedCourses: 2,
    inProgressCourses: 2,
    totalHours: 60,
    completedHours: 48,
    overallProgress: 80,
    certificates: 2,
    lastActivity: new Date("2024-02-29"),
    enrolledCourses: [
      {
        courseId: "course-1",
        courseName: "Habilidades Laborales Básicas",
        instructor: "Dr. Roberto Silva",
        enrollmentDate: new Date("2024-01-10"),
        progress: 100,
        status: "completed",
        grade: 92,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: "course-2",
        courseName: "Emprendimiento Digital",
        instructor: "Lic. Carmen Rodriguez",
        enrollmentDate: new Date("2024-01-15"),
        progress: 100,
        status: "completed",
        grade: 88,
        timeSpent: 18,
        certificateIssued: true,
      },
      {
        courseId: "course-3",
        courseName: "Finanzas Personales",
        instructor: "Ing. Luis Mamani",
        enrollmentDate: new Date("2024-02-01"),
        progress: 55,
        status: "in_progress",
        grade: null,
        timeSpent: 8,
        certificateIssued: false,
      },
      {
        courseId: "course-5",
        courseName: "Liderazgo Juvenil",
        instructor: "Psic. Patricia Sosa",
        enrollmentDate: new Date("2024-02-10"),
        progress: 25,
        status: "in_progress",
        grade: null,
        timeSpent: 7,
        certificateIssued: false,
      },
    ],
  },
  {
    id: "student-4",
    name: "Luis Vargas",
    email: "luis.vargas@email.com",
    avatar: "/api/placeholder/60/60",
    age: 20,
    location: "Tarija, Bolivia",
    phone: "+591-4-4567890",
    enrollmentDate: new Date("2024-02-01"),
    status: "active",
    totalCourses: 1,
    completedCourses: 0,
    inProgressCourses: 1,
    totalHours: 15,
    completedHours: 3,
    overallProgress: 20,
    certificates: 0,
    lastActivity: new Date("2024-02-25"),
    enrolledCourses: [
      {
        courseId: "course-1",
        courseName: "Habilidades Laborales Básicas",
        instructor: "Dr. Roberto Silva",
        enrollmentDate: new Date("2024-02-01"),
        progress: 20,
        status: "in_progress",
        grade: null,
        timeSpent: 3,
        certificateIssued: false,
      },
    ],
  },
  {
    id: "student-5",
    name: "Patricia Sosa",
    email: "patricia.sosa@email.com",
    avatar: "/api/placeholder/60/60",
    age: 23,
    location: "Potosí, Bolivia",
    phone: "+591-2-5678901",
    enrollmentDate: new Date("2024-01-25"),
    status: "inactive",
    totalCourses: 2,
    completedCourses: 1,
    inProgressCourses: 0,
    totalHours: 30,
    completedHours: 15,
    overallProgress: 50,
    certificates: 1,
    lastActivity: new Date("2024-02-10"),
    enrolledCourses: [
      {
        courseId: "course-1",
        courseName: "Habilidades Laborales Básicas",
        instructor: "Dr. Roberto Silva",
        enrollmentDate: new Date("2024-01-25"),
        progress: 100,
        status: "completed",
        grade: 87,
        timeSpent: 15,
        certificateIssued: true,
      },
      {
        courseId: "course-2",
        courseName: "Emprendimiento Digital",
        instructor: "Lic. Carmen Rodriguez",
        enrollmentDate: new Date("2024-02-01"),
        progress: 15,
        status: "dropped",
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
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const course = searchParams.get("course");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

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
    if (status && status !== "all") {
      filtered = filtered.filter((student) => student.status === status);
    }

    // Apply course filter
    if (course && course !== "all") {
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
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "enrollmentDate":
          aValue = new Date(a.enrollmentDate);
          bValue = new Date(b.enrollmentDate);
          break;
        case "progress":
          aValue = a.overallProgress;
          bValue = b.overallProgress;
          break;
        case "courses":
          aValue = a.totalCourses;
          bValue = b.totalCourses;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      active: students.filter((s) => s.status === "active").length,
      inactive: students.filter((s) => s.status === "inactive").length,
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
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Error al obtener estudiantes" },
      { status: 500 }
    );
  }
}

// POST /api/admin/students - Create new student enrollment (if needed)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email"];
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
      status: data.status || "active",
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
        message: "Estudiante creado exitosamente",
        student: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Error al crear estudiante" },
      { status: 500 }
    );
  }
}
