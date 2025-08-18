import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/jobapplication-messages/unread-count`,
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return NextResponse.json(
      { error: 'Error al obtener contador de mensajes no leídos' },
      { status: 500 }
    );
  }
}
