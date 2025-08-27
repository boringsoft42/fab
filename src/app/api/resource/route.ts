import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

// Mock data for resources
const getMockResources = () => [
  {
    id: '1',
    title: 'Guía de Emprendimiento Digital',
    description: 'Una guía completa para iniciar tu negocio digital',
    type: 'GUIDE',
    category: 'ENTREPRENEURSHIP',
    format: 'PDF',
    author: 'CEMSE',
    authorId: 'cemse_author_1',
    fileUrl: '/resources/guides/entrepreneurship-guide.pdf',
    downloadUrl: '/api/resource/1/download',
    thumbnailUrl: '/images/resources/entrepreneurship-guide.jpg',
    fileSize: 2048000,
    publishedDate: '2024-01-15',
    tags: ['emprendimiento', 'negocios', 'digital'],
    isPublic: true,
    isFeatured: true,
    downloads: 234,
    rating: 4.7,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Template Plan de Negocios',
    description: 'Plantilla editable para crear tu plan de negocios',
    type: 'TEMPLATE',
    category: 'BUSINESS_PLAN',
    format: 'DOCX',
    author: 'CEMSE',
    authorId: 'cemse_author_1',
    fileUrl: '/resources/templates/business-plan-template.docx',
    downloadUrl: '/api/resource/2/download',
    thumbnailUrl: '/images/resources/business-plan-template.jpg',
    fileSize: 512000,
    publishedDate: '2024-01-10',
    tags: ['plan de negocios', 'template', 'startup'],
    isPublic: true,
    isFeatured: true,
    downloads: 156,
    rating: 4.5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    title: 'Kit de Herramientas para Jóvenes Emprendedores',
    description: 'Conjunto de herramientas y recursos para jóvenes que inician un negocio',
    type: 'TOOLKIT',
    category: 'YOUTH_ENTREPRENEURSHIP',
    format: 'ZIP',
    author: 'CEMSE',
    authorId: 'cemse_author_1',
    fileUrl: '/resources/toolkits/youth-entrepreneur-toolkit.zip',
    downloadUrl: '/api/resource/3/download',
    thumbnailUrl: '/images/resources/youth-toolkit.jpg',
    fileSize: 10240000,
    publishedDate: '2024-01-20',
    tags: ['jóvenes', 'herramientas', 'emprendimiento'],
    isPublic: true,
    isFeatured: false,
    downloads: 89,
    rating: 4.8,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

// GET /api/resource - Obtener todos los recursos (público)
export async function GET(request: NextRequest) {
  try {
    console.log('📚 API: Received request for resources');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
    const featured = searchParams.get('featured');
    const authorId = searchParams.get('authorId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('q');
    const municipalityId = searchParams.get('municipalityId');

    // Try to get resources from database
    const resources = await prisma.resource.findMany({
      where: {
        ...(type && { type: type as any }),
        ...(category && { category: category as any }),
        ...(isPublic !== null && { isPublic: isPublic === 'true' }),
        ...(featured && { isFeatured: featured === 'true' }),
        ...(authorId && { authorId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: [search] } }
          ]
        }),
        // Municipality filtering not available in current Resource schema
        // TODO: Add municipalityId field to Resource model if needed
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit
    });

    // If no resources found in database, return mock data
    if (resources.length === 0) {
      console.log('📚 API: No resources found in database, using mock data');
      let mockResources = getMockResources();

      // Apply filters to mock data
      if (type) {
        mockResources = mockResources.filter(r => r.type === type);
      }
      if (category) {
        mockResources = mockResources.filter(r => r.category === category);
      }
      if (isPublic !== null) {
        const isPublicBool = isPublic === 'true';
        mockResources = mockResources.filter(r => r.isPublic === isPublicBool);
      }
      if (featured) {
        const isFeaturedBool = featured === 'true';
        mockResources = mockResources.filter(r => r.isFeatured === isFeaturedBool);
      }
      if (search) {
        mockResources = mockResources.filter(r => 
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedResources = mockResources.slice(startIndex, startIndex + limit);

      console.log('📚 API: Returning', paginatedResources.length, 'mock resources');
      return NextResponse.json({
        success: true,
        resources: paginatedResources,
        pagination: {
          total: mockResources.length,
          page,
          limit,
          totalPages: Math.ceil(mockResources.length / limit)
        }
      });
    }

    console.log('📚 API: Found', resources.length, 'resources in database');
    return NextResponse.json({
      success: true,
      resources,
      pagination: {
        total: resources.length,
        page,
        limit,
        totalPages: Math.ceil(resources.length / limit)
      }
    });

  } catch (error) {
    console.error('Error getting resources:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resources' },
      { status: 500 }
    );
  }
}

// POST /api/resource - Crear nuevo recurso (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    console.log('📚 API: Received request to create resource');

    // Verificar autenticación
    const authResult = await authenticateToken(request);
    console.log('📚 API: Authentication result:', authResult.success);

    if (!authResult.success) {
      console.log('📚 API: Authentication failed:', authResult.message);
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verificar si es multipart/form-data (con archivo) o JSON
    const contentType = request.headers.get('content-type') || '';
    console.log('📚 API: Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
      // Manejar FormData con archivo
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const type = formData.get('type') as string;
      const category = formData.get('category') as string;
      const format = formData.get('format') as string;
      const author = formData.get('author') as string;
      const externalUrl = formData.get('externalUrl') as string;
      const publishedDate = formData.get('publishedDate') as string;
      const tags = formData.get('tags') as string;
      const isPublic = formData.get('isPublic') as string;

      // For now, return mock response for file uploads
      const mockResource = {
        id: 'resource_' + Date.now(),
        title,
        description,
        type,
        category,
        format,
        author: author || authResult.user?.username || 'Usuario',
        authorId: authResult.user?.id || 'user_123',
        fileUrl: file ? `/uploads/${file.name}` : null,
        downloadUrl: `/api/resource/resource_${Date.now()}/download`,
        thumbnailUrl: '/images/resources/default.jpg',
        fileSize: file ? file.size : 0,
        publishedDate: publishedDate || new Date().toISOString(),
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        isPublic: isPublic === 'true',
        isFeatured: false,
        downloads: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📚 API: Mock resource created (with file):', mockResource.id);
      return NextResponse.json({ success: true, resource: mockResource }, { status: 201 });

    } else {
      // Manejar JSON sin archivo
      const body = await request.json();

      // Create resource in database or return mock
      const resourceData = {
        title: body.title,
        description: body.description,
        type: body.type,
        category: body.category,
        format: body.format || 'URL',
        author: body.author || authResult.user?.username || 'Usuario',
        authorId: authResult.user?.id || 'user_123',
        fileUrl: body.fileUrl || body.externalUrl,
        downloadUrl: body.downloadUrl,
        thumbnailUrl: body.thumbnailUrl || '/images/resources/default.jpg',
        fileSize: body.fileSize || 0,
        publishedDate: body.publishedDate || new Date().toISOString(),
        tags: body.tags || [],
        isPublic: body.isPublic ?? true,
        isFeatured: body.isFeatured ?? false,
        downloads: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        externalUrl: body.externalUrl
      };

      // For now, return mock response
      const mockResource = {
        id: 'resource_' + Date.now(),
        ...resourceData
      };

      console.log('📚 API: Mock resource created (JSON):', mockResource.id);
      return NextResponse.json({ success: true, resource: mockResource }, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating resource' },
      { status: 500 }
    );
  }
}