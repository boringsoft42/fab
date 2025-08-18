import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for job questions');
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL('http://localhost:3001/api/jobquestion');
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

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
    console.log('🔍 API: Backend data received, questions count:', data.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job questions route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Received POST request for job questions');
    const body = await request.json();
    
    console.log('🔍 API: Forwarding to backend:', 'http://localhost:3001/api/jobquestion');
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch('http://localhost:3001/api/jobquestion', {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.log('🔍 API: Backend data received for job questions creation');
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job questions creation route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
