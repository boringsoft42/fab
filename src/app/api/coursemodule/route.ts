import { NextRequest, NextResponse } from 'next/server';

// Mock data for course modules
const mockModules = [
  {
    id: '1',
    courseId: '1',
    title: 'Fundamentos de HTML',
    description: 'Aprende los conceptos básicos de HTML5',
    orderIndex: 1,
    estimatedDuration: 120,
    isLocked: false,
    prerequisites: [],
    hasCertificate: true,
    certificateTemplate: 'default',
    lessons: []
  },
  {
    id: '2',
    courseId: '1',
    title: 'CSS y Estilos',
    description: 'Aprende a dar estilo a tus páginas web',
    orderIndex: 2,
    estimatedDuration: 180,
    isLocked: false,
    prerequisites: ['1'],
    hasCertificate: true,
    certificateTemplate: 'default',
    lessons: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('id');

    if (moduleId) {
      const module = mockModules.find(m => m.id === moduleId);
      if (!module) {
        return NextResponse.json({ message: 'Módulo no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ module });
    }

    if (courseId) {
      const modules = mockModules.filter(m => m.courseId === courseId);
      return NextResponse.json({ modules });
    }

    return NextResponse.json({ modules: mockModules });
  } catch (error) {
    console.error('Error in course modules route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      title,
      description,
      orderIndex,
      estimatedDuration,
      prerequisites = [],
      hasCertificate = true,
      certificateTemplate = 'default'
    } = body;

    if (!courseId || !title || !orderIndex || !estimatedDuration) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newModule = {
      id: Date.now().toString(),
      courseId,
      title,
      description,
      orderIndex,
      estimatedDuration,
      isLocked: false,
      prerequisites,
      hasCertificate,
      certificateTemplate,
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockModules.push(newModule);

    return NextResponse.json({ module: newModule }, { status: 201 });
  } catch (error) {
    console.error('Error creating course module:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'ID del módulo es requerido' },
        { status: 400 }
      );
    }

    const moduleIndex = mockModules.findIndex(m => m.id === id);
    if (moduleIndex === -1) {
      return NextResponse.json(
        { message: 'Módulo no encontrado' },
        { status: 404 }
      );
    }

    mockModules[moduleIndex] = {
      ...mockModules[moduleIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return NextResponse.json({ module: mockModules[moduleIndex] });
  } catch (error) {
    console.error('Error updating course module:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID del módulo es requerido' },
        { status: 400 }
      );
    }

    const moduleIndex = mockModules.findIndex(m => m.id === id);
    if (moduleIndex === -1) {
      return NextResponse.json(
        { message: 'Módulo no encontrado' },
        { status: 404 }
      );
    }

    mockModules.splice(moduleIndex, 1);

    return NextResponse.json({ message: 'Módulo eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting course module:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
