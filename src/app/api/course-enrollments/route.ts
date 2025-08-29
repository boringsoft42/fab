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
      // Get user's profile to use the correct studentId
      const userProfile = await prisma.profile.findUnique({
        where: { userId: decoded.id }
      });
      
      if (userProfile) {
        where.studentId = userProfile.userId;
      } else {
        // If no profile found, return empty enrollments
        return NextResponse.json({ enrollments: [] });
      }
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

    // Return actual enrollments from database

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

    // First, check if the user has a profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: decoded.id }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Perfil de usuario no encontrado' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId,
        studentId: userProfile.userId,
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
        studentId: userProfile.userId,
        enrolledAt: new Date(),
        progress: 0,
        status: 'ENROLLED',
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
    
    const errorDetails = error instanceof Error ? {
      message: error.message,
      code: (error as any).code,
      meta: (error as any).meta
    } : { message: 'Unknown error' };
    
    console.error('❌ Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Error al crear inscripción al curso',
        details: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined
      },
      { status: 500 }
    );
  }
}
