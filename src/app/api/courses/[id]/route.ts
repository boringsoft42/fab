import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import {
  Course,
  Module,
  Lesson,
  LessonType,
  Quiz,
  QuestionType,
  CourseCategory,
  CourseLevel,
} from &ldquo;@/types/courses&rdquo;;

// Extended mock data with modules and lessons for each mandatory course
const courseDetailsData: Record<string, { course: Course; modules: Module[] }> =
  {
    &ldquo;soft-skills-empowerment&rdquo;: {
      course: {
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
        instructor: {
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
      modules: [
        {
          id: &ldquo;module-1&rdquo;,
          courseId: &ldquo;soft-skills-empowerment&rdquo;,
          title: &ldquo;Empoderamiento Personal&rdquo;,
          description: &ldquo;Desarrolla tu poder interior y confianza personal&rdquo;,
          order: 1,
          duration: 120,
          isLocked: false,
          lessons: [
            {
              id: &ldquo;lesson-1-1&rdquo;,
              moduleId: &ldquo;module-1&rdquo;,
              title: &ldquo;Introducción al Empoderamiento&rdquo;,
              description:
                &ldquo;Comprende qué es el empoderamiento y cómo aplicarlo&rdquo;,
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: &ldquo;/api/placeholder/video/empowerment-intro&rdquo;,
                  duration: 900,
                  subtitles: [
                    { language: &ldquo;es&rdquo;, url: &ldquo;/subtitles/lesson-1-1-es.vtt&rdquo; },
                  ],
                },
                text: &ldquo;# Introducción al Empoderamiento\n\nEl empoderamiento personal es...&rdquo;,
              },
              duration: 15,
              order: 1,
              isPreview: true,
            },
            {
              id: &ldquo;lesson-1-2&rdquo;,
              moduleId: &ldquo;module-1&rdquo;,
              title: &ldquo;Autoevaluación Inicial&rdquo;,
              description: &ldquo;Evalúa tu nivel actual de empoderamiento&rdquo;,
              type: LessonType.QUIZ,
              content: {},
              duration: 10,
              order: 2,
              isPreview: false,
              quiz: {
                id: &ldquo;quiz-1-2&rdquo;,
                title: &ldquo;Evaluación de Empoderamiento&rdquo;,
                description: &ldquo;Evalúa tu nivel actual&rdquo;,
                questions: [
                  {
                    id: &ldquo;q1&rdquo;,
                    type: QuestionType.MULTIPLE_CHOICE,
                    question: &ldquo;¿Cómo defines el empoderamiento personal?&rdquo;,
                    options: [
                      &ldquo;Tener poder sobre otros&rdquo;,
                      &ldquo;Desarrollar confianza en uno mismo&rdquo;,
                      &ldquo;Ser agresivo en las decisiones&rdquo;,
                      &ldquo;Evitar responsabilidades&rdquo;,
                    ],
                    correctAnswer: &ldquo;Desarrollar confianza en uno mismo&rdquo;,
                    points: 10,
                    order: 1,
                  },
                ],
                timeLimit: 15,
                passingScore: 70,
                allowedAttempts: 3,
                showCorrectAnswers: true,
              },
            },
          ],
        },
        {
          id: &ldquo;module-2&rdquo;,
          courseId: &ldquo;soft-skills-empowerment&rdquo;,
          title: &ldquo;Autoestima y Confianza&rdquo;,
          description: &ldquo;Fortalece tu autoestima y desarrolla confianza genuina&rdquo;,
          order: 2,
          duration: 120,
          isLocked: false,
          lessons: [
            {
              id: &ldquo;lesson-2-1&rdquo;,
              moduleId: &ldquo;module-2&rdquo;,
              title: &ldquo;Fundamentos de la Autoestima&rdquo;,
              description: &ldquo;Aprende los pilares de una autoestima saludable&rdquo;,
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: &ldquo;/api/placeholder/video/self-esteem&rdquo;,
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
    &ldquo;basic-competencies&rdquo;: {
      course: {
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
        instructor: {
          id: &ldquo;carlos-rivera&rdquo;,
          name: &ldquo;Carlos Rivera&rdquo;,
          title: &ldquo;Especialista en Competencias Básicas&rdquo;,
          avatar: &ldquo;/api/placeholder/100/100&rdquo;,
          bio: &ldquo;Educador con 20 años formando competencias básicas en matemáticas y comunicación.&rdquo;,
          rating: 4.9,
          totalStudents: 3200,
          totalCourses: 5,
        },
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
      modules: [
        {
          id: &ldquo;module-basic-1&rdquo;,
          courseId: &ldquo;basic-competencies&rdquo;,
          title: &ldquo;Alfabetización y Comunicación&rdquo;,
          description: &ldquo;Mejora tu comunicación oral y escrita&rdquo;,
          order: 1,
          duration: 60,
          isLocked: false,
          lessons: [
            {
              id: &ldquo;lesson-basic-1-1&rdquo;,
              moduleId: &ldquo;module-basic-1&rdquo;,
              title: &ldquo;Comunicación Efectiva&rdquo;,
              description: &ldquo;Principios de comunicación clara y directa&rdquo;,
              type: LessonType.VIDEO,
              content: {
                video: {
                  url: &ldquo;/api/placeholder/video/communication&rdquo;,
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
        { error: &ldquo;Curso no encontrado&rdquo; },
        { status: 404 }
      );
    }

    return NextResponse.json(courseData);
  } catch (error) {
    console.error(&ldquo;Error fetching course details:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error interno del servidor&rdquo; },
      { status: 500 }
    );
  }
}
