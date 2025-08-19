import { NextRequest, NextResponse } from 'next/server';

// Mock data for lesson progress
const mockProgress = [
  {
    id: '1',
    enrollmentId: 'enrollment_1',
    lessonId: '1',
    isCompleted: true,
    completedAt: new Date('2024-01-15T10:30:00Z'),
    timeSpent: 900, // 15 minutes
    videoProgress: 1.0, // 100%
    lastWatchedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    enrollmentId: 'enrollment_1',
    lessonId: '2',
    isCompleted: false,
    completedAt: null,
    timeSpent: 600, // 10 minutes
    videoProgress: 0.5, // 50%
    lastWatchedAt: new Date('2024-01-16T14:20:00Z')
  },
  {
    id: '3',
    enrollmentId: 'enrollment_2',
    lessonId: '1',
    isCompleted: true,
    completedAt: new Date('2024-01-14T16:45:00Z'),
    timeSpent: 1200, // 20 minutes
    videoProgress: 1.0, // 100%
    lastWatchedAt: new Date('2024-01-14T16:45:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const progressId = searchParams.get('id');
    const enrollmentId = searchParams.get('enrollmentId');
    const lessonId = searchParams.get('lessonId');
    const courseId = searchParams.get('courseId');

    if (progressId) {
      const progress = mockProgress.find(p => p.id === progressId);
      if (!progress) {
        return NextResponse.json({ message: 'Progreso no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ progress });
    }

    if (enrollmentId && lessonId) {
      const progress = mockProgress.find(p => p.enrollmentId === enrollmentId && p.lessonId === lessonId);
      return NextResponse.json({ progress });
    }

    if (enrollmentId) {
      const progress = mockProgress.filter(p => p.enrollmentId === enrollmentId);
      return NextResponse.json({ progress });
    }

    if (courseId) {
      // Mock course progress calculation
      const courseProgress = {
        totalLessons: 10,
        completedLessons: 6,
        overallProgress: 60,
        timeSpent: 5400, // 90 minutes
        lastActivity: new Date('2024-01-16T14:20:00Z'),
        modules: [
          {
            moduleId: '1',
            title: 'Fundamentos de HTML',
            progress: 80,
            completedLessons: 4,
            totalLessons: 5
          },
          {
            moduleId: '2',
            title: 'CSS y Estilos',
            progress: 40,
            completedLessons: 2,
            totalLessons: 5
          }
        ]
      };
      return NextResponse.json({ courseProgress });
    }

    return NextResponse.json({ progress: mockProgress });
  } catch (error) {
    console.error('Error in lesson progress route:', error);
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
      enrollmentId,
      lessonId,
      isCompleted = false,
      timeSpent = 0,
      videoProgress = 0
    } = body;

    if (!enrollmentId || !lessonId) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Check if progress already exists
    const existingIndex = mockProgress.findIndex(
      p => p.enrollmentId === enrollmentId && p.lessonId === lessonId
    );

    const progressData = {
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
      timeSpent,
      videoProgress,
      lastWatchedAt: new Date()
    };

    if (existingIndex !== -1) {
      // Update existing progress
      mockProgress[existingIndex] = {
        ...mockProgress[existingIndex],
        ...progressData
      };
      return NextResponse.json({ progress: mockProgress[existingIndex] });
    } else {
      // Create new progress
      const newProgress = {
        id: Date.now().toString(),
        ...progressData
      };
      mockProgress.push(newProgress);
      return NextResponse.json({ progress: newProgress }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating lesson progress:', error);
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
        { message: 'ID del progreso es requerido' },
        { status: 400 }
      );
    }

    const progressIndex = mockProgress.findIndex(p => p.id === id);
    if (progressIndex === -1) {
      return NextResponse.json(
        { message: 'Progreso no encontrado' },
        { status: 404 }
      );
    }

    mockProgress[progressIndex] = {
      ...mockProgress[progressIndex],
      ...updateData,
      lastWatchedAt: new Date()
    };

    return NextResponse.json({ progress: mockProgress[progressIndex] });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
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
        { message: 'ID del progreso es requerido' },
        { status: 400 }
      );
    }

    const progressIndex = mockProgress.findIndex(p => p.id === id);
    if (progressIndex === -1) {
      return NextResponse.json(
        { message: 'Progreso no encontrado' },
        { status: 404 }
      );
    }

    mockProgress.splice(progressIndex, 1);

    return NextResponse.json({ message: 'Progreso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting lesson progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
