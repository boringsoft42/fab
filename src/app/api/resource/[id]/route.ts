import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { getAuthHeaders } from '@/lib/api';
import { API_BASE } from '@/lib/api';

// GET /api/resource/[id] - Obtener un recurso específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error getting resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource' },
      { status: 500 }
    );
  }
}

// PUT /api/resource/[id] - Actualizar un recurso
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

    const body = await request.json();

    // Agregar información de actualización
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resource/[id] - Eliminar un recurso
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

    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting resource' },
      { status: 500 }
    );
  }
}
