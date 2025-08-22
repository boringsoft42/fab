import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders , API_BASE} from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    let url = `${backendUrl}/api/entrepreneurship`;
    
    // Add query parameters for filtering
    const category = searchParams.get('category');
    const municipality = searchParams.get('municipality');
    const ownerId = searchParams.get('ownerId');
    const isPublic = searchParams.get('isPublic');
    
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (municipality) queryParams.append('municipality', municipality);
    if (ownerId) queryParams.append('ownerId', ownerId);
    if (isPublic) queryParams.append('isPublic', isPublic);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    console.log('🔍 API Route - Calling backend URL:', url);
    
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
    console.log('🔍 API Route - Backend response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error:', error);
    return NextResponse.json(
      { error: 'Error al cargar emprendimientos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    
    console.log('🔍 API Route - Creating entrepreneurship with data:', body);
    
    const response = await fetch(`${backendUrl}/api/entrepreneurship`, {
      method: 'POST',
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
    console.log('🔍 API Route - Created entrepreneurship:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error creating entrepreneurship:', error);
    return NextResponse.json(
      { error: 'Error al crear emprendimiento' },
      { status: 500 }
    );
  }
}
