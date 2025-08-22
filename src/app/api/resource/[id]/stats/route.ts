import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/api';
import { API_BASE } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}/stats`, {
      method: 'GET',
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
    console.error('Error getting resource stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource stats' },
      { status: 500 }
    );
  }
}
