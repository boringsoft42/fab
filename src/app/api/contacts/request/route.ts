import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeaders = getAuthHeaders();
    
    const response = await fetch(`http://localhost:3001/api/contacts/request`, {
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
    console.error('Error creating contact request:', error);
    return NextResponse.json(
      { error: 'Error al crear solicitud de contacto' },
      { status: 500 }
    );
  }
}
