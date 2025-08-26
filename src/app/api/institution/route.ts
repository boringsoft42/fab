import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET /api/institution - Get institutions with optional filters
export async function GET(request: NextRequest) {
  try {
    console.log('🏛️ API: Received request for institutions');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const municipality = searchParams.get('municipality');
    const department = searchParams.get('department');
    const serviceArea = searchParams.get('serviceArea');
    const specialization = searchParams.get('specialization');
    const isPublic = searchParams.get('isPublic');

    // Build filter conditions
    const where: any = {
      role: 'TRAINING_CENTERS', // Filter for institution profiles
    };

    if (municipality) where.municipality = municipality;
    if (department) where.department = department;
    if (serviceArea) where.serviceArea = serviceArea;
    if (specialization) where.specialization = specialization;

    // Get institution profiles from database
    const institutions = await prisma.profile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        municipality: true,
        department: true,
        country: true,
        website: true,
        avatarUrl: true,
        institutionName: true,
        institutionType: true,
        serviceArea: true,
        specialization: true,
        institutionDescription: true,
        profileCompletion: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('🏛️ API: Found', institutions.length, 'institutions');
    return NextResponse.json(institutions);
  } catch (error) {
    console.error('Error in institutions route:', error);
    return NextResponse.json(
      { error: 'Error al cargar instituciones' },
      { status: 500 }
    );
  }
}

// POST /api/institution - Create new institution (Training Centers only)
export async function POST(request: NextRequest) {
  try {
    console.log('🏛️ API: Received request to create institution');

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
    console.log('🏛️ API: Authenticated user:', decoded.username);

    const body = await request.json();
    console.log('🏛️ API: Request body:', body);

    const {
      institutionName,
      institutionType,
      serviceArea,
      specialization,
      institutionDescription,
      website,
      email,
      phone,
      address,
      municipality,
      department,
    } = body;

    // Validate required fields
    if (!institutionName || !institutionType || !municipality) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: institutionName, institutionType, municipality' },
        { status: 400 }
      );
    }

    // Update the profile with institution data
    const institution = await prisma.profile.update({
      where: { userId: decoded.id },
      data: {
        institutionName: institutionName.trim(),
        institutionType,
        serviceArea,
        specialization,
        institutionDescription: institutionDescription?.trim(),
        website,
        email,
        phone,
        address,
        municipality,
        department: department || 'Cochabamba',
      }
    });

    console.log('🏛️ API: Institution updated:', institution.id);
    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating institution:', error);
    return NextResponse.json(
      { error: 'Error al crear institución' },
      { status: 500 }
    );
  }
}