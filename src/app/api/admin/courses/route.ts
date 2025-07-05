import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { CourseCategory, CourseLevel } from &ldquo;@/types/courses&rdquo;;

// Mock data for demonstration
const mockCourses = [
  {
    id: &ldquo;course-1&rdquo;,
    title: &ldquo;Habilidades Laborales Básicas&rdquo;,
    slug: &ldquo;habilidades-laborales-basicas&rdquo;,
    description:
      &ldquo;Curso completo sobre competencias fundamentales para el trabajo&rdquo;,
    shortDescription:
      &ldquo;Desarrolla las competencias esenciales para el éxito laboral&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/300&rdquo;,
    instructor: {
      id: &ldquo;instructor-1&rdquo;,
      name: &ldquo;Dra. Ana Pérez&rdquo;,
      title: &ldquo;Especialista en Desarrollo Profesional&rdquo;,
      avatar: &ldquo;/api/placeholder/80/80&rdquo;,
      bio: &ldquo;Experta en desarrollo de habilidades laborales&rdquo;,
      rating: 4.8,
      totalStudents: 2847,
      totalCourses: 12,
    },
    institution: &ldquo;Centro de Capacitación Municipal&rdquo;,
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
      &ldquo;Desarrollar comunicación efectiva&rdquo;,
      &ldquo;Fortalecer trabajo en equipo&rdquo;,
    ],
    prerequisites: [&ldquo;Ninguno&rdquo;],
    includedMaterials: [
      &ldquo;Videos&rdquo;,
      &ldquo;Material de lectura&rdquo;,
      &ldquo;Ejercicios prácticos&rdquo;,
    ],
    certification: true,
    tags: [&ldquo;habilidades&rdquo;, &ldquo;trabajo&rdquo;, &ldquo;comunicación&rdquo;],
    createdAt: new Date(&ldquo;2024-01-15&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-20&rdquo;),
    publishedAt: new Date(&ldquo;2024-01-20&rdquo;),
  },
  {
    id: &ldquo;course-2&rdquo;,
    title: &ldquo;Emprendimiento Digital&rdquo;,
    slug: &ldquo;emprendimiento-digital&rdquo;,
    description: &ldquo;Aprende a crear y gestionar negocios digitales&rdquo;,
    shortDescription: &ldquo;Inicia tu camino emprendedor en el mundo digital&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/300&rdquo;,
    instructor: {
      id: &ldquo;instructor-2&rdquo;,
      name: &ldquo;Carlos Mendoza&rdquo;,
      title: &ldquo;Consultor en Emprendimiento&rdquo;,
      avatar: &ldquo;/api/placeholder/80/80&rdquo;,
      bio: &ldquo;Especialista en negocios digitales&rdquo;,
      rating: 4.6,
      totalStudents: 1523,
      totalCourses: 8,
    },
    institution: &ldquo;Centro de Capacitación Municipal&rdquo;,
    category: CourseCategory.ENTREPRENEURSHIP,
    level: CourseLevel.INTERMEDIATE,
    duration: 12,
    totalLessons: 20,
    rating: 4.6,
    studentCount: 1523,
    price: 0,
    isMandatory: false,
    isActive: true,
    objectives: [&ldquo;Crear plan de negocios&rdquo;, &ldquo;Desarrollar MVP&rdquo;],
    prerequisites: [&ldquo;Conocimientos básicos de computación&rdquo;],
    includedMaterials: [&ldquo;Videos&rdquo;, &ldquo;Plantillas&rdquo;, &ldquo;Casos de estudio&rdquo;],
    certification: true,
    tags: [&ldquo;emprendimiento&rdquo;, &ldquo;digital&rdquo;, &ldquo;negocios&rdquo;],
    createdAt: new Date(&ldquo;2024-02-01&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-25&rdquo;),
    publishedAt: new Date(&ldquo;2024-02-05&rdquo;),
  },
  {
    id: &ldquo;course-3&rdquo;,
    title: &ldquo;Alfabetización Digital Básica&rdquo;,
    slug: &ldquo;alfabetizacion-digital-basica&rdquo;,
    description: &ldquo;Competencias digitales fundamentales para el siglo XXI&rdquo;,
    shortDescription: &ldquo;Aprende las herramientas digitales esenciales&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/300&rdquo;,
    instructor: {
      id: &ldquo;instructor-3&rdquo;,
      name: &ldquo;Ing. María Rodríguez&rdquo;,
      title: &ldquo;Especialista en Tecnología Educativa&rdquo;,
      avatar: &ldquo;/api/placeholder/80/80&rdquo;,
      bio: &ldquo;Experta en alfabetización digital&rdquo;,
      rating: 4.9,
      totalStudents: 3254,
      totalCourses: 15,
    },
    institution: &ldquo;Centro de Capacitación Municipal&rdquo;,
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
      &ldquo;Usar herramientas de oficina&rdquo;,
      &ldquo;Navegar internet de forma segura&rdquo;,
    ],
    prerequisites: [&ldquo;Conocimientos básicos de computación&rdquo;],
    includedMaterials: [
      &ldquo;Videos tutoriales&rdquo;,
      &ldquo;Ejercicios prácticos&rdquo;,
      &ldquo;Recursos digitales&rdquo;,
    ],
    certification: true,
    tags: [&ldquo;digital&rdquo;, &ldquo;tecnología&rdquo;, &ldquo;básico&rdquo;],
    createdAt: new Date(&ldquo;2024-01-10&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-15&rdquo;),
    publishedAt: new Date(&ldquo;2024-01-15&rdquo;),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get(&ldquo;query&rdquo;);
    const category = searchParams.get(&ldquo;category&rdquo;);
    const level = searchParams.get(&ldquo;level&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);

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

    if (category && category !== &ldquo;all&rdquo;) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === category
      );
    }

    if (level && level !== &ldquo;all&rdquo;) {
      filteredCourses = filteredCourses.filter(
        (course) => course.level === level
      );
    }

    if (status && status !== &ldquo;all&rdquo;) {
      filteredCourses = filteredCourses.filter((course) => {
        if (status === &ldquo;active&rdquo;) return course.isActive;
        if (status === &ldquo;inactive&rdquo;) return !course.isActive;
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
    console.error(&ldquo;Error fetching courses:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
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
        { error: &ldquo;Faltan campos requeridos&rdquo; },
        { status: 400 }
      );
    }

    // Create new course (mock implementation)
    const newCourse = {
      id: `course-${Date.now()}`,
      slug: courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, &ldquo;&rdquo;)
        .replace(/\s+/g, &ldquo;-&rdquo;)
        .replace(/-+/g, &ldquo;-&rdquo;)
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
    console.error(&ldquo;Error creating course:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}
