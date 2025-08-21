import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/auth-middleware';

// POST /api/resource/[id]/toggle-public - Cambiar visibilidad pública de un recurso
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`http://localhost:3001/api/resource/${params.id}/toggle-public`, {
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
    console.error('Error toggling resource public status:', error);
    return NextResponse.json(
      { success: false, message: 'Error toggling resource public status' },
      { status: 500 }
    );
  }
}
