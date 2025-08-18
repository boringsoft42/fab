import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for conversations');
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    const url = new URL(`${API_BASE}/messages/conversations`);
    if (page) url.searchParams.set('page', page);
    if (limit) url.searchParams.set('limit', limit);

    console.log('🔍 API: Forwarding to backend:', url.toString());
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 API: Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 API: Backend error:', errorText);
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🔍 API: Backend data received:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in messages conversations route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
