import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders , API_BASE} from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/entrepreneurship/${params.id}`;
    
    console.log('🔍 API Route - Getting entrepreneurship:', params.id);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      console.error('🔍 API Route - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 API Route - Entrepreneurship data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error:', error);
    return NextResponse.json(
      { error: 'Error al cargar emprendimiento' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/entrepreneurship/${params.id}`;
    
    console.log('🔍 API Route - Updating entrepreneurship:', params.id, body);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('🔍 API Route - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 API Route - Updated entrepreneurship:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error updating entrepreneurship:', error);
    return NextResponse.json(
      { error: 'Error al actualizar emprendimiento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/entrepreneurship/${params.id}`;
    
    console.log('🔍 API Route - Deleting entrepreneurship:', params.id);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      console.error('🔍 API Route - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 API Route - Deleted entrepreneurship:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error deleting entrepreneurship:', error);
    return NextResponse.json(
      { error: 'Error al eliminar emprendimiento' },
      { status: 500 }
    );
  }
}
