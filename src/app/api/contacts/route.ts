import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`http://localhost:3001/api/contacts`, {
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
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Error al cargar contactos' },
      { status: 500 }
    );
  }
}
