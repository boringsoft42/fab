import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET /api/certificate/[id] - Get specific course certificate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🏆 API: Received request for certificate:', id);

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

    // Get certificate from database
    const certificate = await prisma.certificate.findFirst({
      where: {
        id,
        userId: decoded.id, // Ensure user can only access their own certificates
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
      }
    });

    if (!certificate) {
      // Return mock certificate for development if not found
      console.log('🏆 API: Certificate not found in database, using mock data');
      const mockCertificate = {
        id: id,
        userId: decoded.id,
        courseId: '1',
        template: 'default',
        issuedAt: new Date().toISOString(),
        verificationCode: `CERT-${id.toUpperCase()}`,
        digitalSignature: `sha256-mock-signature-${id}`,
        isValid: true,
        url: `https://example.com/certificates/${id}.pdf`,
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
      };

      return NextResponse.json(mockCertificate);
    }

    console.log('🏆 API: Found certificate:', certificate.id);
    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error getting certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/certificate/[id] - Delete specific certificate (if needed)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🏆 API: Received request to delete certificate:', id);

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

    // Delete certificate (ensure user can only delete their own certificates)
    const deletedCertificate = await prisma.certificate.deleteMany({
      where: {
        id,
        userId: decoded.id,
      }
    });

    if (deletedCertificate.count === 0) {
      return NextResponse.json(
        { error: 'Certificate not found or not authorized' },
        { status: 404 }
      );
    }

    console.log('🏆 API: Certificate deleted:', id);
    return NextResponse.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}