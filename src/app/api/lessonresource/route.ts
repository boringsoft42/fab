import { NextRequest, NextResponse } from 'next/server';

// Mock data for lesson resources
const mockResources = [
  {
    id: '1',
    lessonId: '1',
    title: 'Guía completa de HTML',
    description: 'PDF con todos los conceptos de HTML5',
    type: 'PDF',
    url: 'https://example.com/html-guide.pdf',
    filePath: '/uploads/html-guide.pdf',
    fileSize: 2048576, // 2MB
    orderIndex: 1,
    isDownloadable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    lessonId: '1',
    title: 'Ejercicios prácticos HTML',
    description: 'Archivo ZIP con ejercicios para practicar',
    type: 'ZIP',
    url: 'https://example.com/html-exercises.zip',
    filePath: '/uploads/html-exercises.zip',
    fileSize: 1048576, // 1MB
    orderIndex: 2,
    isDownloadable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    lessonId: '2',
    title: 'Referencia de etiquetas HTML',
    description: 'Enlace a la documentación oficial de MDN',
    type: 'LINK',
    url: 'https://developer.mozilla.org/es/docs/Web/HTML',
    filePath: null,
    fileSize: null,
    orderIndex: 1,
    isDownloadable: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    lessonId: '3',
    title: 'Cheat Sheet CSS',
    description: 'Guía rápida de propiedades CSS',
    type: 'PDF',
    url: 'https://example.com/css-cheatsheet.pdf',
    filePath: '/uploads/css-cheatsheet.pdf',
    fileSize: 512000, // 500KB
    orderIndex: 1,
    isDownloadable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('id');
    const lessonId = searchParams.get('lessonId');

    if (resourceId) {
      const resource = mockResources.find(r => r.id === resourceId);
      if (!resource) {
        return NextResponse.json({ message: 'Recurso no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ resource });
    }

    if (lessonId) {
      const resources = mockResources.filter(r => r.lessonId === lessonId);
      return NextResponse.json({ resources });
    }

    return NextResponse.json({ resources: mockResources });
  } catch (error) {
    console.error('Error in lesson resources route:', error);
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
      lessonId,
      title,
      description,
      type,
      url,
      filePath,
      fileSize,
      orderIndex,
      isDownloadable = true
    } = body;

    if (!lessonId || !title || !type || !url || !orderIndex) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newResource = {
      id: Date.now().toString(),
      lessonId,
      title,
      description,
      type,
      url,
      filePath,
      fileSize,
      orderIndex,
      isDownloadable,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockResources.push(newResource);

    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson resource:', error);
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
        { message: 'ID del recurso es requerido' },
        { status: 400 }
      );
    }

    const resourceIndex = mockResources.findIndex(r => r.id === id);
    if (resourceIndex === -1) {
      return NextResponse.json(
        { message: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    mockResources[resourceIndex] = {
      ...mockResources[resourceIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return NextResponse.json({ resource: mockResources[resourceIndex] });
  } catch (error) {
    console.error('Error updating lesson resource:', error);
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
        { message: 'ID del recurso es requerido' },
        { status: 400 }
      );
    }

    const resourceIndex = mockResources.findIndex(r => r.id === id);
    if (resourceIndex === -1) {
      return NextResponse.json(
        { message: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    mockResources.splice(resourceIndex, 1);

    return NextResponse.json({ message: 'Recurso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting lesson resource:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
