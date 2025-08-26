import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for job applications');
    
    // Get auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔍 API: Authenticated user:', decoded.username);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get('applicantId');
    const status = searchParams.get('status');

    // Build filter conditions
    const where: any = {};
    if (applicantId) where.applicantId = applicantId;
    if (status) where.status = status;

    // Get job applications from database
    const jobApplications = await prisma.jobApplication.findMany({
      where,
      include: {
        jobOffer: {
          select: {
            id: true,
            title: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            location: true,
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    console.log('🔍 API: Found', jobApplications.length, 'job applications');
    return NextResponse.json(jobApplications);
  } catch (error) {
    console.error('Error in job applications route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Received request to create job application');

    // Get auth token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔍 API: Authenticated user:', decoded.username);

    const body = await request.json();
    console.log('🔍 API: Request body:', body);

    const { jobOfferId, coverLetter, resumeUrl, customAnswers } = body;

    if (!jobOfferId) {
      return NextResponse.json(
        { message: 'Job offer ID is required' },
        { status: 400 }
      );
    }

    // Check if job offer exists
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
      select: { id: true }
    });

    if (!jobOffer) {
      return NextResponse.json(
        { message: 'Job offer not found' },
        { status: 404 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobOfferId,
        applicantId: decoded.id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied to this job' },
        { status: 409 }
      );
    }

    // Create job application
    const jobApplication = await prisma.jobApplication.create({
      data: {
        jobOfferId,
        applicantId: decoded.id,
        status: 'PENDING',
        coverLetter,
        resumeUrl,
        customAnswers: customAnswers || [],
        appliedAt: new Date()
      },
      include: {
        jobOffer: {
          select: {
            id: true,
            title: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            location: true,
          }
        }
      }
    });

    console.log('🔍 API: Job application created:', jobApplication.id);
    return NextResponse.json(jobApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
