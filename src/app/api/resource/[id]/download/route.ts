import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`http://localhost:3001/api/resource/${params.id}/download`, {
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
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading resource' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`http://localhost:3001/api/resource/${params.id}/download`, {
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
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading resource' },
      { status: 500 }
    );
  }
}
