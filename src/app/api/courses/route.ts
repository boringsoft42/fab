import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import {
  Course,
  CourseCategory,
  CourseLevel,
  CourseCatalogResponse,
  CourseSearchParams,
  Instructor,
} from &ldquo;@/types/courses&rdquo;;

// Mock instructors data
const mockInstructors: Record<string, Instructor> = {
  &ldquo;maria-lopez&rdquo;: {
    id: &ldquo;maria-lopez&rdquo;,
    name: &ldquo;María López&rdquo;,
    title: &ldquo;Especialista en Desarrollo Personal&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    bio: &ldquo;Psicóloga con 15 años de experiencia en desarrollo de habilidades blandas y empoderamiento juvenil.&rdquo;,
    rating: 4.8,
    totalStudents: 2500,
    totalCourses: 8,
    socialLinks: {
      linkedin: &ldquo;https://linkedin.com/in/marialopez&rdquo;,
      website: &ldquo;https://marialopez.dev&rdquo;,
    },
  },
  &ldquo;carlos-rivera&rdquo;: {
    id: &ldquo;carlos-rivera&rdquo;,
    name: &ldquo;Carlos Rivera&rdquo;,
    title: &ldquo;Especialista en Competencias Básicas&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    bio: &ldquo;Educador con 20 años formando competencias básicas en matemáticas y comunicación.&rdquo;,
    rating: 4.9,
    totalStudents: 3200,
    totalCourses: 5,
    socialLinks: {
      linkedin: &ldquo;https://linkedin.com/in/carlosrivera&rdquo;,
    },
  },
  &ldquo;ana-garcia&rdquo;: {
    id: &ldquo;ana-garcia&rdquo;,
    name: &ldquo;Ana García&rdquo;,
    title: &ldquo;Consultora en Recursos Humanos&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    bio: &ldquo;Especialista en inserción laboral y desarrollo profesional con 12 años de experiencia.&rdquo;,
    rating: 4.7,
    totalStudents: 1800,
    totalCourses: 6,
    socialLinks: {
      linkedin: &ldquo;https://linkedin.com/in/anagarcia&rdquo;,
      website: &ldquo;https://anagarcia.consulting&rdquo;,
    },
  },
  &ldquo;luis-mendoza&rdquo;: {
    id: &ldquo;luis-mendoza&rdquo;,
    name: &ldquo;Luis Mendoza&rdquo;,
    title: &ldquo;Emprendedor y Mentor de Negocios&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    bio: &ldquo;Fundador de 3 empresas exitosas, mentor de emprendedores durante 10 años.&rdquo;,
    rating: 4.9,
    totalStudents: 2100,
    totalCourses: 7,
    socialLinks: {
      linkedin: &ldquo;https://linkedin.com/in/luismendoza&rdquo;,
      twitter: &ldquo;https://twitter.com/luismendoza&rdquo;,
      website: &ldquo;https://luismendoza.business&rdquo;,
    },
  },
  &ldquo;sofia-torres&rdquo;: {
    id: &ldquo;sofia-torres&rdquo;,
    name: &ldquo;Sofía Torres&rdquo;,
    title: &ldquo;Especialista en Tecnología Educativa&rdquo;,
    avatar: &ldquo;/api/placeholder/100/100&rdquo;,
    bio: &ldquo;Ingeniera en sistemas especializada en capacitación tecnológica y transformación digital.&rdquo;,
    rating: 4.8,
    totalStudents: 2800,
    totalCourses: 9,
    socialLinks: {
      linkedin: &ldquo;https://linkedin.com/in/sofiatorres&rdquo;,
      website: &ldquo;https://sofiatorres.tech&rdquo;,
    },
  },
};

// Mock courses data
const mockCourses: Course[] = [
  {
    id: &ldquo;soft-skills-empowerment&rdquo;,
    title: &ldquo;Habilidades Blandas y Empoderamiento Personal&rdquo;,
    slug: &ldquo;habilidades-blandas-empoderamiento&rdquo;,
    description: `Un curso integral diseñado para desarrollar las habilidades blandas esenciales que todo joven necesita para el éxito personal y profesional. 

Este curso te llevará a través de un viaje de autodescubrimiento y crecimiento personal, donde aprenderás a:
- Fortalecer tu autoestima y confianza personal
- Desarrollar resiliencia ante los desafíos
- Cultivar habilidades de liderazgo efectivo
- Tomar decisiones informadas y estratégicas
- Trabajar en equipo y construir relaciones sólidas

Con metodologías interactivas, casos prácticos y ejercicios de autorreflexión, este curso te preparará para enfrentar cualquier desafío con seguridad y determinación.`,
    shortDescription:
      &ldquo;Desarrolla habilidades blandas esenciales: autoestima, liderazgo, resiliencia y trabajo en equipo.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    videoPreview: &ldquo;/api/placeholder/video/preview1&rdquo;,
    instructor: mockInstructors[&ldquo;maria-lopez&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
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
      &ldquo;Fortalecer la autoestima y confianza personal&rdquo;,
      &ldquo;Desarrollar habilidades de liderazgo efectivo&rdquo;,
      &ldquo;Cultivar la resiliencia ante desafíos&rdquo;,
      &ldquo;Mejorar la toma de decisiones&rdquo;,
      &ldquo;Potenciar el espíritu emprendedor&rdquo;,
      &ldquo;Desarrollar planes de crecimiento personal&rdquo;,
    ],
    prerequisites: [],
    includedMaterials: [
      &ldquo;Videos interactivos (20 horas)&rdquo;,
      &ldquo;Ejercicios de autoevaluación&rdquo;,
      &ldquo;Plantillas de desarrollo personal&rdquo;,
      &ldquo;Casos de estudio reales&rdquo;,
      &ldquo;Certificado oficial&rdquo;,
    ],
    certification: true,
    tags: [
      &ldquo;habilidades blandas&rdquo;,
      &ldquo;liderazgo&rdquo;,
      &ldquo;autoestima&rdquo;,
      &ldquo;emprendimiento&rdquo;,
      &ldquo;desarrollo personal&rdquo;,
    ],
    createdAt: new Date(&ldquo;2024-01-15&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-20&rdquo;),
    publishedAt: new Date(&ldquo;2024-01-20&rdquo;),
  },
  {
    id: &ldquo;basic-competencies&rdquo;,
    title: &ldquo;Competencias Básicas Fundamentales&rdquo;,
    slug: &ldquo;competencias-basicas-fundamentales&rdquo;,
    description: `Fortalece tus competencias básicas en comunicación y matemáticas con este curso práctico y dinámico.

Diseñado especialmente para jóvenes que desean mejorar sus habilidades fundamentales, este curso cubre:
- Alfabetización digital y tradicional
- Comunicación efectiva oral y escrita
- Matemáticas aplicadas al día a día
- Regla de 3 y cálculos de porcentajes
- Resolución de problemas cotidianos

Con ejercicios interactivos y aplicaciones prácticas, desarrollarás las competencias esenciales para el mundo laboral y la vida diaria.`,
    shortDescription:
      &ldquo;Fortalece competencias básicas en comunicación, matemáticas y resolución de problemas.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    instructor: mockInstructors[&ldquo;carlos-rivera&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
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
      &ldquo;Mejorar la comunicación oral y escrita&rdquo;,
      &ldquo;Dominar operaciones matemáticas básicas&rdquo;,
      &ldquo;Aplicar la regla de 3 en situaciones reales&rdquo;,
      &ldquo;Calcular porcentajes correctamente&rdquo;,
      &ldquo;Desarrollar pensamiento lógico&rdquo;,
    ],
    prerequisites: [],
    includedMaterials: [
      &ldquo;Videos explicativos (5 horas)&rdquo;,
      &ldquo;Ejercicios prácticos interactivos&rdquo;,
      &ldquo;Calculadora de regla de 3&rdquo;,
      &ldquo;Simuladores matemáticos&rdquo;,
      &ldquo;Evaluaciones automáticas&rdquo;,
    ],
    certification: true,
    tags: [
      &ldquo;matemáticas&rdquo;,
      &ldquo;comunicación&rdquo;,
      &ldquo;competencias básicas&rdquo;,
      &ldquo;regla de 3&rdquo;,
      &ldquo;porcentajes&rdquo;,
    ],
    createdAt: new Date(&ldquo;2024-01-10&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-15&rdquo;),
    publishedAt: new Date(&ldquo;2024-01-15&rdquo;),
  },
  {
    id: &ldquo;job-placement-skills&rdquo;,
    title: &ldquo;Inserción Laboral y Técnicas de Búsqueda de Empleo&rdquo;,
    slug: &ldquo;insercion-laboral-busqueda-empleo&rdquo;,
    description: `Prepárate para ingresar al mundo laboral con confianza y las herramientas correctas.

Este curso te equipará con todo lo necesario para una búsqueda de empleo exitosa:
- Conocimiento completo de derechos y deberes laborales
- Creación de CV profesional y atractivo
- Redacción de cartas de presentación efectivas
- Técnicas avanzadas para entrevistas de trabajo
- Simulador de entrevistas con IA para práctica real

Incluye casos reales, plantillas profesionales y acceso a nuestro innovador simulador de entrevistas impulsado por inteligencia artificial.`,
    shortDescription:
      &ldquo;Domina la búsqueda de empleo: CV, entrevistas, derechos laborales y simulador con IA.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    instructor: mockInstructors[&ldquo;ana-garcia&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
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
      &ldquo;Conocer derechos y deberes laborales&rdquo;,
      &ldquo;Crear CV profesional efectivo&rdquo;,
      &ldquo;Redactar cartas de presentación persuasivas&rdquo;,
      &ldquo;Dominar técnicas de entrevista&rdquo;,
      &ldquo;Practicar con simulador de IA&rdquo;,
      &ldquo;Desarrollar presencia profesional&rdquo;,
    ],
    prerequisites: [],
    includedMaterials: [
      &ldquo;Videos de capacitación (8 horas)&rdquo;,
      &ldquo;Plantillas de CV profesionales&rdquo;,
      &ldquo;Generador de cartas de presentación&rdquo;,
      &ldquo;Simulador de entrevistas con IA&rdquo;,
      &ldquo;Guía de derechos laborales&rdquo;,
      &ldquo;Casos de estudio reales&rdquo;,
    ],
    certification: true,
    tags: [
      &ldquo;inserción laboral&rdquo;,
      &ldquo;CV&rdquo;,
      &ldquo;entrevistas&rdquo;,
      &ldquo;derechos laborales&rdquo;,
      &ldquo;búsqueda empleo&rdquo;,
      &ldquo;IA&rdquo;,
    ],
    createdAt: new Date(&ldquo;2024-01-20&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-25&rdquo;),
    publishedAt: new Date(&ldquo;2024-01-25&rdquo;),
  },
  {
    id: &ldquo;entrepreneurship-fundamentals&rdquo;,
    title: &ldquo;Fundamentos de Emprendimiento y Desarrollo de Negocios&rdquo;,
    slug: &ldquo;fundamentos-emprendimiento-negocios&rdquo;,
    description: `Transforma tu idea en un negocio exitoso con este curso completo de emprendimiento.

Aprenderás paso a paso cómo desarrollar y lanzar tu propio emprendimiento:
- Desarrollo de plan de negocios profesional
- Estrategias de marketing para emprendedores
- Finanzas básicas y gestión de recursos
- Validación de ideas de negocio
- Herramientas digitales para emprendedores

Con casos de estudio de emprendedores bolivianos exitosos y herramientas prácticas que podrás aplicar inmediatamente en tu proyecto.`,
    shortDescription:
      &ldquo;Aprende a crear y gestionar tu propio negocio: plan de negocios, marketing y finanzas.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    instructor: mockInstructors[&ldquo;luis-mendoza&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
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
      &ldquo;Desarrollar plan de negocios completo&rdquo;,
      &ldquo;Crear estrategias de marketing efectivas&rdquo;,
      &ldquo;Manejar finanzas básicas empresariales&rdquo;,
      &ldquo;Validar ideas de negocio&rdquo;,
      &ldquo;Usar herramientas digitales&rdquo;,
      &ldquo;Analizar casos de éxito locales&rdquo;,
    ],
    prerequisites: [],
    includedMaterials: [
      &ldquo;Videos instructivos (12 horas)&rdquo;,
      &ldquo;Plantilla de plan de negocios&rdquo;,
      &ldquo;Calculadora financiera&rdquo;,
      &ldquo;Casos de estudio bolivianos&rdquo;,
      &ldquo;Herramientas de validación&rdquo;,
      &ldquo;Templates de marketing&rdquo;,
    ],
    certification: true,
    tags: [
      &ldquo;emprendimiento&rdquo;,
      &ldquo;plan de negocios&rdquo;,
      &ldquo;marketing&rdquo;,
      &ldquo;finanzas&rdquo;,
      &ldquo;startup&rdquo;,
      &ldquo;Bolivia&rdquo;,
    ],
    createdAt: new Date(&ldquo;2024-02-01&rdquo;),
    updatedAt: new Date(&ldquo;2024-03-01&rdquo;),
    publishedAt: new Date(&ldquo;2024-02-05&rdquo;),
  },
  {
    id: &ldquo;technical-skills-digital&rdquo;,
    title: &ldquo;Habilidades Técnicas y Competencias Digitales&rdquo;,
    slug: &ldquo;habilidades-tecnicas-competencias-digitales&rdquo;,
    description: `Desarrolla las habilidades técnicas y digitales más demandadas en el mercado laboral actual.

Este curso te capacitará en:
- Herramientas digitales esenciales
- Técnicas de ventas y atención al cliente
- Gestión de inventarios y control de stock
- Regulaciones técnicas importantes
- Plataformas digitales especializadas

Incluye acceso a recursos externos especializados y certificaciones reconocidas por la industria.`,
    shortDescription:
      &ldquo;Domina herramientas digitales, ventas, gestión de inventarios y regulaciones técnicas.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    instructor: mockInstructors[&ldquo;sofia-torres&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
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
      &ldquo;Manejar herramientas digitales esenciales&rdquo;,
      &ldquo;Desarrollar técnicas de ventas efectivas&rdquo;,
      &ldquo;Gestionar inventarios eficientemente&rdquo;,
      &ldquo;Conocer regulaciones técnicas&rdquo;,
      &ldquo;Usar plataformas especializadas&rdquo;,
    ],
    prerequisites: [],
    includedMaterials: [
      &ldquo;Videos tutoriales (15 horas)&rdquo;,
      &ldquo;Software y herramientas digitales&rdquo;,
      &ldquo;Simulador de ventas&rdquo;,
      &ldquo;Sistema de gestión de inventarios&rdquo;,
      &ldquo;Enlaces a cursos especializados&rdquo;,
      &ldquo;Certificaciones industriales&rdquo;,
    ],
    certification: true,
    tags: [
      &ldquo;habilidades técnicas&rdquo;,
      &ldquo;digital&rdquo;,
      &ldquo;ventas&rdquo;,
      &ldquo;inventarios&rdquo;,
      &ldquo;regulaciones&rdquo;,
      &ldquo;tecnología&rdquo;,
    ],
    createdAt: new Date(&ldquo;2024-02-10&rdquo;),
    updatedAt: new Date(&ldquo;2024-03-05&rdquo;),
    publishedAt: new Date(&ldquo;2024-02-15&rdquo;),
  },
  // Additional non-mandatory courses
  {
    id: &ldquo;digital-literacy-advanced&rdquo;,
    title: &ldquo;Alfabetización Digital Avanzada&rdquo;,
    slug: &ldquo;alfabetizacion-digital-avanzada&rdquo;,
    description: &ldquo;Curso avanzado de competencias digitales para el siglo XXI.&rdquo;,
    shortDescription:
      &ldquo;Competencias digitales avanzadas para profesionales modernos.&rdquo;,
    thumbnail: &ldquo;/api/placeholder/400/250&rdquo;,
    instructor: mockInstructors[&ldquo;sofia-torres&rdquo;],
    institution: &ldquo;Centro de Formación CEMSE&rdquo;,
    category: CourseCategory.DIGITAL_LITERACY,
    level: CourseLevel.ADVANCED,
    duration: 10,
    totalLessons: 20,
    rating: 4.6,
    studentCount: 890,
    price: 0,
    isMandatory: false,
    isActive: true,
    objectives: [
      &ldquo;Dominar herramientas digitales avanzadas&rdquo;,
      &ldquo;Desarrollar pensamiento computacional&rdquo;,
      &ldquo;Crear contenido digital profesional&rdquo;,
    ],
    prerequisites: [&ldquo;basic-competencies&rdquo;],
    includedMaterials: [
      &ldquo;Videos HD (10 horas)&rdquo;,
      &ldquo;Software especializado&rdquo;,
      &ldquo;Proyectos prácticos&rdquo;,
    ],
    certification: true,
    tags: [&ldquo;digital&rdquo;, &ldquo;avanzado&rdquo;, &ldquo;tecnología&rdquo;, &ldquo;competencias&rdquo;],
    createdAt: new Date(&ldquo;2024-02-20&rdquo;),
    updatedAt: new Date(&ldquo;2024-03-10&rdquo;),
    publishedAt: new Date(&ldquo;2024-02-25&rdquo;),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search parameters
    const query = searchParams.get(&ldquo;query&rdquo;) || &ldquo;&rdquo;;
    const category = searchParams.get(&ldquo;category&rdquo;);
    const level = searchParams.get(&ldquo;level&rdquo;);
    const price = searchParams.get(&ldquo;price&rdquo;);
    const rating = searchParams.get(&ldquo;rating&rdquo;);
    const isFree = searchParams.get(&ldquo;isFree&rdquo;);
    const isMandatory = searchParams.get(&ldquo;isMandatory&rdquo;);
    const instructor = searchParams.get(&ldquo;instructor&rdquo;);
    const sortBy = searchParams.get(&ldquo;sortBy&rdquo;) || &ldquo;popularity&rdquo;;
    const sortOrder = searchParams.get(&ldquo;sortOrder&rdquo;) || &ldquo;desc&rdquo;;
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;12&rdquo;);

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
      const categories = category.split(&ldquo;,&rdquo;) as CourseCategory[];
      filteredCourses = filteredCourses.filter((course) =>
        categories.includes(course.category)
      );
    }

    if (level) {
      const levels = level.split(&ldquo;,&rdquo;) as CourseLevel[];
      filteredCourses = filteredCourses.filter((course) =>
        levels.includes(course.level)
      );
    }

    if (duration) {
      const [min, max] = duration.split(&ldquo;-&rdquo;).map(Number);
      filteredCourses = filteredCourses.filter(
        (course) => course.duration >= min && course.duration <= max
      );
    }

    if (price) {
      const [min, max] = price.split(&ldquo;-&rdquo;).map(Number);
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

    if (isFree === &ldquo;true&rdquo;) {
      filteredCourses = filteredCourses.filter((course) => course.price === 0);
    }

    if (isMandatory === &ldquo;true&rdquo;) {
      filteredCourses = filteredCourses.filter((course) => course.isMandatory);
    } else if (isMandatory === &ldquo;false&rdquo;) {
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
        case &ldquo;popularity&rdquo;:
          comparison = b.studentCount - a.studentCount;
          break;
        case &ldquo;date&rdquo;:
          comparison =
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime();
          break;
        case &ldquo;rating&rdquo;:
          comparison = b.rating - a.rating;
          break;
        case &ldquo;title&rdquo;:
          comparison = a.title.localeCompare(b.title);
          break;
        case &ldquo;duration&rdquo;:
          comparison = a.duration - b.duration;
          break;
        default:
          comparison = b.studentCount - a.studentCount;
      }

      return sortOrder === &ldquo;asc&rdquo; ? -comparison : comparison;
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
    console.error(&ldquo;Error fetching courses:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}
