import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('💼 /api/joboffer - Job offers request received');

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const municipality = searchParams.get('municipality');
    
    console.log('💼 /api/joboffer - Filters:', { status, category, municipality });

    // Build query filters
    const whereClause: any = {
      isActive: true
    };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (municipality) {
      whereClause.municipality = municipality;
    }

    // Fetch job offers from database
    const jobOffers = await prisma.jobOffer.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If no job offers found, return some mock data for development
    if (jobOffers.length === 0) {
      const mockJobOffers = [
        {
          id: 'mock-job-1',
          title: 'Desarrollador Frontend',
          description: 'Buscamos un desarrollador frontend con experiencia en React',
          requirements: 'React, TypeScript, 2+ años de experiencia',
          benefits: 'Trabajo remoto, seguro médico',
          salaryMin: 8000,
          salaryMax: 12000,
          salaryCurrency: 'BOB',
          contractType: 'FULL_TIME',
          workSchedule: 'Lunes a Viernes 9-17',
          workModality: 'REMOTE',
          location: 'Cochabamba, Bolivia',
          municipality: 'Cochabamba',
          department: 'Cochabamba',
          experienceLevel: 'INTERMEDIATE',
          educationRequired: 'UNIVERSITY',
          skillsRequired: ['React', 'TypeScript', 'JavaScript'],
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          status: 'PUBLISHED',
          viewsCount: 25,
          applicationsCount: 5,
          featured: false,
          publishedAt: new Date().toISOString(),
          company: {
            id: 'mock-company-1',
            name: 'TechCorp',
            email: 'info@techcorp.com'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      console.log('💼 /api/joboffer - Returning mock job offers:', mockJobOffers.length);
      return NextResponse.json(mockJobOffers);
    }

    console.log('💼 /api/joboffer - Found job offers:', jobOffers.length);
    return NextResponse.json(jobOffers);

  } catch (error) {
    console.error('Error fetching job offers:', error);
    return NextResponse.json(
      { error: 'Error al cargar ofertas de trabajo' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💼 /api/joboffer POST - Creating job offer');

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('💼 /api/joboffer POST - Request body received');

    // Create new job offer in database
    const newJobOffer = await prisma.jobOffer.create({
      data: {
        ...body,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('💼 /api/joboffer POST - Job offer created:', newJobOffer.id);
    return NextResponse.json(newJobOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating job offer:', error);
    return NextResponse.json(
      { error: 'Error al crear oferta de trabajo' },
      { status: 500 }
    );
  }
}


