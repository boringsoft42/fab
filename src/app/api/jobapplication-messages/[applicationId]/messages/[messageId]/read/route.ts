import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string; messageId: string }> }
) {
  try {
    const { applicationId, messageId } = await params;
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const response = await fetch(
      `${API_BASE}/jobapplication-messages/${applicationId}/messages/${messageId}/read`,
      {
        method: 'PUT',
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
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Error al marcar mensaje como leído' },
      { status: 500 }
    );
  }
}
