import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/api';
import { API_BASE } from '@/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const authHeaders = getAuthHeaders();

    const response = await fetch(`${API_BASE}/messages/${resolvedParams.id}/read`, {
      method: 'POST',
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
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Error al marcar mensaje como leído' },
      { status: 500 }
    );
  }
}
