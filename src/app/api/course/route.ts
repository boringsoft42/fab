import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// Mock data for courses
const getMockCourses = () => ({
  courses: [
    {
      id: '1',
      title: 'React para Principiantes',
      description: 'Aprende React desde cero con proyectos prácticos',
      duration: '8 semanas',
      instructor: 'Juan Pérez',
      level: 'Principiante',
      price: 0,
      image: '/images/react-course.jpg',
      category: 'Programación'
    },
    {
      id: '2',
      title: 'Diseño UX/UI',
      description: 'Fundamentos del diseño de experiencia de usuario',
      duration: '6 semanas',
      instructor: 'María García',
      level: 'Intermedio',
      price: 0,
      image: '/images/ux-course.jpg',
      category: 'Diseño'
    }
  ]
});

// Mock data for courses
const getMockCourses = () => ({
  courses: [
    {
      id: '1',
      title: 'React para Principiantes',
      description: 'Aprende React desde cero con proyectos prácticos',
      duration: '8 semanas',
      instructor: 'Juan Pérez',
      level: 'Principiante',
      price: 0,
      image: '/images/react-course.jpg',
      category: 'Programación'
    },
    {
      id: '2',
      title: 'Diseño UX/UI',
      description: 'Fundamentos del diseño de experiencia de usuario',
      duration: '6 semanas',
      instructor: 'María García',
      level: 'Intermedio',
      price: 0,
      image: '/images/ux-course.jpg',
      category: 'Diseño'
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
