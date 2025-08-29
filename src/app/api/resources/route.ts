import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireOrganization } from '@/lib/auth-middleware';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources - Obtener todos los recursos (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
    const featured = searchParams.get('featured');
    const authorId = searchParams.get('authorId');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('q');

    const controller = new ResourceController();

    if (search) {
      const results = await controller.searchResources(search);
      return NextResponse.json({ success: true, data: results });
    }

    if (featured === 'true') {
      const results = await controller.getFeaturedResources(limit ? parseInt(limit) : 10);
      return NextResponse.json({ success: true, data: results });
    }

    if (isPublic === 'true') {
      const results = await controller.getPublicResources();
      return NextResponse.json({ success: true, data: results });
    }

    if (type) {
      const results = await controller.getResourcesByType(type);
      return NextResponse.json({ success: true, data: results });
    }

    if (category) {
      const results = await controller.getResourcesByCategory(category);
      return NextResponse.json({ success: true, data: results });
    }

    if (authorId) {
      const results = await controller.getResourcesByAuthor(authorId);
      return NextResponse.json({ success: true, data: results });
    }

    // Obtener todos los recursos con paginación
    const results = await controller.getAllResources({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    });

    return NextResponse.json({ success: true, data: results });

  } catch (error) {
    console.error('Error getting resources:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Crear nuevo recurso (requiere autenticación y permisos de organización)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verificar permisos de organización
    const orgResult = await requireOrganization(request);
    if (!orgResult.success) {
      return NextResponse.json(
        { success: false, message: 'Organization permissions required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const controller = new ResourceController();
    const resource = await controller.createResource(body, authResult.user);

    return NextResponse.json({ success: true, data: resource }, { status: 201 });

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating resource' },
      { status: 500 }
    );
  }
}
