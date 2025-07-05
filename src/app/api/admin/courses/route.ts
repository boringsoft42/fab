import { NextRequest, NextResponse } from "next/server";
import { CourseCategory, CourseLevel } from "@/types/courses";

// Mock data for demonstration
const mockCourses = [
  {
    id: "course-1",
    title: "Habilidades Laborales Básicas",
    slug: "habilidades-laborales-basicas",
    description:
      "Curso completo sobre competencias fundamentales para el trabajo",
    shortDescription:
      "Desarrolla las competencias esenciales para el éxito laboral",
    thumbnail: "/api/placeholder/400/300",
    instructor: {
      id: "instructor-1",
      name: "Dra. Ana Pérez",
      title: "Especialista en Desarrollo Profesional",
      avatar: "/api/placeholder/80/80",
      bio: "Experta en desarrollo de habilidades laborales",
      rating: 4.8,
      totalStudents: 2847,
      totalCourses: 12,
    },
    institution: "Centro de Capacitación Municipal",
    category: CourseCategory.SOFT_SKILLS,
    level: CourseLevel.BEGINNER,
    duration: 8,
    totalLessons: 15,
    rating: 4.8,
    studentCount: 2847,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Desarrollar comunicación efectiva",
      "Fortalecer trabajo en equipo",
    ],
    prerequisites: ["Ninguno"],
    includedMaterials: [
      "Videos",
      "Material de lectura",
      "Ejercicios prácticos",
    ],
    certification: true,
    tags: ["habilidades", "trabajo", "comunicación"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
    publishedAt: new Date("2024-01-20"),
  },
  {
    id: "course-2",
    title: "Emprendimiento Digital",
    slug: "emprendimiento-digital",
    description: "Aprende a crear y gestionar negocios digitales",
    shortDescription: "Inicia tu camino emprendedor en el mundo digital",
    thumbnail: "/api/placeholder/400/300",
    instructor: {
      id: "instructor-2",
      name: "Carlos Mendoza",
      title: "Consultor en Emprendimiento",
      avatar: "/api/placeholder/80/80",
      bio: "Especialista en negocios digitales",
      rating: 4.6,
      totalStudents: 1523,
      totalCourses: 8,
    },
    institution: "Centro de Capacitación Municipal",
    category: CourseCategory.ENTREPRENEURSHIP,
    level: CourseLevel.INTERMEDIATE,
    duration: 12,
    totalLessons: 20,
    rating: 4.6,
    studentCount: 1523,
    price: 0,
    isMandatory: false,
    isActive: true,
    objectives: ["Crear plan de negocios", "Desarrollar MVP"],
    prerequisites: ["Conocimientos básicos de computación"],
    includedMaterials: ["Videos", "Plantillas", "Casos de estudio"],
    certification: true,
    tags: ["emprendimiento", "digital", "negocios"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-25"),
    publishedAt: new Date("2024-02-05"),
  },
  {
    id: "course-3",
    title: "Alfabetización Digital Básica",
    slug: "alfabetizacion-digital-basica",
    description: "Competencias digitales fundamentales para el siglo XXI",
    shortDescription: "Aprende las herramientas digitales esenciales",
    thumbnail: "/api/placeholder/400/300",
    instructor: {
      id: "instructor-3",
      name: "Ing. María Rodríguez",
      title: "Especialista en Tecnología Educativa",
      avatar: "/api/placeholder/80/80",
      bio: "Experta en alfabetización digital",
      rating: 4.9,
      totalStudents: 3254,
      totalCourses: 15,
    },
    institution: "Centro de Capacitación Municipal",
    category: CourseCategory.DIGITAL_LITERACY,
    level: CourseLevel.BEGINNER,
    duration: 6,
    totalLessons: 12,
    rating: 4.9,
    studentCount: 3254,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Usar herramientas de oficina",
      "Navegar internet de forma segura",
    ],
    prerequisites: ["Conocimientos básicos de computación"],
    includedMaterials: [
      "Videos tutoriales",
      "Ejercicios prácticos",
      "Recursos digitales",
    ],
    certification: true,
    tags: ["digital", "tecnología", "básico"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-15"),
    publishedAt: new Date("2024-01-15"),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let filteredCourses = [...mockCourses];

    // Apply filters
    if (query) {
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category && category !== "all") {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === category
      );
    }

    if (level && level !== "all") {
      filteredCourses = filteredCourses.filter(
        (course) => course.level === level
      );
    }

    if (status && status !== "all") {
      filteredCourses = filteredCourses.filter((course) => {
        if (status === "active") return course.isActive;
        if (status === "inactive") return !course.isActive;
        return true;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      courses: paginatedCourses,
      total: filteredCourses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCourses.length / limit),
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json();

    // Validate required fields
    if (!courseData.title || !courseData.category || !courseData.level) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Create new course (mock implementation)
    const newCourse = {
      id: `course-${Date.now()}`,
      slug: courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
      rating: 0,
      studentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: courseData.isActive ? new Date() : null,
      ...courseData,
    };

    // In a real implementation, you would save to database using Prisma
    // await prisma.course.create({ data: newCourse });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
