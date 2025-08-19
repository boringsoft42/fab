// Mock data for lessons - shared across API routes
export let mockLessons = [
  {
    id: '1',
    moduleId: '1',
    title: 'Introducción a HTML',
    description: '¿Qué es HTML y por qué es importante?',
    content: 'HTML es el lenguaje de marcado estándar para crear páginas web...',
    contentType: 'VIDEO',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 15,
    orderIndex: 1,
    isRequired: true,
    isPreview: false,
    attachments: [],
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    moduleId: '1',
    title: 'Estructura básica de HTML',
    description: 'Aprende las etiquetas fundamentales de HTML',
    content: 'Toda página HTML tiene una estructura básica...',
    contentType: 'TEXT',
    videoUrl: null,
    duration: 20,
    orderIndex: 2,
    isRequired: true,
    isPreview: false,
    attachments: [],
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    moduleId: '2',
    title: 'Introducción a CSS',
    description: 'Fundamentos de CSS para dar estilo a tus páginas',
    content: 'CSS es el lenguaje de estilos para HTML...',
    contentType: 'VIDEO',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    duration: 25,
    orderIndex: 1,
    isRequired: true,
    isPreview: false,
    attachments: [],
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to add a new lesson to the mock data
export const addMockLesson = (lesson: any) => {
  mockLessons.push(lesson);
};

// Function to update a lesson in the mock data
export const updateMockLesson = (lessonId: string, updatedLesson: any) => {
  const index = mockLessons.findIndex(l => l.id === lessonId);
  if (index !== -1) {
    mockLessons[index] = { ...mockLessons[index], ...updatedLesson, updatedAt: new Date() };
  }
};

// Function to delete a lesson from the mock data
export const deleteMockLesson = (lessonId: string) => {
  mockLessons = mockLessons.filter(l => l.id !== lessonId);
};
