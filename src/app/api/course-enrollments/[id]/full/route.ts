import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const enrollmentId = resolvedParams.id;
    console.log('📚 API: Received request for full enrollment data:', enrollmentId);
    
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

    // Get enrollment with complete course data
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    resources: {
                      orderBy: { orderIndex: 'asc' }
                    },
                    quizzes: {
                      include: {
                        questions: {
                          include: {
                            options: {
                              orderBy: { orderIndex: 'asc' }
                            }
                          },
                          orderBy: { orderIndex: 'asc' }
                        }
                      }
                    }
                  },
                  orderBy: { orderIndex: 'asc' }
                }
              },
              orderBy: { orderIndex: 'asc' }
            },
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                moduleId: true,
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Check if the authenticated user owns this enrollment
    if (enrollment.studentId !== decoded.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to enrollment' },
        { status: 403 }
      );
    }

    console.log('📚 API: Found full enrollment data:', enrollment.id);
    return NextResponse.json({ enrollment }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in full enrollment route:', error);
    
    const errorDetails = error instanceof Error ? {
      message: error.message,
      code: (error as any).code,
      meta: (error as any).meta
    } : { message: 'Unknown error' };
    
    console.error('❌ Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined
      },
      { status: 500 }
    );
  }
}
