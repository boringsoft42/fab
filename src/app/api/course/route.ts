import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// Mock data for courses
const getMockCourses = () => ({
  courses: [
    {
      id: '1',
      title: 'React para Principiantes',
      slug: 'react-para-principiantes',
      description: 'Aprende React desde cero con proyectos prácticos',
      shortDescription: 'Fundamentos de React con proyectos reales',
      thumbnail: '/images/react-course.jpg',
      coverImage: '/images/react-course.jpg',
      videoPreview: null,
      objectives: ['Entender los conceptos básicos de React', 'Crear componentes reutilizables', 'Manejar estado y props'],
      prerequisites: ['Conocimientos básicos de JavaScript', 'HTML y CSS'],
      duration: 480, // 8 horas en minutos
      level: 'BEGINNER',
      category: 'TECHNICAL_SKILLS',
      isMandatory: false,
      isActive: true,
      price: 0,
      rating: 4.5,
      studentsCount: 150,
      enrollmentCount: 150,
      completionRate: 85,
      totalLessons: 24,
      totalQuizzes: 6,
      totalResources: 12,
      tags: ['React', 'JavaScript', 'Frontend'],
      certification: true,
      includedMaterials: ['Código fuente', 'Ejercicios prácticos', 'Certificado'],
      instructorId: '1',
      institutionName: 'CEMSE',
      instructor: {
        id: '1',
        name: 'Juan Pérez',
        title: 'Desarrollador Frontend Senior',
        avatar: '/avatars/juan-perez.jpg'
      },
      organization: {
        id: '1',
        name: 'CEMSE',
        logo: '/logos/cemse.png'
      },
      publishedAt: '2024-01-15T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Diseño UX/UI',
      slug: 'diseno-ux-ui',
      description: 'Fundamentos del diseño de experiencia de usuario',
      shortDescription: 'Aprende a crear interfaces intuitivas y atractivas',
      thumbnail: '/images/ux-course.jpg',
      coverImage: '/images/ux-course.jpg',
      videoPreview: null,
      objectives: ['Comprender los principios de UX/UI', 'Crear wireframes y prototipos', 'Realizar investigación de usuarios'],
      prerequisites: ['Creatividad', 'Interés en diseño'],
      duration: 360, // 6 horas en minutos
      level: 'INTERMEDIATE',
      category: 'SOFT_SKILLS',
      isMandatory: false,
      isActive: true,
      price: 0,
      rating: 4.8,
      studentsCount: 89,
      enrollmentCount: 89,
      completionRate: 92,
      totalLessons: 18,
      totalQuizzes: 4,
      totalResources: 8,
      tags: ['UX', 'UI', 'Diseño', 'Prototipado'],
      certification: true,
      includedMaterials: ['Templates de diseño', 'Herramientas gratuitas', 'Certificado'],
      instructorId: '2',
      institutionName: 'CEMSE',
      instructor: {
        id: '2',
        name: 'María García',
        title: 'UX/UI Designer',
        avatar: '/avatars/maria-garcia.jpg'
      },
      organization: {
        id: '1',
        name: 'CEMSE',
        logo: '/logos/cemse.png'
      },
      publishedAt: '2024-01-10T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Emprendimiento Digital',
      slug: 'emprendimiento-digital',
      description: 'Convierte tu idea en un negocio digital exitoso',
      shortDescription: 'Guía completa para crear y hacer crecer tu startup',
      thumbnail: '/images/entrepreneurship-course.jpg',
      coverImage: '/images/entrepreneurship-course.jpg',
      videoPreview: null,
      objectives: ['Validar ideas de negocio', 'Crear un plan de negocio', 'Implementar estrategias de marketing digital'],
      prerequisites: ['Interés en emprender', 'Disposición para aprender'],
      duration: 600, // 10 horas en minutos
      level: 'BEGINNER',
      category: 'ENTREPRENEURSHIP',
      isMandatory: false,
      isActive: true,
      price: 0,
      rating: 4.7,
      studentsCount: 234,
      enrollmentCount: 234,
      completionRate: 78,
      totalLessons: 30,
      totalQuizzes: 8,
      totalResources: 15,
      tags: ['Emprendimiento', 'Negocios', 'Marketing', 'Startup'],
      certification: true,
      includedMaterials: ['Plantillas de plan de negocio', 'Herramientas de análisis', 'Certificado'],
      instructorId: '3',
      institutionName: 'CEMSE',
      instructor: {
        id: '3',
        name: 'Carlos Rodríguez',
        title: 'Consultor de Emprendimiento',
        avatar: '/avatars/carlos-rodriguez.jpg'
      },
      organization: {
        id: '1',
        name: 'CEMSE',
        logo: '/logos/cemse.png'
      },
      publishedAt: '2024-01-20T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for courses');
    
    // Check if backend should be used
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND !== 'false';
    
    if (!useBackend) {
      console.log('🔍 API: Backend disabled, returning mock data');
      const mockData = getMockCourses();
      return NextResponse.json(mockData, { status: 200 });
    }
    
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL(`${API_BASE}/course`);
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('🔍 API: Forwarding to backend:', url.toString());
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 API: Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 API: Backend error:', errorText);
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🔍 API: Backend data received, courses count:', data.courses?.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in courses route:', error);
    
    // If backend is not available, return mock data
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.log('🔍 API: Backend not available, returning mock data');
      const mockData = getMockCourses();
      return NextResponse.json(mockData, { status: 200 });
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
