import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireOrganization, requireSuperAdmin } from '@/lib/auth-middleware';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/[id] - Obtener un recurso específico (público)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const controller = new ResourceController();
    const resource = await controller.getResourceById(params.id);

    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: resource });

  } catch (error) {
    console.error('Error getting resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource' },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Actualizar un recurso (requiere autenticación y permisos de organización)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const resource = await controller.updateResource(params.id, body, authResult.user);

    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: resource });

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Eliminar un recurso (requiere autenticación y permisos de SuperAdmin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verificar permisos de SuperAdmin
    const adminResult = await requireSuperAdmin(request);
    if (!adminResult.success) {
      return NextResponse.json(
        { success: false, message: 'SuperAdmin permissions required' },
        { status: 403 }
      );
    }

    const controller = new ResourceController();
    await controller.deleteResource(params.id);

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting resource' },
      { status: 500 }
    );
  }
}
