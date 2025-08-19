import { NextRequest, NextResponse } from 'next/server';
import { mockLessons, addMockLesson, updateMockLesson, deleteMockLesson } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');
    const moduleId = searchParams.get('moduleId');

    if (lessonId) {
      const lesson = mockLessons.find(l => l.id === lessonId);
      if (!lesson) {
        return NextResponse.json({ message: 'Lección no encontrada' }, { status: 404 });
      }
      return NextResponse.json({ lesson });
    }

    if (moduleId) {
      const lessons = mockLessons.filter(l => l.moduleId === moduleId);
      return NextResponse.json({ lessons });
    }

    return NextResponse.json({ lessons: mockLessons });
  } catch (error) {
    console.error('Error in lessons route:', error);
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
      moduleId,
      title,
      description,
      content,
      contentType,
      videoUrl,
      duration,
      orderIndex,
      isRequired = true,
      isPreview = false,
      attachments = []
    } = body;

    if (!moduleId || !title || !content || !contentType || !orderIndex) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newLesson = {
      id: Date.now().toString(),
      moduleId,
      title,
      description,
      content,
      contentType,
      videoUrl,
      duration,
      orderIndex,
      isRequired,
      isPreview,
      attachments,
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addMockLesson(newLesson);

    return NextResponse.json({ lesson: newLesson }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
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
        { message: 'ID de la lección es requerido' },
        { status: 400 }
      );
    }

    const lessonIndex = mockLessons.findIndex(l => l.id === id);
    if (lessonIndex === -1) {
      return NextResponse.json(
        { message: 'Lección no encontrada' },
        { status: 404 }
      );
    }

    updateMockLesson(id, updateData);
    const updatedLesson = mockLessons.find(l => l.id === id);

    return NextResponse.json({ lesson: updatedLesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
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
        { message: 'ID de la lección es requerido' },
        { status: 400 }
      );
    }

    const lessonIndex = mockLessons.findIndex(l => l.id === id);
    if (lessonIndex === -1) {
      return NextResponse.json(
        { message: 'Lección no encontrada' },
        { status: 404 }
      );
    }

    deleteMockLesson(id);

    return NextResponse.json({ message: 'Lección eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
