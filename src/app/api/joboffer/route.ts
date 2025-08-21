import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeaders = getAuthHeaders();
    
    // Forward all search parameters to backend
    const url = new URL(`http://localhost:3001/api/joboffer`);
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
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
    console.error('Error fetching job offers:', error);
    return NextResponse.json(
      { error: 'Error al cargar ofertas de trabajo' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeaders = getAuthHeaders();
    
    const response = await fetch(`http://localhost:3001/api/joboffer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating job offer:', error);
    return NextResponse.json(
      { error: 'Error al crear oferta de trabajo' },
      { status: 500 }
    );
  }
}


