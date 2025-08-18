import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('Search API called'); // Debug
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    const url = query 
      ? `${API_BASE}/contacts/search?query=${encodeURIComponent(query)}`
      : `${API_BASE}/contacts/search`;

    console.log('Calling backend URL:', url); // Debug
    const response = await fetch(url, {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Backend response:', data); // Debug
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in contacts search route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
