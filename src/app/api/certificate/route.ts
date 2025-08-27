import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET /api/certificate - Get course certificates for authenticated user (singular endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log('🏆 API: Received request for course certificates (singular endpoint)');
    
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
    console.log('🏆 API: Authenticated user:', decoded.username);

    // Get course certificates from database
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    // If no certificates found in database, return mock data for development
    if (certificates.length === 0) {
      console.log('🏆 API: No certificates found in database, using mock data');
      const mockCertificates = [
        {
          id: 'cert_course_1',
          userId: decoded.id,
          courseId: '1',
          template: 'default',
          issuedAt: new Date().toISOString(),
          verificationCode: 'CERT-COURSE-001',
          digitalSignature: 'sha256-mock-signature',
          isValid: true,
          url: 'https://example.com/certificates/course-cert.pdf',
          course: {
            id: '1',
            title: 'React para Principiantes',
            description: 'Aprende React desde cero con proyectos prácticos'
          },
          user: {
            id: decoded.id,
            firstName: 'Usuario',
            lastName: 'Demo',
            email: decoded.username + '@email.com',
          }
        }
      ];

      console.log('🏆 API: Returning', mockCertificates.length, 'mock certificates');
      return NextResponse.json(mockCertificates);
    }

    console.log('🏆 API: Found', certificates.length, 'course certificates');
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error in course certificates route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}