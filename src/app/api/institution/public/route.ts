import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/institution/public - Get public institutions directory
export async function GET(request: NextRequest) {
  try {
    console.log('🏛️ API: Received request for public institutions');
    
    const { searchParams } = new URL(request.url);
    const municipality = searchParams.get('municipality');
    const department = searchParams.get('department');
    const serviceArea = searchParams.get('serviceArea');
    const specialization = searchParams.get('specialization');
    const search = searchParams.get('search');

    // Build filter conditions for public institutions
    const where: any = {
      role: 'TRAINING_CENTERS', // Filter for institution profiles
      active: true, // Only active institutions
    };

    if (municipality) where.municipality = municipality;
    if (department) where.department = department;
    if (serviceArea) where.serviceArea = serviceArea;
    if (specialization) where.specialization = specialization;
    
    // Add search functionality
    if (search) {
      where.OR = [
        { institutionName: { contains: search, mode: 'insensitive' } },
        { institutionDescription: { contains: search, mode: 'insensitive' } },
        { serviceArea: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get public institution profiles from database
    const institutions = await prisma.profile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        institutionName: true,
        institutionType: true,
        serviceArea: true,
        specialization: true,
        institutionDescription: true,
        email: true,
        phone: true,
        address: true,
        municipality: true,
        department: true,
        country: true,
        website: true,
        avatarUrl: true,
        profileCompletion: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { profileCompletion: 'desc' }, // Show more complete profiles first
        { createdAt: 'desc' }
      ]
    });

    // Transform data to match expected format
    const formattedInstitutions = institutions.map(institution => ({
      id: institution.id,
      userId: institution.userId,
      name: institution.institutionName || 'Sin nombre',
      institutionType: institution.institutionType || 'CENTRO_CAPACITACION',
      customType: institution.serviceArea || 'Educación',
      serviceArea: institution.serviceArea || '',
      specialization: institution.specialization || '',
      description: institution.institutionDescription || '',
      email: institution.email || '',
      phone: institution.phone || '',
      address: institution.address || '',
      municipality: institution.municipality || '',
      department: institution.department || 'Cochabamba',
      region: institution.department || 'Cochabamba',
      country: institution.country || 'Bolivia',
      website: institution.website || '',
      logo: institution.avatarUrl || '',
      profileCompletion: institution.profileCompletion || 0,
      createdAt: institution.createdAt,
      updatedAt: institution.updatedAt,
      isActive: true,
    }));

    // If no institutions found in database, fall back to mock data
    if (formattedInstitutions.length === 0) {
      console.log('🏛️ API: No institutions found in database, using mock data');
      const mockInstitutions = [
        {
          id: 'inst_1',
          name: 'Fundación CEMSE',
          department: 'Cochabamba',
          region: 'Cochabamba',
          municipality: 'Cercado',
          institutionType: 'FOUNDATION',
          customType: 'Educación',
          serviceArea: 'Educación',
          specialization: 'Desarrollo Juvenil',
          description: 'Fundación dedicada al desarrollo educativo y emprendimiento juvenil',
          address: 'Av. Principal 123, Cochabamba',
          phone: '+591 4 1234567',
          email: 'info@cemse.org.bo',
          website: 'https://cemse.org.bo',
          isActive: true,
          profileCompletion: 100,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'inst_2',
          name: 'ONG Juventud Activa',
          department: 'La Paz',
          region: 'La Paz',
          municipality: 'La Paz',
          institutionType: 'NGO',
          customType: 'Desarrollo Social',
          serviceArea: 'Desarrollo Social',
          specialization: 'Juventud',
          description: 'Organización no gubernamental enfocada en el desarrollo de la juventud',
          address: 'Calle Comercio 456, La Paz',
          phone: '+591 2 9876543',
          email: 'contacto@juventudactiva.org',
          website: 'https://juventudactiva.org',
          isActive: true,
          profileCompletion: 90,
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 'inst_3',
          name: 'Centro de Innovación Tecnológica',
          department: 'Santa Cruz',
          region: 'Santa Cruz',
          municipality: 'Santa Cruz de la Sierra',
          institutionType: 'OTHER',
          customType: 'Tecnología',
          serviceArea: 'Tecnología',
          specialization: 'Innovación',
          description: 'Centro especializado en innovación y desarrollo tecnológico',
          address: 'Av. Libertador 789, Santa Cruz',
          phone: '+591 3 5555666',
          email: 'info@cit.org.bo',
          website: 'https://cit.org.bo',
          isActive: true,
          profileCompletion: 85,
          createdAt: '2024-02-01T09:15:00Z',
          updatedAt: '2024-02-01T09:15:00Z'
        },
        {
          id: 'inst_4',
          name: 'Fundación Emprender',
          department: 'Tarija',
          region: 'Tarija',
          municipality: 'Tarija',
          institutionType: 'FOUNDATION',
          customType: 'Emprendimiento',
          serviceArea: 'Emprendimiento',
          specialization: 'Innovación Empresarial',
          description: 'Fundación que promueve el emprendimiento y la innovación empresarial',
          address: 'Calle Sucre 321, Tarija',
          phone: '+591 4 7777888',
          email: 'contacto@emprender.org.bo',
          website: 'https://emprender.org.bo',
          isActive: true,
          profileCompletion: 95,
          createdAt: '2024-02-10T16:45:00Z',
          updatedAt: '2024-02-10T16:45:00Z'
        }
      ];

      console.log('🏛️ API: Returning', mockInstitutions.length, 'mock institutions');
      return NextResponse.json(mockInstitutions);
    }

    console.log('🏛️ API: Found', formattedInstitutions.length, 'database institutions');
    return NextResponse.json(formattedInstitutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { error: 'Error al cargar las instituciones' },
      { status: 500 }
    );
  }
}
