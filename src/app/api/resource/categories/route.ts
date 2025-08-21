import { NextRequest, NextResponse } from 'next/server';

// GET /api/resource/categories - Obtener categorías de recursos
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:3001/api/resource/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error getting resource categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error getting resource categories' },
      { status: 500 }
    );
  }
}
