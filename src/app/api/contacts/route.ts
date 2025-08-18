import { NextRequest, NextResponse } from 'next/server';

// Redirigir a las funciones del backend
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:3001/api/contacts', {
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
