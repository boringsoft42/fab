import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// Redirigir a las funciones del backend
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE}/contacts`, {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
