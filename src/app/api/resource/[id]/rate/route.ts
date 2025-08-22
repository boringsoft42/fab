import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/api';
import { API_BASE } from '@/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error rating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error rating resource' },
      { status: 500 }
    );
  }
}
