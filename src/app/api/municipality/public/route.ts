import { NextRequest, NextResponse } from 'next/server';
// import { API_BASE } from '@/lib/api';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const response = await fetch(`${backendUrl}/api/municipality/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return NextResponse.json(
      { error: 'Error al cargar los municipios' },
      { status: 500 }
    );
  }
}
