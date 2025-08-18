import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Search API called'); // Debug
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    const url = query 
      ? `http://localhost:3001/api/contacts/search?query=${encodeURIComponent(query)}`
      : 'http://localhost:3001/api/contacts/search';

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
