import { NextRequest, NextResponse } from "next/server";
import {
  Course,
  CourseCategory,
  CourseLevel,
  CourseCatalogResponse,
  CourseSearchParams,
  Instructor,
} from "@/types/courses";

// Mock instructors data
const mockInstructors: Record<string, Instructor> = {
  "maria-lopez": {
    id: "maria-lopez",
    name: "María López",
    title: "Especialista en Desarrollo Personal",
    avatar: "/api/placeholder/100/100",
    bio: "Psicóloga con 15 años de experiencia en desarrollo de habilidades blandas y empoderamiento juvenil.",
    rating: 4.8,
    totalStudents: 2500,
    totalCourses: 8,
    socialLinks: {
      linkedin: "https://linkedin.com/in/marialopez",
      website: "https://marialopez.dev",
    },
  },
  "carlos-rivera": {
    id: "carlos-rivera",
    name: "Carlos Rivera",
    title: "Especialista en Competencias Básicas",
    avatar: "/api/placeholder/100/100",
    bio: "Educador con 20 años formando competencias básicas en matemáticas y comunicación.",
    rating: 4.9,
    totalStudents: 3200,
    totalCourses: 5,
    socialLinks: {
      linkedin: "https://linkedin.com/in/carlosrivera",
    },
  },
  "ana-garcia": {
    id: "ana-garcia",
    name: "Ana García",
    title: "Consultora en Recursos Humanos",
    avatar: "/api/placeholder/100/100",
    bio: "Especialista en inserción laboral y desarrollo profesional con 12 años de experiencia.",
    rating: 4.7,
    totalStudents: 1800,
    totalCourses: 6,
    socialLinks: {
      linkedin: "https://linkedin.com/in/anagarcia",
      website: "https://anagarcia.consulting",
    },
  },
  "luis-mendoza": {
    id: "luis-mendoza",
    name: "Luis Mendoza",
    title: "Emprendedor y Mentor de Negocios",
    avatar: "/api/placeholder/100/100",
    bio: "Fundador de 3 empresas exitosas, mentor de emprendedores durante 10 años.",
    rating: 4.9,
    totalStudents: 2100,
    totalCourses: 7,
    socialLinks: {
      linkedin: "https://linkedin.com/in/luismendoza",
      twitter: "https://twitter.com/luismendoza",
      website: "https://luismendoza.business",
    },
  },
  "sofia-torres": {
    id: "sofia-torres",
    name: "Sofía Torres",
    title: "Especialista en Tecnología Educativa",
    avatar: "/api/placeholder/100/100",
    bio: "Ingeniera en sistemas especializada en capacitación tecnológica y transformación digital.",
    rating: 4.8,
    totalStudents: 2800,
    totalCourses: 9,
    socialLinks: {
      linkedin: "https://linkedin.com/in/sofiatorres",
      website: "https://sofiatorres.tech",
    },
  },
};

// Mock courses data
const mockCourses: Course[] = [
  {
    id: "soft-skills-empowerment",
    title: "Habilidades Blandas y Empoderamiento Personal",
    slug: "habilidades-blandas-empoderamiento",
    description: `Un curso integral diseñado para desarrollar las habilidades blandas esenciales que todo joven necesita para el éxito personal y profesional. 

Este curso te llevará a través de un viaje de autodescubrimiento y crecimiento personal, donde aprenderás a:
- Fortalecer tu autoestima y confianza personal
- Desarrollar resiliencia ante los desafíos
- Cultivar habilidades de liderazgo efectivo
- Tomar decisiones informadas y estratégicas
- Trabajar en equipo y construir relaciones sólidas

Con metodologías interactivas, casos prácticos y ejercicios de autorreflexión, este curso te preparará para enfrentar cualquier desafío con seguridad y determinación.`,
    shortDescription:
      "Desarrolla habilidades blandas esenciales: autoestima, liderazgo, resiliencia y trabajo en equipo.",
    thumbnail: "/api/placeholder/400/250",
    videoPreview: "/api/placeholder/video/preview1",
    instructor: mockInstructors["maria-lopez"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.SOFT_SKILLS,
    level: CourseLevel.BEGINNER,
    duration: 20,
    totalLessons: 30,
    rating: 4.8,
    studentCount: 2450,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Fortalecer la autoestima y confianza personal",
      "Desarrollar habilidades de liderazgo efectivo",
      "Cultivar la resiliencia ante desafíos",
      "Mejorar la toma de decisiones",
      "Potenciar el espíritu emprendedor",
      "Desarrollar planes de crecimiento personal",
    ],
    prerequisites: [],
    includedMaterials: [
      "Videos interactivos (20 horas)",
      "Ejercicios de autoevaluación",
      "Plantillas de desarrollo personal",
      "Casos de estudio reales",
      "Certificado oficial",
    ],
    certification: true,
    tags: [
      "habilidades blandas",
      "liderazgo",
      "autoestima",
      "emprendimiento",
      "desarrollo personal",
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
    publishedAt: new Date("2024-01-20"),
  },
  {
    id: "basic-competencies",
    title: "Competencias Básicas Fundamentales",
    slug: "competencias-basicas-fundamentales",
    description: `Fortalece tus competencias básicas en comunicación y matemáticas con este curso práctico y dinámico.

Diseñado especialmente para jóvenes que desean mejorar sus habilidades fundamentales, este curso cubre:
- Alfabetización digital y tradicional
- Comunicación efectiva oral y escrita
- Matemáticas aplicadas al día a día
- Regla de 3 y cálculos de porcentajes
- Resolución de problemas cotidianos

Con ejercicios interactivos y aplicaciones prácticas, desarrollarás las competencias esenciales para el mundo laboral y la vida diaria.`,
    shortDescription:
      "Fortalece competencias básicas en comunicación, matemáticas y resolución de problemas.",
    thumbnail: "/api/placeholder/400/250",
    instructor: mockInstructors["carlos-rivera"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.BASIC_COMPETENCIES,
    level: CourseLevel.BEGINNER,
    duration: 5,
    totalLessons: 15,
    rating: 4.9,
    studentCount: 3180,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Mejorar la comunicación oral y escrita",
      "Dominar operaciones matemáticas básicas",
      "Aplicar la regla de 3 en situaciones reales",
      "Calcular porcentajes correctamente",
      "Desarrollar pensamiento lógico",
    ],
    prerequisites: [],
    includedMaterials: [
      "Videos explicativos (5 horas)",
      "Ejercicios prácticos interactivos",
      "Calculadora de regla de 3",
      "Simuladores matemáticos",
      "Evaluaciones automáticas",
    ],
    certification: true,
    tags: [
      "matemáticas",
      "comunicación",
      "competencias básicas",
      "regla de 3",
      "porcentajes",
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-15"),
    publishedAt: new Date("2024-01-15"),
  },
  {
    id: "job-placement-skills",
    title: "Inserción Laboral y Técnicas de Búsqueda de Empleo",
    slug: "insercion-laboral-busqueda-empleo",
    description: `Prepárate para ingresar al mundo laboral con confianza y las herramientas correctas.

Este curso te equipará con todo lo necesario para una búsqueda de empleo exitosa:
- Conocimiento completo de derechos y deberes laborales
- Creación de CV profesional y atractivo
- Redacción de cartas de presentación efectivas
- Técnicas avanzadas para entrevistas de trabajo
- Simulador de entrevistas con IA para práctica real

Incluye casos reales, plantillas profesionales y acceso a nuestro innovador simulador de entrevistas impulsado por inteligencia artificial.`,
    shortDescription:
      "Domina la búsqueda de empleo: CV, entrevistas, derechos laborales y simulador con IA.",
    thumbnail: "/api/placeholder/400/250",
    instructor: mockInstructors["ana-garcia"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.JOB_PLACEMENT,
    level: CourseLevel.INTERMEDIATE,
    duration: 8,
    totalLessons: 20,
    rating: 4.7,
    studentCount: 1750,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Conocer derechos y deberes laborales",
      "Crear CV profesional efectivo",
      "Redactar cartas de presentación persuasivas",
      "Dominar técnicas de entrevista",
      "Practicar con simulador de IA",
      "Desarrollar presencia profesional",
    ],
    prerequisites: [],
    includedMaterials: [
      "Videos de capacitación (8 horas)",
      "Plantillas de CV profesionales",
      "Generador de cartas de presentación",
      "Simulador de entrevistas con IA",
      "Guía de derechos laborales",
      "Casos de estudio reales",
    ],
    certification: true,
    tags: [
      "inserción laboral",
      "CV",
      "entrevistas",
      "derechos laborales",
      "búsqueda empleo",
      "IA",
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-25"),
    publishedAt: new Date("2024-01-25"),
  },
  {
    id: "entrepreneurship-fundamentals",
    title: "Fundamentos de Emprendimiento y Desarrollo de Negocios",
    slug: "fundamentos-emprendimiento-negocios",
    description: `Transforma tu idea en un negocio exitoso con este curso completo de emprendimiento.

Aprenderás paso a paso cómo desarrollar y lanzar tu propio emprendimiento:
- Desarrollo de plan de negocios profesional
- Estrategias de marketing para emprendedores
- Finanzas básicas y gestión de recursos
- Validación de ideas de negocio
- Herramientas digitales para emprendedores

Con casos de estudio de emprendedores bolivianos exitosos y herramientas prácticas que podrás aplicar inmediatamente en tu proyecto.`,
    shortDescription:
      "Aprende a crear y gestionar tu propio negocio: plan de negocios, marketing y finanzas.",
    thumbnail: "/api/placeholder/400/250",
    instructor: mockInstructors["luis-mendoza"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.ENTREPRENEURSHIP,
    level: CourseLevel.INTERMEDIATE,
    duration: 12,
    totalLessons: 25,
    rating: 4.9,
    studentCount: 2050,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Desarrollar plan de negocios completo",
      "Crear estrategias de marketing efectivas",
      "Manejar finanzas básicas empresariales",
      "Validar ideas de negocio",
      "Usar herramientas digitales",
      "Analizar casos de éxito locales",
    ],
    prerequisites: [],
    includedMaterials: [
      "Videos instructivos (12 horas)",
      "Plantilla de plan de negocios",
      "Calculadora financiera",
      "Casos de estudio bolivianos",
      "Herramientas de validación",
      "Templates de marketing",
    ],
    certification: true,
    tags: [
      "emprendimiento",
      "plan de negocios",
      "marketing",
      "finanzas",
      "startup",
      "Bolivia",
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-01"),
    publishedAt: new Date("2024-02-05"),
  },
  {
    id: "technical-skills-digital",
    title: "Habilidades Técnicas y Competencias Digitales",
    slug: "habilidades-tecnicas-competencias-digitales",
    description: `Desarrolla las habilidades técnicas y digitales más demandadas en el mercado laboral actual.

Este curso te capacitará en:
- Herramientas digitales esenciales
- Técnicas de ventas y atención al cliente
- Gestión de inventarios y control de stock
- Regulaciones técnicas importantes
- Plataformas digitales especializadas

Incluye acceso a recursos externos especializados y certificaciones reconocidas por la industria.`,
    shortDescription:
      "Domina herramientas digitales, ventas, gestión de inventarios y regulaciones técnicas.",
    thumbnail: "/api/placeholder/400/250",
    instructor: mockInstructors["sofia-torres"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.TECHNICAL_SKILLS,
    level: CourseLevel.BEGINNER,
    duration: 15,
    totalLessons: 35,
    rating: 4.8,
    studentCount: 2750,
    price: 0,
    isMandatory: true,
    isActive: true,
    objectives: [
      "Manejar herramientas digitales esenciales",
      "Desarrollar técnicas de ventas efectivas",
      "Gestionar inventarios eficientemente",
      "Conocer regulaciones técnicas",
      "Usar plataformas especializadas",
    ],
    prerequisites: [],
    includedMaterials: [
      "Videos tutoriales (15 horas)",
      "Software y herramientas digitales",
      "Simulador de ventas",
      "Sistema de gestión de inventarios",
      "Enlaces a cursos especializados",
      "Certificaciones industriales",
    ],
    certification: true,
    tags: [
      "habilidades técnicas",
      "digital",
      "ventas",
      "inventarios",
      "regulaciones",
      "tecnología",
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-05"),
    publishedAt: new Date("2024-02-15"),
  },
  // Additional non-mandatory courses
  {
    id: "digital-literacy-advanced",
    title: "Alfabetización Digital Avanzada",
    slug: "alfabetizacion-digital-avanzada",
    description: "Curso avanzado de competencias digitales para el siglo XXI.",
    shortDescription:
      "Competencias digitales avanzadas para profesionales modernos.",
    thumbnail: "/api/placeholder/400/250",
    instructor: mockInstructors["sofia-torres"],
    institution: "Centro de Formación CEMSE",
    category: CourseCategory.DIGITAL_LITERACY,
    level: CourseLevel.ADVANCED,
    duration: 10,
    totalLessons: 20,
    rating: 4.6,
    studentCount: 890,
    price: 150,
    isMandatory: false,
    isActive: true,
    objectives: [
      "Dominar herramientas digitales avanzadas",
      "Desarrollar pensamiento computacional",
      "Crear contenido digital profesional",
    ],
    prerequisites: ["basic-competencies"],
    includedMaterials: [
      "Videos HD (10 horas)",
      "Software especializado",
      "Proyectos prácticos",
    ],
    certification: true,
    tags: ["digital", "avanzado", "tecnología", "competencias"],
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
    publishedAt: new Date("2024-02-25"),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const duration = searchParams.get("duration");
    const price = searchParams.get("price");
    const rating = searchParams.get("rating");
    const isFree = searchParams.get("isFree");
    const isMandatory = searchParams.get("isMandatory");
    const instructor = searchParams.get("instructor");
    const sortBy = searchParams.get("sortBy") || "popularity";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let filteredCourses = [...mockCourses];

    // Apply filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerQuery) ||
          course.description.toLowerCase().includes(lowerQuery) ||
          course.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          course.instructor.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (category) {
      const categories = category.split(",") as CourseCategory[];
      filteredCourses = filteredCourses.filter((course) =>
        categories.includes(course.category)
      );
    }

    if (level) {
      const levels = level.split(",") as CourseLevel[];
      filteredCourses = filteredCourses.filter((course) =>
        levels.includes(course.level)
      );
    }

    if (duration) {
      const [min, max] = duration.split("-").map(Number);
      filteredCourses = filteredCourses.filter(
        (course) => course.duration >= min && course.duration <= max
      );
    }

    if (price) {
      const [min, max] = price.split("-").map(Number);
      filteredCourses = filteredCourses.filter(
        (course) => course.price >= min && course.price <= max
      );
    }

    if (rating) {
      const minRating = parseFloat(rating);
      filteredCourses = filteredCourses.filter(
        (course) => course.rating >= minRating
      );
    }

    if (isFree === "true") {
      filteredCourses = filteredCourses.filter((course) => course.price === 0);
    }

    if (isMandatory === "true") {
      filteredCourses = filteredCourses.filter((course) => course.isMandatory);
    } else if (isMandatory === "false") {
      filteredCourses = filteredCourses.filter((course) => !course.isMandatory);
    }

    if (instructor) {
      filteredCourses = filteredCourses.filter(
        (course) => course.instructor.id === instructor
      );
    }

    // Apply sorting
    filteredCourses.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "popularity":
          comparison = b.studentCount - a.studentCount;
          break;
        case "date":
          comparison =
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime();
          break;
        case "rating":
          comparison = b.rating - a.rating;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "duration":
          comparison = a.duration - b.duration;
          break;
        default:
          comparison = b.studentCount - a.studentCount;
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });

    // Pagination
    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Generate filter counts
    const categoryStats = Object.values(CourseCategory).map((cat) => ({
      value: cat,
      count: mockCourses.filter((course) => course.category === cat).length,
    }));

    const levelStats = Object.values(CourseLevel).map((lvl) => ({
      value: lvl,
      count: mockCourses.filter((course) => course.level === lvl).length,
    }));

    const instructorStats = Object.values(mockInstructors).map((inst) => ({
      value: inst.id,
      count: mockCourses.filter((course) => course.instructor.id === inst.id)
        .length,
    }));

    const allTags = [...new Set(mockCourses.flatMap((course) => course.tags))];
    const tagStats = allTags.map((tag) => ({
      value: tag,
      count: mockCourses.filter((course) => course.tags.includes(tag)).length,
    }));

    const response: CourseCatalogResponse = {
      courses: paginatedCourses,
      total,
      page,
      totalPages,
      filters: {
        categories: categoryStats,
        levels: levelStats,
        instructors: instructorStats,
        tags: tagStats,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
