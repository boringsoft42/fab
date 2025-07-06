import { NextRequest, NextResponse } from "next/server";
import {
  Course,
  Module,
  LessonType,
  QuestionType,
  CourseCategory,
  CourseLevel,
} from "@/types/courses";

// Extended mock data with modules and lessons for each mandatory course
const courseDetailsData: Record<string, { course: Course; modules: Module[] }> =
  {
    "soft-skills-empowerment": {
      course: {
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
        instructor: {
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
        sections: [],
        totalQuizzes: 1,
        totalResources: 5,
      },
      modules: [
        {
          id: "module-1",
          courseId: "soft-skills-empowerment",
          title: "Empoderamiento Personal",
          description: "Desarrolla tu poder interior y confianza personal",
          order: 1,
          duration: 120,
          isLocked: false,
          lessons: [
            {
              id: "lesson-1-1",
              moduleId: "module-1",
              title: "Introducción al Empoderamiento",
              description:
                "Comprende qué es el empoderamiento y cómo aplicarlo",
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: "/api/placeholder/video/empowerment-intro",
                  duration: 900,
                  subtitles: [
                    { language: "es", url: "/subtitles/lesson-1-1-es.vtt" },
                  ],
                },
                text: "# Introducción al Empoderamiento\n\nEl empoderamiento personal es...",
              },
              duration: 15,
              order: 1,
              isPreview: true,
            },
            {
              id: "lesson-1-2",
              moduleId: "module-1",
              title: "Autoevaluación Inicial",
              description: "Evalúa tu nivel actual de empoderamiento",
              type: LessonType.QUIZ,
              content: {},
              duration: 10,
              order: 2,
              isPreview: false,
              quiz: {
                id: "quiz-1-2",
                title: "Evaluación de Empoderamiento",
                description: "Evalúa tu nivel actual",
                questions: [
                  {
                    id: "q1",
                    type: QuestionType.MULTIPLE_CHOICE,
                    question: "¿Cómo defines el empoderamiento personal?",
                    options: [
                      "Tener poder sobre otros",
                      "Desarrollar confianza en uno mismo",
                      "Ser agresivo en las decisiones",
                      "Evitar responsabilidades",
                    ],
                    correctAnswer: "Desarrollar confianza en uno mismo",
                    points: 10,
                    order: 1,
                  },
                ],
                timeLimit: 15,
                passingScore: 70,
                showCorrectAnswers: true,
              },
            },
          ],
        },
        {
          id: "module-2",
          courseId: "soft-skills-empowerment",
          title: "Autoestima y Confianza",
          description: "Fortalece tu autoestima y desarrolla confianza genuina",
          order: 2,
          duration: 120,
          isLocked: false,
          lessons: [
            {
              id: "lesson-2-1",
              moduleId: "module-2",
              title: "Fundamentos de la Autoestima",
              description: "Aprende los pilares de una autoestima saludable",
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: "/api/placeholder/video/self-esteem",
                  duration: 1200,
                },
              },
              duration: 20,
              order: 1,
              isPreview: false,
            },
          ],
        },
      ],
    },
    "basic-competencies": {
      course: {
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
        instructor: {
          id: "carlos-rivera",
          name: "Carlos Rivera",
          title: "Especialista en Competencias Básicas",
          avatar: "/api/placeholder/100/100",
          bio: "Educador con 20 años formando competencias básicas en matemáticas y comunicación.",
          rating: 4.9,
          totalStudents: 3200,
          totalCourses: 5,
        },
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
        sections: [],
        totalQuizzes: 0,
        totalResources: 3,
      },
      modules: [
        {
          id: "module-basic-1",
          courseId: "basic-competencies",
          title: "Alfabetización y Comunicación",
          description: "Mejora tu comunicación oral y escrita",
          order: 1,
          duration: 60,
          isLocked: false,
          lessons: [
            {
              id: "lesson-basic-1-1",
              moduleId: "module-basic-1",
              title: "Comunicación Efectiva",
              description: "Principios de comunicación clara y directa",
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: "/api/placeholder/video/communication",
                  duration: 900,
                },
              },
              duration: 15,
              order: 1,
              isPreview: true,
            },
          ],
        },
      ],
    },
  };

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const courseData = courseDetailsData[courseId];

    if (!courseData) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(courseData);
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
