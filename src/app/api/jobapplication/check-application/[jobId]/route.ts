import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET /api/jobapplication/check-application/{jobId} - Check if user has applied to job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    console.log('🔍 API: Checking application status for job:', jobId);

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
    console.log('🔍 API: Checking application for user:', decoded.username);

    // Check if user has already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobOfferId: jobId,
        applicantId: decoded.id,
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
      }
    });

    const hasApplied = !!existingApplication;

    console.log('🔍 API: Application check result:', { hasApplied, application: existingApplication });

    return NextResponse.json({
      hasApplied,
      application: existingApplication || null
    });
  } catch (error) {
    console.error('Error checking job application:', error);
    return NextResponse.json(
      { error: 'Error al verificar aplicación' },
      { status: 500 }
    );
  }
}