import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for stats');
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch(`${API_BASE}/messages/stats`, {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 API: Stats backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 API: Stats backend error:', errorText);
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🔍 API: Stats backend data received:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in messages stats route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
