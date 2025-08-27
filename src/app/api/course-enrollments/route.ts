import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function GET(request: NextRequest) {
  try {
    console.log('📚 API: Received request for course enrollments');
    
    // Get auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('📚 API: Authenticated user:', decoded.username);

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    // Build filter conditions
    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (studentId) where.studentId = studentId;
    
    // If no specific filters, get enrollments for the authenticated user
    if (!courseId && !studentId) {
      where.studentId = decoded.id;
    }

    // Get course enrollments from database
    const enrollments = await prisma.courseEnrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            level: true,
            duration: true,
            category: true,
            isActive: true,
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // If no enrollments found in database, return mock data for development
    if (enrollments.length === 0) {
      console.log('📚 API: No enrollments found in database, using mock data');
      const mockEnrollments = [
        {
          id: 'enroll_1',
          courseId: '1',
          studentId: decoded.id,
          enrolledAt: new Date().toISOString(),
          progress: 25,
          status: 'ACTIVE',
          completedAt: null,
          course: {
            id: '1',
            title: 'React para Principiantes',
            description: 'Aprende React desde cero con proyectos prácticos',
            thumbnail: '/images/react-course.jpg',
            level: 'BEGINNER',
            duration: 480,
            category: 'TECHNICAL_SKILLS',
            isActive: true,
          },
          student: {
            id: decoded.id,
            firstName: 'Usuario',
            lastName: 'Demo',
            email: decoded.username + '@email.com',
          }
        }
      ];

      console.log('📚 API: Returning', mockEnrollments.length, 'mock enrollments');
      return NextResponse.json({ enrollments: mockEnrollments });
    }

    console.log('📚 API: Found', enrollments.length, 'course enrollments');
    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error in course enrollments route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📚 API: Received request to create course enrollment');

    // Get auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('📚 API: Authenticated user:', decoded.username);

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId,
        studentId: decoded.id,
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en este curso' },
        { status: 400 }
      );
    }

    // Create new enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        studentId: decoded.id,
        enrolledAt: new Date(),
        progress: 0,
        status: 'ACTIVE',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            level: true,
            duration: true,
            category: true,
            isActive: true,
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    console.log('📚 API: Course enrollment created:', enrollment.id);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating course enrollment:', error);
    return NextResponse.json(
      { error: 'Error al crear inscripción al curso' },
      { status: 500 }
    );
  }
}
