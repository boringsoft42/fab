import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const response = await fetch(
      `${API_BASE}/jobapplication-messages/unread-count`,
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
