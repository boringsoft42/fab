import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/certificate/verify/[code] - Verify certificate by verification code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    console.log('🔍 API: Verifying certificate with code:', code);

    // Get certificate from database by verification code
    const certificate = await prisma.certificate.findFirst({
      where: {
        verificationCode: code,
        isValid: true,
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
      // For development, return mock verification result
      console.log('🔍 API: Certificate not found in database, checking mock certificates');
      
      if (code.startsWith('CERT-')) {
        const mockVerification = {
          isValid: true,
          certificate: {
            id: 'mock_cert_' + code.toLowerCase(),
            userId: 'user_123',
            courseId: '1',
            template: 'default',
            issuedAt: new Date().toISOString(),
            verificationCode: code,
            digitalSignature: `sha256-mock-signature-${code.toLowerCase()}`,
            isValid: true,
            url: `https://example.com/certificates/${code}.pdf`,
            course: {
              id: '1',
              title: 'React para Principiantes',
              description: 'Aprende React desde cero con proyectos prácticos'
            },
            user: {
              id: 'user_123',
              firstName: 'Usuario',
              lastName: 'Demo',
              email: 'testuser@email.com',
            }
          },
          verifiedAt: new Date().toISOString(),
        };

        console.log('🔍 API: Returning mock verification for code:', code);
        return NextResponse.json(mockVerification);
      }

      return NextResponse.json(
        { 
          isValid: false,
          message: 'Certificate not found or invalid',
          verifiedAt: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    const verificationResult = {
      isValid: true,
      certificate: certificate,
      verifiedAt: new Date().toISOString(),
    };

    console.log('🔍 API: Certificate verified successfully:', certificate.id);
    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}